processed_data/overall/
=======================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during the entire pandemic.


Contents
--------

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
  - `total`: overall stats
  - `YYYY`: during year `YYYY`
  - `MMM_YYYY`: during month `MMM` of year `YYYY`

`case_by_age_label.csv`
- Row: time range
- Column
  - `key`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)

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

`case_fatality_rate.csv`
- Row: date
- Column
  - `date`
  - `weekly_CFR`: 7-day-averaged case fatality rate
  - `cumul_CFR`: cumulative case fatality rate

`death_by_age_count.csv`
- Row: age group
- Column
  - `age`
  - `total`: overall stats
  - `YYYY`: during year `YYYY`

`death_by_age_label.csv`
- Row: time range
- Column
  - `key`
  - `label`: label in English
  - `label_fr`: label in French (contains non-ASCII characters)
  - `label_zh`: label in Mandarin (contains non-ASCII characters)

`death_by_age_rate.csv`
- Row: age group
- Column
  - `age`
  - `total`: overall stats
  - `YYYY`: during year `YYYY`

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
  - `total`: overall stats
  - `YYYY`: during year `YYYY`

`death_delay_label.csv`
- Row
  - `counts`: total number of deaths
  - `missing`: number of deaths without the report date of diagnosis
  - `avg`: average delay
- Column
  - `key`
  - `total`: overall stats
  - `YYYY`: during year `YYYY`

`hospitalization_or_isolation.csv`
- Row: report date
- Column
  - `date`
  - `hospitalized`: number of cases that are confirmed & not closed, either in hospitalization or isolation

`incidence_map.csv`
- Row: city or county
- Column
  - `county`
  - `total`: overall stats
  - `YYYY`: during year `YYYY`
  - `MMM_YYYY`: during month `MMM` of year `YYYY`

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
  - `total`: nationwide
  - `Keelung` to `Matsu`: individual city or county
  - `Hsinchu`: Hsinchu county
  - `Hsinchu_C`: Hsinchu city
  - `Chiayi`: Chiayi county
  - `Chiayi_C`: Chiayi city
  - `*_avg`: 7-day moving average of `*`

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

`test_positive_rate.csv`
- Row: date
- Column
  - `date`
  - `positivity`: number of confirmed cases over number of tests

`vaccination_by_brand.csv`
- Row: report date
- Column
  - `date`
  - `interpolated`
    - Original data are provided in cumulative counts but with missing values. Here, the file provides daily counts where missing values are estimated from interpolation.
    - 0 = true value, not interpolated
    - 1 = interpolated value
    - -1 = interpolated value, but the cumulative count on this day is known
  - `total`: all brands, daily new injections
  - `AZ`
  - `Moderna`
  - `Medigen`
  - `Pfizer`
  - `Novavax`
  - `*_avg`: 7-day moving average of `*`

`vaccination_by_dose.csv`
- Row: report date
- Column
  - `date`
  - `interpolated`
    - 0 = true value, not interpolated
    - 1 = interpolated value
  - `ppl_vacc_rate`: proportion of the population vaccinated with their 1st dose
  - `ppl_fully_vacc_rate`: proportion of the population fully vaccinated
  - `ppl_vacc_3_rate`: proportion of the population vaccinated with their 3rd dose
  - `ppl_vacc_4_rate`: proportion of the population vaccinated with their 4th dose

`vaccination_deliveries_list.csv`
- Row: deliveries
- Column
  - `brand`
  - `source`: expeditor of the delivery
  - `quantity`: number of doses after quality checks fulfilled
    - Quality checks always consume some doses, typically 600.
    - The exact quantity can be found in FDA's monthly report.
    - The links to these reports are listed in `vaccination_deliveries_reference.csv`.
  - `delivery_date`
  - `available_date`: date after quality checks fulfilled
  - `delivery_news`: CNA news on the delivery
  - `available_news`: CNA news or FDA press release on quality checks

`vaccination_deliveries_reference.csv`
- Row = month
- Column
  - `month`
  - `link`: link to the reference pdf file published by FDA

`vaccination_progress_injections.csv`
- Row = report date
- Column
  - `date`
  - `interpolated`
    - 0 = true value, not interpolated
    - 1 = interpolated value
  - `total`: all brands, cumulative number of doses
  - `AZ`
  - `Moderna`
  - `Medigen`
  - `Pfizer`
  - `Novavax`

`vaccination_progress_supplies.csv`
- Row: available date
- Column
  - `date`: available date of the supply
    - If the available date is not available, the date is estimated as the delivery date plus 8 days
  - `source`: origin of the supply
  - `total`: all brands, cumulative number of doses
  - `AZ`
  - `Moderna`
  - `Medigen`
  - `Pfizer`
  - `Novavax`
