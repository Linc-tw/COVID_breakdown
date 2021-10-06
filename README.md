COVID-19 Statistics in Taiwan
=============================

This repository hosts and generates a [dashboard](https://linc-tw.github.io/COVID_breakdown/index.html) for COVID-19 statistics in Taiwan.

![image](figures/screenshot.png)


Description
-----------

This site informs general public about COVID-19 with data visualization.
It shows cases, testing, & vaccination statistics in Taiwan.


Features
--------

The most recent statisitcs can be found in _Last 90 days_.
The overall statistics can be found in _Overall stats_.
In these two sections, 17 plots are shown on 4 pages: 
- _Case breakdown_
- _Incidence rates_
- _Vaccination_
- _Other stats_

Plots on [_Case breakdown_](https://linc-tw.github.io/COVID_breakdown/page/latest_cases.html) are:
- Confirmed Case Counts
- Local Confirmed Cases per City & County
- Confirmed Cases by Age

Plots on [_Incidence rates_](https://linc-tw.github.io/COVID_breakdown/page/latest_incidence.html) are:
- Arrival & Local Incidence Rates
- Incidence Map
- Evolution of Incidence Rate by City & County (only in _Last 90 days_)
- Evolution of Incidence Rate by Age Group (only in _Last 90 days_)

Plots on [_Vaccination_](https://linc-tw.github.io/COVID_breakdown/page/latest_vaccination.html) are:
- Vaccination by Brand
- Vaccination Progress & Deliveries
- Vaccination Progress by Dose
- Vaccination by City & County (only in _Last 90 days_)

Plots on [_Other stats_](https://linc-tw.github.io/COVID_breakdown/page/latest_others.html) are:
- Test Counts
- Positive Rate & Case Fatality Rate
- Death Counts
- Hospitalization or Confirmed Cases in Isolation
- Border Crossing
- Statistics in Mirror

There is an additional plot is on the _Home_ page:
- Status Evolution

And 2 other plots on the _Timeline_ page:
- Chronology of Systematic Testing
- Pandemic Timeline (text in Mandarin)

Other ideas for plots are welcome. To be proposed at [Issues](https://github.com/Linc-tw/COVID_breakdown/issues).


Language support
----------------

- English
- French
- Taiwanese Mandarin


Current workflow
----------------

An automatic update is scheduled at 16:45 everyday.
This is done by executing `upload.sh`. It will:
- download raw data from the sources;
- execute `python COVID_breakdown_data_processing.py` to generate processed data; and
- commit & push the data to the repository.

Manual data regularization will be done from time to time in late evening.


Credits
-------

The principle data source of this website is 
maintained by various anonymous users of the PTT forum, often considered as Taiwanese Reddit. 
They crawl to harvest data from official sites. 
They also collect fragmental information from daily press releases and conferences, and sort them into comprehensive worksheets.

Obviously this website cannot be done without the goodwill of these volunteers that I am fully grateful to.

See [_Data Sources_](https://linc-tw.github.io/COVID_breakdown/data_source.html) or 
`README.md` of [`raw_data/`](https://github.com/Linc-tw/COVID_breakdown/tree/master/raw_data)
for details.


Licenses
--------

The codes & scripts are released under MIT License © Chieh-An Lin.

This repository contains a [piece of code](https://github.com/Linc-tw/COVID_breakdown/blob/master/js/utility/saveSvgAsPng.js) 
taken from [here](https://github.com/exupero/saveSvgAsPng) and is released under [MIT License © Eric Shull](https://github.com/exupero/saveSvgAsPng/blob/gh-pages/LICENSE).

The website template is released under [MIT License © Blackrock Digital LLC](https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/gh-pages/LICENSE).

All other texts and plots created by this repository are released under [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/deed.en).
