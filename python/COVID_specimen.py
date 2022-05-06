
    ################################
    ##  COVID_specimen.py         ##
    ##  Chieh-An Lin              ##
    ##  2022.05.06                ##
    ################################

import os
import sys
import datetime as dtt

import numpy as np
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - specimen sheet

class SpecimenSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '通報日'
    self.coltag_from_clin_def = '法定傳染病通報'
    self.coltag_from_qt = '居家檢疫送驗'
    self.coltag_from_extended = '擴大監測送驗'
    self.coltag_total = 'Total'
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_specimen.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    #https://od.cdc.gov.tw/eic/covid19/covid19_tw_specimen.csv
    
    tot_list = data[self.coltag_total].values
    ind = tot_list != '0.0'
    ind[:-50] = True
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return 
    
  def getDate(self):
    date_list = []
    
    for date in self.getCol(self.coltag_date):
      md_slash = date.split('/')
      y = int(md_slash[0])
      m = int(md_slash[1])
      d = int(md_slash[2])
      
      date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
      date_list.append(date)
    return date_list
  
  def getFromClinDef(self):
    from_clin_def_list = []
    for from_clin_def in self.getCol(self.coltag_from_clin_def):
      from_clin_def_list.append(int(float(from_clin_def)))
    return from_clin_def_list

  def getFromQT(self):
    from_qt_list = []
    for from_qt in self.getCol(self.coltag_from_qt):
      from_qt_list.append(int(float(from_qt)))
    return from_qt_list

  def getFromExtended(self):
    from_ext_list = []
    for from_ext in self.getCol(self.coltag_from_extended):
        from_ext_list.append(int(float(from_ext)))
    return from_ext_list

  def getTotal(self):
    total_list = []
    for total in self.getCol(self.coltag_total):
      total_list.append(int(float(total)))
    return total_list

  def makeReadme_testCounts(self, page):
    key = 'test_counts'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: total test counts')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_testCounts(self):
    date_list = self.getDate()
    total_list = self.getTotal()
    
    avg_arr = ccm.makeMovingAverage(total_list)
    stock = {'date': date_list, 'total': total_list, 'total_avg': avg_arr}
    
    stock = pd.DataFrame(stock)
    stock = stock[:-1]
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '{}processed_data/{}/test_counts.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_testCounts(page)
    return
  
  def makeReadme_testByCriterion(self, page):
    key = 'test_by_criterion'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `clinical`: based on clinical criteria')
    stock.append('  - `quarantine`: on people in quarantine (obsolete)')
    stock.append('  - `extended`: extended community search')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_testByCriterion(self):
    date_list = self.getDate()
    from_clin_def_list = self.getFromClinDef()
    from_qt_list = self.getFromQT()
    from_ext_list = self.getFromExtended()
    
    stock = {'date': date_list, 'clinical': from_clin_def_list, 'quarantine': from_qt_list, 'extended': from_ext_list}
    stock = pd.DataFrame(stock)
    stock = stock[:-1]
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '{}processed_data/{}/test_by_criterion.csv'.format(ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_testByCriterion(page)
    return
  
  def updateNewTestCounts(self, stock):
    date_list = self.getDate()
    total_list = self.getTotal()
    
    stock_tmp = {'date': date_list, 'new_tests': total_list}
    stock_tmp = pd.DataFrame(stock_tmp)
    stock_tmp = ccm.adjustDateRange(stock_tmp)
    
    stock['new_tests'] = stock_tmp['new_tests'].values
    return
  
  def saveCsv(self):
    self.saveCsv_testCounts()
    self.saveCsv_testByCriterion()
    return

## End of file
################################################################################
