processed_data/overall/
=======================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during the entire pandemic.


Contents
--------

`border_statistics.csv`
- TODO

`case_by_age.csv`
- Row = age group of 5 up to 70
- Column = time period
  - `total` = last 90 days
  - `week_-1` = between 0 to 6 days ago
  - `week_-2` = between 7 to 13 days ago
  - etc.
- Value = confirmed case counts

`case_by_transmission_by_report_day.csv`
- TODO

`death_counts.csv`
- TODO

`hospitalization_or_isolation.csv`
- TODO

`incidence_rates.csv`
- TODO

`local_case_per_county.csv`
- Row = report date
- Column = city or county
- Value = confirmed case counts

`positicity_and_fatality.csv`
- TODO

`status_evolution.csv`
- Row = date
- Column
  - `discharged` = number of people discharged from isolation
  - `hospitalized`
  - `death`
- Value = number counts

`test_by_criterion.csv`
- TODO

`vaccination_by_brand.csv`
- Row = date
- Column
  - `interpolated`
    - Original data are provided in cumulative counts but with missing values. Here, the processed data set provides daily counts where missing values are estimated from interpolation.
    - 0 = true value, not interpolated
    - 1 = interpolated value
    - -1 = interpolated value, but the cumulative count on this day is a real value
  - `AZ`
  - `Moderna`

`vaccination_by_dose.csv`
- TODO

`vaccination_progress_administrated.csv`
- TODO

`vaccination_progress_deliveries.csv`
- TODO
