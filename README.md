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
In total, 15 charts are shown on 3 pages, 
[_Case breakdown_](https://linc-tw.github.io/COVID_breakdown/latest_breakdown.html),
[_Incidence rates_](https://linc-tw.github.io/COVID_breakdown/latest_incidence.html), & 
[_Other stats_](https://linc-tw.github.io/COVID_breakdown/latest_others.html).

In _Case breakdown_:
- Confirmed Cases by Transmission Type
- Confirmed Cases by Detection Channel
- Local Confirmed Cases per City & County
- Confirmed Cases by Age
- Correlations between Travel History & Symptoms
- Correlations between Age & Symptoms
- Delay Before Identifying a Transmission

In _Incidence rates_:
- 7-day Average of Various Rates
- Incidence Map
- Evolution of Incidence Rate by City & County
- Evolution of Incidence Rate by Age Group

In _Other stats_:
- Status Evolution
- Number of Tests by Reporting Criterion
- Administrated Vaccines by Brand
- Border Crossing

The above charts are all generated with data of last 90 days.
A selection of these figures can be found in _Highlight_, constituting a dashboard.

The same charts made from all-year statistics & can be found in _Stats 2020_ & _Stats 2021_,
except that:
- _Administrated Vaccines by Brand_ only exists for _Stats 2021_ and
- no _Evolution of Incidence Rate by City & County_ or _Evolution of Incidence Rate by Age Group_for either of two.
Loading can be slow for some pages of these categories due to large files.

There are also 2 charts in _Timeline_:
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

An automatic update is scheduled at 14:40 everyday.
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

