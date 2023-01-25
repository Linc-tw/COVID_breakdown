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

`2022/`
- Contains statistics of 2022

`2023/`
- Contains statistics of 2023

`latest/`
- Contains statistics of last 90 days

`overall/`
- Contains statistics of the entire pandemic

`adminMap_byCounties_offsetIslands_sphe.geojson`
- Map of Taiwan with its islands rearranged
- Contain non-ASCII characters
