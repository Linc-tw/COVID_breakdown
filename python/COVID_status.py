
    ################################
    ##  COVID_status.py           ##
    ##  Chieh-An Lin              ##
    ##  2022.05.25                ##
    ################################

import os
import sys
import datetime as dtt
import warnings as wng

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
    self.ind_2023 = None
    ## new_year_token
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    
    self.setData(data)
    self.setCaseCounts()
    
    self.trans_key_list = ['imported', 'local', 'others']
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
      print('N_latest = {:d}'.format(self.n_latest))
      for year in ccm.GROUP_YEAR_LIST:
        print('N_{} = {:d}'.format(year, self.n_year_dict[year]))
    return 
  
  def setData(self, data):
    date_list = data[self.coltag_date].values
    
    self.ind_2021 = (date_list == '2021分隔線').argmax() - 1
    self.ind_2022 = (date_list == '2022分隔線').argmax() - 2
    self.ind_2023 = (date_list == '2023分隔線').argmax() - 3
    ## new_year_token
    
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
    stock = ccm.adjustDateRange(stock)
    
    cum_cases_dict = {}
    for gr in ccm.GROUP_LIST:
      data = ccm.truncateStock(stock, gr)
      cum_cases = data['total'].values
      ind = ~pd.isna(cum_cases)
      cum_cases_dict[gr] = cum_cases[ind].sum()
      
    self.n_total = int(cum_cases_dict[ccm.GROUP_OVERALL])
    self.n_latest = int(cum_cases_dict[ccm.GROUP_LATEST])
    for year in ccm.GROUP_YEAR_LIST:
      self.n_year_dict[year] = int(cum_cases_dict[year])
    return
    
  def getDate(self):
    date_list = []
    y = 2020
    
    ## new_year_token (2023)
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2022:
        y = 2022
      elif i >= self.ind_2021:
        y = 2021
        
      mmdd_zh = date.split('月')
      m = int(mmdd_zh[0])
      dd_zh = mmdd_zh[1].split('日')
      d = int(dd_zh[0])
      date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
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
    
  def makeReadme_keyNb(self):
    key = 'key_numbers'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row')
    stock.append('  - `n_total`: total confirmed case counts')
    stock.append('  - `n_latest`: number of confirmed cases during last 90 days')
    for year in ccm.GROUP_YEAR_LIST:
      stock.append('  - `n_{}`: number of confirmed cases during {}'.format(year, year))
    stock.append('  - `timestamp`: time of last update')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `value`')
    ccm.README_DICT['root'][key] = stock
    return
  
  def saveCsv_keyNb(self, mode='both'):
    if mode in ['data', 'both']:
      timestamp = dtt.datetime.now().astimezone()
      timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC%z')
      
      population_twn = ccm.COUNTY_DICT['00000']['population']
      
      key = ['n_overall', 'n_latest'] + ['n_{}'.format(year) for year in self.n_year_dict.keys()] + ['timestamp', 'population_twn']
      value = [self.n_total, self.n_latest] + list(self.n_year_dict.values()) + [timestamp, population_twn]
      
      ## Make data frame
      data = {'key': key, 'value': value}
      data = pd.DataFrame(data)
      
      ## Save
      name = '{}processed_data/key_numbers.csv'.format(ccm.DATA_PATH)
      ccm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      self.makeReadme_keyNb()
    return
    
  def makeStock_caseCounts(self):
    date_list = self.getDate()
    new_soldiers_list = self.getNewSoldiers()
    new_imported_list = self.getNewImported()
    new_local_list = self.getNewLocal()
    new_unclear_list = self.getNewUnclear()
    
    new_others_list = new_soldiers_list + new_unclear_list
    new_total_list = new_imported_list + new_local_list + new_others_list
    
    stock = {'date': date_list, 'total': new_total_list, 'imported': new_imported_list, 'local': new_local_list, 'others': new_others_list}
    
    ## Make avg
    for key in ['total']+self.trans_key_list:
      stock[key+'_avg'] = ccm.makeMovingAverage(stock[key])
    return stock
    
  def makeReadme_caseCounts(self, gr):
    key = 'case_counts_by_report_day'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `total`: `imported` + `local` + `others`')
    stock.append('  - `imported`: imported cases')
    stock.append('  - `local`: local cases')
    stock.append('  - `others`: on plane, on boat, & unknown')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    stock.append('  - `imported_avg`: 7-day moving average of `imported`')
    stock.append('  - `local_avg`: 7-day moving average of `local`')
    stock.append('  - `others_avg`: 7-day moving average of `others`')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_caseCounts(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_caseCounts()
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/case_counts_by_report_day.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_caseCounts(gr)
    return
  
  def makeReadme_statusEvolution(self, gr):
    key = 'status_evolution'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `discharged`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    stock.append('  - `death`')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_statusEvolution(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      cum_deaths_list = self.getCumDeaths()
      cum_dis_list = self.getCumDischarged()
      cum_hosp_list = self.getCumHospitalized()
      
      stock = {'date': date_list, 'discharged': cum_dis_list, 'hospitalized': cum_hosp_list, 'death': cum_deaths_list}
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/status_evolution.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_statusEvolution(gr)
    return
    
  def makeStock_deathCounts(self):
    date_list = self.getDate()
    new_deaths_list = self.getNewDeaths()
    avg_arr = ccm.makeMovingAverage(new_deaths_list)
    
    stock = {'date': date_list, 'death': new_deaths_list, 'death_avg': avg_arr}
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
  
  def saveCsv_deathCounts(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_deathCounts()
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
    
  def makeStock_caseFatalityRates(self):
    date_list = self.getDate()
    new_soldiers_list = self.getNewSoldiers()
    new_imported_list = self.getNewImported()
    new_local_list = self.getNewLocal()
    new_unclear_list = self.getNewUnclear()
    new_deaths_list = self.getNewDeaths()
    cum_deaths_list = self.getCumDeaths()
    
    new_case_list = new_imported_list + new_local_list + new_soldiers_list + new_unclear_list
    cum_case_list = np.cumsum(new_case_list)
    
    offset_days = 15
    offset_case_list = np.concatenate([[0]*offset_days, new_case_list[:-offset_days]])
    
    offset_case_list = ccm.sevenDayMovingAverage(offset_case_list)
    new_deaths_list = ccm.sevenDayMovingAverage(new_deaths_list)
    cum_case_list, _ = ccm.pandasNAToZero(cum_case_list)
    cum_deaths_list, _ = ccm.pandasNAToZero(cum_deaths_list)
    
    with wng.catch_warnings(): ## Avoid division by zero
      wng.simplefilter('ignore')
      
      front = (offset_case_list != offset_case_list) + (offset_case_list == 0)
      back = front.copy()
      front[-7:] = False ## Front blank forced to 0
      back[:7] = False ## Back blank forced to NaN
      
      inst_cfr_list = new_deaths_list / offset_case_list
      inst_cfr_list = np.around(inst_cfr_list, decimals=6)
      inst_cfr_list[front] = 0
      inst_cfr_list[back] = np.nan
    
      front = (cum_case_list != cum_case_list) + (cum_case_list == 0)
      back = front.copy()
      front[-7:] = False ## Front blank forced to 0
      back[:7] = False ## Back blank forced to NaN
      
      cum_cfr_list = cum_deaths_list / cum_case_list
      cum_cfr_list = np.around(cum_cfr_list, decimals=6)
      cum_cfr_list[front] = 0
      cum_cfr_list[back] = np.nan
      
    stock = {'date': date_list, 'inst_CFR': inst_cfr_list, 'cumul_CFR': cum_cfr_list}
    return stock

  def makeReadme_caseFatalityRates(self, gr):
    key = 'case_fatality_rate'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `weekly_CFR`: 7-day-averaged case fatality rate')
    stock.append('  - `cumul_CFR`: cumulative case fatality rate')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_caseFatalityRates(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_caseFatalityRates()
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/case_fatality_rates.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_caseFatalityRates(gr)
    return
    
  def makeReadme_hospitalizationOrIsolation(self, gr):
    key = 'hospitalization_or_isolation'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_hospitalizationOrIsolation(self, mode='both'):
    if mode in ['data', 'both']:
      date_list = self.getDate()
      cum_hosp_list = self.getCumHospitalized()
      
      stock = {'date': date_list, 'hospitalized': cum_hosp_list}
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/hospitalization_or_isolation.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
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
    
    stock_tmp = {'date': date_list, 'new_cases': new_total_list, 'new_imported': new_imported_list, 'new_local': new_local_list}
    stock_tmp = pd.DataFrame(stock_tmp)
    stock_tmp = ccm.adjustDateRange(stock_tmp)
    
    stock['date'] = stock_tmp['date'].values
    stock['new_cases'] = stock_tmp['new_cases'].values
    stock['new_imported'] = stock_tmp['new_imported'].values
    stock['new_local'] = stock_tmp['new_local'].values
    return
    
  ## Obsolete
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

  def saveCsv(self, mode='both'):
    self.saveCsv_keyNb(mode=mode)
    self.saveCsv_caseCounts(mode=mode)
    self.saveCsv_statusEvolution(mode=mode)
    self.saveCsv_deathCounts(mode=mode)
    self.saveCsv_caseFatalityRates(mode=mode)
    self.saveCsv_hospitalizationOrIsolation(mode=mode)
    return

## End of file
################################################################################
