
    ################################
    ##  timeline.py               ##
    ##  Chieh-An Lin              ##
    ##  2022.12.05                ##
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
## Class - timeline sheet

class TimelineSheet(cvcm.Template):
  
  def __init__(self, verbose=True):
    self.coltag_date = '時間'
    self.coltag_twn_evt = '台灣事件'
    self.coltag_criteria = '台灣檢驗標準'
    self.coltag_global_evt = '全球事件'
    self.coltag_cdc_evt = 'CDC時間軸'
    
    name = '{}raw_data/COVID-19_in_Taiwan_raw_data_timeline.csv'.format(cvcm.DATA_PATH)
    data = cvcm.loadCsv(name, verbose=verbose)
    
    self.data = data
    self.n_total = self.getNbRows()
    
    if verbose:
      print('N_total = {:d}'.format(self.n_total))
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
      date = '{:04d}-{:02d}-{:02d}'.format(y, m, d)
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
  
  def getCDCEvt(self):
    key_evt_list = []
    for key_evt in self.getCol(self.coltag_cdc_evt):
      if key_evt == key_evt:
        key_evt_list.append(key_evt.rstrip('\n'))
      else:
        key_evt_list.append(key_evt)
    return key_evt_list
  
  def makeStock_evtTimeline(self):
    date_list = self.getDate()
    twn_evt_list = self.getTWNEvt()
    global_evt_list = self.getGlobalEvt()
    cdc_evt_list = self.getCDCEvt()
    
    col_tag_list = ['date', 'Taiwan_event', 'global_event', 'CDC_event']
    stock = {col_tag: [] for col_tag in col_tag_list}
    
    for date, twn_evt, global_evt, cdc_evt in zip(date_list, twn_evt_list, global_evt_list, cdc_evt_list):
      if twn_evt != twn_evt and global_evt != global_evt and cdc_evt != cdc_evt:
        continue
      
      stock['date'].append(date)
      stock['Taiwan_event'].append(twn_evt)
      stock['global_event'].append(global_evt)
      stock['CDC_event'].append(cdc_evt)
    return stock
      
  def makeReadme_evtTimeline(self):
    key = 'event_timeline_zh-tw'
    stock = []
    stock.append('`{}.csv`'.format(key))
    stock.append('- Row: date')
    stock.append('- Column')
    stock.append('  - `Taiwan_event`')
    stock.append('  - `global_event`')
    stock.append('  - `key_event`')
    stock.append('- Timeline table for major pandemic events')
    stock.append('- Contains non-ASCII characters')
    cvcm.README_DICT['root'][key] = stock
    return
  
  def saveCsv_evtTimeline(self, mode='both'):
    if mode in ['data', 'both']:
      data = self.makeStock_evtTimeline()
      data = pd.DataFrame(data)
      
      name = '{}processed_data/event_timeline_zh-tw.csv'.format(cvcm.DATA_PATH)
      cvcm.saveCsv(name, data)
    
    if mode in ['readme', 'both']:
      self.makeReadme_evtTimeline()
    return
  
  def saveCsv(self, mode='both'):
    self.saveCsv_evtTimeline(mode=mode)
    return
  
## End of file
################################################################################