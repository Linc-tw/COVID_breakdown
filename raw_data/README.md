raw_data/
=========


Data sources
------------

The visualization of this website is based on data collected from the following sources:
- a crowdsourced Google Spreadsheet,
- Centers for Disease Control (CDC),
- National Center for High-performance Computing (NCHC),
- Food and Drug Administration (FDA), and 
- Ministry of the Interior (MOI).

### Crowdsourcing

This [Google Spreadsheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#) 
is maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. 
They collect fragmental information from offical releases and daily press conferences, and sort them into comprehensive worksheets.
The data of confirmed cases, border statistics, deaths, & timeline are taken from here.

### CDC

Taiwan CDC possesses an [official data platform](https://data.cdc.gov.tw/zh_TW/).
The data of age and geographical information of confirmed cases and the data of tests are taken from here.

### NCHC

NCHC hosts a [dashboard](https://covid-19.nchc.org.tw/index.php) providing sorted data and visualization of pandemic situation.
The vaccination & death data are taken from here.

### FDA

Taiwan FDA publishes every month [documents](https://www.fda.gov.tw/TC/download.aspx) 
about the brands and amounts of vaccines that have passed quality checks.
The data of vaccine supplies are taken from here.

### MOI

Taiwan MOI publishes [regular statistics](https://www.ris.gov.tw/app/portal/346) on Taiwanese demography.
The population data are taken from here.


Raw data
--------

Raw data are a subset of files or spreadsheets downloaded from sources mentioned earlier.

There are 9 `csv` files. These files contain abundant Mandarin strings.


Contents
--------

### Crowdsourcing

`COVID-19_in_Taiwan_raw_data_case_breakdown.csv`
- Breakdown table of every single confirmed cases
- Contains report date, onset date, entry date, gender, age, nationality, transmission type, detection channel, symptoms, travel history, & link to known cases
- Updated until Apr 29th 2022

`COVID-19_in_Taiwan_raw_data_status_evolution.csv`
- Evolution of numbers of confirmed cases, discharged cases, & deaths
- Updated until Dec 31st 2022

`COVID-19_in_Taiwan_raw_data_timeline.csv`
- Timeline of major pandemic events for Taiwan & the world
- Updated until Dec 31st 2022

### CDC

`COVID-19_in_Taiwan_raw_data_county_age.csv`
- Table of confirmed cases as were reported by local health authorities
- Contains report date, county/city, village/district, gender, age, whether imported, & number of cases
- Removed from repo since its size is too large
- Downloaded from [here](https://data.cdc.gov.tw/zh_TW/dataset/aagsdctable-day-19cov)

`COVID-19_in_Taiwan_raw_data_number_of_tests.csv`
- Daily test statistics
- Shows date of tests when they were administrated, which is **not** necessary the same date as when they were analyzed
- Updated until Mar 1st 2023
- Downloaded from [here](https://data.gov.tw/dataset/120451)

### NCHC

`COVID-19_in_Taiwan_raw_data_vaccination.csv`
- Table of administrated doses of different vaccine brands
- Updated until Mar 25th 2023
- Downloaded from [here](https://covid-19.nchc.org.tw/api.php?tableID=2004)

`COVID-19_in_Taiwan_raw_data_vaccination_county.csv`
- Table of administrated doses from different regions for different age ranges
- Updated until Dec 14th 2022
- Downloaded from [here](https://covid-19.nchc.org.tw/api.php?tableID=2006)

`COVID-19_in_Taiwan_raw_data_death.csv`
- Breakdown table of every single deaths
- Updated until Jan 19th 2023
- Downloaded from [here](https://covid-19.nchc.org.tw/api.php?tableID=4002)

### Out of date

`COVID-19_in_Taiwan_raw_data_border_statistics.csv`
- Daily border entries & exits at all airports & seaports
- Updated monthly until May 2022
- This is just a sorted version of offical datasets that can be found [here](https://data.gov.tw/dataset/12369).
