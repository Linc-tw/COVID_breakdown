
    ################################
    ##  others.py                 ##
    ##  Chieh-An Lin              ##
    ##  2023.01.25                ##
    ################################

import os
import sys
import warnings as wng
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import covid.common as cvcm

################################################################################
## Functions - cross-sheet concatenation

def concatenateNewCaseCounts(status_sheet, cc_sheet):
  stock_tmp = {}
  status_sheet.updateNewCaseCounts(stock_tmp)
  cc_sheet.updateNewCaseCounts(stock_tmp)
  
  for key in ['date', 'total', 'imported', 'local', 'others']:
    stock_tmp[key] = np.concatenate([stock_tmp.pop(f'{key}_0'), stock_tmp.pop(f'{key}_1')])
    
  stock_tmp = pd.DataFrame(stock_tmp)
  stock_tmp = cvcm.adjustDateRange(stock_tmp)
  
  stock = {}
  for key in ['date', 'total', 'imported', 'local', 'others']:
    stock[key] = stock_tmp[key].values
  return stock
  
def concatenateNewDeathCounts(status_sheet, death_sheet):
  stock_tmp = {}
  status_sheet.updateNewDeathCounts(stock_tmp)
  death_sheet.updateNewDeathCounts(stock_tmp)
  
  for key in ['date', 'death']:
    stock_tmp[key] = np.concatenate([stock_tmp.pop(f'{key}_0'), stock_tmp.pop(f'{key}_1')])
    
  stock_tmp = pd.DataFrame(stock_tmp)
  stock_tmp = cvcm.adjustDateRange(stock_tmp)
  
  stock = {}
  for key in ['date', 'death']:
    stock[key] = stock_tmp[key].values
  return stock
  
################################################################################
## Functions - cross-sheet processing

def makeReadme_keyNb():
  key = 'key_numbers'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row')
  stock.append('  - `n_total`: total confirmed case counts')
  stock.append('  - `n_latest`: number of confirmed cases during last 90 days')
  for year in cvcm.GROUP_YEAR_LIST:
    stock.append(f'  - `n_{year}`: number of confirmed cases during {year}')
  stock.append('  - `timestamp`: time of last update')
  stock.append('- Column')
  stock.append('  - `key`')
  stock.append('  - `value`')
  cvcm.README_DICT['root'][key] = stock
  return

def saveCsv_keyNb(status_sheet, cc_sheet, mode='both'):
  if mode in ['data', 'both']:
    timestamp = dtt.datetime.now().astimezone()
    timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC%z')
    
    n_total = status_sheet.n_total + cc_sheet.n_total
    n_latest = cc_sheet.n_latest
    population_twn = cvcm.COUNTY_DICT['00000']['population']
    year_list = list(status_sheet.n_year_dict.keys()) + list(cc_sheet.n_year_dict.keys())
    n_list = list(status_sheet.n_year_dict.values()) + list(cc_sheet.n_year_dict.values())
    
    key = ['n_overall', 'n_latest'] + [f'n_{year}' for year in year_list] + ['timestamp', 'population_twn']
    value = [n_total, n_latest] + n_list + [timestamp, population_twn]
    
    ## Make data frame
    data = {'key': key, 'value': value}
    data = pd.DataFrame(data)
    
    ## Save
    name = f'{cvcm.DATA_PATH}processed_data/key_numbers.csv'
    cvcm.saveCsv(name, data)
  
  if mode in ['readme', 'both']:
    makeReadme_keyNb()
  return
    
def makeStock_caseCounts(status_sheet, cc_sheet):
  stock = concatenateNewCaseCounts(status_sheet, cc_sheet)
  
  ## Make avg
  for key in ['total', 'imported', 'local', 'others']:
    stock[key+'_avg'] = cvcm.makeMovingAverage(stock[key])
  return stock

def makeReadme_caseCounts(gr):
  key = 'case_counts_by_report_day'
  stock = []
  stock.append(f'`{key}.csv`')
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
  cvcm.README_DICT[gr][key] = stock
  return
  
def saveCsv_caseCounts(status_sheet, cc_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_caseCounts(status_sheet, cc_sheet)
    stock = pd.DataFrame(stock)
    stock = cvcm.adjustDateRange(stock)
  
  for gr in cvcm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = cvcm.truncateStock(stock, gr)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/case_counts_by_report_day.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_caseCounts(gr)
  return
  
def makeStock_incidenceRates(status_sheet, cc_sheet, border_sheet):
  stock = concatenateNewCaseCounts(status_sheet, cc_sheet)
  border_sheet.updateNewEntryCounts(stock)
  
  ## Replacement
  ind = pd.isna(stock['local'])
  stock['local'][ind] = stock['total'][ind]
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    value_arr = cvcm.sevenDayMovingAverage(value_arr)
    if key == 'new_entries':
      ind = value_arr != value_arr
      value_arr[ind] = 0
    
    ## Push back
    stock[key] = value_arr
  
  population_twn = cvcm.COUNTY_DICT['00000']['population']
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter('ignore')
    
    ind = stock['new_entries'] == 0
    value_arr = stock['imported'] / stock['new_entries']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind] = np.nan
    stock_new['arr_incidence'] = value_arr
    
    value_arr = stock['local'] / float(population_twn) * 1000 ## Rate over thousand
    value_arr = np.around(value_arr, decimals=4)
    stock_new['local_incidence'] = value_arr
  
  return stock_new

def makeReadme_incidenceRates(gr):
  key = 'incidence_rates'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `arr_incidence`: number of imported confirmed cases over number of arrival passengers')
  stock.append('  - `local_incidence`: number of local confirmed cases over population')
  cvcm.README_DICT[gr][key] = stock
  return
  
def saveCsv_incidenceRates(status_sheet, cc_sheet, border_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_incidenceRates(status_sheet, cc_sheet, border_sheet)
    stock = pd.DataFrame(stock)
  
  for gr in cvcm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = cvcm.truncateStock(stock, gr)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/incidence_rates.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_incidenceRates(gr)
  return
  
def makeStock_deathCounts(status_sheet, death_sheet):
  stock = concatenateNewDeathCounts(status_sheet, death_sheet)
  
  ## Make avg
  for key in ['death']:
    stock[key+'_avg'] = cvcm.makeMovingAverage(stock[key])
  return stock

def makeReadme_deathCounts(gr):
  key = 'death_counts'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: report date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `death`')
  stock.append('  - `death_avg`: 7-day moving average of `death`')
  cvcm.README_DICT[gr][key] = stock
  return

def saveCsv_deathCounts(status_sheet, death_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_deathCounts(status_sheet, death_sheet)
    stock = pd.DataFrame(stock)
    stock = cvcm.adjustDateRange(stock)
  
  for gr in cvcm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = cvcm.truncateStock(stock, gr)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/death_counts.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_deathCounts(gr)
  return

def makeStock_caseFatalityRates(status_sheet, cc_sheet, death_sheet):
  stock_0 = concatenateNewCaseCounts(status_sheet, cc_sheet)
  stock_1 = concatenateNewDeathCounts(status_sheet, death_sheet)
  
  date_list = stock_0['date']
  new_case_list = stock_0['total']
  cum_case_list = np.cumsum(new_case_list)
  new_deaths_list = stock_1['death']
  cum_deaths_list = np.cumsum(new_deaths_list)
  
  offset_days = 12
  offset_case_list = np.concatenate([[0]*offset_days, new_case_list[:-offset_days]])
  
  offset_case_list = cvcm.sevenDayMovingAverage(offset_case_list)
  new_deaths_list = cvcm.sevenDayMovingAverage(new_deaths_list)
  cum_case_list, _ = cvcm.pandasNAToZero(cum_case_list)
  cum_deaths_list, _ = cvcm.pandasNAToZero(cum_deaths_list)
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter('ignore')
    
    ind = (offset_case_list != offset_case_list) + (offset_case_list == 0)
    inst_cfr_list = new_deaths_list / offset_case_list
    inst_cfr_list = np.around(inst_cfr_list, decimals=6)
    inst_cfr_list[ind] = 0
  
    ind = (cum_case_list != cum_case_list) + (cum_case_list == 0)
    cum_cfr_list = cum_deaths_list / cum_case_list
    cum_cfr_list = np.around(cum_cfr_list, decimals=6)
    cum_cfr_list[ind] = 0
    
  stock = {'date': date_list, 'inst_CFR': inst_cfr_list, 'cumul_CFR': cum_cfr_list}
  return stock

def makeReadme_caseFatalityRates(gr):
  key = 'case_fatality_rate'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `weekly_CFR`: 7-day-averaged case fatality rate')
  stock.append('  - `cumul_CFR`: cumulative case fatality rate')
  cvcm.README_DICT[gr][key] = stock
  return

def saveCsv_caseFatalityRates(status_sheet, cc_sheet, death_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_caseFatalityRates(status_sheet, cc_sheet, death_sheet)
    stock = pd.DataFrame(stock)
    stock = cvcm.adjustDateRange(stock)
  
  for gr in cvcm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = cvcm.truncateStock(stock, gr)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/case_fatality_rates.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_caseFatalityRates(gr)
  return
    
def makeCountStock_deathByAge(death_sheet):
  stock = {}
  death_sheet.updateDeathByAge(stock)
  
  year_list = ['total'] + cvcm.GROUP_YEAR_LIST
  age_list = ['total'] + death_sheet.age_key_list
  stock_new = {'age': age_list}
  
  ## Loop over year
  for year in year_list:
    key = 'death_by_age_' + year
    count_list = []
    
    for age in age_list:
      case_dict = stock[key]
      try:
        count_list.append(case_dict[age])
      except:
        count_list.append(np.nan)
        
    stock_new[year] = count_list
    
  return stock_new

def makeRateStock_deathByAge(county_sheet, death_sheet):
  stock = {}
  county_sheet.updateCaseByAge(stock)
  death_sheet.updateDeathByAge(stock)
  
  year_list = ['total'] + cvcm.GROUP_YEAR_LIST
  age_list = ['total', '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+']
  stock_new = {'age': age_list}
  
  ## Rearrange age group
  for key, dict_ in stock.items():
    if 'case_by_age' in key:
      dict_['total'] = sum(dict_.values())
      
      dict_['0-9'] = dict_.pop('0-4') + dict_.pop('5-9')
      dict_['10-19'] = dict_.pop('10-14') + dict_.pop('15-19')
      dict_['20-29'] = dict_.pop('20-24') + dict_.pop('25-29')
      dict_['30-39'] = dict_.pop('30-34') + dict_.pop('35-39')
      dict_['40-49'] = dict_.pop('40-44') + dict_.pop('45-49')
      dict_['50-59'] = dict_.pop('50-54') + dict_.pop('55-59')
      dict_['60-69'] = dict_.pop('60-64') + dict_.pop('65-69')
    if 'death_by_age' in key:
      dict_['70+'] = dict_.pop('70-79') + dict_.pop('80-89') + dict_.pop('90-99') + dict_.pop('100+')
      
  ## Loop over year
  for year in year_list:
    rate_list = []
    for age in age_list:
      try:
        rate = stock['death_by_age_'+year][age] / stock['case_by_age_'+year][age]
        rate = f'{rate:.2e}'
      except:
        rate = ''
      rate_list.append(rate)
    stock_new[year] = rate_list
  return stock_new

def makeLabel_deathByAge(gr):
  key_list = ['total']
  label_list_en = ['Total']
  label_list_fr = ['Totaux']
  label_list_zh = ['合計']
  
  if gr == cvcm.GROUP_OVERALL:
    for year in cvcm.GROUP_YEAR_LIST:
      key_list.append(year)
      label_list_en.append(f'{year} all year')
      label_list_fr.append(f'Année {year}')
      label_list_zh.append(f'{year}全年')
      
  stock = {'key': key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
  return stock
  
def makeReadme_deathByAge(gr):
  key = 'death_by_age_count'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: age group')
  stock.append('- Column')
  stock.append('  - `age`')
  stock.append('  - `total`: overall stats')
  stock.append('  - `YYYY`: during year `YYYY`')
  cvcm.README_DICT[gr][key] = stock
    
  key = 'death_by_age_rate'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: age group')
  stock.append('- Column')
  stock.append('  - `age`')
  stock.append('  - `total`: overall stats')
  stock.append('  - `YYYY`: during year `YYYY`')
  cvcm.README_DICT[gr][key] = stock
  
  key = 'death_by_age_label'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: time range')
  stock.append('- Column')
  stock.append('  - `key`')
  stock.append('  - `label`: label in English')
  stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
  stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
  cvcm.README_DICT[gr][key] = stock
  return
  
def saveCsv_deathByAge(county_sheet, death_sheet, mode='both'):
  gr = cvcm.GROUP_OVERALL
  
  if mode in ['data', 'both']:
    data_c = makeCountStock_deathByAge(death_sheet)
    data_c = pd.DataFrame(data_c)
    
    data_r = makeRateStock_deathByAge(county_sheet, death_sheet)
    data_r = pd.DataFrame(data_r)
    
    data_l = makeLabel_deathByAge(gr)
    data_l = pd.DataFrame(data_l)
    
    ## Save
    name = f'{cvcm.DATA_PATH}processed_data/{gr}/death_by_age_count.csv'
    cvcm.saveCsv(name, data_c)
    name = f'{cvcm.DATA_PATH}processed_data/{gr}/death_by_age_rate.csv'
    cvcm.saveCsv(name, data_r)
    name = f'{cvcm.DATA_PATH}processed_data/{gr}/death_by_age_label.csv'
    cvcm.saveCsv(name, data_l)
  
  if mode in ['readme', 'both']:
    makeReadme_deathByAge(gr)
  return

def makeStock_testPositiveRate(status_sheet, cc_sheet, test_sheet):
  stock = concatenateNewCaseCounts(status_sheet, cc_sheet)
  test_sheet.updateNewTestCounts(stock)
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    value_arr = cvcm.sevenDayMovingAverage(value_arr)
    ind = value_arr != value_arr
    value_arr[ind] = 0
    
    ## Push back
    stock[key] = value_arr
  
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter('ignore')
    
    ind = stock['new_tests'] == 0
    value_arr = stock['total'] / stock['new_tests']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind] = np.nan
    stock_new['positivity'] = value_arr
  return stock_new

def makeReadme_testPositiveRate(gr):
  key = 'test_positive_rate'
  stock = []
  stock.append(f'`{key}.csv`')
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `positivity`: number of confirmed cases over number of tests')
  cvcm.README_DICT[gr][key] = stock
  return
  
def saveCsv_testPositiveRate(status_sheet, cc_sheet, test_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_testPositiveRate(status_sheet, cc_sheet, test_sheet)
    stock = pd.DataFrame(stock)
  
  for gr in cvcm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = cvcm.truncateStock(stock, gr)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/test_positive_rate.csv'
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_testPositiveRate(gr)
  return

################################################################################
## Functions - main

def saveCsv_others(status_sheet, cc_sheet, border_sheet, death_sheet, county_sheet, test_sheet, mode='both'):
  saveCsv_keyNb(status_sheet, cc_sheet)
  saveCsv_caseCounts(status_sheet, cc_sheet)
  saveCsv_incidenceRates(status_sheet, cc_sheet, border_sheet, mode=mode)
  saveCsv_deathCounts(status_sheet, death_sheet, mode=mode)
  saveCsv_caseFatalityRates(status_sheet, cc_sheet, death_sheet, mode=mode)
  saveCsv_deathByAge(county_sheet, death_sheet, mode=mode)
  saveCsv_testPositiveRate(status_sheet, cc_sheet, test_sheet, mode=mode)
  return

## End of file
################################################################################
