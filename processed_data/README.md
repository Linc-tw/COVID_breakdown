processed_data/
===============


Processed data
--------------

Processed data contain various files that are directly used for plotting.

All `csv` files were generated from files in `raw_data/` by executing 
```python
python COVID_breakdown_data_processing.py
```
A `geojson` file containing a modified version of Taiwan map is also added.

All files here only contain ASCII characters unless specified.


Contents
--------

`2020/`
- Contains statistics of 2020

`2021/`
- Contains statistics of 2021

`latest/`
- Contains statistics of last 90 days

`adminMap_byCounties_offsetIslands_sphe.geojson`
- Map of Taiwan with its islands rearranged
- Contain non-ASCII characters

`key_numbers.csv`
- Row
  - `n_total` = total confirmed case counts
  - `n_latest` = confirmed case counts during last 90 days
  - `n_2020` = confirmed case counts during 2020
  - `n_2021` = confirmed case counts during 2021
  - `n_empty` = number of cases that have been proven later as false positive
  - `timestamp` = time of last update
- Column
  - `key`
  - `value`

### From `COVID-19_in_Taiwan_raw_data_timeline.csv`

`criteria_timeline.csv`
- Row = date
- Column = language
  - `en`
  - `fr`
  - `zh-tw`
- Timeline table for evolution of testing criteria in Taiwan
- Contains non-ASCII characters

`event_timeline_zh-tw.csv`
- Row = date
- Column
  - `Taiwan_event`
  - `global_event`
  - `key_event`
- Timeline table for major pandemic events
- Contains non-ASCII characters
