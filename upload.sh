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
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_case_breakdown.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=0' &
sleep 15
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1036676170' &
sleep 10
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1173642744' &
sleep 10
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1449990493' &
sleep 10
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1744708886' &
sleep 5
echo
wget -O 'raw_data/COVID-19_in_Taiwan_raw_data_county_age.csv' 'https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.csv' &
sleep 5
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_c&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyMzE0MjQ2Mg==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=YES&c[]=a07&t[]=decimal&d[]=YES&c[]=a08&t[]=int&d[]=NO&c[]=a09&t[]=decimal&d[]=NO' &
sleep 25
echo

echo "## Process data"
echo
/usr/bin/python3.8 COVID_breakdown_data_processing.py & sleep 2
echo

echo "## Push to repo"
echo
git add raw_data/*.csv
git add processed_data/*.csv
git add processed_data/latest/*.csv
git add processed_data/2021/*.csv
git add processed_data/2020/*.csv & sleep 2
git commit -m "${MODE} data update" & sleep 1
echo
git push & sleep 7
echo

date
echo "## Log - upload.sh"
echo "################################################################################"
