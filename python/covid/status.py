
    ################################
    ##  status.py                 ##
    ##  Chieh-An Lin              ##
    ##  2023.01.25                ##
    ################################

import os
import sys
import datetime as dtt
import warnings as wng

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import covid.common as cvcm

################################################################################
## Class - status sheet

class StatusSheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_week_nb = '週次'
    self.coltag_new_cases = '新增確診'
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
    self.coltag_new_local = '新增本土'
    self.coltag_cum_local = '本土總人數'
    self.coltag_local_frac = '本土率'
    self.coltag_new_unclear = '新增不明'
    self.coltag_cum_unclear = '不明總人數'
    self.coltag_unclear_frac = '不明率'
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
    
    self.n_total = 0
    self.n_latest = 0
    self.n_year_dict = {}
    self.ind_2021 = None
    self.ind_2022 = None
    
    name = f'{cvcm.DATA_PATH}raw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv'
    data = cvcm.loadCsv(name, verbose=verbose)
    
    self.setData(data)
    self.setCaseCounts()
    
    self.trans_key_list = ['imported', 'local', 'others']
    
    if verbose:
      print(f'N_total = {self.n_total}')
      print(f'N_latest = {self.n_latest}')
      for year in cvcm.GROUP_YEAR_LIST:
        if year not in [cvcm.GROUP_2020, cvcm.GROUP_2021, cvcm.GROUP_2022]:
          continue
        print(f'N_{year} = {self.n_year_dict[year]}')
    return 
  
  def setData(self, data):
    date_list = data[self.coltag_date].values
    
    self.ind_2021 = (date_list == '2021分隔線').argmax() - 1
    self.ind_2022 = (date_list == '2022分隔線').argmax() - 2
    
    cum_dis_list = data[self.coltag_cum_dis].values
    ind = cum_dis_list == cum_dis_list
    self.data = data[ind]
    return
    
  def setCaseCounts(self):
    date_list = self.getDate()
    new_soldiers_list = self.getNewSoldiers()
    new_impored_list = self.getNewImported()
    new_local_list = self.getNewLocal()
    new_unclear_list = self.getNewUnclear()
    
    new_others_list = new_soldiers_list + new_unclear_list
    new_cases_list = new_impored_list + new_local_list + new_others_list
    
    stock = {'date': date_list[:-1], 'total': new_cases_list[:-1]}
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
      if year not in [cvcm.GROUP_2020, cvcm.GROUP_2021, cvcm.GROUP_2022]:
        continue
      self.n_year_dict[year] = int(cum_cases_dict[year])
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
      date = f'{y:04}-{m:02}-{d:02}'
      date_list.append(date)
    return date_list
    
  def getCumCases(self):
    return self.getCol(self.coltag_cum_cases).astype(int)
    
  def getNewSoldiers(self):
    return self.getCol(self.coltag_new_soldiers).astype(int)
    
  def getNewImported(self):
    return self.getCol(self.coltag_new_imported).astype(int)
    
  def getNewLocal(self):
    return self.getCol(self.coltag_new_local).astype(int)
    
  def getNewUnclear(self):
    return self.getCol(self.coltag_new_unclear).astype(int)
    
  def getNewDeaths(self):
    return self.getCol(self.coltag_new_deaths).astype(int)
    
  def getCumDeaths(self):
    return self.getCol(self.coltag_cum_deaths).astype(int)
    
  def getCumDischarged(self):
    cum_dis_list = self.getCol(self.coltag_cum_dis)
    ind = cum_dis_list == '0.00%'
    cum_dis_list[ind] = 0
    return cum_dis_list.astype(int)
    
  def getCumHospitalized(self):
    return self.getCol(self.coltag_cum_hosp).astype(int)
    
  def makeReadme_statusEvolution(self, gr):
    key = 'status_evolution'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `discharged`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    stock.append('  - `death`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_statusEvolution(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      cum_deaths_list = self.getCumDeaths()
      cum_dis_list = self.getCumDischarged()
      cum_hosp_list = self.getCumHospitalized()
      
      stock = {'date': date_list, 'discharged': cum_dis_list, 'hospitalized': cum_hosp_list, 'death': cum_deaths_list}
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in [cvcm.GROUP_OVERALL, cvcm.GROUP_2020, cvcm.GROUP_2021, cvcm.GROUP_2022]:
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/status_evolution.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_statusEvolution(gr)
    return
    
  def makeReadme_hospitalizationOrIsolation(self, gr):
    key = 'hospitalization_or_isolation'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_hospitalizationOrIsolation(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      cum_hosp_list = self.getCumHospitalized()
      
      stock = {'date': date_list, 'hospitalized': cum_hosp_list}
      stock = pd.DataFrame(stock)
      stock = cvcm.adjustDateRange(stock)
    
    for gr in [cvcm.GROUP_OVERALL, cvcm.GROUP_2020, cvcm.GROUP_2021]:
      if mode in ['data', 'both']:
        data = cvcm.truncateStock(stock, gr)
        
        ## Save
        name = f'{cvcm.DATA_PATH}processed_data/{gr}/hospitalization_or_isolation.csv'
        cvcm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_hospitalizationOrIsolation(gr)
    return
    
  def updateNewCaseCounts(self, stock):
    date_list = self.getDate()
    new_soldiers_list = self.getNewSoldiers()
    new_imported_list = self.getNewImported()
    new_local_list = self.getNewLocal()
    new_unclear_list = self.getNewUnclear()
    
    new_others_list = new_soldiers_list + new_unclear_list
    new_total_list = new_imported_list + new_local_list + new_others_list
    
    stock['date_0'] = date_list
    stock['total_0'] = new_total_list
    stock['imported_0'] = new_imported_list
    stock['local_0'] = new_local_list
    stock['others_0'] = new_others_list
    return
  
  def updateNewDeathCounts(self, stock):
    date_list = self.getDate()
    new_deaths_list = self.getNewDeaths()
    
    stock['date_0'] = date_list
    stock['death_0'] = new_deaths_list
    return
    
  def saveCsv(self, mode='both'):
    self.saveCsv_statusEvolution(mode='readme')
    self.saveCsv_hospitalizationOrIsolation(mode='readme')
    return

## End of file
################################################################################
