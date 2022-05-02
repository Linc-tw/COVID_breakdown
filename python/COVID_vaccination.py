
    ################################
    ##  COVID_vaccination.py      ##
    ##  Chieh-An Lin              ##
    ##  2022.05.02                ##
    ################################

import os
import sys
import datetime as dtt
import collections as clt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - vaccination sheet

class VaccinationSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_vaccination.json'.format(ccm.DATA_PATH)
    data = ccm.loadJson(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_manufacture_v1&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTY0MDgxOTQ1Mg==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=date&d[]=NO&c[]=a03&t[]=varchar&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=NO&c[]=a06&t[]=int&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=int&d[]=NO
    ## Old: https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_can3_c&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyOTg2Mzk2Ng==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=varchar&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=decimal&d[]=NO
    
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_location = 'a01'
    self.key_date = 'a02'
    self.key_brand = 'a03'
    self.key_cum_1st = 'a04'
    self.key_cum_2nd = 'a05'
    self.key_cum_3rd_1 = 'a06'
    self.key_cum_3rd_2 = 'a07'
    self.key_cum_tot = 'a08'
    
    self.data = data
    self.brand_list = ['AZ', 'Moderna', 'Medigen', 'Pfizer']
    self.dose_list = ['ppl_vacc_rate', 'ppl_fully_vacc_rate', 'ppl_vacc_3_rate']
    self.n_total = len(set(self.getDate()))
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return
  
  def __str__(self):
    return str(self.data['data'])

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
        print('Brand, {}'.format(brand))
        brand_list.append('unknown')
    return brand_list
  
  def getCum1st(self):
    return [int(value) for value in self.getColData(self.key_cum_1st)]
  
  def getCum2nd(self):
    return [int(value) for value in self.getColData(self.key_cum_2nd)]
  
  def getCum3rd(self):
    return [int(value_1)+int(value_2) for value_1, value_2 in zip(self.getColData(self.key_cum_3rd_1), self.getColData(self.key_cum_3rd_2))]
  
  def getCumTot(self):
    return [int(value) for value in self.getColData(self.key_cum_tot)]
  
  def interpolate(self, stock, col_tag_list, dtype=int, cumul=True):
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ord_today = ccm.getTodayOrdinal()
    prev = {col_tag: 0 for col_tag in col_tag_list}
    ord_prev = ord_ref
    
    ## Set initial zero
    ord_zero = ccm.ISODateToOrd('2021-03-21')
    stock['interpolated'][ord_zero-ord_ref] = 0
    for col_tag in col_tag_list:
      stock[col_tag][ord_zero-ord_ref] = 0
    
    ## Loop over ordinal
    for ord_ in range(ord_ref, ord_today):
      ind = ord_ - ord_ref
      
      if stock['interpolated'][ind] > 0:
        continue
      
      length = ord_ - ord_prev
      if length > 1 and not cumul:
        stock['interpolated'][ind] = -1
      
      for col_tag in col_tag_list:
        value = np.linspace(prev[col_tag], stock[col_tag][ind], length, endpoint=False)
        stock[col_tag][ind-length:ind] = value
        prev[col_tag] = stock[col_tag][ind]
      
      ord_prev = ord_
    
    ## Format to int
    if dtype == int:
      for col_tag in col_tag_list:
        ind = np.isnan(stock[col_tag])
        stock[col_tag][ind] = 0
        stock[col_tag] = stock[col_tag].astype(int)
        
    if not cumul:
      for col_tag in col_tag_list:
        lower = np.insert(stock[col_tag][:-1], 0, 0)
        stock[col_tag] -= lower
    
    ## Cut the days w/o data
    nb_rows = ord_prev + 1 - ord_ref
    if 'index' in stock:
      stock['index'] = stock['index'][:nb_rows]
    stock['date'] = stock['date'][:nb_rows]
    stock['interpolated'] = stock['interpolated'][:nb_rows]
    for col_tag in col_tag_list:
      stock[col_tag] = stock[col_tag][:nb_rows]
    return stock
      
  def makeStock_vaccinationByBrand(self):
    date_list = self.getDate()
    brand_list = self.getBrand()
    cum_tot_list = self.getCumTot()
    
    ## Make dictionary of date & brand
    cum_doses_dict = clt.defaultdict(lambda: clt.defaultdict(int))
    for date, brand, cum_tot in zip(date_list, brand_list, cum_tot_list):
      cum_doses_dict[date][brand] = cum_tot
    
    key_brand_list = ['total'] + self.brand_list
    
    ## Initialize stock
    stock = ccm.initializeStock_dailyCounts(['interpolated']+key_brand_list)
    stock['interpolated'] += 1
    for col_tag in key_brand_list:
      stock[col_tag] = stock[col_tag].astype(float) + np.nan
    
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    
    ## Fill raw data to stock
    for date, cum_doses in cum_doses_dict.items():
      ind = ccm.ISODateToOrd(date) - ord_ref
      stock['interpolated'][ind] = 0
      for brand, cd in cum_doses.items():
        stock[brand][ind] = cd
    return stock
   
  def interpolate_vaccinationByBrand(self, stock):
    key_brand_list = ['total'] + self.brand_list
    stock = self.interpolate(stock, key_brand_list, dtype=int, cumul=False)
    
    ## Loop over column
    for col_tag in key_brand_list:
      key = col_tag + '_avg'
      stock[key] = ccm.makeMovingAverage(stock[col_tag])
    return stock
  
  def makeReadme_vaccinationByBrand(self, page):
    key = 'vaccination_by_brand'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `interpolated`')
    stock.append('    - Original data are provided in cumulative counts but with missing values. Here, the file provides daily counts where missing values are estimated from interpolation.')
    stock.append('    - 0 = true value, not interpolated')
    stock.append('    - 1 = interpolated value')
    stock.append('    - -1 = interpolated value, but the cumulative count on this day is known')
    stock.append('  - `total`: all brands, daily new injections')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    stock.append('  - `Pfizer`')
    stock.append('  - `*_avg`: 7-day moving average of `*`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByBrand(self):
    stock = self.makeStock_vaccinationByBrand()
    stock = self.interpolate_vaccinationByBrand(stock)
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
      name = '{}processed_data/{}/vaccination_by_brand.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_vaccinationByBrand(page)
    return
  
  def makeSupplies_vaccinationProgress(self):
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    nb_rows = len(ccm.DELIVERY_LIST)
    brand_list = ['total'] + self.brand_list
    
    cum_dict = {brand: 0 for brand in brand_list}
    stock = {col_tag: [] for col_tag in ['date', 'source'] + brand_list}
    today_ord = ccm.getTodayOrdinal()
    
    ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
    for i, row in enumerate(ccm.DELIVERY_LIST):
      brand = row[0]
      source = row[1]
      quantity = row[2]
      delivery_date = row[3]
      available_date = row[4]
      
      if available_date is None or available_date == '':
        estimated_avail = ccm.ISODateToOrd(delivery_date) + 8
        if estimated_avail > today_ord: 
          ind = -1
        else:
          available_date = ccm.ordDateToISO(estimated_avail)
          ind = estimated_avail - ord_ref
      else:
        ind = ccm.ISODateToOrd(available_date) - ord_ref 
      
      cum_dict['total'] += quantity
      cum_dict[brand] += quantity
      
      stock['date'].append(available_date)
      stock['source'].append(source)
      for brand in brand_list:
        stock[brand].append(cum_dict[brand])
        
    return stock
    
  def makeInjections_vaccinationProgress(self):
    stock = self.makeStock_vaccinationByBrand()
    key_brand_list = ['total'] + self.brand_list
    stock = self.interpolate(stock, key_brand_list, dtype=int, cumul=True)
    return stock
  
  def makeReadme_vaccinationProgress(self, page):
    key = 'vaccination_progress_supplies'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: available date')
    stock.append('- Column')
    stock.append('  - `date`: available date of the supply')
    stock.append('    - If the available date is not available, the date is estimated as the delivery date plus 8 days')
    stock.append('  - `source`: origin of the supply')
    stock.append('  - `total`: all brands, cumulative number of doses')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    stock.append('  - `Pfizer`')
    ccm.README_DICT[page][key] = stock
    
    key = 'vaccination_progress_injections'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row = report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `interpolated`')
    stock.append('    - 0 = true value, not interpolated')
    stock.append('    - 1 = interpolated value')
    stock.append('  - `total`: all brands, cumulative number of doses')
    stock.append('  - `AZ`')
    stock.append('  - `Moderna`')
    stock.append('  - `Medigen`')
    stock.append('  - `Pfizer`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationProgress(self):
    stock_s = self.makeSupplies_vaccinationProgress()
    stock_s = pd.DataFrame(stock_s)
    stock_i = self.makeInjections_vaccinationProgress()
    stock_i = pd.DataFrame(stock_i)
    stock_i = ccm.adjustDateRange(stock_i)
    
    for page in ccm.PAGE_LIST:
      if page == ccm.PAGE_2020:
        continue
      
      ## No cut on supplies
      data_s = stock_s
      data_i = ccm.truncateStock(stock_i, page)
      
      ## Vaccination trunk
      if page == ccm.PAGE_OVERALL:
        ind = ccm.ISODateToOrd(ccm.ISO_DATE_REF_VACC) - ccm.ISODateToOrd(ccm.ISO_DATE_REF)
        data_i = data_i[ind:]
        
      name = '{}processed_data/{}/vaccination_progress_supplies.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_s)
      name = '{}processed_data/{}/vaccination_progress_injections.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data_i)
      
      self.makeReadme_vaccinationProgress(page)
    return
  
  def makeDeliveries_vaccinationDeliveries(self):
    brand_list          = [delivery[0] for delivery in ccm.DELIVERY_LIST]
    source_list         = [delivery[1] for delivery in ccm.DELIVERY_LIST]
    quantity_list       = [delivery[2] for delivery in ccm.DELIVERY_LIST]
    delivery_date_list  = [delivery[3] for delivery in ccm.DELIVERY_LIST]
    available_date_list = [delivery[4] for delivery in ccm.DELIVERY_LIST]
    delivery_news_list  = [delivery[5] for delivery in ccm.DELIVERY_LIST]
    available_news_list = [delivery[6] for delivery in ccm.DELIVERY_LIST]
    stock = {
      'brand': brand_list, 'source': source_list, 'quantity': quantity_list, 
      'delivery_date': delivery_date_list, 'available_date': available_date_list, 
      'delivery_news': delivery_news_list, 'available_news': available_news_list,
    }
    return stock
  
  def makeRef_vaccinationDeliveries(self):
    month_list = list(ccm.QC_REF_DICT.keys())
    link_list  = list(ccm.QC_REF_DICT.values())
    stock = {'month': month_list, 'link': link_list}
    return stock
  
  def makeReadme_vaccinationDeliveries(self, page):
    key = 'vaccination_deliveries_list'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: deliveries')
    stock.append('- Column')
    stock.append('  - `brand`')
    stock.append('  - `source`: expeditor of the delivery')
    stock.append('  - `quantity`: number of doses after quality checks fulfilled')
    stock.append('    - Quality checks always consume some doses, typically 600.')
    stock.append('    - The exact quantity can be found in FDA\'s monthly report.')
    stock.append('    - The links to these reports are listed in `vaccination_deliveries_reference.csv`.')
    stock.append('  - `delivery_date`')
    stock.append('  - `available_date`: date after quality checks fulfilled')
    stock.append('  - `delivery_news`: CNA news on the delivery')
    stock.append('  - `available_news`: CNA news or FDA press release on quality checks')
    ccm.README_DICT[page][key] = stock
    
    key = 'vaccination_deliveries_reference'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row = month')
    stock.append('- Column')
    stock.append('  - `month`')
    stock.append('  - `link`: link to the reference pdf file published by FDA')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationDeliveries(self):
    stock_d = self.makeDeliveries_vaccinationDeliveries()
    stock_d = pd.DataFrame(stock_d)
    stock_r = self.makeRef_vaccinationDeliveries()
    stock_r = pd.DataFrame(stock_r)
    
    for page in ccm.PAGE_LIST:
      if page != ccm.PAGE_OVERALL:
        continue
      
      name = '{}processed_data/{}/vaccination_deliveries_list.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, stock_d)
      name = '{}processed_data/{}/vaccination_deliveries_reference.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, stock_r)
      
      self.makeReadme_vaccinationProgress(page)
    return
  
  def makeStock_vaccinationByDose(self):
    date_list = self.getDate()
    brand_list = self.getBrand()
    cum_1st_list = self.getCum1st()
    cum_2nd_list = self.getCum2nd()
    cum_3rd_list = self.getCum3rd()
    
    ## Get variables
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    
    ## Make stock
    stock = ccm.initializeStock_dailyCounts(['interpolated']+self.dose_list)
    stock['interpolated'] += 1
    for col_tag in self.dose_list:
      stock[col_tag] = stock[col_tag].astype(float) + np.nan
    
    ## Fill from raw data
    for date, brand, cum_1st, cum_2nd, cum_3rd in zip(date_list, brand_list, cum_1st_list, cum_2nd_list, cum_3rd_list):
      if brand != 'total':
        continue
      
      ind = ccm.ISODateToOrd(date) - ord_ref
      stock['interpolated'][ind] = 0
      stock['ppl_vacc_rate'][ind] = float(cum_1st)
      stock['ppl_fully_vacc_rate'][ind] = float(cum_2nd)
      stock['ppl_vacc_3_rate'][ind] = float(cum_3rd)
    return stock
    
  def interpolate_vaccinationByDose(self, stock):
    stock = self.interpolate(stock, self.dose_list, dtype=float, cumul=True)
    
    ## Normalize & format
    population_twn = ccm.COUNTY_DICT['00000']['population']
    for col_tag in self.dose_list:
      stock[col_tag] = np.around(stock[col_tag] / population_twn, decimals=4)
    return stock
    
  def makeReadme_vaccinationByDose(self, page):
    key = 'vaccination_by_dose'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `interpolated`')
    stock.append('    - 0 = true value, not interpolated')
    stock.append('    - 1 = interpolated value')
    stock.append('  - `ppl_vacc_rate`: proportion of the population vaccinated with their 1st dose')
    stock.append('  - `ppl_fully_vacc_rate`: proportion of the population fully vaccinated')
    stock.append('  - `ppl_vacc_3_rate`: proportion of the population vaccinated with their 3rd dose')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByDose(self):
    stock = self.makeStock_vaccinationByDose()
    stock = self.interpolate_vaccinationByDose(stock)
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
      name = '{}processed_data/{}/vaccination_by_dose.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_vaccinationByDose(page)
    return
  
  def saveCsv(self):
    self.saveCsv_vaccinationByBrand()
    self.saveCsv_vaccinationProgress()
    self.saveCsv_vaccinationDeliveries()
    self.saveCsv_vaccinationByDose()
    return
  
## End of file
################################################################################
