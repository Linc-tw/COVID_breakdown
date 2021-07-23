
    ###################################
    ##  COVID_vaccination_county.py  ##
    ##  Chieh-An Lin                 ##
    ##  Version 2021.07.22           ##
    ###################################

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
## Classes - Vaccination

class VaccinationCountySheet(ccm.Template):
  
  def __init__(self, verbose=True):
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.json' % ccm.DATA_PATH
    data = ccm.loadJson(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_can2_c2&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyNjU1MDY4MQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=decimal&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=int&d[]=NO&c[]=a09&t[]=decimal&d[]=NO&c[]=a10&t[]=int&d[]=NO&c[]=a11&t[]=int&d[]=NO&c[]=a12&t[]=decimal&d[]=NO&c[]=a13&t[]=int&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=decimal&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=decimal&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO
  
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_report_date = 'a01'
    self.key_county = 'a02'
    self.key_population = 'a03'
    
    self.key_new_vacc = 'a04'
    self.key_cum_vacc = 'a05'
    self.key_vacc_rate = 'a06'
    self.key_cum_supplies = 'a07'
    self.key_remaining_doses = 'a08'
    self.key_remaining_ratio = 'a09'
    
    self.key_new_AZ = 'a10'
    self.key_cum_AZ = 'a11'
    self.key_AZ_rate = 'a12'
    self.key_AZ_supplies = 'a13'
    self.key_remaining_AZ = 'a14'
    self.key_AZ_remaining_ratio = 'a15'
    
    self.key_new_Moderna = 'a16'
    self.key_cum_Moderna = 'a17'
    self.key_Moderna_rate = 'a18'
    self.key_Moderna_supplies = 'a19'
    self.key_remaining_Moderna = 'a20'
    self.key_Moderna_remaining_ratio = 'a21'
    
    self.data = data
    self.processed_data = {}
    self.process()
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    
    if verbose:
      print('N_total = %d' % len(self.processed_data))
    return
  
  def process(self):
    for row in self.data['data']:
      report_date = row[self.key_report_date]
      county = row[self.key_county]
      
      try:
        county = ccm.COUNTY_DICT_2[county]
      except KeyError:
        print('County label, %s' % county)
        county = 'unknown'
      
      try:
        self.processed_data[report_date][county] = row
      except KeyError:
        self.processed_data[report_date] = {county: row}
    
    self.processed_data = dict(sorted(self.processed_data.items()))
    return
    
  def getReportDate(self):
    return list(self.processed_data.keys())
  
  def getCumVacc(self, county):
    cum_vacc_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_vacc]) for row in county_dict.values()]
        cum_vacc_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_vacc_list.append(int(row[self.key_cum_vacc]))
        
    return cum_vacc_list
    
  def getCumAZ(self, county):
    cum_az_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_AZ]) for row in county_dict.values()]
        cum_az_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_az_list.append(int(row[self.key_cum_AZ]))
        
    return cum_az_list
    
  def getCumModerna(self, county):
    cum_moderna_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_Moderna]) for row in county_dict.values()]
        cum_moderna_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_moderna_list.append(int(row[self.key_cum_Moderna]))
        
    return cum_moderna_list
      
  #TODO
  def makeReadme_vaccinationByCounty(self, page):
    key = 'vaccination_by_county'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `entry`')
    stock.append('  - `exit`')
    stock.append('  - `total`: entry + exit')
    stock.append('  - `entry_avg`: 7-day moving average of `entry`')
    stock.append('  - `exit_avg`: 7-day moving average of `exit`')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByCounty(self):
    county_key_list = ['total'] + self.county_key_list
    pop_dict = {value_dict['tag']: value_dict['population'] for value_dict in ccm.COUNTY_DICT.values()}
    
    ## Data for population & label
    date = self.getReportDate()[-1]
    county_dict = {dict_['tag']: dict_ for dict_ in ccm.COUNTY_DICT.values()}
    
    key_list = ['latest_date'] + county_key_list
    value_list = [date]
    label_list_en = [''] + [county_dict[county]['label'][0] for county in county_key_list]
    label_list_fr = [''] + [county_dict[county]['label'][1] for county in county_key_list]
    label_list_zh = [''] + [county_dict[county]['label'][2] for county in county_key_list]
      
    ## Make stock
    for county in county_key_list:
      cum_vacc = self.getCumVacc(county)[-1]
      value = float(cum_vacc) / float(pop_dict[county])
      value_list.append('%.4f' % value)
      
    stock = {'key': key_list, 'value': value_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data = pd.DataFrame(stock)
      
    name = '%sprocessed_data/%s/vaccination_by_county.csv' % (ccm.DATA_PATH, ccm.PAGE_LATEST)
    ccm.saveCsv(name, data)
    return

  def saveCsv(self):
    self.saveCsv_vaccinationByCounty()
    return
  
## End of file
################################################################################
