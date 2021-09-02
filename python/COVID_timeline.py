
    ##############################
    ##  COVID_timeline.py       ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.07.22      ##
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

################################################################################
## Classes - timeline sheet

class TimelineSheet(ccm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '時間'
    self.coltag_twn_evt = '台灣事件'
    self.coltag_criteria = '台灣檢驗標準'
    self.coltag_global_evt = '全球事件'
    self.coltag_key_evt = '重點事件'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' % ccm.DATA_PATH
    data = ccm.loadCsv(name, verbose=verbose)
    
    date_list = data[self.coltag_date].values
    ind = (date_list == date_list) * (date_list != '2021分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = []
    
    for date in self.getCol(self.coltag_date):
      yyyymmddday_zh = date.split('年')
      y = int(yyyymmddday_zh[0])
      mmddday_zh = yyyymmddday_zh[1].split('月')
      m = int(mmddday_zh[0])
      ddday_zh = mmddday_zh[1].split('日')
      d = int(ddday_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
  
  def getTWNEvt(self):
    twn_evt_list = []
    for twn_evt in self.getCol(self.coltag_twn_evt):
      if twn_evt == twn_evt:
        twn_evt = twn_evt.rstrip('\n')
        twn_evt = '\n'.join(twn_evt.split('\n\n\n'))
        twn_evt = '\n'.join(twn_evt.split('\n\n'))
        twn_evt_list.append(twn_evt)
      else:
        twn_evt_list.append(twn_evt)
    return twn_evt_list
  
  def getGlobalEvt(self):
    global_evt_list = []
    for global_evt in self.getCol(self.coltag_global_evt):
      if global_evt == global_evt:
        global_evt = global_evt.rstrip('\n')
        global_evt = '\n'.join(global_evt.split('\n\n\n'))
        global_evt = '\n'.join(global_evt.split('\n\n'))
        global_evt_list.append(global_evt)
      else:
        global_evt_list.append(global_evt)
    return global_evt_list
  
  def getKeyEvt(self):
    key_evt_list = []
    for key_evt in self.getCol(self.coltag_key_evt):
      if key_evt == key_evt:
        key_evt_list.append(key_evt.rstrip('\n'))
      else:
        key_evt_list.append(key_evt)
    return key_evt_list
  
  def makeReadme_evtTimeline(self):
    key = 'event_timeline_zh-tw'
    stock = []
    stock.append('`%s.csv`' % key)
    stock.append('- Row: date')
    stock.append('- Column')
    stock.append('  - `Taiwan_event`')
    stock.append('  - `global_event`')
    stock.append('  - `key_event`')
    stock.append('- Timeline table for major pandemic events')
    stock.append('- Contains non-ASCII characters')
    ccm.README_DICT['root'][key] = stock
    return
  
  def saveCsv_evtTimeline(self):
    date_list = []
    twn_evt_list = []
    global_evt_list = []
    key_evt_list = []
    
    #for date, twn_evt, global_evt, key_evt in zip(self.getDate(), self.getTWNEvt(), self.getGlobalEvt(), self.getKeyEvt()):
      #if twn_evt != twn_evt and global_evt != global_evt and key_evt != key_evt:
        #continue
      #else:
        #date_list.append(date)
        #twn_evt_list.append(twn_evt)
        #global_evt_list.append(global_evt)
        #key_evt_list.append(key_evt)
    
    for date, twn_evt, global_evt in zip(self.getDate(), self.getTWNEvt(), self.getGlobalEvt()):
      if twn_evt != twn_evt and global_evt != global_evt:
        continue
      else:
        date_list.append(date)
        twn_evt_list.append(twn_evt)
        global_evt_list.append(global_evt)
        key_evt_list.append(' ')
    
    stock = {'date': date_list, 'Taiwan_event': twn_evt_list, 'global_event': global_evt_list, 'key_event': key_evt_list}
    data = pd.DataFrame(stock)
    
    name = '%sprocessed_data/event_timeline_zh-tw.csv' % ccm.DATA_PATH
    ccm.saveCsv(name, data)
    
    self.makeReadme_evtTimeline()
    return
  
  def saveCsv(self):
    self.saveCsv_evtTimeline()
    return
  
## End of file
################################################################################
