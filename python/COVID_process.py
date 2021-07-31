
    ##############################
    ##  COVID_process.py        ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.07.24      ##
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
import COVID_case
import COVID_status
import COVID_test
import COVID_border
import COVID_timeline
import COVID_county
import COVID_vaccination
import COVID_vaccination_county

################################################################################
## Functions - cross-sheet operations

def makeIncidenceRates(case_sheet, border_sheet):
  stock = {}
  case_sheet.updateNewCaseCounts(stock)
  border_sheet.updateNewEntryCounts(stock)
  
  ## Index to avoid division by zero
  ind_entries = stock['new_entries'] == 0
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    ## Modify
    stock[key] = ccm.sevenDayMovingAverage(value_arr) 
  
  population_twn = ccm.COUNTY_DICT['00000']['population']
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter('ignore')
    
    value_arr = stock['new_imported'] / stock['new_entries']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_entries] = np.nan
    stock_new['arr_incidence'] = value_arr
    
    value_arr = stock['new_local'] / float(population_twn) * 1000 ## Rate over thousand
    value_arr = np.around(value_arr, decimals=4)
    stock_new['local_incidence'] = value_arr
  
  return stock_new

def makeReadme_incidenceRates(page):
  key = 'incidence_rates'
  stock = []
  stock.append('`%s.csv`' % key)
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `arr_incidence`: number of imported confirmed cases over number of arrival passengers')
  stock.append('  - `local_incidence`: number of local confirmed cases over population')
  ccm.README_DICT[page][key] = stock
  return
  
def saveCsv_incidenceRates(case_sheet, border_sheet):
  stock = makeIncidenceRates(case_sheet, border_sheet)
  stock = pd.DataFrame(stock)
  
  for page in ccm.PAGE_LIST:
    data = ccm.truncateStock(stock, page)
    
    ## Save
    name = '%sprocessed_data/%s/incidence_rates.csv' % (ccm.DATA_PATH, page)
    ccm.saveCsv(name, data)
    
    makeReadme_incidenceRates(page)
  return
  
def makePositivityAndFatality(case_sheet, status_sheet, test_sheet):
  stock = {}
  case_sheet.updateNewCaseCounts(stock)
  status_sheet.updateCumCounts(stock)
  test_sheet.updateNewTestCounts(stock)
  
  ## Index to avoid division by zero
  ind_new_tests = stock['new_tests'] == 0
  ind_cum_cases = stock['cum_cases'] == 0
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    ## No smoothing if cumulative
    if key in ['cum_cases', 'cum_deaths']:
      value_arr = value_arr.astype(float)
    else:
      value_arr = ccm.sevenDayMovingAverage(value_arr)
    
    ## Push back
    stock[key] = ccm.sevenDayMovingAverage(value_arr) 
  
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter('ignore')
    
    value_arr = stock['new_cases'] / stock['new_tests']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_new_tests] = np.nan
    stock_new['positivity'] = value_arr
    
    value_arr = stock['cum_deaths'] / stock['cum_cases']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_cum_cases] = np.nan
    stock_new['fatality'] = value_arr
  return stock_new

def makeReadme_positivityAndFatality(page):
  key = 'positivity_and_fatality'
  stock = []
  stock.append('`%s.csv`' % key)
  stock.append('- Row: date')
  stock.append('- Column')
  stock.append('  - `date`')
  stock.append('  - `positivity`: number of confirmed cases over number of tests')
  stock.append('  - `fatality`: number of deaths over number of confirmed cases')
  ccm.README_DICT[page][key] = stock
  return
  
def saveCsv_positivityAndFatality(case_sheet, status_sheet, test_sheet):
  stock = makePositivityAndFatality(case_sheet, status_sheet, test_sheet)
  stock = pd.DataFrame(stock)
  
  for page in ccm.PAGE_LIST:
    data = ccm.truncateStock(stock, page)
    
    ## Save
    name = '%sprocessed_data/%s/positivity_and_fatality.csv' % (ccm.DATA_PATH, page)
    ccm.saveCsv(name, data)
    
    makeReadme_positivityAndFatality(page)
  return

################################################################################
## Functions - sandbox

def sandbox():
  ccm.initializeReadme()
  
  #case_sheet = COVID_case.CaseSheet()
  #case_sheet.saveCsv_keyNb()
  
  #status_sheet = COVID_status.StatusSheet()
  #status_sheet.saveCsv_deathCounts()
  
  #test_sheet = COVID_test.TestSheet()
  #test_sheet.saveCsv_testByCriterion()
  
  #border_sheet = COVID_border.BorderSheet()
  #border_sheet.saveCsv_borderStats()
  
  #timeline_sheet = COVID_timeline.TimelineSheet()
  #timeline_sheet.saveCsv_evtTimeline()
  
  #county_sheet = COVID_county.CountySheet()
  #county_sheet.saveCsv_incidenceMap()
  
  vacc_sheet = COVID_vaccination.VaccinationSheet()
  vacc_sheet.saveCsv_vaccinationByBrand()
  
  #vacc_county_sheet = COVID_vaccination_county.VaccinationCountySheet()
  #vacc_county_sheet.saveCsv_vaccinationByCounty()
  
  #case_sheet = COVID_case.CaseSheet()
  #status_sheet = COVID_status.StatusSheet()
  #test_sheet = COVID_test.TestSheet()
  #border_sheet = COVID_border.BorderSheet()
  #saveCsv_incidenceRates(case_sheet, border_sheet)
  #saveCsv_positivityAndFatality(case_sheet, status_sheet, test_sheet)
  return

################################################################################
## Functions - save

def saveCsv_all():
  ccm.initializeReadme()
  
  print()
  case_sheet = COVID_case.CaseSheet()
  case_sheet.saveCsv()
  
  print()
  status_sheet = COVID_status.StatusSheet()
  status_sheet.saveCsv()
  
  print()
  test_sheet = COVID_test.TestSheet()
  test_sheet.saveCsv()
  
  print()
  border_sheet = COVID_border.BorderSheet()
  border_sheet.saveCsv()
  
  print()
  timeline_sheet = COVID_timeline.TimelineSheet()
  timeline_sheet.saveCsv()
  
  print()
  county_sheet = COVID_county.CountySheet()
  county_sheet.saveCsv()
  
  print()
  vacc_sheet = COVID_vaccination.VaccinationSheet()
  vacc_sheet.saveCsv()
  
  print()
  vacc_county_sheet = COVID_vaccination_county.VaccinationCountySheet()
  vacc_county_sheet.saveCsv_vaccinationByCounty()
  
  print()
  saveCsv_incidenceRates(case_sheet, border_sheet)
  saveCsv_positivityAndFatality(case_sheet, status_sheet, test_sheet)
  
  print()
  ccm.saveMarkdown_readme()
  
  print()
  return

################################################################################
## Main

if __name__ == '__main__':
  saveCsv_all()

## End of file
################################################################################
