
    ################################
    ##  COVID_county.py           ##
    ##  Chieh-An Lin              ##
    ##  2022.05.14                ##
    ################################

import os
import sys
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - county sheet

class CountySheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_disease = '確定病名'
    self.coltag_report_date = '個案研判日'
    self.coltag_county = '縣市'
    self.coltag_village = '鄉鎮'
    self.coltag_gender = '性別'
    self.coltag_imported = '是否為境外移入'
    self.coltag_age = '年齡層'
    self.coltag_nb_cases = '確定病例數'
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_county_age.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    ## https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.csv
    
    self.data = data
    self.n_total = data[self.coltag_nb_cases].astype(int).sum()
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    self.age_key_list = [
      '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', 
      '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70+',
    ]
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return
  
  def getReportDate(self):
    report_date_list = []
    
    for report_date in self.getCol(self.coltag_report_date):
      yyyy = report_date[:4]
      mm = report_date[5:7]
      dd = report_date[8:]
      report_date = '{}-{}-{}'.format(yyyy, mm, dd)
      report_date_list.append(report_date)
    
    return report_date_list
  
  def getCounty(self):
    county_list = []
    
    for county in self.getCol(self.coltag_county):
      try:
        county_list.append(ccm.COUNTY_DICT_2[county])
      except KeyError:
        print('County, {}'.format(county))
        county_list.append('unknown')
    
    return county_list
    
  def getVillage(self):
    return self.getCol(self.coltag_village)
    
  def getGender(self):
    gender_list = [1 if gender == '男' else 2 for gender in self.getCol(self.coltag_gender)]
    return gender_list
    
  def getImported(self):
    imported_list = [1 if imported == '是' else 0 for imported in self.getCol(self.coltag_imported)]
    return imported_list
    
  def getAge(self):
    age_list = []
    
    for age in self.getCol(self.coltag_age):
      if age in ['0', '1', '2', '3', '4']:
        age_list.append('0-4')
      else:
        age_list.append(age)
    
    return age_list
  
  def getNbCases(self):
    return self.getCol(self.coltag_nb_cases).astype(int)
  
  def increment_localCasePerCounty(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock
    col_tag_list = ['total'] + self.county_key_list
    stock = ccm.initializeStock_dailyCounts(col_tag_list)
    
    ind_max = 0
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ind = ccm.indexForOverall(report_date)
      ind_max = max(ind_max, ind+1)
      
      try:
        stock['total'][ind] += nb_cases
        stock[county][ind] += nb_cases
      except IndexError: ## If NaN
        pass
    
    ind_today = ccm.getTodayOrdinal() - ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ind = max(ind_max, ind_today-1) ## Take the max of data date & today
    stock = {k: v[:ind] for k, v in stock.items()}
      
    ## Moving average
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = ccm.makeMovingAverage(stock[col_tag])
    return stock
  
  def makeReadme_localCasePerCounty(self, page):
    key = 'local_case_per_county'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: nationalwide')
    stock.append('  - `Keelung` to `Matsu`: individual city or county')
    stock.append('  - `Hsinchu`: Hsinchu county')
    stock.append('  - `Hsinchu_C`: Hsinchu city')
    stock.append('  - `Chiayi`: Chiayi county')
    stock.append('  - `Chiayi_C`: Chiayi city')
    stock.append('  - `*_avg`: 7-day moving average of `*`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_localCasePerCounty(self):
    stock = self.increment_localCasePerCounty()
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '{}processed_data/{}/local_case_per_county.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_localCasePerCounty(page)
    return

  def increment_caseByAge(self):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock dict
    case_hist = {age: 0 for age in self.age_key_list}
    stock = [case_hist.copy() for i in range(13)] ## Total + 12 weeks or months
    stock_dict = ccm.initializeStockDict_general(stock)
    
    ## Add 27 empty hist for overall (24 months + 3 all year)
    for i in range(27): ## new_year_token (2023)
      stock_dict[ccm.PAGE_OVERALL].append(case_hist.copy())
    
    ## Loop over series
    for report_date, age, nb_cases in zip(report_date_list, age_list, nb_cases_list):
      index_list = ccm.makeIndexList(report_date)
      
      for ind, page, stock in zip(index_list, stock_dict.keys(), stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock[0][age] += nb_cases
      
        if ccm.PAGE_LATEST == page:
          lookback_week = (ind - ccm.NB_LOOKBACK_DAYS) // 7 ## ind - ccm.NB_LOOKBACK_DAYS in [-90, -1]; this will be in [-13, -1]
          if lookback_week >= -12:
            stock[-lookback_week][age] += nb_cases
            
        elif ccm.PAGE_OVERALL == page:
          y_ind = int(report_date[:4]) - 2020
          m_ind = int(report_date[5:7])
          yy_ind = 1 + 13 * y_ind
          ym_ind = 1 + m_ind + 13 * y_ind
          stock[yy_ind][age] += nb_cases
          stock[ym_ind][age] += nb_cases
          
        else:
          mm = int(report_date[5:7])
          stock[mm][age] += nb_cases
            
    return stock_dict
  
  def makeLabel_caseByAge(self, page):
    month_name_en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    month_name_fr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] 
    
    key_list = ['total']
    label_list_en = ['Total']
    label_list_fr = ['Totaux']
    label_list_zh = ['合計']
    
    if page == ccm.PAGE_LATEST:
      for i in range(12):
        str_ = '{:d}-{:d}'.format(7*i, 7*i+6)
        key_list.append('week_-{:d}'.format(i+1))
        label_list_en.append('{} days ago'.format(str_))
        label_list_fr.append('{} jours plus tôt'.format(str_))
        label_list_zh.append('{}天前'.format(str_))
      
    elif page == ccm.PAGE_OVERALL:
      for year in ccm.YEAR_LIST:
        key_list.append(year)
        label_list_en.append('{} all year'.format(year))
        label_list_fr.append('Année {}'.format(year))
        label_list_zh.append('{}全年'.format(year))
        
        for i in range(12):
          str_ = '{:d}-{:d}'.format(7*i, 7*i+6)
          key_list.append('{}_{}'.format(ccm.numMonthToAbbr(i+1), year))
          label_list_en.append('{} {}'.format(month_name_en[i], year))
          label_list_fr.append('{} {}'.format(month_name_fr[i], year))
          label_list_zh.append('{}年{:d}月'.format(year, i+1))
        
    elif page in ccm.YEAR_LIST:
      for i in range(12):
        str_ = '{:d}-{:d}'.format(7*i, 7*i+6)
        key_list.append('{}'.format(ccm.numMonthToAbbr(i+1)))
        label_list_en.append('{}'.format(month_name_en[i]))
        label_list_fr.append('{}'.format(month_name_fr[i]))
        label_list_zh.append('{:d}月'.format(i+1))
        
    stock = {'key': key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    return stock
  
  def makeReadme_caseByAge(self, page):
    key = 'case_by_age'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: age group')
    stock.append('- Column')
    stock.append('  - `age`')
    if page == ccm.PAGE_LATEST:
      stock.append('  - `total`: last 90 days')
      stock.append('  - `week_-N`: between 7*`N`-7 & 7*`N`-1 days ago')
    elif page == ccm.PAGE_OVERALL:
      stock.append('  - `total`: overall stats')
      stock.append('  - `YYYY`: during year `YYYY`')
      stock.append('  - `MMM_YYYY`: during month `MMM` of year `YYYY`')
    elif page in ccm.YEAR_LIST:
      stock.append('  - `total`: all year {}'.format(page))
      stock.append('  - `MMM`: during month `MMM`')
    ccm.README_DICT[page][key] = stock
    
    key = 'case_by_age_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: time range')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_caseByAge(self):
    stock_dict = self.increment_caseByAge()
    
    ## Loop over page
    for page, stock in stock_dict.items():
      stock_l = self.makeLabel_caseByAge(page)
      data_l = pd.DataFrame(stock_l)
      col_tag_list = data_l['key']
      
      data_c = {'age': self.age_key_list}
      data_c.update({col_tag: case_hist.values() for col_tag, case_hist in zip(col_tag_list, stock)})
      data_c = pd.DataFrame(data_c)
      
      ## Save
      name = '{}processed_data/{}/case_by_age.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_c)
      
      name = '{}processed_data/{}/case_by_age_label.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_l)
      
      self.makeReadme_caseByAge(page)
    return

  def increment_incidenceMap(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock dict
    county_key_list = ['total'] + self.county_key_list
    case_hist = {county: 0 for county in county_key_list}
    stock = [case_hist.copy() for i in range(13)]
    stock_dict = ccm.initializeStockDict_general(stock)
    
    ## Add 27 empty hist for overall (24 months + 3 all year)
    for i in range(27): ## new_year_token (2023)
      stock_dict[ccm.PAGE_OVERALL].append(case_hist.copy())
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      index_list = ccm.makeIndexList(report_date)
      
      for ind, page, stock in zip(index_list, stock_dict.keys(), stock_dict.values()):
        if ind != ind:
          continue
        
        stock[0]['total'] += nb_cases
        stock[0][county] += nb_cases
      
        if ccm.PAGE_LATEST == page:
          lookback_week = (ind - ccm.NB_LOOKBACK_DAYS) // 7 ## ind - ccm.NB_LOOKBACK_DAYS in [-90, -1]; this will be in [-13, -1]
          if lookback_week >= -12:
            stock[-lookback_week]['total'] += nb_cases
            stock[-lookback_week][county] += nb_cases
            
        elif ccm.PAGE_OVERALL == page:
          y_ind = int(report_date[:4]) - 2020
          m_ind = int(report_date[5:7])
          yy_ind = 1 + 13 * y_ind
          ym_ind = 1 + m_ind + 13 * y_ind
          stock[yy_ind]['total'] += nb_cases
          stock[yy_ind][county] += nb_cases
          stock[ym_ind]['total'] += nb_cases
          stock[ym_ind][county] += nb_cases
          
        else:
          mm = int(report_date[5:7])
          stock[mm]['total'] += nb_cases
          stock[mm][county] += nb_cases
    
    return stock_dict
  
  def makeReadme_incidenceMap(self, page):
    key = 'incidence_map'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: city or county')
    stock.append('- Column')
    stock.append('  - `county`')
    if page == ccm.PAGE_LATEST:
      stock.append('  - `total`: last 90 days')
      stock.append('  - `week_-N`: between 7*`N`-7 & 7*`N`-1 days ago')
    elif page == ccm.PAGE_OVERALL:
      stock.append('  - `total`: overall stats')
      stock.append('  - `YYYY`: during year `YYYY`')
      stock.append('  - `MMM_YYYY`: during month `MMM` of year `YYYY`')
    elif page in ccm.YEAR_LIST:
      stock.append('  - `total`: all year {}'.format(page))
      stock.append('  - `MMM`: during month `MMM`')
    ccm.README_DICT[page][key] = stock
    
    key = 'incidence_map_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: city or county')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `code`: unique code attributed to city or county by Ministry of Interior')
    stock.append('  - `population`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_incidenceMap(self):
    stock_dict = self.increment_incidenceMap()
    county_key_list = ['total'] + self.county_key_list
    
    ## Loop over page
    for page, stock in stock_dict.items():
      if ccm.PAGE_LATEST == page:
        label_list = ['total'] + ['week_-{:d}'.format(i+1) for i in range(12)]
      elif ccm.PAGE_OVERALL == page:
        label_list = ['total'] + \
          ['2020'] + ['{}_2020'.format(ccm.numMonthToAbbr(i+1)) for i in range(12)] + \
          ['2021'] + ['{}_2021'.format(ccm.numMonthToAbbr(i+1)) for i in range(12)] + \
          ['2022'] + ['{}_2022'.format(ccm.numMonthToAbbr(i+1)) for i in range(12)] ## new_year_token (2023)
      else:
        label_list = ['total'] + [ccm.numMonthToAbbr(i+1) for i in range(12)]
    
      ## Data for population & label
      inv_dict = {dict_['tag']: code for code, dict_ in ccm.COUNTY_DICT.items()}
      code_list = [inv_dict[county] for county in county_key_list]
      population = [ccm.COUNTY_DICT[code]['population'] for code in code_list]
      label_list_en = [ccm.COUNTY_DICT[code]['label'][0] for code in code_list]
      label_list_fr = [ccm.COUNTY_DICT[code]['label'][1] for code in code_list]
      label_list_zh = [ccm.COUNTY_DICT[code]['label'][2] for code in code_list]
      
      data_c = {'county': county_key_list}
      data_c.update({label: case_hist.values() for label, case_hist in zip(label_list, stock)})
      data_c = pd.DataFrame(data_c)
      
      data_p = {'key': county_key_list, 'code': code_list, 'population': population, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
      data_p = pd.DataFrame(data_p)
      
      ## Save
      name = '{}processed_data/{}/incidence_map.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_c)
      name = '{}processed_data/{}/incidence_map_label.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_p)
      
      self.makeReadme_incidenceMap(page)
    return

  def increment_incidenceEvolutionByCounty(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock
    county_key_list = ['total'] + self.county_key_list
    stock = ccm.initializeStock_dailyCounts(county_key_list)
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ind = ccm.indexForOverall(report_date)
      
      try:
        stock[county][ind] += nb_cases
        stock['total'][ind] += nb_cases
      except IndexError:
        pass
    return stock
  
  def smooth_incidenceEvolutionByCounty(self):
    stock = self.increment_incidenceEvolutionByCounty()
    population_dict = {county['tag']: county['population'] * 0.00001 for code, county in ccm.COUNTY_DICT.items()}
    nb_lookback_days = 45
    
    ## Smooth
    for county, nb_cases_arr in stock.items():
      if 'date' == county:
        stock[county] = nb_cases_arr[-nb_lookback_days:]
        continue
      
      nb_cases_arr = ccm.sevenDayMovingAverage(nb_cases_arr)
      nb_cases_arr = nb_cases_arr[-nb_lookback_days:]
      nb_cases_arr *= 7 / population_dict[county]
      nb_cases_arr = np.around(nb_cases_arr, decimals=2)
      nb_cases_arr[-1] = np.nan ## Force to NaN
      
      stock[county] = nb_cases_arr
    return stock
  
  def makeReadme_incidenceEvolutionByCounty(self, page):
    key = 'incidence_evolution_by_county'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: nationalwide')
    stock.append('  - `Keelung` to `Matsu`: individual city or county')
    stock.append('  - `Hsinchu`: Hsinchu county')
    stock.append('  - `Hsinchu_C`: Hsinchu city')
    stock.append('  - `Chiayi`: Chiayi county')
    stock.append('  - `Chiayi_C`: Chiayi city')
    ccm.README_DICT[page][key] = stock
    
    key = 'incidence_evolution_by_county_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: city or county')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_incidenceEvolutionByCounty(self):
    stock = self.smooth_incidenceEvolutionByCounty()
    data_r = pd.DataFrame(stock)
    
    ## Data for population & label
    county_key_list = ['total'] + self.county_key_list
    county_dict = {dict_['tag']: dict_ for dict_ in ccm.COUNTY_DICT.values()}
    label_list_en = [county_dict[county]['label'][0] for county in county_key_list]
    label_list_fr = [county_dict[county]['label'][1] for county in county_key_list]
    label_list_zh = [county_dict[county]['label'][2] for county in county_key_list]
      
    data_l = {'key': county_key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data_l = pd.DataFrame(data_l)
    
    page = ccm.PAGE_LATEST
    
    name = '{}processed_data/{}/incidence_evolution_by_county.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data_r)
    
    name = '{}processed_data/{}/incidence_evolution_by_county_label.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data_l)
    
    self.makeReadme_incidenceEvolutionByCounty(page)
    return
  
  def increment_incidenceEvolutionByAge(self):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    nb_cases_list = self.getNbCases()
    
    ## Reverse
    age_key_list = ['total'] + self.age_key_list[::-1]
    
    ## Initialize stock
    stock = ccm.initializeStock_dailyCounts(age_key_list)
    
    ## Loop over series
    for report_date, age, nb_cases in zip(report_date_list, age_list, nb_cases_list):
      ind = ccm.indexForOverall(report_date)
      
      try:
        stock[age][ind] += nb_cases
        stock['total'][ind] += nb_cases
      except IndexError:
        pass
      
    return stock
  
  def smooth_incidenceEvolutionByAge(self):
    stock = self.increment_incidenceEvolutionByAge()
    nb_lookback_days = 45
    
    ## Get year & adjust
    year = dtt.datetime.today().isoformat()[:4]
    year = str(int(year) - 1)
    population_dict = {age: population * 0.00001 for age, population in ccm.AGE_DICT_2[year].items()}
    population_dict['total'] = ccm.COUNTY_DICT['00000']['population'] * 0.00001
    
    ## Minor modif
    value = 0
    for age in ['70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+']:
      value += population_dict.pop(age)
    population_dict['70+'] = value
    
    ## Smooth
    for age, nb_cases_arr in stock.items():
      if 'date' == age:
        stock[age] = nb_cases_arr[-nb_lookback_days:]
        continue
      
      nb_cases_arr = ccm.sevenDayMovingAverage(nb_cases_arr)
      nb_cases_arr = nb_cases_arr[-nb_lookback_days:]
      nb_cases_arr *= 7 / population_dict[age]
      nb_cases_arr = np.around(nb_cases_arr, decimals=2)
      nb_cases_arr[-1] = np.nan ## Force to NaN
      
      stock[age] = nb_cases_arr
    return stock
  
  def makeReadme_incidenceEvolutionByAge(self, page):
    key = 'incidence_evolution_by_age'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: all ages')
    stock.append('  - `0-4` to `70+`: age group')
    ccm.README_DICT[page][key] = stock
    
    key = 'incidence_evolution_by_age_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: age group')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
    stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_incidenceEvolutionByAge(self):
    stock = self.smooth_incidenceEvolutionByAge()
    data_r = pd.DataFrame(stock)
    
    ## Reverse
    age_key_list = ['total'] + self.age_key_list[::-1]
    
    ## Data for population & label
    label_list_en = [ccm.AGE_DICT_2['label'][age]['en'] for age in age_key_list]
    label_list_fr = [ccm.AGE_DICT_2['label'][age]['fr'] for age in age_key_list]
    label_list_zh = [ccm.AGE_DICT_2['label'][age]['zh-tw'] for age in age_key_list]
    
    data_l = {'key': age_key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data_l = pd.DataFrame(data_l)
    
    page = ccm.PAGE_LATEST
    
    name = '{}processed_data/{}/incidence_evolution_by_age.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data_r)
    
    name = '{}processed_data/{}/incidence_evolution_by_age_label.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data_l)
    
    self.makeReadme_incidenceEvolutionByAge(page)
    return
  
  def updateCaseByAge(self):
    return
  
  def saveCsv(self):
    self.saveCsv_localCasePerCounty()
    self.saveCsv_caseByAge()
    self.saveCsv_incidenceMap()
    self.saveCsv_incidenceEvolutionByCounty()
    self.saveCsv_incidenceEvolutionByAge()
    return
  
## End of file
################################################################################
