Script structure
================


Structure by folders
--------------------

`archives/`
  - `age_symptom_correlations.js`
  - `case_by_detection.js`
  - `difference_by_transmission.js`
  - `hospitalization_or_isolation.js`
  - `infectiodynamics.js`
  - `status_evolution.js`
  - `travel_history_symptom_correlations.js`

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
  
`death_sheet/`
  - `death_by_age.js`
  
`others/`
  - `incidence_rates.js`
  - `positivity_and_fatality.js`
  - `stats_in_mirror.js`

`status_sheet/`
  - `death_counts.js`

`test_sheet/`
  - `test_counts.js`

`timeline/`
  - `criteria_timeline.js`
  - `event_timeline.js`
  
`vaccination_county_sheet/`
  - `vaccination_by_age.js`
  - `vaccination_by_county.js`

`vaccination_sheet/`
  - `vaccination_by_brand.js`
  - `vaccination_by_dose.js`
  - `vaccination_progress.js`


Structure by page
-----------------

`index.html`
  - `case_counts.js` (repeated)
  - `vaccination_by_dose.js` (repeated)

`cases.html`
  - `case_counts.js`
  - `local_case_per_county.js`
  - `case_by_age.js`

`incidence.html`
  - `incidence_rates.js`
  - `incidence_map.js`
  - `incidence_evolution_by_county.js` (only latest)
  - `incidence_evolution_by_age.js` (only latest)

`vaccination.html`
  - `vaccination_by_brand.js`
  - `vaccination_progress.js`
  - `vaccination_by_dose.js`
  - `vaccination_by_age.js` (only latest)
  - `vaccination_by_county.js` (only latest)

`others.html`
  - `test_counts.js`
  - `positivity_and_fatality.js`
  - `death_counts.js`
  - `death_by_age.js`
  - `border_statistics.js`

`comparison.html`
  - `stats_in_mirror.js`

`timeline.html`
  - `criteria_timeline.js`
  - `event_timeline.js`

  
Structure by axis type
----------------------

Single bar
  - `case_by_age.js`
  - `death_by_age.js`

Multiple bar
  - `vaccination_by_age.js`
  - `vaccination_by_county.js`

Faint single bar & avg line
  - `border_statistics.js`
  - `case_counts.js`
  - `death_counts.js`
  - `local_case_per_county.js`
  - `test_counts.js`
  - `vaccination_by_brand.js`

Line
  - `incidence_rates.js`
  - `positivity_and_fatality.js`
  - `vaccination_by_dose.js`
  - `vaccination_progress.js`

Hot map
  - `incidence_evolution_by_age.js`
  - `incidence_evolution_by_county.js`

No axis
  - `incidence_map.js`
  - `criteria_timeline.js`
  - `event_timeline.js`

Combined
  - `stats_in_mirror.js`
