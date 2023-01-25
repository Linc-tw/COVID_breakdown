
    ################################
    ##  vaccination_county.py     ##
    ##  Chieh-An Lin              ##
    ##  2023.01.25                ##
    ################################

import os
import sys
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import covid.common as cvcm

################################################################################
## Class - vaccination county sheet

class VaccinationCountySheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_row_id = 'ID'
    self.coltag_report_date = '發佈統計日期'
    self.coltag_county = '縣市'
    self.coltag_age = '群組'
    self.coltag_1st_dose = '第1劑'
    self.coltag_2nd_dose = '第2劑'
    self.coltag_3rd_dose_2 = '加強劑'
    self.coltag_3rd_dose_1 = '追加劑'
    
    name = f'{cvcm.DATA_PATH}raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.csv'
    data = cvcm.loadCsv(name, verbose=verbose)
    ## https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2006&chartset=utf-8
    
    self.data = data
    self.n_total = len(set(self.getDate()))
    
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    self.age_key_list = ['0-4', '5-11', '12-17', '18-29', '30-49', '50-64', '65-74', '75+']
    
    if verbose:
      print(f'N_total = {self.n_total}')
    return
  
  def getDate(self):
    return self.getCol(self.coltag_report_date)
  
  def getCounty(self):
    county_list = []
    
    for county in self.getCol(self.coltag_county):
      try:
        county_list.append(cvcm.COUNTY_DICT_2[county])
      except KeyError:
        print(f'County, {county}')
        county_list.append('unknown')
    
    return county_list
  
  def getAge(self):
    age_list = []
    
    for age in self.getCol(self.coltag_age):
      try:
        age_list.append(cvcm.AGE_DICT_3[age])
      except KeyError:
        print(f'Age, {age}')
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
    
    ord_list = [cvcm.ISODateToOrd(date) for date in set(date_list)]
    ord_max = max(ord_list)
    latest_date = cvcm.ordDateToISO(ord_max)
    
    stock = {'latest_date': latest_date}
    
    for date, county, age, dose_1st, dose_2nd, dose_3rd_1, dose_3rd_2 in zip(date_list, county_list, age_list, dose_1st_list, dose_2nd_list, dose_3rd_1_list, dose_3rd_2_list):
      if date != latest_date or age != 'total':
        continue
      
      stock[county] = [dose_1st, dose_2nd, dose_3rd_1+dose_3rd_2]
    return stock
  
  def addLabel_vaccinationByCounty(self, stock):
    county_dict = {dict_['tag']: dict_ for dict_ in cvcm.COUNTY_DICT.values()}
    county_key_list = ['total'] + self.county_key_list
    col_tag_list = ['key', 'value_1', 'value_2', 'value_3', 'label', 'label_fr', 'label_zh']
    stock_new = {col_tag: [] for col_tag in col_tag_list}
    
    for key in county_key_list:
      value_list = stock[key]
      label_dict = county_dict[key]['label']
      
      stock_new['key'].append(key)
      stock_new['value_1'].append(np.around(value_list[0], decimals=2))
      stock_new['value_2'].append(np.around(value_list[1], decimals=2))
      stock_new['value_3'].append(np.around(value_list[2], decimals=2))
      stock_new['label'].append(label_dict[0])
      stock_new['label_fr'].append(label_dict[1])
      stock_new['label_zh'].append(label_dict[2])
    return stock_new
  
  def makeReadme_vaccinationByCounty(self, gr):
    key = 'vaccination_by_county'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: city or county')
    stock.append('- Column')
    stock.append('  - `key`: name of key')
    stock.append('  - `value_1`: proportion of population having their 1st dose')
    stock.append('  - `value_2`: proportion of population having their 2nd dose')
    stock.append('  - `value_3`: proportion of population having their 3rd dose')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French')
    stock.append('  - `label_zh`: label in Mandarin')
    cvcm.README_DICT[gr][key] = stock
    
    key = 'vaccination_by_county_label'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row')
    stock.append('  - `latest_date`: date of last available data')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `value`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationByCounty(self, mode='both'):
    gr = cvcm.GROUP_LATEST
    
    if mode in ['data', 'both']:
      stock = self.makeStock_vaccinationByCounty()
      data_l = {'key': ['latest_date'], 'value': [stock['latest_date']]}
      data_l = pd.DataFrame(data_l)
      
      data_r = self.addLabel_vaccinationByCounty(stock)
      data_r = pd.DataFrame(data_r)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_county.csv'
      cvcm.saveCsv(name, data_r)
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_county_label.csv'
      cvcm.saveCsv(name, data_l)
    
    if mode in ['readme', 'both']:
      self.makeReadme_vaccinationByCounty(gr)
    return
  
  def makeStock_vaccinationByAge(self):
    date_list = self.getDate()
    county_list = self.getCounty()
    age_list = self.getAge()
    dose_1st_list = self.get1stDose()
    dose_2nd_list = self.get2ndDose()
    dose_3rd_1_list = self.get3rdDose1()
    dose_3rd_2_list = self.get3rdDose2()
    
    ord_list = [cvcm.ISODateToOrd(date) for date in set(date_list)]
    ord_max = max(ord_list)
    latest_date = cvcm.ordDateToISO(ord_max)
    
    stock = {'latest_date': latest_date}
    
    for date, county, age, dose_1st, dose_2nd, dose_3rd_1, dose_3rd_2 in zip(date_list, county_list, age_list, dose_1st_list, dose_2nd_list, dose_3rd_1_list, dose_3rd_2_list):
      if date != latest_date or county != 'total' or age == '65+':
        continue
      
      stock[age] = [dose_1st, dose_2nd, dose_3rd_1+dose_3rd_2]
    return stock
  
  def addLabel_vaccinationByAge(self, stock):
    age_key_list = ['total'] + self.age_key_list
    col_tag_list = ['key', 'value_1', 'value_2', 'value_3', 'label', 'label_fr', 'label_zh']
    stock_new = {col_tag: [] for col_tag in col_tag_list}
    
    for key in age_key_list:
      value_list = stock[key]
      label_dict = cvcm.AGE_DICT_2['label'][key]
      
      stock_new['key'].append(key)
      stock_new['value_1'].append(np.around(value_list[0], decimals=2))
      stock_new['value_2'].append(np.around(value_list[1], decimals=2))
      stock_new['value_3'].append(np.around(value_list[2], decimals=2))
      stock_new['label'].append(label_dict['en'])
      stock_new['label_fr'].append(label_dict['fr'])
      stock_new['label_zh'].append(label_dict['zh-tw'])
    return stock_new
  
  def makeReadme_vaccinationByAge(self, gr):
    key = 'vaccination_by_age'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row: age group')
    stock.append('- Column')
    stock.append('  - `key`: name of key')
    stock.append('  - `value_1`: proportion of population having their 1st dose')
    stock.append('  - `value_2`: proportion of population having their 2nd dose')
    stock.append('  - `value_3`: proportion of population having their 3rd dose')
    stock.append('  - `label`: label in English')
    stock.append('  - `label_fr`: label in French')
    stock.append('  - `label_zh`: label in Mandarin')
    cvcm.README_DICT[gr][key] = stock
    
    key = 'vaccination_by_age_label'
    stock = []
    stock.append(f'`{key}.csv`')
    stock.append('- Row')
    stock.append('  - `latest_date`: date of last available data')
    stock.append('- Column')
    stock.append('  - `key`')
    stock.append('  - `value`')
    cvcm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_vaccinationByAge(self, mode='both'):
    gr = cvcm.GROUP_LATEST
    
    if mode in ['data', 'both']:
      stock = self.makeStock_vaccinationByAge()
      data_l = {'key': ['latest_date'], 'value': [stock['latest_date']]}
      data_l = pd.DataFrame(data_l)
      
      data_r = self.addLabel_vaccinationByAge(stock)
      data_r = pd.DataFrame(data_r)
      
      ## Save
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_age.csv'
      cvcm.saveCsv(name, data_r)
      name = f'{cvcm.DATA_PATH}processed_data/{gr}/vaccination_by_age_label.csv'
      cvcm.saveCsv(name, data_l)
    
    if mode in ['readme', 'both']:
      self.makeReadme_vaccinationByAge(gr)
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_vaccinationByCounty(mode=mode)
    self.saveCsv_vaccinationByAge(mode=mode)
    return
  
## End of file
################################################################################
