Script structure
================


Structure by raw data
---------------------

`county_sheet/`
  - `case_by_age.js`
  - `local_case_per_county.js`
  - `incidence_evolution_by_age.js` TODO
  - `incidence_evolution_by_county.js` TODO
  - `incidence_map.js`
  
`main_sheet/`
  - `age_symptom_correlations.js`
  - `case_by_detection.js`
  - `case_by_transmission.js`
  - `difference_by_transmission.js`
  - `travel_history_symptom_correlations.js`
  
`others/`
  - `border_statistics.js`
  - `status_evolution.js`
  - `test_by_criterion.js`
  - `various_rates.js`
  - `vaccination_by_brand.js`

  
Structure by page
-----------------

`index.html` (repeated)
  - `status_evolution.js`
  - `various_rates.js`
  - `case_by_transmission.js`
  - `incidence_map.js`
  - `test_by_criterion.js`
  - `vaccination_by_brand.js`
  - `incidence_evolution_by_county.js` TODO (replace `incidence_map.js`)

`breakdown.html`
  - `case_by_transmission.js`
  - `case_by_detection.js`
  - `local_case_per_county.js`
  - `case_by_age.js`
  - `travel_history_symptom_correlations.js`
  - `age_symptom_correlations.js`
  - `difference_by_transmission.js`

`incidence.html`
  - `various_rates.js`
  - `incidence_map.js`
  - `incidence_evolution_by_county.js` TODO
  - `incidence_evolution_by_age.js` TODO

`others.html`
  - `status_evolution.js`
  - `test_by_criterion.js`
  - `vaccination_by_brand.js`
  - `border_statistics.js`
