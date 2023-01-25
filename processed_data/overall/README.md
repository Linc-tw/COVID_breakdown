processed_data/overall/
=======================


Summary
-------

This folder hosts data files which summarize COVID statistics in Taiwan during the entire pandemic.


Contents
--------

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
