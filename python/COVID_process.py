
    ################################
    ##  COVID_process.py          ##
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
import covid.case as cvca
import covid.status as cvst
import covid.test as cvte
import covid.border as cvbd
import covid.timeline as cvtl
import covid.county as cvct
import covid.vaccination as cvva
import covid.vaccination_county as cvvc
import covid.death as cvde
import covid.case_counts as cvcc
import covid.others as cvot

import covid.html as cvht

################################################################################
## Functions - sandbox

def sandbox():
  mode = 'data'
  #cvcm.initializeReadme()
  
  #case_sheet = cvca.CaseSheet()
  #case_sheet.getOnsetDate()
  
  #status_sheet = cvst.StatusSheet()
  #status_sheet.saveCsv_caseFatalityRate(mode=mode)
  
  #test_sheet = cvte.TestSheet()
  #test_sheet.saveCsv_testCounts(mode=mode)
  
  #border_sheet = cvbd.BorderSheet()
  #border_sheet.saveCsv_borderStats(mode=mode)
  
  #timeline_sheet = cvtl.TimelineSheet()
  #timeline_sheet.saveCsv_evtTimeline(mode=mode)
  
  #county_sheet = cvct.CountySheet()
  #county_sheet.saveCsv_incidenceMap(mode=mode)
  
  #vacc_sheet = cvva.VaccinationSheet()
  #vacc_sheet.saveCsv_vaccinationByBrand(mode=mode)
  
  #vc_sheet = cvvc.VaccinationCountySheet()
  #vc_sheet.saveCsv_vaccinationByAge(mode=mode)
  
  #death_sheet = cvde.DeathSheet()
  #death_sheet.saveCsv_deathCounts(mode=mode)
  
  #cc_sheet = cvcc.CaseCountsSheet()
  #cc_sheet.saveCsv(mode=mode)
  
  status_sheet = cvst.StatusSheet()
  cc_sheet = cvcc.CaseCountsSheet()
  #border_sheet = cvbd.BorderSheet()
  death_sheet = cvde.DeathSheet()
  #county_sheet = cvct.CountySheet()
  #test_sheet = cvte.TestSheet()
  #cvot.saveCsv_keyNb(status_sheet, cc_sheet, mode=mode)
  #cvot.saveCsv_caseCounts(status_sheet, cc_sheet, mode=mode)
  #cvot.saveCsv_incidenceRates(status_sheet, cc_sheet, border_sheet, mode=mode)
  #cvot.saveCsv_deathCounts(status_sheet, death_sheet, mode=mode)
  cvot.saveCsv_caseFatalityRates(status_sheet, cc_sheet, death_sheet, mode=mode)
  #cvot.saveCsv_deathByAge(county_sheet, death_sheet, mode=mode)
  #cvot.saveCsv_testPositiveRate(status_sheet, cc_sheet, test_sheet, mode=mode)
  return

################################################################################
## Functions - save

def saveCsv_all():
  mode = 'both'
  cvcm.initializeReadme()
  
  ## README-only
  print()
  status_sheet = cvst.StatusSheet()
  status_sheet.saveCsv(mode=mode)
  print()
  case_sheet = cvca.CaseSheet()
  case_sheet.saveCsv(mode=mode)
  print()
  border_sheet = cvbd.BorderSheet()
  border_sheet.saveCsv(mode=mode)
  print()
  timeline_sheet = cvtl.TimelineSheet()
  timeline_sheet.saveCsv(mode=mode)
  
  ## From CDC
  print()
  county_sheet = cvct.CountySheet()
  county_sheet.saveCsv(mode=mode)
  print()
  test_sheet = cvte.TestSheet()
  test_sheet.saveCsv(mode=mode)
  
  ## From NCHC
  print()
  cc_sheet = cvcc.CaseCountsSheet()
  cc_sheet.saveCsv(mode=mode)
  print()
  death_sheet = cvde.DeathSheet()
  death_sheet.saveCsv(mode=mode)
  print()
  vc_sheet = cvvc.VaccinationCountySheet()
  vc_sheet.saveCsv(mode=mode)
  print()
  vacc_sheet = cvva.VaccinationSheet()
  vacc_sheet.saveCsv(mode=mode)
  
  print()
  cvot.saveCsv_others(status_sheet, cc_sheet, border_sheet, death_sheet, county_sheet, test_sheet, mode=mode)
  
  print()
  cvcm.saveMarkdown_readme()
  
  print()
  return

################################################################################
## Main

if __name__ == '__main__':
  if len(sys.argv) > 1:
    if sys.argv[1] == 'html':
      cvht.saveHtml_all()
    elif sys.argv[1] == 'sandbox':
      sandbox()
  else:
    saveCsv_all()

## End of file
################################################################################
