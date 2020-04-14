

    ##########################################
    ##  COVID_breakdown_data_processing.py  ##
    ##  Chieh-An Lin                        ##
    ##  Version 2020.04.15                  ##
    ##########################################


import os
import datetime as dtt

import numpy as np
import scipy as sp
#import matplotlib as mpl
#import matplotlib.pyplot as plt
import pandas as pd

import commonFunctions as cf
import matplotlibFunctions as mplf


################################################################################
## Parameters

DATA_PATH = '/home/linc/03_Codes/COVID_breakdown/'
#FONT_PATH = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'

###############################################################################
## Main sheet

class MainSheet:
  
  def __init__(self, verbose=True):
    self.n_case = '案例'
    self.n_reportDate = '新聞稿發布日期'
    self.n_gender = '性別'
    self.n_age = '年齡'
    self.n_nationality = '國籍'
    self.n_city = '區域'
    self.n_transmission = '來源'
    self.n_travHist = '旅遊史'
    self.n_entryDate = '入境臺灣日期'
    self.n_onsetDate = '出現症狀日期'
    self.n_hospDate = '就醫日期'
    self.n_channel = '發現管道'
    self.n_symptom = '症狀'
    self.n_disease = '疾病史'
    self.n_link = '感染源'
    self.n_notes = '備註'
    self.n_discharged = '痊癒'
    self.n_disDate = '痊癒日期'
    self.n_disDate2 = '出院日期'
    self.n_confPressRel = '疾管署新聞稿'
    self.n_disPressRel = '出院新聞稿'
    
    name = '%sraw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 臺灣武漢肺炎病例.csv' % DATA_PATH
    self.data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    if verbose:
      print('Loaded \"%s\"' % name)
    return 
    
  def getReportDate(self):
    reportDateList = self.data[self.n_reportDate].values
    reportDateList = [reportDate.split('日')[0].split('月') for reportDate in reportDateList]
    reportDateList = ['2020-%02s-%02s' % (reportDate[0], reportDate[1]) for reportDate in reportDateList]
    return reportDateList

  def getTransmission(self):
    transList = self.data[self.n_transmission].values
    transList = ['imported' if trans == '境外' else 'indigenous' for trans in transList]
    return transList

  def getLink(self):
    linkList = self.data[self.n_link].values
    linkList = ['unlinked' if link == '未知' else link for link in linkList]
    return linkList
  
  def getOnsetDate(self):
    onsetDateList = []
    
    for onsetDate in self.data[self.n_onsetDate].values:
      if onsetDate == '2/18-25':
        onsetDateList.append(np.nan)
        continue
      
      if type(onsetDate) == type(0.0):
        onsetDateList.append(np.nan)
        continue
      
      MD = onsetDate.split('/')
      onsetDate = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
      onsetDateList.append(onsetDate)
    
    return onsetDateList
  
  def getChannel(self):
    chanList = []
    keyList_out = ['採檢']
    
    for chan in self.data[self.n_channel].values:
      if type(chan) == type(0.0):
        chanList.append(np.nan)
        continue
      
      if chan in keyList_out:
        chanList.append(np.nan)
        continue
      if '機場' in chan:
        chanList.append('airport')
        continue
      if '檢疫' in chan:
        chanList.append('quarantine')
        continue
      if '隔離' in chan:
        chanList.append('isolation')
        continue
      if '接觸者檢查' in chan:
        chanList.append('isolation')
        continue
      if '自主健康管理' in chan:
        chanList.append('monitoring')
        continue
      if '加強自主管理' in chan:
        chanList.append('monitoring')
        continue
      if '自行就醫' in chan:
        chanList.append('hospital')
        continue
      if '自主就醫' in chan:
        chanList.append('hospital')
        continue
      
      chanList.append(chan)
    return chanList
  
  def saveCsv_caseByTrans(self):
    reportDateList = self.getReportDate()
    onsetDateList  = self.getOnsetDate()
    transList      = self.getTransmission()
    linkList       = self.getLink()
    
    refOrd = cf.ISODateToOrdinal('2020-01-11')
    endOrd = dtt.date.today().toordinal() + 1
    
    date       = [cf.ordinalToISODate(i) for i in range(refOrd, endOrd)]
    nbDays     = endOrd - refOrd
    imported_r = np.zeros(nbDays, dtype=int)
    linked_r   = np.zeros(nbDays, dtype=int)
    unlinked_r = np.zeros(nbDays, dtype=int)
    imported_o = np.zeros(nbDays, dtype=int)
    linked_o   = np.zeros(nbDays, dtype=int)
    unlinked_o = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, trans, link in zip(reportDateList, onsetDateList, transList, linkList):
      ind_r = cf.ISODateToOrdinal(reportDate) - refOrd
      if ind_r < 0 or ind_r >= nbDays:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if trans == 'imported':
        imported_r[ind_r] += 1
      elif link == 'unlinked':
        unlinked_r[ind_r] += 1
      else:
        linked_r[ind_r] += 1
      
      if type(onsetDate) != type(0.0):
        ind_o = cf.ISODateToOrdinal(onsetDate) - refOrd
        if ind_o < 0 or ind_o >= nbDays:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if trans == 'imported':
          imported_o[ind_o] += 1
        elif link == 'unlinked':
          unlinked_o[ind_o] += 1
        else:
          linked_o[ind_o] += 1
    
    data_r = {'date': date, 'unlinked': unlinked_r, 'linked': linked_r, 'imported': imported_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'unlinked': unlinked_o, 'linked': linked_o, 'imported': imported_o}
    data_o = pd.DataFrame(data_o)
    
    name = '%sprocessed_data/case_by_transmission_by_report_day.csv' % DATA_PATH
    cf.saveCsv(name, data_r)
    name = '%sprocessed_data/case_by_transmission_by_onset_day.csv' % DATA_PATH
    cf.saveCsv(name, data_o)
    return
  
  def saveCsv_caseByDectChan(self):
    reportDateList = self.getReportDate()
    onsetDateList  = self.getOnsetDate()
    chanList       = self.getChannel()
    
    refOrd = cf.ISODateToOrdinal('2020-02-20')
    endOrd = dtt.date.today().toordinal() + 1
    
    date       = [cf.ordinalToISODate(i) for i in range(refOrd, endOrd)]
    nbDays     = endOrd - refOrd
    airport_r  = np.zeros(nbDays, dtype=int)
    QT_r       = np.zeros(nbDays, dtype=int)
    iso_r      = np.zeros(nbDays, dtype=int)
    monitor_r  = np.zeros(nbDays, dtype=int)
    hospital_r = np.zeros(nbDays, dtype=int)
    airport_o  = np.zeros(nbDays, dtype=int)
    QT_o       = np.zeros(nbDays, dtype=int)
    iso_o      = np.zeros(nbDays, dtype=int)
    monitor_o  = np.zeros(nbDays, dtype=int)
    hospital_o = np.zeros(nbDays, dtype=int)
    
    for reportDate, onsetDate, chan in zip(reportDateList, onsetDateList, chanList):
      if type(chan) == type(0.0):
        continue
      
      ind_r = cf.ISODateToOrdinal(reportDate) - refOrd
      if ind_r < 0 or ind_r >= nbDays:
        print('Bad ind_r = %d' % ind_r)
        continue
      
      if chan == 'airport':
        airport_r[ind_r] += 1
      elif chan == 'quarantine':
        QT_r[ind_r] += 1
      elif chan == 'isolation':
        iso_r[ind_r] += 1
      elif chan == 'monitoring':
        monitor_r[ind_r] += 1
      elif chan == 'hospital':
        hospital_r[ind_r] += 1
      
      if type(onsetDate) != type(0.0):
        ind_o = cf.ISODateToOrdinal(onsetDate) - refOrd
        if ind_o < 0 or ind_o >= nbDays:
          print('Bad ind_o = %d' % ind_o)
          continue
        
        if chan == 'airport':
          airport_o[ind_o] += 1
        elif chan == 'quarantine':
          QT_o[ind_o] += 1
        elif chan == 'isolation':
          iso_o[ind_o] += 1
        elif chan == 'monitoring':
          monitor_o[ind_o] += 1
        elif chan == 'hospital':
          hospital_o[ind_o] += 1
    
    data_r = {'date': date, 'hospital': hospital_r, 'monitoring': monitor_r, 'isolation': iso_r, 'quarantine': QT_r, 'airport': airport_r}
    data_r = pd.DataFrame(data_r)
    data_o = {'date': date, 'hospital': hospital_o, 'monitoring': monitor_o, 'isolation': iso_o, 'quarantine': QT_o, 'airport': airport_o}
    data_o = pd.DataFrame(data_o)
    
    name = '%sprocessed_data/case_by_detection_by_report_day.csv' % DATA_PATH
    cf.saveCsv(name, data_r)
    name = '%sprocessed_data/case_by_detection_by_onset_day.csv' % DATA_PATH
    cf.saveCsv(name, data_o)
    return
  
  def saveCsv(self):
    self.saveCsv_caseByTrans()
    self.saveCsv_caseByDectChan()
    return

###############################################################################
## Test sheet

class TestSheet:
  
  def __init__(self, verbose=True):
    self.n_date = '日期'
    self.n_fromExtended = '擴大監測'
    self.n_cumFromEextended = '擴大監測累計'
    self.n_fromQT = '居檢送驗'
    self.n_cumFromQT = '居檢送驗累計'
    self.n_fromClinicalDef = '武肺通報'
    self.n_cumFromClinicalDef = '武肺通報累計'
    self.n_nbTests = '檢驗人數'
    self.n_cumNbTests = '檢驗人數累計'
    self.n_confirmed = '確診人數'
    self.n_cumConfirmed = '確診人數累計'
    self.n_dailyPosRate = '單日陽性率'
    self.n_totPosRate = '陽性率'
    self.n_note1 = '擴大之檢驗標準(含擴大監測標準及通報定義)'
    self.n_note2 = '來源：疾管署（每天1am更新）'
    
    name = '%sraw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 檢驗人數.csv' % DATA_PATH
    self.data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    if verbose:
      print('Loaded \"%s\"' % name)
    return 
    
  def getDate(self):
    dateList = []
    
    for date in self.data[self.n_date].values:
      if type(date) == type(0.0):
        dateList.append(np.nan)
        continue
      
      MD = date.split('/')
      date = '2020-%02d-%02d' % (int(MD[0]), int(MD[1]))
      dateList.append(date)
    return dateList
  
  def getFromExtended(self):
    fromExtList = []
    for fromExt in self.data[self.n_fromExtended].values:
      if type(fromExt) == type(0.0):
        fromExtList.append(0)
        continue
        
      fromExt = fromExt.lstrip('+').split(',')
      fromExt = int(''.join(fromExt))
      fromExtList.append(fromExt)
    return fromExtList

  def getFromQT(self):
    fromQTList = []
    for fromQT in self.data[self.n_fromQT].values:
      if type(fromQT) == type(0.0):
        fromQTList.append(0)
        continue
        
      fromQT = fromQT.lstrip('+').split(',')
      fromQT = int(''.join(fromQT))
      fromQTList.append(fromQT)
    return fromQTList

  def getFromClinicalDef(self):
    clinicalDefList = []
    for clinicalDef in self.data[self.n_fromClinicalDef].values:
      if type(clinicalDef) == type(0.0):
        clinicalDefList.append(np.nan)
        continue
        
      clinicalDef = clinicalDef.lstrip('+').split(',')
      clinicalDef = int(''.join(clinicalDef))
      clinicalDefList.append(clinicalDef)
    return clinicalDefList

  def saveCsv_testByCriterion(self):
    dateList    = self.getDate()
    fromExtList = self.getFromExtended()
    fromQTList  = self.getFromQT()
    fromClinicalDefList = self.getFromClinicalDef()
    
    if type(dateList[-1]) == type(0.0):
      dateList    = dateList[:-1]
      fromExtList = fromExtList[:-1]
      fromQTList  = fromQTList[:-1]
      fromClinicalDefList = fromClinicalDefList[:-1]
    
    data = {'date': dateList, 'clinical': fromClinicalDefList, 'quarantine': fromQTList, 'extended': fromExtList}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/test_by_criterion.csv' % DATA_PATH
    cf.saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_testByCriterion()
    return

###############################################################################
## Sandbox

def sandbox():
  #sheet = MainSheet()
  #print(sheet.getChannel())
  #sheet.saveCsv()
  
  sheet = TestSheet()
  #print(sheet.getDate())
  sheet.saveCsv()
  return

###############################################################################
## Save

def saveCsv_all():
  MainSheet().saveCsv()
  TestSheet().saveCsv()
  return

###############################################################################

