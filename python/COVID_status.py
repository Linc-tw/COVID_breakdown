
    ################################
    ##  COVID_status.py           ##
    ##  Chieh-An Lin              ##
    ##  2022.01.04                ##
    ################################

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
## Class - status sheet

class StatusSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_week_nb = '週次'
    self.coltag_new_nb_cases = '新增確診'
    self.coltag_new_cases_per_week = '每週新增確診'
    self.coltag_cum_cases = '確診總人數'
    self.coltag_new_males = '新增男性'
    self.coltag_cum_males = '男性總數'
    self.coltag_male_frac = '確診男性率'
    self.coltag_new_females = '新增女性'
    self.coltag_cum_females = '女性總數'
    self.coltag_female_frac = '確診女性率'
    self.coltag_new_soldiers = '新增軍人'
    self.coltag_cum_soldiers = '敦睦總人數'
    self.coltag_soldier_frac = '軍隊率'
    self.coltag_new_imported = '新增境外'
    self.coltag_cum_imported = '境外總人數'
    self.coltag_imported_frac = '境外率'
    self.coltag_newLocal = '新增本土'
    self.coltag_cumLocal = '本土總人數'
    self.coltag_local_frac = '本土率'
    self.coltag_new_deaths = '新增死亡'
    self.coltag_cum_deaths = '死亡總人數'
    self.coltag_death_frac = '死亡率'
    self.coltag_new_unknown = '當日未知感染源數'
    self.coltag_cum_unknown = '未知感染源總數'
    self.coltag_cum_known = '已知感染源數'
    self.coltag_new_dis = '新增解除隔離'
    self.coltag_cum_dis = '解除隔離數'
    self.coltag_cum_dis_and_deaths = '解除隔離+死亡'
    self.coltag_cum_hosp = '未解除隔離數'
    self.coltag_notes = '備註'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' % ccm.DATA_PATH
    data = ccm.loadCsv(name, verbose=verbose)
    
    date_list = data[self.coltag_date].values
    ## new_year_token
    self.ind_2021 = (date_list == '2021分隔線').argmax()
    self.ind_2022 = (date_list == '2022分隔線').argmax() - 2
    
    cum_dis_list = data[self.coltag_cum_dis].values
    ind = (cum_dis_list == cum_dis_list)# * (date_list != '2021分隔線') * (date_list != '2022分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return 
  
  def getDate(self):
    date_list = []
    y = 2020
    
    ## new_year_token
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2022:
        y = 2022
      elif i >= self.ind_2021:
        y = 2021
        
      mmdd_zh = date.split('月')
      m = int(mmdd_zh[0])
      dd_zh = mmdd_zh[1].split('日')
      d = int(dd_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
    
  def getCumCases(self):
    return self.getCol(self.coltag_cum_cases).astype(int)
    
  def getCumDeaths(self):
    return self.getCol(self.coltag_cum_deaths).astype(int)
    
  def getCumDischarged(self):
    cum_dis_list = self.getCol(self.coltag_cum_dis)
    ind = cum_dis_list == '0.00%'
    cum_dis_list[ind] = 0
    return cum_dis_list.astype(int)
    
  def getCumHospitalized(self):
    return self.getCol(self.coltag_cum_hosp).astype(int)
    
  def makeReadme_statusEvolution(self, page):
    key = 'status_evolution'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `discharged`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    stock.append('  - `death`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_statusEvolution(self):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_dis_list = self.getCumDischarged()
    cum_hosp_list = self.getCumHospitalized()
    
    stock = {'date': date_list, 'discharged': cum_dis_list, 'hospitalized': cum_hosp_list, 'death': cum_deaths_list}
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/status_evolution.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_statusEvolution(page)
    return
    
  def makeReadme_deathCounts(self, page):
    key = 'death_counts'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `death`')
    stock.append('  - `death_avg`: 7-day moving average of `death`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_deathCounts(self):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_deaths_list_offset = np.insert(cum_deaths_list[:-1], 0, 0)
    new_deaths_list = cum_deaths_list - cum_deaths_list_offset
    avg_arr = ccm.makeMovingAverage(new_deaths_list)
    
    stock = {'date': date_list, 'death': new_deaths_list, 'death_avg': avg_arr}
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/death_counts.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_deathCounts(page)
    return
    
  def makeReadme_hospitalizationOrIsolation(self, page):
    key = 'hospitalization_or_isolation'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_hospitalizationOrIsolation(self):
    date_list = self.getDate()
    cum_hosp_list = self.getCumHospitalized()
    
    stock = {'date': date_list, 'hospitalized': cum_hosp_list}
    stock = pd.DataFrame(stock)
    stock = ccm.adjustDateRange(stock)
    
    for page in ccm.PAGE_LIST:
      data = ccm.truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/hospitalization_or_isolation.csv' % (ccm.DATA_PATH, page)
      ccm.saveCsv(name, data)
      
      self.makeReadme_hospitalizationOrIsolation(page)
    return
    
  def updateCumCounts(self, stock):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_cases_list = self.getCumCases()
    
    stock_tmp = {'date': date_list, 'cum_cases': cum_cases_list, 'cum_deaths': cum_deaths_list}
    stock_tmp = pd.DataFrame(stock_tmp)
    stock_tmp = ccm.adjustDateRange(stock_tmp)
    
    stock['cum_cases'] = stock_tmp['cum_cases'].values
    stock['cum_deaths'] = stock_tmp['cum_deaths'].values
    return
  
  def saveCsv(self):
    self.saveCsv_statusEvolution()
    self.saveCsv_deathCounts()
    self.saveCsv_hospitalizationOrIsolation()
    return

## End of file
################################################################################
