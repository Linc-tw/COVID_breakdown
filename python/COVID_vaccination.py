
    ##############################
    ##  COVID_vaccination.py    ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.08.25      ##
    ##############################

import os
import sys
import warnings
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Classes - Vaccination

class VaccinationSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' % ccm.DATA_PATH
    data = ccm.loadJson(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_manufacture&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyOTg2Mzk2Ng==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=date&d[]=NO&c[]=a03&t[]=varchar&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=NO&c[]=a06&t[]=int&d[]=NO
    ## Old: https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_can3_c&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyOTg2Mzk2Ng==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=varchar&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=decimal&d[]=NO
    
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_location = 'a01'
    self.key_date = 'a02'
    self.key_brand = 'a03'
    self.key_cum_1st = 'a04'
    self.key_cum_2nd = 'a05'
    self.key_cum_tot = 'a06'
    
    self.data = data
    self.brand_list = ['AZ', 'Moderna', 'Medigen']
    self.n_total = len(set(self.getDate()))
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return
  
  def getColData(self, key):
    return [row[key] for row in self.data['data']]
  
  def getDate(self):
    return [row[self.key_date] for row in self.data['data']]
  
  def getBrand(self):
    brand_list = []
    
    for row in self.data['data']:
      brand = row[self.key_brand]
      try:
        brand_list.append(ccm.BRAND_DICT[brand])
      except KeyError:
        print('Brand, %s' % brand)
        brand_list.append('unknown')
    return brand_list
  
  def getCum1st(self):
    return [int(value) for value in self.getColData(self.key_cum_1st)]
  
  def getCum2nd(self):
    return [int(value) for value in self.getColData(self.key_cum_2nd)]
  
  def getCumTot(self):
    return [int(value) for value in self.getColData(self.key_cum_tot)]
  
  def incrementWithInterpolation_vaccinationByBrand(self):
    date_list = self.getDate()
    brand_list = self.getBrand()
    cum_tot_list = self.getCumTot()
    
    ## Make dictionary of date & brand
    cum_doses_dict = {}
    for date, brand, cum_tot in zip(date_list, brand_list, cum_tot_list):
      try:
        cum_doses_dict[date][brand] = cum_tot
      except KeyError:
        cum_doses_dict[date] = {}
        cum_doses_dict[date][brand] = cum_tot
    
    key_brand_list = ['total'] + self.brand_list
    
    ## Make stock dict
    stock = {'date': [], 'interpolated': [], 'new_doses': {brand: [] for brand in key_brand_list}}
    
    ## For recording last non-missing data
    prev = {brand: 0 for brand in key_brand_list}
    ord_prev = ccm.ISODateToOrd('2021-03-21')
    
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ord_today = ccm.getTodayOrdinal()
    
    ## Loop over ordinal
    for ord_ in range(ord_ref, ord_today):
      date = ccm.ordDateToISO(ord_)
      stock['date'].append(date)
      
      ## Out of provided range
      if date not in cum_doses_dict:
        stock['interpolated'].append(1)
        if ord_ <= ord_prev:
          for list_ in stock['new_doses'].values():
            list_.append(0)
        continue
      
      ## In range
      cum_doses = cum_doses_dict[date]
      length = ord_ - ord_prev
      
      for brand in key_brand_list:
        try:
          stock['new_doses'][brand] += ccm.itpFromCumul(prev[brand], cum_doses[brand], length)
        except KeyError:
          stock['new_doses'][brand] += [0] * length
        
      stock['interpolated'].append(-int(1 < length))
      prev.update(cum_doses)
      ord_prev = ord_
    
    ## Cut the days w/o data
    nb_rows = ord_prev + 1 - ord_ref
    stock['date'] = stock['date'][:nb_rows]
    stock['interpolated'] = stock['interpolated'][:nb_rows]
    for brand in stock['new_doses'].keys():
      stock['new_doses'][brand] = stock['new_doses'][brand][:nb_rows]
    
    ## This contains daily doses & a column indicating whether it's interpolated or not.
    return stock
  
  def makeReadme_vaccinationByBrand(self, page):
    key = 'vaccination_by_brand'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `interpolated`')
    stock.append('    - Original data are provided in cumulative counts but with missing values. Here, the file provides daily counts where missing values are estimated from interpolation.')
    stock.append('    - 0 = true value, not interpolated')
    stock.append('    - 1 = interpolated value')
    stock.append('    - -1 = interpolated value, but the cumulative count on this day is known')
    stock.append('  - `total`: all brands')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    stock.append('  - `*_avg`: 7-day moving average of `*`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByBrand(self):
    stock_prev = self.incrementWithInterpolation_vaccinationByBrand()
    
    ## For order
    stock = {'date': stock_prev['date'], 'interpolated': stock_prev['interpolated']}
    stock.update(stock_prev['new_doses'])
    
    ## Loop over column
    for col_tag in stock_prev['new_doses'].keys():
      key = col_tag + '_avg'
      stock[key] = ccm.makeMovingAverage(stock[col_tag])
    
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      if page == ccm.PAGE_2020:
        continue
      
      data = ccm.truncateStock(stock, page)
      
      ## Vaccination trunk
      if page == ccm.PAGE_OVERALL:
        ind = ccm.ISODateToOrd(ccm.ISO_DATE_REF_VACC) - ccm.ISODateToOrd(ccm.ISO_DATE_REF)
        data = data[ind:]
        
      ## Save
      name = '%sprocessed_data/%s/vaccination_by_brand.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_vaccinationByBrand(page)
    return
  
  def makeSupplies_vaccinationProgress(self):
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    nb_rows = len(ccm.DELIVERY_LIST)
    brand_list = ['total'] + self.brand_list
    
    cum_dict = {brand: 0 for brand in brand_list}
    stock = {col: [] for col in ['index', 'date', 'source'] + brand_list}
    
    ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
    for i, row in enumerate(ccm.DELIVERY_LIST):
      brand = row[0]
      source = row[1]
      quantity = row[2]
      delivery_date = row[3]
      available_date = row[4]
      
      if available_date is None or available_date == '':
        ind = -1
      else:
        ind = ccm.ISODateToOrd(available_date) - ord_ref 
      
      cum_dict['total'] += quantity
      cum_dict[brand] += quantity
      
      stock['index'].append(ind)
      stock['date'].append(available_date)
      stock['source'].append(source)
      for brand in brand_list:
        stock[brand].append(cum_dict[brand])
        
    return stock
    
  def makeInjections_vaccinationProgress(self):
    date_list = self.getDate()
    brand_list = self.getBrand()
    cum_tot_list = self.getCumTot()
    
    ## Make dictionary of date & brand
    cum_doses_dict = {}
    for date, brand, cum_tot in zip(date_list, brand_list, cum_tot_list):
      try:
        cum_doses_dict[date][brand] = cum_tot
      except KeyError:
        cum_doses_dict[date] = {}
        cum_doses_dict[date][brand] = cum_tot
    
    date_list = list(cum_doses_dict.keys())
    cum_tot_list = [dict_.get('total', 0) for dict_ in cum_doses_dict.values()]
    cum_az_list = [dict_.get('AZ', 0) for dict_ in cum_doses_dict.values()]
    cum_moderna_list = [dict_.get('Moderna', 0) for dict_ in cum_doses_dict.values()]
    cum_medigen_list = [dict_.get('Medigen', 0) for dict_ in cum_doses_dict.values()]
    
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    index_list = [ccm.ISODateToOrd(iso)-ord_ref for iso in date_list]
    ind = np.argsort(index_list)
    
    ## Sort
    index_list = np.array(index_list)[ind]
    date_list = np.array(date_list)[ind]
    cum_tot_list = np.array(cum_tot_list)[ind]
    cum_az_list = np.array(cum_az_list)[ind]
    cum_moderna_list = np.array(cum_moderna_list)[ind]
    cum_medigen_list = np.array(cum_medigen_list)[ind]
    
    stock = {'index': index_list, 'date': date_list, 'total': cum_tot_list, 'AZ': cum_az_list, 'Moderna': cum_moderna_list, 'Medigen': cum_medigen_list}
    return stock
    
  def makeReadme_vaccinationProgress(self, page):
    key = 'vaccination_progress_supplies'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `index`: day difference from %s' % ccm.ISO_DATE_REF)
    stock.append('  - `date`')
    stock.append('  - `source`: origin of the supply')
    stock.append('  - `total`: all brands, cumulative number of doses')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    ccm.README_DICT[page][key] = stock
    
    key = 'vaccination_progress_injections'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row = report date')
    stock.append('- Column')
    stock.append('  - `index`: day difference from %s' % ccm.ISO_DATE_REF)
    stock.append('  - `date`')
    stock.append('  - `total`: all brands, cumulative number of doses')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationProgress(self):
    stock_s = self.makeSupplies_vaccinationProgress()
    stock_s = pd.DataFrame(stock_s)
    stock_i = self.makeInjections_vaccinationProgress()
    stock_i = pd.DataFrame(stock_i)
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    
    for page in ccm.PAGE_LIST:
      if page == ccm.PAGE_2020:
        continue
      
      if page == ccm.PAGE_LATEST:
        ind = ccm.getTodayOrdinal() - ord_ref - 90
      elif page == ccm.PAGE_2021:
        ind = ccm.ISODateToOrd('2021-01-01') - ord_ref
      elif page == ccm.PAGE_OVERALL:
        ind = ccm.ISODateToOrd(ccm.ISO_DATE_REF_VACC) - ord_ref
        
      ## No cut on supplies
      data_s = stock_s
      ind_arr = (stock_i['index'] == -1) | (stock_i['index'] >= ind)
      data_i = stock_i[ind_arr]
      
      name = '%sprocessed_data/%s/vaccination_progress_supplies.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_s)
      name = '%sprocessed_data/%s/vaccination_progress_injections.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_i)
      
      self.makeReadme_vaccinationProgress(page)
    return
  
  def makeStock_vaccinationByDose(self):
    date_list_raw = self.getDate()
    brand_list = self.getBrand()
    cum_1st_list_raw = self.getCum1st()
    cum_2nd_list_raw = self.getCum2nd()
    
    ## Get variables
    population_twn = ccm.COUNTY_DICT['00000']['population']
    date_list = []
    cum_1st_list = []
    cum_2nd_list = []
    
    for date, brand, cum_1st, cum_2nd in zip(date_list_raw, brand_list, cum_1st_list_raw, cum_2nd_list_raw):
      if brand == 'total':
        date_list.append(date)
        cum_1st_list.append(float(cum_1st) / float(population_twn))
        cum_2nd_list.append(float(cum_2nd) / float(population_twn))
    
    ## Adjustment
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    index_list = [ccm.ISODateToOrd(iso)-ord_ref for iso in date_list]
    cum_1st_list = np.around(cum_1st_list, decimals=4)
    cum_2nd_list = np.around(cum_2nd_list, decimals=4)
    ind = np.argsort(index_list)
    
    ## Sort
    index_list = np.array(index_list)[ind]
    date_list = np.array(date_list)[ind]
    cum_1st_list = cum_1st_list[ind]
    cum_2nd_list = cum_2nd_list[ind]
    
    ## Stock
    stock = {'index': index_list, 'date': date_list, 'ppl_vacc_rate': cum_1st_list, 'ppl_fully_vacc_rate': cum_2nd_list}
    return stock
    
  def makeReadme_vaccinationByDose(self, page):
    key = 'vaccination_by_dose'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `index`: day difference from %s' % ccm.ISO_DATE_REF)
    stock.append('  - `date`')
    stock.append('  - `ppl_vacc_rate`: proportion of the population vaccinated with their 1st dose')
    stock.append('  - `ppl_fully_vacc_rate`: proportion of the population fully vaccinated')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByDose(self):
    stock = self.makeStock_vaccinationByDose()
    stock = pd.DataFrame(stock)
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    
    for page in ccm.PAGE_LIST:
      if page == ccm.PAGE_2020:
        continue
      
      if page == ccm.PAGE_LATEST:
        ind = ccm.getTodayOrdinal() - ord_ref - 90
      elif page == ccm.PAGE_2021:
        ind = ccm.ISODateToOrd('2021-01-01') - ord_ref
      elif page == ccm.PAGE_OVERALL:
        ind = ccm.ISODateToOrd(ccm.ISO_DATE_REF_VACC) - ord_ref
        
      ind_arr = stock['index'] >= ind
      data = stock[ind_arr]
        
      name = '%sprocessed_data/%s/vaccination_by_dose.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_vaccinationByDose(page)
    return
  
  def saveCsv(self):
    self.saveCsv_vaccinationByBrand()
    self.saveCsv_vaccinationProgress()
    self.saveCsv_vaccinationByDose()
    return
  
## End of file
################################################################################
