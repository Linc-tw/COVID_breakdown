Script structure
================


Structure by folders
--------------------

`archives/`
  - `age_symptom_correlations.js`
  - `case_by_detection.js`
  - `difference_by_transmission.js`
  - `hospitalization_or_isolation.js`
  - `status_evolution.js`
  - `travel_history_symptom_correlations.js`
  - `vaccination_by_county.js`

`border_sheet/`
  - `border_statistics.js`
  
`case_sheet/`
  - `case_counts.js`
  
`county_sheet/`
  - `case_by_age.js`
  - `incidence_evolution_by_age.js`
  - `incidence_evolution_by_county.js`
  - `incidence_map.js`
  - `local_case_per_county.js`
  
`others/`
  - `incidence_rates.js`
  - `infectiodynamics.js`
  - `positivity_and_fatality.js`
  - `stats_in_mirror.js`

`status_sheet/`
  - `death_counts.js`

`test_sheet/`
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
  - `case_by_transmission.js` (repeated)
  - `vaccination_progress.js` (repeated)

`cases.html`
  - `case_by_transmission.js`
  - `local_case_per_county.js`
  - `case_by_age.js`

`incidence.html`
  - `incidence_rates.js`
  - `incidence_map.js`
  - `incidence_evolution_by_county.js` (no overall)
  - `incidence_evolution_by_age.js` (no overall)

`vaccination.html`
  - `vaccination_by_brand.js`
  - `vaccination_progress.js`
  - `vaccination_by_dose.js`

`others.html`
  - `test_by_criterion.js`
  - `positivity_and_fatality.js`
  - `death_counts.js`
  - `border_statistics.js`
  - `stats_in_mirror.js`
  - `infectiodynamics.js` (no latest)

`timeline.html`
  - `criteria_timeline.js`
  - `event_timeline.js`

  
Structure by axis type
----------------------

Single bar
  - `case_by_age.js`

Faint single bar & avg line
  - `border_statistics.js`
  - `case_by_transmission.js`
  - `death_counts.js`
  - `local_case_per_county.js`
  - `test_by_criterion.js`
  - `vaccination_by_brand.js`

Line
  - `incidence_rates.js`
  - `infectiodynamics.js` 
  - `positivity_and_fatality.js`
  - `vaccination_progress.js`

Area
  - `vaccination_by_dose.js`

Hot map
  - `incidence_evolution_by_age.js`
  - `incidence_evolution_by_county.js`

No axis
  - `incidence_map.js`
  - `criteria_timeline.js`
  - `event_timeline.js`

Combined
  - `stats_in_mirror.js`
