Script structure
================


Structure by raw data
---------------------

`archives/`
  - `age_symptom_correlations.js`
  - `case_by_detection.js`
  - `difference_by_transmission.js`
  - `travel_history_symptom_correlations.js`

`county_sheet/`
  - `case_by_age.js`
  - `incidence_evolution_by_age.js`
  - `incidence_evolution_by_county.js`
  - `incidence_map.js`
  - `local_case_per_county.js`
  
`main_sheet/`
  - `case_by_transmission.js`
  
`others/`
  - `border_statistics.js`
  - `incidence_rates.js`
  - `positivity_and_fatality.js`
  - `status_evolution.js`
  - `test_by_criterion.js`

`timeline/`
  - `criteria_timeline.js`
  - `event_timeline.js`
  
`vaccination_sheet/`
  - `vaccination_by_brand.js`
  - `vaccination_by_dose.js`
  - `vaccination_progress.js`


Structure by page
-----------------

`index.html`
  - `status_evolution.js`
  - `vaccination_progress.js` (repeated)

`cases.html`
  - `case_by_transmission.js`
  - `local_case_per_county.js`
  - `case_by_age.js` (TODO: Which time range to split for overall?)

`incidence.html`
  - `incidence_rates.js`
  - `incidence_map.js` (TODO: Which time range to split overall?)
  - `incidence_evolution_by_county.js` (no overall)
  - `incidence_evolution_by_age.js` (no overall)

`vaccination.html`
  - `vaccination_by_brand.js`
  - `vaccination_progress.js` (only overall)
  - `vaccination_by_dose.js`
  - TODO vaccination by county

`others.html`
  - `test_by_criterion.js`
  - `positivity_and_fatality.js`
  - `death_counts.js`
  - `hospitalization_or_isolation.js`
  - `border_statistics.js`

`timeline.html`
  - `criteria_timeline.js`
  - `event_timeline.js`

  
Structure by axis type
----------------------

Multiple bar
  - `status_evolution.js`
  
Single bar
  - `case_by_age.js`

Faint single bar & avg line
  - `border_statistics.js`
  - `case_by_transmission.js`
  - `local_case_per_county.js`
  - `test_by_criterion.js`
  - `vaccination_by_brand.js`

Line
  - `vaccination_progress.js`
  - `various_rates.js`

Hot map
  - `incidence_evolution_by_age.js`
  - `incidence_evolution_by_county.js`

No axis
  - `incidence_map.js`
  - `criteria_timeline.js`
  - `event_timeline.js`
