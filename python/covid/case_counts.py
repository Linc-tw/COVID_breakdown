
    ################################
    ##  case_counts.py            ##
    ##  Chieh-An Lin              ##
    ##  2023.01.25                ##
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
## Class - case sheet

class CaseCountsSheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_id = 'id'
    self.coltag_iso_code = 'iso_code'
    self.coltag_continent = '洲名'
    self.coltag_country = '國家'
    self.coltag_date = '日期'
    self.coltag_total = '總確診數'
    self.coltag_new = '新增確診數'
    self.coltag_new_avg = '七天移動平均新增確診數'
    self.coltag_total_ratio = '總確診數/每百萬人'
    self.coltag_new_ratio = '新增確診數/每百萬人'
    self.coltag_new_ratio_avg = '七天移動平均新增確診數/每百萬人'
    self.coltag_population = '總人口數'
    self.coltag_new_official = '新聞稿發佈新增確診數'
    
    self.n_total = 0
    self.n_latest = 0
    self.n_year_dict = {}
    ## new_year_token
    
    name = f'{cvcm.DATA_PATH}raw_data/COVID-19_in_Taiwan_raw_data_case_counts.csv'
    data = cvcm.loadCsv(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=4051&chartset=utf-8&limited=TWN
    
    self.setData(data)
    self.setCaseCounts()
    
    if verbose:
      print(f'N_total = {self.n_total}')
      print(f'N_latest = {self.n_latest}')
      for year in cvcm.GROUP_YEAR_LIST:
        if year in [cvcm.GROUP_2020, cvcm.GROUP_2021, cvcm.GROUP_2022]:
          continue
        print(f'N_{year} = {self.n_year_dict[year]}')
    return 
  
  def setData(self, data):
    date_list = data[self.coltag_date].values
    ind = [int(date[:4]) >= 2023 for date in date_list]
    self.data = data[ind]
    return
  
  def setCaseCounts(self):
    date_list = self.getDate()
    new_list = self.getNew()
    
    stock = {'date': date_list, 'total': new_list}
    stock = pd.DataFrame(stock)
    stock = cvcm.adjustDateRange(stock)
    
    cum_cases_dict = {}
    for gr in cvcm.GROUP_LIST:
      data = cvcm.truncateStock(stock, gr)
      new_cases = data['total'].values
      ind = ~pd.isna(new_cases)
      cum_cases_dict[gr] = new_cases[ind].sum()
      
    self.n_total = int(cum_cases_dict[cvcm.GROUP_OVERALL])
    self.n_latest = int(cum_cases_dict[cvcm.GROUP_LATEST])
    for year in cvcm.GROUP_YEAR_LIST:
      if year in [cvcm.GROUP_2020, cvcm.GROUP_2021, cvcm.GROUP_2022]:
        continue
      self.n_year_dict[year] = int(cum_cases_dict[year])
    return
    
  def getDate(self):
    date_list = []
    for date in self.getCol(self.coltag_date):
      date_list.append(date)
    return date_list
  
  def getNew(self):
    new_list = []
    for new in self.getCol(self.coltag_new):
      new_list.append(int(new))
    return new_list
  
  def makeReadme_caseCounts(self, gr):
    key = 'case_counts'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: total case counts')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  ## Not used
  def saveCsv_caseCounts(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      new_list = self.getNew()
      avg_arr = cvcm.makeMovingAverage(new_list)
      
      stock = {'date': date_list, 'total': new_list, 'total_avg': avg_arr}
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in cvcm.GROUP_LIST:
      if gr in [cvcm.GROUP_2020, cvcm.GROUP_2021]:
        continue
      
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/case_counts.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_testCounts(gr)
    return
  
  def updateNewCaseCounts(self, stock):
    date_list = self.getDate()
    new_total_list = self.getNew()
    nan_list = np.zeros_like(new_total_list, dtype=int) + pd.NA
    
    stock['date_1'] = date_list
    stock['total_1'] = new_total_list
    stock['imported_1'] = nan_list
    stock['local_1'] = nan_list
    stock['others_1'] = nan_list
    return
  
  def saveCsv(self, mode='both'):
    return

## End of file
################################################################################
