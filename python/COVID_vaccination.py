
    ##############################
    ##  COVID_vaccination.py    ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.07.30      ##
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
    #https://covid-19.nchc.org.tw/dt_002-csse_covid_19_daily_reports_vaccine.php?countryCode=TW/taiwan
    #https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine&limitColumn=a01&limitValue=taiwan%&equalValue= like &encodeKey=MTYyNjQyODMwOQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=date&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=YES&c[]=a07&t[]=int&d[]=YES&c[]=a08&t[]=decimal&d[]=YES&c[]=a09&t[]=decimal&d[]=YES&c[]=a10&t[]=decimal&d[]=YES&c[]=a11&t[]=decimal&d[]=YES&c[]=a12&t[]=decimal&d[]=YES&c[]=a13&t[]=text&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=int&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=int&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO",
                                  
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_location = 'a01'
    self.key_iso_code = 'a02'
    self.key_date = 'a03'
    self.key_cum_vacc = 'a04'
    self.key_ppl_vacc = 'a05'
    self.key_ppl_fully_vacc = 'a06'
    self.key_new_vacc_raw = 'a07' ## Unsure
    self.key_new_vacc = 'a08'
    self.key_cum_vacc_per_100 = 'a09'
    self.key_ppl_vacc_per_100 = 'a10'
    self.key_ppl_fully_vacc_per_100 = 'a11'
    self.key_new_vacc_per_1m = 'a12'
    
    self.key_manu = 'a13'
    self.key_cum_jj = 'a14'
    self.key_cum_moderna = 'a15'
    self.key_cum_az = 'a16'
    self.key_cum_pfizer = 'a17'
    self.key_cum_sinovac = 'a18'
    self.key_cum_sputnik = 'a19'
    self.key_cum_sinopharm = 'a20'
    
    self.data = data
    self.n_total = len(self.data['data'])
    self.brand_list = ['AZ', 'Moderna']
    
    if (self.n_total > 1.5 * (ccm.getTodayOrdinal() - ccm.ISODateToOrd('2021-03-21'))):
      self.n_total //= 2
      self.data['data'] = self.data['data'][:self.n_total]
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return
  
  def getColData(self, key):
    return [row[key] for row in self.data['data']]
  
  def getDate(self):
    return [row[self.key_date] for row in self.data['data']]
  
  def getCumVacc(self):
    return [int(row[self.key_cum_vacc]) for row in self.data['data']]
  
  def getPplVacc(self):
    return [int(row[self.key_ppl_vacc]) for row in self.data['data']]
  
  def getPplFullyVacc(self):
    return [int(row[self.key_ppl_fully_vacc]) for row in self.data['data']]
  
  def getNewVacc(self):
    return [int(row[self.key_new_vacc]) for row in self.data['data']]
  
  def getCumAZ(self):
    return [int(row[self.key_cum_az]) for row in self.data['data']]
  
  def getCumModerna(self):
    return [int(row[self.key_cum_moderna]) for row in self.data['data']]
  
  def incrementWithInterpolation_vaccinationByBrand(self):
    date_list = self.getDate()
    cum_vacc_list = self.getCumVacc()
    cum_az_list = self.getCumAZ()
    cum_moderna_list = self.getCumModerna()
    
    ## Declare all brands
    cum_doses_dict = {}
    for date, cum_vacc, cum_az, cum_moderna in zip(date_list, cum_vacc_list, cum_az_list, cum_moderna_list):
      cum_doses_dict[date] = [cum_vacc, cum_az, cum_moderna]
    
    brand_list = ['total'] + self.brand_list
    
    ## Make stock dict
    stock = {'date': [], 'interpolated': [], 'brand_list': brand_list, 'new_doses': [[] for brand in brand_list]}
    
    ## For recording last non-missing data
    prev = [0] * len(brand_list)
    ord_prev = ccm.ISODateToOrd(date_list[0]) - 1
    
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ord_today = ccm.getTodayOrdinal()
    
    ## Loop over ordinal
    for ord_ in range(ord_ref, ord_today):
      date = ccm.ordDateToISO(ord_)
      stock['date'].append(date)
      
      ## Out of provided range
      if date not in cum_doses_dict:
        stock['interpolated'].append(1)
        for list_ in stock['new_doses']:
          list_.append(0)
        continue
      
      ## In range
      cum_doses = cum_doses_dict[date]
      
      ## If data non-missing
      if 0 < sum(cum_doses):
        ord_ = ccm.ISODateToOrd(date)
        length = ord_ - ord_prev
        
        for i, _ in enumerate(brand_list):
          stock['new_doses'][i] += ccm.itpFromCumul(prev[i], cum_doses[i], length)
          
        stock['interpolated'].append(-int(1 < length))
        prev = cum_doses
        ord_prev = ord_
        
      ## If data are missing
      else:
        stock['interpolated'].append(1)
    
    ## Homogenize length caused by trailing zeros
    nb_rows = ord_prev + 1 - ord_ref
    stock['date'] = stock['date'][:nb_rows]
    stock['interpolated'] = stock['interpolated'][:nb_rows]
    for i, _ in enumerate(brand_list):
      stock['new_doses'][i] = stock['new_doses'][i][:nb_rows]
    
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
    stock.append('  - `*_avg`: 7-day moving average of `*`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByBrand(self):
    stock_prev = self.incrementWithInterpolation_vaccinationByBrand()
    stock_tmp = {brand: new_doses_arr for brand, new_doses_arr in zip(stock_prev['brand_list'], stock_prev['new_doses'])}
    
    ## For order
    stock = {'date': stock_prev['date'], 'interpolated': stock_prev['interpolated']}
    stock.update(stock_tmp)
    
    ## Loop over column
    for col_tag in stock_prev['brand_list']:
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
    cum_vacc_list = self.getCumVacc()
    cum_az_list = self.getCumAZ()
    cum_moderna_list = self.getCumModerna()
    
    stock = []
    
    for date, cum_vacc, cum_az, cum_moderna in zip(date_list, cum_vacc_list, cum_az_list, cum_moderna_list):
      if 0 == cum_vacc and date != '2021-03-21':
        continue
      stock.append([date, cum_vacc, cum_az, cum_moderna])
      
    date_list = [row[0] for row in stock]
    cum_vacc_list = [row[1] for row in stock]
    cum_az_list = [row[2] for row in stock]
    cum_moderna_list = [row[3] for row in stock]
    
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    index_list = [ccm.ISODateToOrd(iso)-ord_ref for iso in date_list]
    
    stock = {'index': index_list, 'date': date_list, 'total': cum_vacc_list, 'AZ': cum_az_list, 'Moderna': cum_moderna_list}
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
    date_list = self.getDate()
    ppl_vacc_list = self.getPplVacc()
    ppl_fully_vacc_list = self.getPplFullyVacc()
    
    ## Get variables
    population_twn = ccm.COUNTY_DICT['00000']['population']
    stock = []
    
    ## Loop, skip 0
    for date, ppl_vacc, ppl_fully_vacc in zip(date_list, ppl_vacc_list, ppl_fully_vacc_list):
      if 0 == ppl_vacc + ppl_fully_vacc and date != '2021-03-21':
        continue
      stock.append([date, float(ppl_vacc)/float(population_twn), float(ppl_fully_vacc)/float(population_twn)])
    
    ## Make lists
    date_list = [row[0] for row in stock]
    ppl_vacc_rate_list = [row[1] for row in stock]
    ppl_fully_vacc_rate_list = [row[2] for row in stock]
    
    ## Adjustment
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    index_list = [ccm.ISODateToOrd(iso)-ord_ref for iso in date_list]
    ppl_vacc_rate_list = np.around(ppl_vacc_rate_list, decimals=4)
    ppl_fully_vacc_rate_list = np.around(ppl_fully_vacc_rate_list, decimals=4)
    
    ## Stock
    stock = {'index': index_list, 'date': date_list, 'ppl_vacc_rate': ppl_vacc_rate_list, 'ppl_fully_vacc_rate': ppl_fully_vacc_rate_list}
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
