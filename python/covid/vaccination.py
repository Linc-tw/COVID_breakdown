
    ################################
    ##  vaccination.py            ##
    ##  Chieh-An Lin              ##
    ##  2023.04.13                ##
    ################################

import os
import sys
import datetime as dtt
import collections as clt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import covid.common as cvcm

################################################################################
## Class - vaccination sheet

class VaccinationSheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_row_id = 'id'
    self.coltag_country = '國家'
    self.coltag_date = '統計日期'
    self.coltag_brand = '疫苗廠牌'
    self.coltag_cum_1st = '第一劑累計接種人次'
    self.coltag_cum_2nd = '第二劑累計接種人次'
    self.coltag_cum_3rd_1 = '追加劑累計接種人次'
    self.coltag_cum_3rd_2 = '加強劑累計接種人次'
    self.coltag_cum_4th_1 = '第2次追加劑'
    self.coltag_cum_4th_2 = '第2次加強劑'
    self.coltag_cum_tot = '總共累計接種人次'
    
    name = f'{cvcm.DATA_PATH}raw_data/COVID-19_in_Taiwan_raw_data_vaccination.csv'
    data = cvcm.loadCsv(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2004&chartset=utf-8
    
    self.data = data
    self.n_total = len(set(self.getDate()))
    
    self.brand_key_list = ['AZ', 'Moderna', 'Medigen', 'Pfizer', 'Novavax']
    self.dose_key_list = ['ppl_vacc_rate', 'ppl_fully_vacc_rate', 'ppl_vacc_3_rate', 'ppl_vacc_4_rate']
    
    if verbose:
      print(f'N_total = {self.n_total}')
    return
  
  def getDate(self):
    return self.getCol(self.coltag_date)
  
  def getBrand(self):
    brand_list = []
    
    for brand in self.getCol(self.coltag_brand):
      try:
        brand_list.append(cvcm.BRAND_DICT[brand])
      except KeyError:
        print(f'Brand, {brand}')
        brand_list.append('unknown')
    return brand_list
  
  def getCum1st(self):
    return [int(value) for value in self.getCol(self.coltag_cum_1st)]
  
  def getCum2nd(self):
    return [int(value) for value in self.getCol(self.coltag_cum_2nd)]
  
  def getCum3rd(self):
    return [int(value_1)+int(value_2) for value_1, value_2 in zip(self.getCol(self.coltag_cum_3rd_1), self.getCol(self.coltag_cum_3rd_2))]
  
  def getCum4th(self):
    return [int(value_1)+int(value_2) for value_1, value_2 in zip(self.getCol(self.coltag_cum_4th_1), self.getCol(self.coltag_cum_4th_2))]
  
  def getCumTot(self):
    return [int(value) for value in self.getCol(self.coltag_cum_tot)]
  
  def interpolate(self, stock, col_tag_list, dtype=int, cumul=True):
    ord_ref = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
    ord_today = cvcm.getTodayOrdinal()
    prev = {col_tag: 0 for col_tag in col_tag_list}
    ord_prev = ord_ref
    
    ## Set initial zero
    ord_zero = cvcm.ISODateToOrd('2021-03-21')
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
    
    brand_key_list = ['total'] + self.brand_key_list
    
    ## Initialize stock
    stock = cvcm.initializeStock_dailyCounts(['interpolated']+brand_key_list)
    stock['interpolated'] += 1
    for key in brand_key_list:
      stock[key] = stock[key].astype(float) + np.nan
    
    ord_ref = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
    
    ## Fill raw data to stock
    for date, cum_doses in cum_doses_dict.items():
      ind = cvcm.ISODateToOrd(date) - ord_ref
      stock['interpolated'][ind] = 0
      for brand, cd in cum_doses.items():
        stock[brand][ind] = cd
    return stock
   
  def interpolate_vaccinationByBrand(self, stock):
    brand_key_list = ['total'] + self.brand_key_list
    stock = self.interpolate(stock, brand_key_list, dtype=int, cumul=False)
    
    ## Loop over column
    for key in brand_key_list:
      stock[key+'_avg'] = cvcm.makeMovingAverage(stock[key])
    return stock
  
  def makeReadme_vaccinationByBrand(self, gr):
    key = 'vaccination_by_brand'
    stock = []
    stock.append(f'`{key}.csv`')
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
    stock.append('  - `Novavax`')
    stock.append('  - `*_avg`: 7-day moving average of `*`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationByBrand(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_vaccinationByBrand()
      stock = self.interpolate_vaccinationByBrand(stock)
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
      
    for gr in cvcm.GROUP_LIST:
      if gr == cvcm.GROUP_2020:
        continue
      
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Vaccination trunk
        if gr == cvcm.GROUP_OVERALL:
          ind = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF_VACC) - cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
          data = data[ind:]
          
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_brand.csv'
        cvcm.saveCsv(name, data)
        
      if mode in ['readme', 'both']:
        self.makeReadme_vaccinationByBrand(gr)
    return
  
  def makeSupplies_vaccinationProgress(self):
    ord_ref = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
    nb_rows = len(cvcm.DELIVERY_LIST)
    brand_key_list = ['total'] + self.brand_key_list
    
    cum_dict = {key: 0 for key in brand_key_list}
    stock = {key: [] for key in ['date', 'source']+brand_key_list}
    today_ord = cvcm.getTodayOrdinal()
    
    ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
    for row in cvcm.DELIVERY_LIST:
      brand, source, quantity, delivery_date, available_date, _, _ = row
      
      if available_date is None or available_date == '':
        estimated_avail = cvcm.ISODateToOrd(delivery_date) + 8
        if estimated_avail > today_ord:
          ind = -1
        else:
          available_date = cvcm.ordDateToISO(estimated_avail)
          ind = estimated_avail - ord_ref
      else:
        ind = cvcm.ISODateToOrd(available_date) - ord_ref 
      
      cum_dict['total'] += quantity
      cum_dict[brand] += quantity
      
      stock['date'].append(available_date)
      stock['source'].append(source)
      for key in brand_key_list:
        stock[key].append(cum_dict[key])
        
    return stock
    
  def makeInjections_vaccinationProgress(self):
    stock = self.makeStock_vaccinationByBrand()
    stock = self.interpolate(stock, ['total']+self.brand_key_list, dtype=int, cumul=True)
    return stock
  
  def makeReadme_vaccinationProgress(self, gr):
    key = 'vaccination_progress_supplies'
    stock = []
    stock.append(f'`{key}.csv`')
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
    stock.append('  - `Novavax`')
    cvcm.README_DICT[gr][key] = stock
    
    key = 'vaccination_progress_injections'
    stock = []
    stock.append(f'`{key}.csv`')
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
    stock.append('  - `Novavax`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationProgress(self, mode='both'):
    if mode in ['data', 'both']:
      data_s = self.makeSupplies_vaccinationProgress()
      data_s = pd.DataFrame(data_s) ## No cut on supplies
      
      stock_i = self.makeInjections_vaccinationProgress()
      stock_i = pd.DataFrame(stock_i)
      stock_i = cvcm.adjustDateRange(stock_i)
    
    for gr in cvcm.GROUP_LIST:
      if gr == cvcm.GROUP_2020:
        continue
      
      if mode in ['data', 'both']:
        data_i = cvcm.truncateStock(stock_i, gr)
        
        ## Vaccination trunk
        if gr == cvcm.GROUP_OVERALL:
          ind = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF_VACC) - cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
          data_i = data_i[ind:]
        
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_progress_supplies.csv'
        cvcm.saveCsv(name, data_s)
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_progress_injections.csv'
        cvcm.saveCsv(name, data_i)
      
      if mode in ['readme', 'both']:
        self.makeReadme_vaccinationProgress(gr)
    return
  
  def makeDeliveries_vaccinationDeliveries(self):
    col_tag_list = ['brand', 'source', 'quantity', 'delivery_date', 'available_date', 'delivery_news', 'available_news']
    stock = [[] for _ in col_tag_list]
    
    for delivery in cvcm.DELIVERY_LIST:
      for i, value in enumerate(delivery):
        stock[i].append(value)
    
    stock = {col_tag: list_ for col_tag, list_ in zip(col_tag_list, stock)}
    return stock
  
  def makeRef_vaccinationDeliveries(self):
    month_list = list(cvcm.QC_REF_DICT.keys())
    link_list = list(cvcm.QC_REF_DICT.values())
    stock = {'month': month_list, 'link': link_list}
    return stock
  
  def makeReadme_vaccinationDeliveries(self, gr):
    key = 'vaccination_deliveries_list'
    stock = []
    stock.append(f'`{key}.csv`')
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
    cvcm.README_DICT[gr][key] = stock
    
    key = 'vaccination_deliveries_reference'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row = month')
    stock.append('- Column')
    stock.append('  - `month`')
    stock.append('  - `link`: link to the reference pdf file published by FDA')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationDeliveries(self, mode='both'):
    gr = cvcm.GROUP_OVERALL
    
    if mode in ['data', 'both']:
      data_d = self.makeDeliveries_vaccinationDeliveries()
      data_d = pd.DataFrame(data_d)
      
      data_r = self.makeRef_vaccinationDeliveries()
      data_r = pd.DataFrame(data_r)
    
    ## Save
    if mode in ['data', 'both']:
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_deliveries_list.csv'
      cvcm.saveCsv(name, data_d)
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_deliveries_reference.csv'
      cvcm.saveCsv(name, data_r)
    
    if mode in ['readme', 'both']:
      self.makeReadme_vaccinationDeliveries(gr)
    return
  
  def makeStock_vaccinationByDose(self):
    date_list = self.getDate()
    brand_list = self.getBrand()
    cum_1st_list = self.getCum1st()
    cum_2nd_list = self.getCum2nd()
    cum_3rd_list = self.getCum3rd()
    cum_4th_list = self.getCum4th()
    
    ## Get variables
    ord_ref = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
    
    ## Make stock
    stock = cvcm.initializeStock_dailyCounts(['interpolated']+self.dose_key_list)
    stock['interpolated'] += 1
    for key in self.dose_key_list:
      stock[key] = stock[key].astype(float) + np.nan
    
    ## Fill from raw data
    for date, brand, cum_1st, cum_2nd, cum_3rd, cum_4th in zip(date_list, brand_list, cum_1st_list, cum_2nd_list, cum_3rd_list, cum_4th_list):
      if brand != 'total':
        continue
      
      ind = cvcm.ISODateToOrd(date) - ord_ref
      stock['interpolated'][ind] = 0
      stock['ppl_vacc_rate'][ind] = float(cum_1st)
      stock['ppl_fully_vacc_rate'][ind] = float(cum_2nd)
      stock['ppl_vacc_3_rate'][ind] = float(cum_3rd)
      stock['ppl_vacc_4_rate'][ind] = float(cum_4th)
    return stock
    
  def interpolate_vaccinationByDose(self, stock):
    stock = self.interpolate(stock, self.dose_key_list, dtype=float, cumul=True)
    
    ## Normalize & format
    population_twn = cvcm.COUNTY_DICT['00000']['population']
    for key in self.dose_key_list:
      stock[key] = np.around(stock[key] / population_twn, decimals=4)
    return stock
    
  def makeReadme_vaccinationByDose(self, gr):
    key = 'vaccination_by_dose'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `interpolated`')
    stock.append('    - 0 = true value, not interpolated')
    stock.append('    - 1 = interpolated value')
    stock.append('  - `ppl_vacc_rate`: proportion of the population vaccinated with their 1st dose')
    stock.append('  - `ppl_fully_vacc_rate`: proportion of the population fully vaccinated')
    stock.append('  - `ppl_vacc_3_rate`: proportion of the population vaccinated with their 3rd dose')
    stock.append('  - `ppl_vacc_4_rate`: proportion of the population vaccinated with their 4th dose')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationByDose(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_vaccinationByDose()
      stock = self.interpolate_vaccinationByDose(stock)
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in cvcm.GROUP_LIST:
      if gr == cvcm.GROUP_2020:
        continue
      
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Vaccination trunk
        if gr == cvcm.GROUP_OVERALL:
          ind = cvcm.ISODateToOrd(cvcm.ISO_DATE_REF_VACC) - cvcm.ISODateToOrd(cvcm.ISO_DATE_REF)
          data = data[ind:]
          
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_dose.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_vaccinationByDose(gr)
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_vaccinationByBrand(mode='readme')
    self.saveCsv_vaccinationProgress(mode='readme')
    self.saveCsv_vaccinationDeliveries(mode='readme')
    self.saveCsv_vaccinationByDose(mode='readme')
    return
  
## End of file
################################################################################
