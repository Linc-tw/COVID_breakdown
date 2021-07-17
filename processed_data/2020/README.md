processed_data/2020/
====================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during 2020.


Contents
--------

`age_symptom_correlations.csv` (obsolete)
- Row = matrix element
- Column
  - `symptom`
  - `age`
  - `corr` = correlation coefficient
  - `count` = confirmed case counts

`age_symptom_correlations_label.csv` (obsolete)
- Row = symptom or age group
- Column
  - `key`
  - `count` = confirmed case counts of `key`
  - `label` = label in English for `key`
  - `label_fr` = label in French for `key` (contains non-ASCII characters)
  - `label_zh` = label in Mandarin for `key` (contains non-ASCII characters)

`border_statistics.csv`
- TODO

`border_statistics_both.csv` (obsolete)  
`border_statistics_entry.csv` (obsolete)  
`border_statistics_exit.csv` (obsolete)
- Row = date
- Column
  - `airports`
  - `seaports`
  - `not specified`
- Value = passenger counts

`case_by_age.csv`
- Row = age group of 5 up to 70
- Column = time period
  - `total` = 2020
  - `jan` = January 2020
  - `feb` = February 2020
  - etc.
- Value = confirmed case counts

`case_by_detection_by_onset_day.csv` (obsolete)
- Row = onset date
- Column = detection channel
  - `airport` = airport
  - `quarantine` = isolated due to risky travel history
  - `isolation` = isolated due to being a close contact of confirmed cases
  - `monitoring` = within 7 days after the end of quarantine or isolation
  - `hospital` = other domestic channels
  - `overseas` = by foreign health authorities
  - `no_data` = detection channel not available
- Value = confirmed case counts

`case_by_detection_by_report_day.csv` (obsolete)
- Row = report date
- Column = detection channel (same as above)
- Value = confirmed case counts

`case_by_transmission_by_onset_day.csv` (obsolete)
- Row = onset date
- Column = transmission type
  - `imported` = imported cases 
  - `linked` = local cases that are linked to other confirmed cases
  - `unlinked` = local cases that are unlinked to other confirmed cases
  - `fleet` = from the Pan-Shi warship cluster
  - `plane` = transmission on plane
  - `unknown` = ambiguous & untraceable origin
- Value = confirmed case counts

`case_by_transmission_by_report_day.csv`
- TODO

`death_counts.csv`
- TODO

`difference_by_transmission.csv` (obsolete)
- Row = delay in number of days before identifying a transmission
  - For local cases, it's defined as the delay between the report date & the onset date.
  - For imported cases, it's defined as the delay between the report date & the later one of the onset date & the entry date.
- Column = transmission type
  - `total` = all types combined
  - `imported` = imported cases
  - `indigenous` = all local cases, linked & unlinked
  - `other` = includes fleet, plane, & unknown
- Value = confirmed case counts

`hospitalization_or_isolation.csv`
- TODO

`incidence_map.csv`
- Row = city or county
- Column = time period
  - `total` = 2020
  - `jan` = January 2020
  - `feb` = February 2020
  - etc.
- Value = confirmed case counts

`incidence_map_label.csv`
- Row = city or county
- Column
  - `code` = 5-digit code given by the Ministry of the Interior
  - `population`
  - `label` = city or county name in English
  - `label_fr` = city or county name in French (contains non-ASCII characters)
  - `label_zh` = city or county name in Mandarin (contains non-ASCII characters)

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

`travel_history_symptom_correlations.csv` (obsolete)
- Row = matrix element
- Column
  - `symptom`
  - `trav_hist`
  - `corr` = correlation coefficient
  - `count` = confirmed case counts

`travel_history_symptom_correlations_label.csv` (obsolete)
- Row = symptom or travel history
- Column
  - `key`
  - `count` = confirmed case counts of `key`
  - `label` = label in English for `key`
  - `label_fr` = label in French for `key` (contains non-ASCII characters)
  - `label_zh` = label in Mandarin for `key` (contains non-ASCII characters)

`various_rates.csv` (obsolete)
- Row = date
- Column
  - `positive_rate` = number of confirmed cases over number of tests
  - `imp_inci_rate` = number of imported cases over number of border entries
  - `indi_inci_rate` = number of local cases over national population
- Value = rate calculated based on counts over 7 days
