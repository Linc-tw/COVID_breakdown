
    ################################
    ##  COVID_border.py           ##
    ##  Chieh-An Lin              ##
    ##  2022.05.22                ##
    ################################

import os
import sys
import datetime as dtt

import numpy as np
import scipy as sp
import scipy.signal as signal
import pandas as pd

import COVID_common as ccm

################################################################################
## Class - border sheet

class BorderSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '日期 '
    self.tag_dict = {
      'entry': '資料來源：各機場、港口入出境人數統計資料 入境總人數',
      'exit': '資料來源：各機場、港口入出境人數統計資料 出境總人數',
      'both': '入出境總人數_小計 ',
      'Taoyuan A1 entry': '桃園一期 入境查驗', 
      'Taoyuan A1 exit': '桃園一期 出境查驗', 
      'Taoyuan A1 both': '桃園一期 小計', 
      'Taoyuan A2 entry': '桃園二期 入境查驗', 
      'Taoyuan A2 exit': '桃園二期 出境查驗', 
      'Taoyuan A2 both': '桃園二期 小計', 
      'Taoyuan A both': '桃園一_二期 合計', 
      'Kaohsiung A entry': '高雄機場 入境查驗', 
      'Kaohsiung A exit': '高雄機場 出境查驗', 
      'Kaohsiung A both': '高雄機場 小計', 
      'Keelung S entry': '基隆港 入境查驗', 
      'Keelung S exit': '基隆港 出境查驗', 
      'Keelung S both': '基隆港 小計', 
      'Taichung S entry': '台中港 入境查驗', 
      'Taichung S exit': '台中港 出境查驗', 
      'Taichung S both': '台中港 小計', 
      'Kaohsiung S entry': '高雄港 入境查驗', 
      'Kaohsiung S exit': '高雄港 出境查驗', 
      'Kaohsiung S both': '高雄港 小計', 
      'Hualien S entry': '花蓮港 入境查驗', 
      'Hualien S exit': '花蓮港 出境查驗', 
      'Hualien S both': '花蓮港 小計', 
      'Yilan S entry': '蘇澳港 入境查驗', 
      'Yilan S exit': '蘇澳港 出境查驗', 
      'Yilan S both': '蘇澳港 小計', 
      'Penghu X entry': '澎湖港 入境查驗', 
      'Penghu X exit': '澎湖港 出境查驗', 
      'Penghu X both': '澎湖港 小計', 
      'Tainan A entry': '台南機場 入境查驗', 
      'Tainan A exit': '台南機場 出境查驗', 
      'Tainan A both': '台南機場 小計', 
      'Tainan S entry': '安平港 入境查驗', 
      'Tainan S exit': '安平港 出境查驗', 
      'Tainan S both': '安平港 小計', 
      'Taipei A entry': '松山機場 入境查驗', 
      'Taipei A exit': '松山機場 出境查驗', 
      'Taipei A both': '松山機場 小計', 
      'Kinmen SW entry': '金門港_水頭 入境查驗', 
      'Kinmen SW exit': '金門港_水頭 出境查驗', 
      'Kinmen SW both': '金門港_水頭 小計', 
      'Mazu X entry': '馬祖 入境查驗', 
      'Mazu X exit': '馬祖 出境查驗', 
      'Mazu X both': '馬祖 小計', 
      'Hualien A entry': '花蓮機場 入境查驗', 
      'Hualien A exit': '花蓮機場 出境查驗', 
      'Hualien A both': '花蓮機場 小計', 
      'Yunlin S entry': '麥寮港 入境查驗', 
      'Yunlin S exit': '麥寮港 出境查驗', 
      'Yunlin S both': '麥寮港 小計', 
      'Penghu A entry': '馬公機場 入境查驗', 
      'Penghu A exit': '馬公機場 出境查驗', 
      'Penghu A both': '馬公機場 小計', 
      'Taichung A entry': '台中機場 入境查驗', 
      'Taichung A exit': '台中機場 出境查驗', 
      'Taichung A both': '台中機場 小計', 
      'Hualien SN entry': '和平港 入境查驗', 
      'Hualien SN exit': '和平港 出境查驗', 
      'Hualien SN both': '和平港 小計', 
      'Kinmen A entry': '金門機場 入境查驗', 
      'Kinmen A exit': '金門機場 出境查驗', 
      'Kinmen A both': '金門機場 小計', 
      'Mazu AS entry': '南竿機場 入境查驗', 
      'Mazu AS exit': '南竿機場 出境查驗', 
      'Mazu AS both': '南竿機場 小計', 
      'Mazu AN entry': '北竿機場 入境查驗', 
      'Mazu AN exit': '北竿機場 出境查驗', 
      'Mazu AN both': '北竿機場 小計', 
      'Chiayi A entry': '嘉義機場 入境查驗', 
      'Chiayi A exit': '嘉義機場 出境查驗', 
      'Chiayi A both': '嘉義機場 小計', 
      'Taipei S entry': '台北港 入境查驗', 
      'Taipei S exit': '台北港 出境查驗', 
      'Taipei S both': '台北港 小計', 
      'Pintung SN1 entry': '東港 入境查驗', 
      'Pintung SN1 exit': '東港 出境查驗', 
      'Pintung SN1 both': '東港 小計', 
      'Taitung A entry': '台東機場 入境查驗', 
      'Taitung A exit': '台東機場 出境查驗', 
      'Taitung A both': '台東機場 小計', 
      'Mazu S entry': '北竿白沙港 入境查驗', 
      'Mazu S exit': '北竿白沙港 出境查驗', 
      'Mazu S both': '北竿白沙港 小計', 
      'Chiayi S entry': '布袋港 入境查驗', 
      'Chiayi S exit': '布袋港 出境查驗', 
      'Chiayi S both': '布袋港 小計', 
      'Taoyuan SS entry': '大園沙崙港 入境查驗', 
      'Taoyuan SS exit': '大園沙崙港 出境查驗', 
      'Taoyuan SS both': '大園沙崙港 小計', 
      'Taitung S entry': '台東富岡港 入境查驗', 
      'Taitung S exit': '台東富岡港 出境查驗', 
      'Taitung S both': '台東富岡港 小計', 
      'Penghu S entry': '馬公港 入境查驗', 
      'Penghu S exit': '馬公港 出境查驗', 
      'Penghu S both': '馬公港 小計', 
      'Taoyuan SN entry': '桃園竹圍港 入境查驗', 
      'Taoyuan SN exit': '桃園竹圍港 出境查驗', 
      'Taoyuan SN both': '桃園竹圍港 小計', 
      'Kinmen SE entry': '金門港_料羅 入境查驗', 
      'Kinmen SE exit': '金門港_料羅 出境查驗', 
      'Kinmen SE both': '金門港_料羅 小計', 
      'Pintung SS entry': '後壁湖遊艇港 入境查驗', 
      'Pintung SS exit': '後壁湖遊艇港 出境查驗', 
      'Pintung SS both': '後壁湖遊艇港 小計', 
      'New Taipei S entry': '淡水第二漁港遊艇碼頭 入境查驗', 
      'New Taipei S exit': '淡水第二漁港遊艇碼頭 出境查驗', 
      'New Taipei S both': '淡水第二漁港遊艇碼頭 小計', 
      'Pintung SN2 entry': '屏東大鵬灣遊艇港 入境查驗', 
      'Pintung SN2 exit': '屏東大鵬灣遊艇港 出境查驗', 
      'Pintung SN2 both': '屏東大鵬灣遊艇港 小計', 
      'Pintung A entry': '屏東機場 入境查驗', 
      'Pintung A exit': '屏東機場 出境查驗', 
      'Pintung A both': '屏東機場 小計'
    }
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv'.format(ccm.DATA_PATH)
    data = ccm.loadCsv(name, verbose=verbose, header=[0, 1])
    #https://data.gov.tw/dataset/12369
    
    self.setData(data)
    self.n_total = self.getNbRows()
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
    return 
    
  def setData(self, data):
    hdr = []
    
    ## Change header
    for pair in data.columns:
      if 'Unnamed:' in pair[0]:
        hdr.append((hdr[-1][0], pair[1]))
      elif 'Unnamed:' in pair[1]:
        hdr.append((pair[0], ''))
      else:
        hdr.append(pair)
    
    data.columns = [pair[0]+' '+pair[1] for pair in hdr]
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data = data[ind]
    return
  
  def getDate(self):
    date_list = ['{}-{}-{}'.format(date[:4], date[4:6], date[6:8]) for date in self.getCol(self.coltag_date)]
    return date_list
    
  def getNumbers(self, tag):
    nb_list = [int(out.replace(',', '')) for out in self.getCol(self.tag_dict[tag])]
    return nb_list
    
  def getEntry(self):
    return self.getNumbers('entry')
    
  def getExit(self):
    return self.getNumbers('exit')
    
  def getBoth(self):
    return self.getNumbers('both')
    
  def getAirportBreakdown(self, tag='both'):
    label_list = [
      'Taipei A',
      'Taoyuan A1',
      'Taoyuan A2',
      'Taichung A',
      'Chiayi A',
      'Tainan A',
      'Kaohsiung A',
      'Pintung A',
      
      'Hualien A',
      'Taitung A',
      'Penghu A',
      'Kinmen A',
      'Mazu AN',
      'Mazu AS'
    ]
    
    air_list_break = []
    for label in label_list:
      air_list_break.append((label, self.getNumbers(label+' '+tag)))
    return air_list_break
  
  def getSeaportBreakdown(self, tag='both'):
    label_list = [
      'Keelung S',
      'New Taipei S',
      'Taipei S',
      'Taoyuan SN',
      'Taoyuan SS',
      'Taichung S',
      'Yunlin S',
      'Chiayi S',
      'Tainan S',
      'Kaohsiung S',
      'Pintung SN1',
      'Pintung SN2',
      'Pintung SS',
      
      'Yilan S',
      'Hualien SN',
      'Hualien S',
      'Taitung S',
      'Penghu S',
      'Kinmen SW',
      'Kinmen SE',
      'Mazu S',
    ]
    
    sea_list_break = []
    for label in label_list:
      sea_list_break.append((label, self.getNumbers(label+' '+tag)))
    return sea_list_break
  
  def getNotSpecifiedBreakdown(self, tag='both'):
    label_list = [
      'Penghu X',
      'Mazu X'
    ]
    
    not_spec_list_break = []
    for label in label_list:
      not_spec_list_break.append((label, self.getNumbers(label+' '+tag)))
    return not_spec_list_break
  
  def getAirport(self, tag='both'):
    air_list_break = self.getAirportBreakdown(tag=tag)
    air_list_break = [air_list[1] for air_list in air_list_break]
    air_list = np.array(air_list_break).sum(axis=0)
    return air_list
  
  def getSeaport(self, tag='both'):
    sea_list_break = self.getSeaportBreakdown(tag=tag)
    sea_list_break = [sea_list[1] for sea_list in sea_list_break]
    sea_list = np.array(sea_list_break).sum(axis=0)
    return sea_list
  
  def getNotSpecified(self, tag='both'):
    not_spec_list_break = self.getNotSpecifiedBreakdown(tag=tag)
    not_spec_list_break = [not_spec_list[1] for not_spec_list in not_spec_list_break]
    not_spec_list = np.array(not_spec_list_break).sum(axis=0)
    return not_spec_list
  
  def makeStock_borderStats(self):
    date_list = self.getDate()
    stock = {'date': date_list}
    border_key_list = ['entry', 'exit', 'total']
    
    ## Loop over column
    for key in border_key_list:
      if key == 'total':
        tag = 'both'
      else:
        tag = key
        
      air_list = self.getAirport(tag=tag)
      sea_list = self.getSeaport(tag=tag)
      not_spec_list = self.getNotSpecified(tag=tag)
      stock[key] = np.array(air_list, dtype=int) + np.array(sea_list, dtype=int) + np.array(not_spec_list, dtype=int)
      
    ## Make avg
    for key in border_key_list:
      stock[key+'_avg'] = ccm.makeMovingAverage(stock[key])
    return stock
  
  def makeReadme_borderStats(self, gr):
    key = 'border_statistics'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: report date')
    stock.append('- Column')
    stock.append('  - `date`')
    stock.append('  - `entry`')
    stock.append('  - `exit`')
    stock.append('  - `total`: `entry` + `exit`')
    stock.append('  - `entry_avg`: 7-day moving average of `entry`')
    stock.append('  - `exit_avg`: 7-day moving average of `exit`')
    stock.append('  - `total_avg`: 7-day moving average of `total`')
    ccm.README_DICT[gr][key] = stock
    return
  
  def saveCsv_borderStats(self, mode='both'):
    if mode in ['data', 'both']:
      stock = self.makeStock_borderStats()
      stock = pd.DataFrame(stock)
      stock = ccm.adjustDateRange(stock)
    
    for gr in ccm.GROUP_LIST:
      if mode in ['data', 'both']:
        data = ccm.truncateStock(stock, gr)
        
        ## Save
        name = '{}processed_data/{}/border_statistics.csv'.format(ccm.DATA_PATH, gr)
        ccm.saveCsv(name, data)
      
      if mode in ['readme', 'both']:
        self.makeReadme_borderStats(gr)
    return
      
  def updateNewEntryCounts(self, stock):
    ord_ref = ccm.ISODateToOrd(ccm.ISO_DATE_REF)
    ord_today = ccm.getTodayOrdinal()
    nb_days = ord_today - ord_ref
    
    stock['new_entries'] = np.zeros(nb_days, dtype=int) + np.nan
    
    date_list = self.getDate()
    entry_list = self.getEntry()
    
    for date, entry in zip(date_list, entry_list):
      ind = ccm.ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = {:d}'.format(ind))
        continue
      
      stock['new_entries'][ind] = entry
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_borderStats(mode=mode)
    return

## End of file
################################################################################
