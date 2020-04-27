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
cd /home/linc/03_Codes/COVID_breakdown
echo

echo "## Download raw data"
echo
wget -O 'raw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 臺灣武漢肺炎病例.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=0' &
sleep 10
echo
wget -O 'raw_data/武漢肺炎in臺灣相關整理(請看推廣用連結) - 檢驗人數.csv' 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pub?output=csv&gid=1173642744' &
sleep 10
echo

echo "## Process data"
echo
/usr/bin/python3.8 COVID_breakdown_data_processing.py & sleep 5
echo

echo "## Push to repo"
echo
git add processed_data/*.csv & sleep 1
git commit -m "${MODE} data update" & sleep 1
echo
git push & sleep 10
echo

date
echo "## Log - upload.sh"
echo "################################################################################"
