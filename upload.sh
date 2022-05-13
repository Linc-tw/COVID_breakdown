#!/bin/bash

MODE=${1}
if [ "${MODE}" = "auto" ]; then
  MODE="Automatic"
else
  MODE="Manual"
fi

echo "################################################################################"
echo "## Log - upload.sh"
date
cd /home/linc/21_Codes/COVID_breakdown
echo

echo "## Download raw data"
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1036676170' &
sleep 10
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1449990493' &
sleep 10
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1744708886' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_specimen.csv' 'https://od.cdc.gov.tw/eic/covid19/covid19_tw_specimen.csv' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_county_age.csv' 'https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.csv' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_manufacture_v1&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTY0MDgxOTQ1Mg==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=date&d[]=NO&c[]=a03&t[]=varchar&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=NO&c[]=a06&t[]=int&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=int&d[]=NO' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.csv' 'https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=2006' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_death.csv' 'https://covid-19.nchc.org.tw/api/csv?CK=covid-19@nchc.org.tw&querydata=4002' & 
sleep 25
echo

echo "## Process data"
echo
/usr/bin/python3.8 python/COVID_process.py & sleep 12
echo

echo "## Push to repo"
echo
git add raw_data/**
git add processed_data/** & sleep 2
git commit -m "${MODE} data update" & sleep 1
echo
git push & sleep 7
echo

date
echo "## Log - upload.sh"
echo "################################################################################"
