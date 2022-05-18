
    ###################################
    ##  COVID_vaccination_county.py  ##
    ##  Chieh-An Lin                 ##
    ##  2022.05.16                   ##
    ###################################

import os
import sys
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - vaccination county sheet

class VaccinationCountySheet(ccm.Template):
  
  def __init__(self, verbose=True):
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2006
    
    self.coltag_row_id = 'ID'
    self.coltag_report_date = '發佈統計日期'
    self.coltag_county = '縣市'
    self.coltag_age = '群組'
    
    self.coltag_1st_dose = '第1劑'
    self.coltag_2nd_dose = '第2劑'
    self.coltag_3rd_dose_2 = '加強劑'
    self.coltag_3rd_dose_1 = '追加劑'
    
    self.data = data
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    self.age_key_list = ['6-11', '12-17', '18-29', '30-49', '50-64', '65-74', '75+']
    self.n_total = len(set(self.getDate()))
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return
  
  def getDate(self):
    return self.getCol(self.coltag_report_date)
  
  def getCounty(self):
    county_list = []
    
    for county in self.getCol(self.coltag_county):
      try:
        county_list.append(ccm.COUNTY_DICT_2[county])
      except KeyError:
        print('County, {}'.format(county))
        county_list.append('unknown')
    
    return county_list
  
  def getAge(self):
    age_list = []
    
    for age in self.getCol(self.coltag_age):
      try:
        age_list.append(ccm.AGE_DICT_3[age])
      except KeyError:
        print('Age, {}'.format(age))
        age_list.append('unknown')
        
    return age_list
  
  def get1stDose(self):
    return [float(value) for value in self.getCol(self.coltag_1st_dose)]
    
  def get2ndDose(self):
    return [float(value) for value in self.getCol(self.coltag_2nd_dose)]
    
  def get3rdDose1(self):
    return [float(value) for value in self.getCol(self.coltag_3rd_dose_1)]
  
  def get3rdDose2(self):
    return [float(value) for value in self.getCol(self.coltag_3rd_dose_2)]
  
  def makeStock_vaccinationByCounty(self):
    date_list = self.getDate()
    county_list = self.getCounty()
    age_list = self.getAge()
    dose_1st_list = self.get1stDose()
    dose_2nd_list = self.get2ndDose()
    dose_3rd_1_list = self.get3rdDose1()
    dose_3rd_2_list = self.get3rdDose2()
    
    ord_list = [ccm.ISODateToOrd(date) for date in set(date_list)]
    ord_max = max(ord_list)
    date_max = ccm.ordDateToISO(ord_max)
    
    stock = {}
    
    for date, county, age, dose_1st, dose_2nd, dose_3rd_1, dose_3rd_2 in zip(date_list, county_list, age_list, dose_1st_list, dose_2nd_list, dose_3rd_1_list, dose_3rd_2_list):
      if date != date_max or age != 'total':
        continue
      
      stock[county] = [dose_1st, dose_2nd, dose_3rd_1+dose_3rd_2]
    return stock, date_max
  
  def makeReadme_vaccinationByCounty(self, page):
    key = 'vaccination_by_county'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: date, city, or county')
    stock.append('- Column')
    stock.append('  - `key`: name of key')
    stock.append('  - `value_1`: proportion of population having their 1st dose')
    stock.append('  - `value_2`: proportion of population having their 2nd dose')
    stock.append('  - `value_3`: proportion of population having their 3rd dose')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French')
    stock.append('  - `label_zh`: label in Mandarin')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByCounty(self):
    stock, date_max = self.makeStock_vaccinationByCounty()
    
    county_key_list = ['total'] + self.county_key_list
    county_dict = {dict_['tag']: dict_ for dict_ in ccm.COUNTY_DICT.values()}
    
    key_list = ['latest_date'] + county_key_list
    value_1_list = [date_max] + [np.around(stock[county][0], decimals=2) for county in county_key_list]
    value_2_list = [np.nan] + [np.around(stock[county][1], decimals=2) for county in county_key_list]
    value_3_list = [np.nan] + [np.around(stock[county][2], decimals=2) for county in county_key_list]
    label_list_en = [''] + [county_dict[county]['label'][0] for county in county_key_list]
    label_list_fr = [''] + [county_dict[county]['label'][1] for county in county_key_list]
    label_list_zh = [''] + [county_dict[county]['label'][2] for county in county_key_list]
    
    value_list = value_1_list[2:]
    ind = np.argsort(value_list)[::-1] + 2
    ind = np.insert(np.insert(ind, 0, 0), 1, 1)
    
    key_list = np.array(key_list)[ind]
    value_1_list = np.array(value_1_list)[ind]
    value_2_list = np.array(value_2_list)[ind]
    value_3_list = np.array(value_3_list)[ind]
    label_list_en = np.array(label_list_en)[ind]
    label_list_fr = np.array(label_list_fr)[ind]
    label_list_zh = np.array(label_list_zh)[ind]
    
    stock = {'key': key_list, 'value_1': value_1_list, 'value_2': value_2_list, 'value_3': value_3_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data = pd.DataFrame(stock)
    
    page = ccm.PAGE_LATEST
    
    name = '{}processed_data/{}/vaccination_by_county.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data)
    
    self.makeReadme_vaccinationByCounty(page)
    return
  
  def makeStock_vaccinationByAge(self):
    date_list = self.getDate()
    county_list = self.getCounty()
    age_list = self.getAge()
    dose_1st_list = self.get1stDose()
    dose_2nd_list = self.get2ndDose()
    dose_3rd_1_list = self.get3rdDose1()
    dose_3rd_2_list = self.get3rdDose2()
    
    ord_list = [ccm.ISODateToOrd(date) for date in set(date_list)]
    ord_max = max(ord_list)
    date_max = ccm.ordDateToISO(ord_max)
    
    stock = {}
    
    for date, county, age, dose_1st, dose_2nd, dose_3rd_1, dose_3rd_2 in zip(date_list, county_list, age_list, dose_1st_list, dose_2nd_list, dose_3rd_1_list, dose_3rd_2_list):
      if date != date_max or county != 'total' or age == '65+':
        continue
      
      stock[age] = [dose_1st, dose_2nd, dose_3rd_1+dose_3rd_2]
    return stock, date_max
  
  def makeReadme_vaccinationByAge(self, page):
    key = 'vaccination_by_age'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: date or age')
    stock.append('- Column')
    stock.append('  - `key`: name of key')
    stock.append('  - `value_1`: proportion of population having their 1st dose')
    stock.append('  - `value_2`: proportion of population having their 2nd dose')
    stock.append('  - `value_3`: proportion of population having their 3rd dose')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French')
    stock.append('  - `label_zh`: label in Mandarin')
    ccm.README_DICT[page][key] = stock
    return
  
  def saveCsv_vaccinationByAge(self):
    stock, date_max = self.makeStock_vaccinationByAge()
    
    age_key_list = ['total'] + self.age_key_list
    county_dict = {dict_['tag']: dict_ for dict_ in ccm.COUNTY_DICT.values()}
    
    key_list = ['latest_date'] + age_key_list
    value_1_list = [date_max] + [np.around(stock[age][0], decimals=2) for age in age_key_list]
    value_2_list = [np.nan] + [np.around(stock[age][1], decimals=2) for age in age_key_list]
    value_3_list = [np.nan] + [np.around(stock[age][2], decimals=2) for age in age_key_list]
    label_list_en = [''] + [ccm.AGE_DICT_2['label'][age]['en'] for age in age_key_list]
    label_list_fr = [''] + [ccm.AGE_DICT_2['label'][age]['fr'] for age in age_key_list]
    label_list_zh = [''] + [ccm.AGE_DICT_2['label'][age]['zh-tw'] for age in age_key_list]
    
    stock = {'key': key_list, 'value_1': value_1_list, 'value_2': value_2_list, 'value_3': value_3_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data = pd.DataFrame(stock)
    
    page = ccm.PAGE_LATEST
    
    name = '{}processed_data/{}/vaccination_by_age.csv'.format(ccm.DATA_PATH, page)
    ccm.saveCsv(name, data)
    
    self.makeReadme_vaccinationByAge(page)
    return
  
  def saveCsv(self):
    self.saveCsv_vaccinationByCounty()
    self.saveCsv_vaccinationByAge()
    return
  
## End of file
################################################################################
