processed_data/
===============


Processed data
--------------

This folder & its sub-folders contain processed data files that are directly used for plotting.

All `csv` files were generated from files in `raw_data/`, by
calling 
```python
python COVID_breakdown_data_processing.py
```
A `geojson` file containing a modified version of Taiwan map is also present.

All files here only contain ASCII strings unless specified.


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
- With non-ASCII strings

`criteria_timeline.csv`
- Timeline table for testing criteria evolution in Taiwan
- With non-ASCII strings

`event_timeline_zh-tw.csv`
- Timeline table for major pandemic events
- With non-ASCII strings

`key_numbers.csv`
- Contains case counts & timestamp
