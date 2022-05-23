processed_data/2020/
====================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during 2020.


Contents
--------

`age_symptom_correlations.csv`
- Row: matrix element
- Column
  - `symptom`
  - `age`: age range
  - `corr`: correlation coefficient between `symptom` & `age`
  - `count`: number of confirmed cases from `age` having `symptom`

`age_symptom_correlations_label.csv`
- Row: symptom or age range
- Column
  - `key`
  - `count`: number of confirmed cases of `key`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)

`border_statistics.csv`
- Row: report date
- Column
  - `date`
  - `entry`
  - `exit`
  - `total`: `entry` + `exit`
  - `entry_avg`: 7-day moving average of `entry`
  - `exit_avg`: 7-day moving average of `exit`
  - `total_avg`: 7-day moving average of `total`

`case_by_age.csv`
- Row: age group
- Column
  - `age`
  - `total`: 2020 all year
  - `MMM`: during month `MMM`

`case_by_age_label.csv`
- Row: time range
- Column
  - `key`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)

`case_by_detection_by_onset_day.csv`
- Row: onset date
- Column
  - `date`
  - `airport`
  - `quarantine`: during isolation because of having high-risk travel history
  - `isolation`: during isolation because of being close contact of confirmed cases
  - `monitoring`: during 7 days after quarantine or isolation`
  - `hospital`: detected in community`
  - `overseas`: diagnosed overseas`
  - `no_data`: no detection channel data`

`case_by_detection_by_report_day.csv`
- Row: report date
- Column
  - `date`
  - `airport`
  - `quarantine`: during isolation because of having high-risk travel history
  - `isolation`: during isolation because of being close contact of confirmed cases
  - `monitoring`: during 7 days after quarantine or isolation`
  - `hospital`: detected in community`
  - `overseas`: diagnosed overseas`
  - `no_data`: no detection channel data`

`case_by_transmission_by_onset_day.csv`
- Row: onset date
- Column
  - `date`
  - `imported`
  - `linked`: local cases linked to known ones
  - `unlinked`: local cases with unknown origin
  - `fleet`: on boat
  - `plane`: on plane
  - `unknown`: undetermined`
- Cases without onset date do not show up in the file

`case_by_transmission_by_report_day.csv`
- Row: report date
- Column
  - `date`
  - `imported`
  - `linked`: local cases linked to known ones
  - `unlinked`: local cases with unknown origin
  - `fleet`: on boat
  - `plane`: on plane
  - `unknown`: undetermined`

`case_counts_by_report_day.csv`
- Row: report date
- Column
  - `date`
  - `total`: `imported` + `local` + `others`
  - `imported`: imported cases
  - `local`: local cases
  - `others`: on plane, on boat, & unknown
  - `total_avg`: 7-day moving average of `total`
  - `imported_avg`: 7-day moving average of `imported`
  - `local_avg`: 7-day moving average of `local`
  - `others_avg`: 7-day moving average of `others`

`death_counts.csv`
- Row: report date
- Column
  - `date`
  - `death`
  - `death_avg`: 7-day moving average of `death`

`death_delay.csv`
- Row: delay in days between case and death report
- Column: transmission type
  - `difference`: see row
  - `total`: all year 2020

`death_delay_label.csv`
- Row
  - `counts`: total number of deaths
  - `missing`: number of deaths without the report date of diagnosis
  - `avg`: average delay
- Column
  - `key`
  - `value`

`difference_by_transmission.csv`
- Row: delay in number of days before identifying a transmission
  - For local cases, it is defined as the delay between the report date & the onset date.
  - For imported cases, it is defined as the delay between the report date & the later one of the onset date & the entry date.
- Column: transmission type
  - `difference`: see row
  - `total`: `imported` + `local` + `others`
  - `imported`: imported cases
  - `local`: local cases
  - `others`: on plane, on boat, & unknown
- Value: number of case counts
- This information is not available for all cases.

`hospitalization_or_isolation.csv`
- Row: report date
- Column
  - `date`
  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation

`incidence_map.csv`
- Row: city or county
- Column
  - `county`
  - `total`: 2020 all year
  - `MMM`: during month `MMM`

`incidence_map_label.csv`
- Row: city or county
- Column
  - `key`
  - `code`: unique code attributed to city or county by Ministry of Interior
  - `population`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)

`incidence_rates.csv`
- Row: date
- Column
  - `date`
  - `arr_incidence`: number of imported confirmed cases over number of arrival passengers
  - `local_incidence`: number of local confirmed cases over population

`local_case_per_county.csv`
- Row: report date
- Column
  - `date`
  - `total`: nationalwide
  - `Keelung` to `Matsu`: individual city or county
  - `Hsinchu`: Hsinchu county
  - `Hsinchu_C`: Hsinchu city
  - `Chiayi`: Chiayi county
  - `Chiayi_C`: Chiayi city
  - `*_avg`: 7-day moving average of `*`

`positivity_and_fatality.csv`
- Row: date
- Column
  - `date`
  - `positivity`: number of confirmed cases over number of tests
  - `fatality`: number of deaths over number of confirmed cases

`status_evolution.csv`
- Row: report date
- Column
  - `date`
  - `discharged`
  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation
  - `death`

`test_by_criterion.csv`
- Row: report date
- Column
  - `date`
  - `clinical`: based on clinical criteria
  - `quarantine`: on people in quarantine (obsolete)
  - `extended`: extended community search

`test_counts.csv`
- Row: report date
- Column
  - `date`
  - `total`: total test counts
  - `total_avg`: 7-day moving average of `total`

`travel_history_symptom_correlations.csv`
- Row: matrix element
- Column
  - `symptom`
  - `trav_hist`: country as travel history
  - `corr`: correlation coefficient between `symptom` & `trav_hist`
  - `count`: number of confirmed cases having `symptom` & `trav_hist` simultaneously

`travel_history_symptom_correlations_label.csv`
- Row: symptom or travel history
- Column
  - `key`
  - `count`: number of confirmed cases of `key`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)
