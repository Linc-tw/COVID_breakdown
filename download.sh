#!/bin/bash

MODE=${1}

echo "################################################################################"
echo "## Log - download.sh"
date
cd /home/linc/21_Codes/COVID_breakdown
echo

echo "## Download raw data"
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1036676170' &
sleep 7
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1449990493' &
sleep 7
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1744708886' &
sleep 7
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' 'https://od.cdc.gov.tw/eic/covid19/covid19_tw_specimen.csv' &
sleep 2
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_county_age.csv' 'https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.csv' &
sleep 2
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_big5.csv' 'https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2004' &
sleep 2
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county_big5.csv' 'https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2006' &
sleep 2
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_death_big5.csv' 'https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=4002' & 
sleep 20
echo

echo "## Convert data encoding"
iconv -f Big-5 -t UTF-8 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_big5.csv' > 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination.csv'
iconv -f Big-5 -t UTF-8 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county_big5.csv' > 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.csv'
iconv -f Big-5 -t UTF-8 'raw_data/COVID-19_in_Taiwan_raw_data_death_big5.csv' > 'raw_data/COVID-19_in_Taiwan_raw_data_death.csv'
echo "Done"
echo

if [ "${MODE}" = "a" ] || [ "${MODE}" = "m" ]; then
  echo "## Process data"
  echo
  /usr/bin/python3.8 python/COVID_process.py & sleep 12
  echo

  echo "## Push to repo"
  echo
  git add raw_data/**
  git add processed_data/** & sleep 2
  
  if [ "${MODE}" = "a" ]; then
    git commit -m "Automatic data update" & sleep 1
  else
    git commit -m "Manual data update" & sleep 1
  fi
  
  echo
  git push & sleep 7
  echo
fi

date
echo "## Log - download.sh"
echo "################################################################################"
