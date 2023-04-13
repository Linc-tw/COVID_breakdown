COVID-19 Statistics in Taiwan
=============================

This repository hosts and generates a [dashboard](http://covidtaiwan.linc.tw/) for COVID-19 statistics in Taiwan.

![image](figures/screenshot.png)


Description
-----------

This site informs general public about COVID-19 with data visualization.
It shows cases, testing, & vaccination statistics in Taiwan.


Features
--------

The statisitcs over all pandemic period are shown on 6 different pages: 
- _Case breakdown_
- _Incidence rates_
- _Vaccination_
- _Deaths_
- _Tests_
- _Comparison_

Plots on [_Case breakdown_](http://covidtaiwan.linc.tw/page/latest_cases.html) are:
- Confirmed Case Counts
- Local Confirmed Cases per City & County
- Confirmed Cases by Age

Plots on [_Incidence rates_](http://covidtaiwan.linc.tw/page/latest_incidence.html) are:
- Arrival & Local Incidence Rates
- Incidence Map

Plots on [_Vaccination_](http://covidtaiwan.linc.tw/page/latest_vaccination.html) are:
- Vaccination by Brand
- Vaccination Progress & Deliveries
- Vaccination Progress by Dose
- Vaccination by Age Group
- Vaccination by City & County

Plots on [_Deaths_](http://covidtaiwan.linc.tw/page/latest_deaths.html) are:
- Death Counts
- Case Fatality Rates
- Delay between Case and Death Reports
- Deaths by Age

Plots on [_Tests_](http://covidtaiwan.linc.tw/page/latest_others.html) are:
- Test Counts
- Test Positive Rate

The plot on [_Comparison_](http://covidtaiwan.linc.tw/page/latest_comparison.html) is:
- Statistics in Mirror

And 2 other plots on the [_Timeline_](http://covidtaiwan.linc.tw/page/timeline.html) page:
- Chronology of Systematic Testing
- Pandemic Timeline (text in Mandarin)


Language support
----------------

- English
- French
- Taiwanese Mandarin


Current status
--------------

An automatic daily update was scheduled previouslym but was suspended at the beginning of April 2023.
The site & its data repository are conserved as they are.


Credits
-------

The visualization of this website is based on data collected from the following sources:
- a crowdsourced Google Spreadsheet,
- Centers for Disease Control (CDC),
- National Center for High-performance Computing (NCHC),
- Food and Drug Administration (FDA), and 
- Ministry of the Interior (MOI).

See `README.md` in [`raw_data/`](https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data)
and in [`processed_data/`](https://github.com/Linc-tw/COVID_breakdown/tree/master/processed_data)
for details.


Licenses
--------

The codes & scripts are released under MIT License © Chieh-An Lin.

This repository contains a [piece of code](https://github.com/Linc-tw/COVID_breakdown/blob/master/js/utility/saveSvgAsPng.js) 
taken from [here](https://github.com/exupero/saveSvgAsPng) and is released under [MIT License © Eric Shull](https://github.com/exupero/saveSvgAsPng/blob/gh-pages/LICENSE).

The website template is released under [MIT License © Blackrock Digital LLC](https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/gh-pages/LICENSE).

All other texts and plots created by this repository are released under [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/deed.en).
