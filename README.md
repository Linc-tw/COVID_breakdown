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
In total, 12 charts are shown on 2 pages, [_Highlight_](https://linc-tw.github.io/COVID_breakdown/index.html) & 
[_Case breakdown_](https://linc-tw.github.io/COVID_breakdown/latest_breakdown.html).

In _Highlight_:
- Status Evolution
- 7-day Average of Various Rates
- Confirmed Cases by Transmission Type
- Incidence Map
- Number of Tests by Reporting Criterion
- Border Crossing

In _Case breakdown_:
- Confirmed Cases by Transmission Type (repeated)
- Confirmed Cases by Detection Channel
- Local Confirmed Cases per City & County
- Incidence Map (repeated)
- Confirmed Cases by Age
- Delay Before Identifying a Transmission
- Correlations between Travel History & Symptoms
- Correlations between Age & Symptoms

The above charts are all generated with data of last 90 days.
The same 12 charts made from all-year statistics can be found in _Stats 2020_ & _Stats 2021_.
Loading can be slow for the 4 pages of these categories due to large files.

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

