
    ################################
    ##  COVID_process.py          ##
    ##  Chieh-An Lin              ##
    ##  2022.05.26                ##
    ################################

import os
import sys
import warnings as wng
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm
import COVID_case
import COVID_status
import COVID_test
import COVID_border
import COVID_timeline
import COVID_county
import COVID_vaccination
import COVID_vaccination_county
import COVID_death
import COVID_html

################################################################################
## Functions - cross-sheet operations

def makeStock_incidenceRates(status_sheet, border_sheet):
  stock = {}
  status_sheet.updateNewCaseCounts(stock)
  border_sheet.updateNewEntryCounts(stock)
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    value_arr = ccm.sevenDayMovingAverage(value_arr)
    if key == 'new_entries':
      ind = value_arr != value_arr
      value_arr[ind] = 0
    
    ## Push back
    stock[key] = value_arr
  
  population_twn = ccm.COUNTY_DICT['00000']['population']
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter('ignore')
    
    ind = stock['new_entries'] == 0
    value_arr = stock['new_imported'] / stock['new_entries']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind] = np.nan
    stock_new['arr_incidence'] = value_arr
    
    value_arr = stock['new_local'] / float(population_twn) * 1000 ## Rate over thousand
    value_arr = np.around(value_arr, decimals=4)
    stock_new['local_incidence'] = value_arr
  
  return stock_new

def makeReadme_incidenceRates(gr):
  key = 'incidence_rates'
  stock = []
  stock.append('`{}.csv`'.format(key))
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `arr_incidence`: number of imported confirmed cases over number of arrival passengers')
  stock.append('  - `local_incidence`: number of local confirmed cases over population')
  ccm.README_DICT[gr][key] = stock
  return
  
def saveCsv_incidenceRates(status_sheet, border_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_incidenceRates(status_sheet, border_sheet)
    stock = pd.DataFrame(stock)
  
  for gr in ccm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = ccm.truncateStock(stock, gr)
      
      ## Save
      name = '{}processed_data/{}/incidence_rates.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_incidenceRates(gr)
  return
  
def makeCountStock_deathByAge(death_sheet):
  stock = {}
  death_sheet.updateDeathByAge(stock)
  
  year_list = ['total'] + ccm.GROUP_YEAR_LIST
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
  
  year_list = ['total'] + ccm.GROUP_YEAR_LIST
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
        rate = '{:.2e}'.format(rate)
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
  
  if gr == ccm.GROUP_OVERALL:
    for year in ccm.GROUP_YEAR_LIST:
      key_list.append(year)
      label_list_en.append('{} all year'.format(year))
      label_list_fr.append('Année {}'.format(year))
      label_list_zh.append('{}全年'.format(year))
      
  stock = {'key': key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
  return stock
  
def makeReadme_deathByAge(gr):
  key = 'death_by_age_count'
  stock = []
  stock.append('`{}.csv`'.format(key))
  stock.append('- Row: age group')
  stock.append('- Column')
  stock.append('  - `age`')
  stock.append('  - `total`: overall stats')
  stock.append('  - `YYYY`: during year `YYYY`')
  ccm.README_DICT[gr][key] = stock
    
  key = 'death_by_age_rate'
  stock = []
  stock.append('`{}.csv`'.format(key))
  stock.append('- Row: age group')
  stock.append('- Column')
  stock.append('  - `age`')
  stock.append('  - `total`: overall stats')
  stock.append('  - `YYYY`: during year `YYYY`')
  ccm.README_DICT[gr][key] = stock
  
  key = 'death_by_age_label'
  stock = []
  stock.append('`{}.csv`'.format(key))
  stock.append('- Row: time range')
  stock.append('- Column')
  stock.append('  - `key`')
  stock.append('  - `label`: label in English')
  stock.append('  - `label_fr`: label in French (contains non-ASCII characters)')
  stock.append('  - `label_zh`: label in Mandarin (contains non-ASCII characters)')
  ccm.README_DICT[gr][key] = stock
  return
  
def saveCsv_deathByAge(county_sheet, death_sheet, mode='both'):
  gr = ccm.GROUP_OVERALL
  
  if mode in ['data', 'both']:
    data_c = makeCountStock_deathByAge(death_sheet)
    data_c = pd.DataFrame(data_c)
    
    data_r = makeRateStock_deathByAge(county_sheet, death_sheet)
    data_r = pd.DataFrame(data_r)
    
    data_l = makeLabel_deathByAge(gr)
    data_l = pd.DataFrame(data_l)
    
    ## Save
    name = '{}processed_data/{}/death_by_age_count.csv'.format(ccm.DATA_PATH, gr)
    ccm.saveCsv(name, data_c)
    name = '{}processed_data/{}/death_by_age_rate.csv'.format(ccm.DATA_PATH, gr)
    ccm.saveCsv(name, data_r)
    name = '{}processed_data/{}/death_by_age_label.csv'.format(ccm.DATA_PATH, gr)
    ccm.saveCsv(name, data_l)
  
  if mode in ['readme', 'both']:
    makeReadme_deathByAge(gr)
  return

def makeStock_testPositiveRate(status_sheet, test_sheet):
  stock = {}
  status_sheet.updateNewCaseCounts(stock)
  test_sheet.updateNewTestCounts(stock)
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    value_arr = ccm.sevenDayMovingAverage(value_arr)
    ind = value_arr != value_arr
    value_arr[ind] = 0
    
    ## Push back
    stock[key] = value_arr
  
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter('ignore')
    
    ind = stock['new_tests'] == 0
    value_arr = stock['new_cases'] / stock['new_tests']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind] = np.nan
    stock_new['positivity'] = value_arr
  return stock_new

def makeReadme_testPositiveRate(gr):
  key = 'test_positive_rate'
  stock = []
  stock.append('`{}.csv`'.format(key))
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `positivity`: number of confirmed cases over number of tests')
  ccm.README_DICT[gr][key] = stock
  return
  
def saveCsv_testPositiveRate(status_sheet, test_sheet, mode='both'):
  if mode in ['data', 'both']:
    stock = makeStock_testPositiveRate(status_sheet, test_sheet)
    stock = pd.DataFrame(stock)
  
  for gr in ccm.GROUP_LIST:
    if mode in ['data', 'both']:
      data = ccm.truncateStock(stock, gr)
      
      ## Save
      name = '{}processed_data/{}/test_positive_rate.csv'.format(ccm.DATA_PATH, gr)
      ccm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      makeReadme_testPositiveRate(gr)
  return

def saveCsv_others(status_sheet, test_sheet, border_sheet, county_sheet, death_sheet, mode='both'):
  saveCsv_incidenceRates(status_sheet, border_sheet, mode=mode)
  saveCsv_deathByAge(county_sheet, death_sheet, mode=mode)
  saveCsv_testPositiveRate(status_sheet, test_sheet, mode=mode)
  return

################################################################################
## Functions - sandbox

def sandbox():
  mode = 'data'
  #ccm.initializeReadme()
  
  #case_sheet = COVID_case.CaseSheet()
  #link_list = case_sheet.getLink()
  
  #status_sheet = COVID_status.StatusSheet()
  #status_sheet.saveCsv_caseFatalityRate(mode=mode)
  
  #test_sheet = COVID_test.TestSheet()
  #test_sheet.saveCsv_testCounts(mode=mode)
  
  #border_sheet = COVID_border.BorderSheet()
  #border_sheet.saveCsv_borderStats(mode=mode)
  
  #timeline_sheet = COVID_timeline.TimelineSheet()
  #timeline_sheet.saveCsv_evtTimeline(mode=mode)
  
  #county_sheet = COVID_county.CountySheet()
  #county_sheet.saveCsv_incidenceMap(mode=mode)
  
  vacc_sheet = COVID_vaccination.VaccinationSheet()
  vacc_sheet.saveCsv_vaccinationByBrand(mode=mode)
  
  #vc_sheet = COVID_vaccination_county.VaccinationCountySheet()
  #vc_sheet.saveCsv_vaccinationByAge(mode=mode)
  
  #death_sheet = COVID_death.DeathSheet()
  #death_sheet.saveCsv_deathDelay(mode=mode)
  
  #status_sheet = COVID_status.StatusSheet()
  #test_sheet = COVID_test.TestSheet()
  #border_sheet = COVID_border.BorderSheet()
  #county_sheet = COVID_county.CountySheet()
  #death_sheet = COVID_death.DeathSheet()
  #saveCsv_incidenceRates(status_sheet, border_sheet, mode=mode)
  #saveCsv_positivityAndFatality(status_sheet, test_sheet, mode=mode)
  #saveCsv_deathByAge(county_sheet, death_sheet, mode=mode)
  return

################################################################################
## Functions - save

def saveCsv_all():
  mode = 'both'
  ccm.initializeReadme()
  
  print()
  case_sheet = COVID_case.CaseSheet()
  case_sheet.saveCsv(mode=mode)
  
  print()
  status_sheet = COVID_status.StatusSheet()
  status_sheet.saveCsv(mode=mode)
  
  print()
  test_sheet = COVID_test.TestSheet()
  test_sheet.saveCsv(mode=mode)
  
  print()
  border_sheet = COVID_border.BorderSheet()
  border_sheet.saveCsv(mode=mode)
  
  print()
  county_sheet = COVID_county.CountySheet()
  county_sheet.saveCsv(mode=mode)
  
  print()
  death_sheet = COVID_death.DeathSheet()
  death_sheet.saveCsv(mode=mode)
  
  print()
  saveCsv_others(status_sheet, test_sheet, border_sheet, county_sheet, death_sheet, mode=mode)
  
  print()
  timeline_sheet = COVID_timeline.TimelineSheet()
  timeline_sheet.saveCsv(mode=mode)
  
  print()
  vc_sheet = COVID_vaccination_county.VaccinationCountySheet()
  vc_sheet.saveCsv(mode=mode)
  
  print()
  vacc_sheet = COVID_vaccination.VaccinationSheet()
  vacc_sheet.saveCsv(mode=mode)
  
  print()
  ccm.saveMarkdown_readme()
  
  print()
  return

################################################################################
## Main

if __name__ == '__main__':
  if len(sys.argv) > 1 and sys.argv[1] == 'html':
    COVID_html.saveHtml_all()
  else:
    saveCsv_all()

## End of file
################################################################################
