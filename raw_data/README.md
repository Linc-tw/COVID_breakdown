raw_data/
=========


Data sources
------------

At this stage, this website collects data from 2 sources. 

The principle source is a [Google Spreadsheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7gTCUvuCqR3zdcLGccuGLv1s7dpDcQ-MeH_AZxnCXtW4iqVmEzUnDSKR7o8OiMLPMelEpxE7Pi4Q/pubhtml#)
maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. 
They crawl to harvest data from official sites. 
They also collect fragmental information from daily press releases and conferences, and sort them into comprehensive worksheets.

Obviously this website cannot be done without the goodwill of these volunteers that I am fully grateful to.

The second source is Taiwan CDC's [official data platform](https://data.cdc.gov.tw/zh_TW/), which unfortunately doesn't provide many meaningful datasets.
This is why the principle source is not the offical one.

Both sources provide data in Mandarin.


Raw data
--------

Raw data are a subset of files or spreadsheets from 2 data sources mentioned earlier
that have been used by this website.

There are 6 `csv` files at this stage. 
The main one is a list of every single confirmed cases with their epidemiological details.

These files contain abundant Mandarin strings.


Contents
--------

### From the Google Spreadsheet

`COVID-19_in_Taiwan_raw_data_border_statistics.csv`
- Daily border entries & exits at all airports & seaports
- Updated monthly

`COVID-19_in_Taiwan_raw_data_case_breakdown.csv`
- Breakdown table of every single confirmed cases
- Contains report date, onset date, entry date, gender, age, nationality, transmission type, detection channel, symptoms, travel history, & link to known cases

`COVID-19_in_Taiwan_raw_data_number_of_tests.csv`
- Daily test statistics
- Shows date of tests when they were administrated, which is **not** necessary the same date as when they were analyzed
- This is just a table version of an offical `json` file that can be found [here](https://covid19dashboard.cdc.gov.tw/dash4).

`COVID-19_in_Taiwan_raw_data_status_evolution.csv`
- Evolution of numbers of confirmed cases, discharged cases, & deaths

`COVID-19_in_Taiwan_raw_data_timeline.csv`
- Timeline of major pandemic events for Taiwan & the world

### From the official data platform

`COVID-19_in_Taiwan_raw_data_county_age.csv`
- Table of confirmed cases as were reported by local health authorities
- Contains report date, county/city, village/district, gender, age, whether imported, & number of cases
- Downloaded from [here](https://data.cdc.gov.tw/zh_TW/dataset/aagsdctable-day-19cov)
