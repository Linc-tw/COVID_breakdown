
    ################################
    ##  COVID_death.py            ##
    ##  Chieh-An Lin              ##
    ##  2022.05.19                ##
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
    self.n_total = self.data.shape[0]
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
      if id_ == '--':
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
    
    for confirmed_date in self.getCol(self.coltag_confirmed_date):
      if confirmed_date != confirmed_date:
        pass
      elif confirmed_date == 'Dec-21':
        confirmed_date = '2021-12-21'
      elif confirmed_date == '5/2o':
        confirmed_date = '2021-05-20'
      else:
        confirmed_date = [int(value) for value in confirmed_date.split('/')]
        confirmed_date = '{:04d}-{:02d}-{:02d}'.format(*confirmed_date)
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
        
    ## Loop over column
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = ccm.makeMovingAverage(stock[col_tag])
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
  def saveCsv_deathCounts(self):
    stock = self.increment_deathCounts()
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      data = ccm.truncateStock(stock, gr)
      
      ## Save
      name = '{}processed_data/{}/death_counts.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data)
      
      self.makeReadme_deathCounts(gr)
    return
  
  def makeStock_deathDelay(self):
    row_id_list = self.getRowID()
    confirmed_date_list = self.getConfirmedDate()
    death_date_list = self.getDeathDate()
    
    day_diff_list = []
    for row_id, confirmed_date, death_date in zip(row_id_list, confirmed_date_list, death_date_list):
      if confirmed_date == confirmed_date and death_date == death_date:
        day_diff = ccm.ISODateToOrd(death_date) - ccm.ISODateToOrd(confirmed_date)
        if abs(day_diff) > 90:
          continue
        day_diff_list.append(day_diff)
          #print(row_id, day_diff)
        
    hist = clt.Counter(day_diff_list)
    hist = sorted(hist.items())
    
    print(np.mean(day_diff_list))
    #print(hist)
    #for key, value in hist:
      #print(key, value)
    return
  
  def updateDeathByAge(self, stock):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    
    year_list = ['total'] + ccm.GROUP_YEAR_LIST
    age_key_list = ['total'] + self.age_key_list
    
    ## Initialize stock dict
    death_hist = {age: 0 for age in age_key_list}
    for col_tag in year_list:
      stock['death_by_age_'+col_tag] = death_hist.copy()
    
    for report_date, age in zip(report_date_list, age_list):
      col_tag = report_date[:4]
      
      stock['death_by_age_'+col_tag][age] += 1
      stock['death_by_age_'+col_tag]['total'] += 1
      stock['death_by_age_total'][age] += 1
      stock['death_by_age_total']['total'] += 1
    return
    
  def saveCsv(self):
    #self.saveCsv_deathByAge()
    return

## End of file
################################################################################
