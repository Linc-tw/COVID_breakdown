
    ################################
    ##  COVID_death.py            ##
    ##  Chieh-An Lin              ##
    ##  2022.05.27                ##
    ################################

import os
import sys
import datetime as dtt
import collections as clt

import numpy as np
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - death sheet

class DeathSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_row_id = 'id'
    self.coltag_report_date = '公布日'
    self.coltag_id = '案號'
    self.coltag_gender = '性別'
    self.coltag_age = '年齡'
    self.coltag_comorbidity = '慢性病史'
    self.coltag_vacc_status = '是否接種COVID19疫苗'
    self.coltag_contact_hist = '活動接觸史'
    self.coltag_onset_date = '發病日'
    self.coltag_symptoms = '症狀'
    self.coltag_tested_date = '採檢日'
    self.coltag_isolation_date = '住院/隔離日'
    self.coltag_confirmed_date = '確診日'
    self.coltag_death_date = '死亡日'
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_death.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=4002
    
    self.data = data
    self.correctData()
    self.n_total = self.getNbRows()
    
    self.age_key_list = [
      '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', 
      '60-69', '70-79', '80-89', '90-99', '100+'
    ]
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return 
    
  def correctData(self):
    report_date_list = self.getReportDate()
    id_list = self.getID()
    for i, id_ in enumerate(id_list):
      if id_ != id_:
        continue
      
      if id_ in [799, 935] or id_ < 300:
        self.data.loc[i, self.coltag_onset_date] = '2020' + self.data.loc[i, self.coltag_onset_date][4:]
        self.data.loc[i, self.coltag_confirmed_date] = '2020' + self.data.loc[i, self.coltag_confirmed_date][4:]
      
      if id_ < 300:
        self.data.loc[i, self.coltag_report_date] = '2020' + self.data.loc[i, self.coltag_report_date][4:]
        self.data.loc[i, self.coltag_death_date] = '2020' + self.data.loc[i, self.coltag_death_date][4:]
    return
    
  def getReportDate(self):
    return self.getCol(self.coltag_report_date)
  
  def getRowID(self):
    return self.getCol(self.coltag_row_id)
  
  def getID(self):
    id_list = []
    for id_ in self.getCol(self.coltag_id):
      if id_ != id_:
        id_list.append(np.nan)
      elif id_ == '--':
        id_list.append(np.nan)
      else:
        id_list.append(int(id_))
    return id_list
  
  def getAge(self):
    age_list = []
    for age in self.getCol(self.coltag_age):
      ind = int(age) // 10
      age_list.append(self.age_key_list[ind])
    return age_list
  
  def getConfirmedDate(self):
    confirmed_date_list = []
    
    for i, confirmed_date in enumerate(self.getCol(self.coltag_confirmed_date)):
      if confirmed_date != confirmed_date:
        confirmed_date = np.nan
      elif confirmed_date in ['--', '調查中']:
        confirmed_date = np.nan
      elif confirmed_date == 'Dec-21':
        confirmed_date = '2021-12-21'
      elif confirmed_date == '5/2o':
        confirmed_date = '2021-05-20'
      elif confirmed_date == '4/27':
        confirmed_date = '2022-04-27'
      elif confirmed_date == '4/28':
        confirmed_date = '2022-04-28'
      else:
        try:
          confirmed_date = [int(value) for value in confirmed_date.split('/')]
          confirmed_date = '{:04d}-{:02d}-{:02d}'.format(*confirmed_date)
        except:
          print('ID = {}, confirmed_date = {}'.format(i+1, confirmed_date))
          confirmed_date = np.nan
      confirmed_date_list.append(confirmed_date)
      
    return confirmed_date_list
  
  def getDeathDate(self):
    return self.getCol(self.coltag_death_date)
  
  def increment_deathCounts(self):
    report_date_list = self.getReportDate()
    
    ## Initialize stocks
    col_tag_list = ['death']
    stock = ccm.initializeStock_dailyCounts(col_tag_list)
    
    ## Loop over cases
    for report_date in report_date_list:
      try:
        ind = ccm.indexForOverall(report_date)
        stock['death'][ind] += 1
      except IndexError: ## If NaN
        pass
        
    ## Make avg
    for key in col_tag_list:
      stock[key+'_avg'] = ccm.makeMovingAverage(stock[key])
    return stock
    
  def makeReadme_deathCounts(self, gr):
    key = 'death_counts'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `death`')
    stock.append('  - `death_avg`: 7-day moving average of `death`')
    ccm.README_DICT[gr][key] = stock
    return
  
  ## Not used
  def saveCsv_deathCounts(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.increment_deathCounts()
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/death_counts.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_deathCounts(gr)
    return
  
  def increment_deathDelay(self):
    report_date_list = self.getReportDate()
    confirmed_date_list = self.getConfirmedDate()
    
    stock = {'list': []}
    stock_dict = ccm.initializeStockDict_general(stock)
    
    for report_date, confirmed_date in zip(report_date_list, confirmed_date_list):
      if confirmed_date != confirmed_date:
        continue
      
      ord_rep = ccm.ISODateToOrd(report_date)
      ord_cf = ccm.ISODateToOrd(confirmed_date)
      diff = ord_rep - ord_cf
      
      index_list = ccm.makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['list'].append(diff)
    
    return stock_dict
  
  def makeHist_deathDelay(self, stock_dict):
    upper = 80
    width = 1
    bins = np.arange(-0.5, upper+width, width) ## Histogram bins
    bins[-1] = 999
    
    for gr, stock in stock_dict.items():
      n_arr, ctr_bins = ccm.makeHist(stock['list'], bins)
      n_arr = n_arr.round(0).astype(int)
      ctr_bins = ctr_bins.round(0).astype(int)
      ctr_bins[-1] = upper
      
      stock['bins'] = ctr_bins
      stock['n_arr'] = n_arr
      
      ## Calculate counts, missing, & avg
      stock['counts'] = len(stock['list'])
      stock['missing'] = sum(np.isnan(stock['list']))
      stock['avg'] = np.around(np.nanmean(stock['list']), decimals=2)
      
    return stock_dict
  
  def makeStock_deathDelay(self, stock_dict):
    key_list = ['counts', 'missing', 'avg']
    stock_dict_c = {}
    stock_dict_l = {}
    
    for gr, stock in stock_dict.items():
      stock_c = {'difference': stock['bins']}
      stock_l = {'key': key_list}
      
      if gr == ccm.GROUP_OVERALL:
        stock_c['total'] = stock['n_arr']
        stock_l['total'] = [stock[key] for key in key_list]
        for year in ccm.GROUP_YEAR_LIST:
          stock_c[year] = stock_dict[year]['n_arr']
          stock_l[year] = [stock_dict[year][key] for key in key_list]
      else:
        stock_c['total'] = stock['n_arr']
        stock_l['value'] = [stock[key] for key in key_list]
        
      stock_dict_c[gr] = stock_c
      stock_dict_l[gr] = stock_l
    return stock_dict_c, stock_dict_l
  
  def makeReadme_deathDelay(self, gr):
    key = 'death_delay'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: delay in days between case and death report')
    stock.append('- Column: transmission type')
    stock.append('  - `difference`: see row')
    if gr == ccm.GROUP_LATEST:
      stock.append('  - `total`: last 90 days')
    elif gr == ccm.GROUP_OVERALL:
      stock.append('  - `total`: overall stats')
      stock.append('  - `YYYY`: during year `YYYY`')
    elif gr in ccm.GROUP_YEAR_LIST:
      stock.append('  - `total`: all year {}'.format(gr))
    ccm.README_DICT[gr][key] = stock
    
    key = 'death_delay_label'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row')
    stock.append('  - `counts`: total number of deaths')
    stock.append('  - `missing`: number of deaths without the report date of diagnosis')
    stock.append('  - `avg`: average delay')
    stock.append('- Column')
    stock.append('  - `key`')
    if gr == ccm.GROUP_OVERALL:
      stock.append('  - `total`: overall stats')
      stock.append('  - `YYYY`: during year `YYYY`')
    else:
      stock.append('  - `value`')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_deathDelay(self, mode='both'):
    if mode in ['data', 'both']:
      stock_dict = self.increment_deathDelay()
      stock_dict = self.makeHist_deathDelay(stock_dict)
      stock_dict_c, stock_dict_l = self.makeStock_deathDelay(stock_dict)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data_c = stock_dict_c[gr]
        data_c = pd.DataFrame(data_c)
        
        data_l = stock_dict_l[gr]
        data_l = pd.DataFrame(data_l)
        
        ## Save
        name = '{}processed_data/{}/death_delay.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data_c)
        name = '{}processed_data/{}/death_delay_label.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data_l)
      
      if mode in ['readme', 'both']:
        self.makeReadme_deathDelay(gr)
    return
  
  def updateDeathByAge(self, stock):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    
    year_list = ['total'] + ccm.GROUP_YEAR_LIST
    age_key_list = ['total'] + self.age_key_list
    
    ## Initialize stock dict
    death_hist = {key: 0 for key in age_key_list}
    for year in year_list:
      stock['death_by_age_'+year] = death_hist.copy()
    
    for report_date, age in zip(report_date_list, age_list):
      year = report_date[:4]
      
      stock['death_by_age_total'][age] += 1
      stock['death_by_age_total']['total'] += 1
      stock['death_by_age_'+year][age] += 1
      stock['death_by_age_'+year]['total'] += 1
    return
    
  def saveCsv(self, mode='both'):
    self.saveCsv_deathDelay(mode=mode)
    return

## End of file
################################################################################
