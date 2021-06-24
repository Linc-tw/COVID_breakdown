processed_data/latest/
======================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during last 90 days.


Contents
--------

### From `COVID-19_in_Taiwan_raw_data_border_statistics.csv`

`test_by_criterion.csv`
- Row = date
- Column = testing criterion
  - `clinical` = suspicious clinical cases
  - `quarantine` = in quarantine (obsolete criterion)
  - `extended` = extended tests for community monitoring
- Value = administrated test counts

### From `COVID-19_in_Taiwan_raw_data_case_breakdown.csv`

`age_symptom_correlations_coefficient.csv`
- Row = matrix element
- Column
  - `symptom`
  - `age`
  - `value` = correlation coefficient, used for color
  - `label` = correlation coefficient, already formatted

`age_symptom_correlations_counts.csv`
- Row = matrix element
- Column
  - `symptom`
  - `age`
  - `value` = correlation coefficient, used for color
  - `label` = confirmed case counts

`age_symptom_correlations_total.csv`
- Row = matrix symptom & age
- Column
  - `label` = symptom & age in English
  - `count` = confirmed case counts of the group
  - `label_zh` = symptom & age in Mandarin (contains non-ASCII characters)
  - `label_fr` = symptom & age in French (contains non-ASCII characters)

`case_by_detection_by_onset_day.csv`
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

`case_by_detection_by_report_day.csv`
- Row = report date
- Column = detection channel (same as above)
- Value = confirmed case counts

`case_by_transmission_by_onset_day.csv`
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
- Row = report date
- Column = transmission type (same as above)
- Value = confirmed case counts

`difference_by_transmission.csv`
- Row = delay in number of days before identifying a transmission
  - For local cases, it's defined as the delay between the report date & the onset date.
  - For imported cases, it's defined as the delay between the report date & the later one of the onset date & the entry date.
- Column = transmission type
  - `total` = all types combined
  - `imported` = imported cases
  - `indigenous` = all local cases, linked & unlinked
  - `other` = includes fleet, plane, & unknown
- Value = confirmed case counts

`travel_history_symptom_correlations_coefficient.csv`
- Row = matrix element
- Column
  - `symptom`
  - `trav_hist`
  - `value` = correlation coefficient, used for color
  - `label` = correlation coefficient, already formatted

`travel_history_symptom_correlations_counts.csv`
- Row = matrix element
- Column
  - `symptom`
  - `trav_hist`
  - `value` = correlation coefficient, used for color
  - `label` = confirmed case counts

`travel_history_symptom_correlations_total.csv`
- Row = symptom & travel history
- Column
  - `label` = symptom & travel history in English
  - `count` = confirmed case counts of the group
  - `label_zh` = symptom & travel history in Mandarin (contains non-ASCII characters)
  - `label_fr` = symptom & travel history in French (contains non-ASCII characters)

### From `COVID-19_in_Taiwan_raw_data_county_age.csv`

`case_by_age.csv`
- Row = age range of 5 up to 70
- Column = time period
  - `total` = last 90 days
  - `week_-1` = between 0 to 6 days ago
  - `week_-2` = between 7 to 13 days ago
  - etc.
- Value = confirmed case counts

`daily_case_per_county.csv`
- Row = report date
- Column = city or county
- Value = confirmed case counts

`incidence_map.csv`
- Row = city or county
- Column = time period
  - `total` = last 90 days
  - `week_-1` = between 0 to 6 days ago
  - `week_-2` = between 7 to 13 days ago
  - etc.
- Value = confirmed case counts

`incidence_map_population.csv`
- Row = city or county
- Column
  - `code` = 5-digit code given by the Ministry of the Interior
  - `population`
  - `label` = city or county name in English
  - `label_fr` = city or county name in French (contains non-ASCII characters)
  - `label_zh` = city or county name in Mandarin (contains non-ASCII characters)

### From `COVID-19_in_Taiwan_raw_data_number_of_tests.csv`

`border_statistics_both.csv`  
`border_statistics_entry.csv`  
`border_statistics_exit.csv`
- Row = date
- Column
  - `airports`
  - `seaports`
  - `not specified`
- Value = passenger counts

### From `COVID-19_in_Taiwan_raw_data_status_evolution.csv`

`status_evolution.csv`
- Row = date
- Column
  - `discharged` = number of people discharged from isolation
  - `hospitalized`
  - `death`
- Value = number counts

### From crossing multiple raw data files

`various_rates.csv`
- Row = date
- Column
  - `positive_rate` = number of confirmed cases over number of tests
  - `imp_inci_rate` = number of imported cases over number of border entries
  - `indi_inci_rate` = number of local cases over national population
- Value = rate calculated based on counts over 7 days
