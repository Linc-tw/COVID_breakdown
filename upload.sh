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
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.json' 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_can2_c2&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyNjU1MDY4MQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=decimal&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=int&d[]=NO&c[]=a09&t[]=decimal&d[]=NO&c[]=a10&t[]=int&d[]=NO&c[]=a11&t[]=int&d[]=NO&c[]=a12&t[]=decimal&d[]=NO&c[]=a13&t[]=int&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=decimal&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=decimal&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO' &
sleep 1
echo
wget --no-check-certificate -O 'raw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine&limitColumn=a01&limitValue=taiwan%&equalValue=%20like%20&encodeKey=MTYyNDM0Nzg5OA==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=date&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=YES&c[]=a07&t[]=int&d[]=YES&c[]=a08&t[]=decimal&d[]=YES&c[]=a09&t[]=decimal&d[]=YES&c[]=a10&t[]=decimal&d[]=YES&c[]=a11&t[]=decimal&d[]=YES&c[]=a12&t[]=decimal&d[]=YES&c[]=a13&t[]=text&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=int&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=int&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO' & 
sleep 25
echo

echo "## Process data"
echo
/usr/bin/python3.8 COVID_breakdown_data_processing.py & sleep 10
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
