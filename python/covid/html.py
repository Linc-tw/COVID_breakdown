
    ################################
    ##  html.py                   ##
    ##  Chieh-An Lin              ##
    ##  2022.12.05                ##
    ################################

################################################################################
## Parameters

PAGE_DICT = {
  'index': dict(
    name = 'Index',
    plot_list = ['VBD', 'CC', 'IR', 'VBB', 'DC', 'TC', 'SIM'],
  ),
  
  'latest_cases': dict(
    name = 'Latest cases',
    plot_list = ['CC', 'LCPC', 'CBA'],
  ),
  'latest_incidence': dict(
    name = 'Latest incidence',
    plot_list = ['IR', 'IM', 'IEBC', 'IEBA'],
  ),
  'latest_vaccination': dict(
    name = 'Latest vaccination',
    plot_list = ['VBB', 'VP', 'VBD', 'VBA', 'VBC'],
  ),
  'latest_deaths': dict(
    name = 'Latest deaths',
    plot_list = ['DC', 'CFR', 'DD'],
  ),
  'latest_others': dict(
    name = 'Latest tests',
    plot_list = ['TC', 'TPR', 'BS'],
  ),
  'latest_comparison': dict(
    name = 'Latest comparison',
    plot_list = ['CC', 'IR', 'VBB', 'VBD', 'DC', 'CFR', 'TC', 'TPR', 'BS', 'SIM'],
  ),
  
  'overall_cases': dict(
    name = 'Overall cases',
    plot_list = ['CC', 'LCPC', 'CBA'],
  ),
  'overall_incidence': dict(
    name = 'Overall incidence',
    plot_list = ['IR', 'IM'],
  ),
  'overall_vaccination': dict(
    name = 'Overall vaccination',
    plot_list = ['VBB', 'VP', 'VBD'],
  ),
  'overall_deaths': dict(
    name = 'Overall deaths',
    plot_list = ['DC', 'CFR', 'DD', 'DBA'],
  ),
  'overall_others': dict(
    name = 'Overall tests',
    plot_list = ['TC', 'TPR', 'BS'],
  ),
  'overall_comparison': dict(
    name = 'Overall comparison',
    plot_list = ['CC', 'IR', 'VBB', 'VBD', 'DC', 'CFR', 'TC', 'TPR', 'BS', 'SIM'],
  ),
  
  'timeline': dict(
    name = 'Timeline',
    plot_list = ['CT', 'ET'],
  ),
  'data_source': dict(
    name = 'Data source',
    plot_list = [],
  ),
  'no_right_reserved': dict(
    name = 'No right reserved',
    plot_list = [],
  ),
  
}

PLOT_DICT = {
  ## Cases
  'CC': dict(
    plot_tag = 'case_counts',
    js_path = 'status_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-briefcase-medical',
  ),
  'LCPC': dict(
    plot_tag = 'local_case_per_county',
    js_path = 'county_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-street-view',
  ),
  'CBA': dict(
    plot_tag = 'case_by_age',
    js_path = 'county_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-baby',
  ),
  
  ## Incidence
  'IR': dict(
    plot_tag = 'incidence_rates',
    js_path = 'others/',
    wdt_str = None,
    fontawe_str = 'fa-chart-line',
  ),
  'IM': dict(
    plot_tag = 'incidence_map',
    js_path = 'county_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-map-marked-alt',
  ),
  'IEBC': dict(
    plot_tag = 'incidence_evolution_by_county',
    js_path = 'county_sheet/',
    wdt_str = 'col-xl-9',
    fontawe_str = 'fa-file-medical-alt',
  ),
  'IEBA': dict(
    plot_tag = 'incidence_evolution_by_age',
    js_path = 'county_sheet/',
    wdt_str = 'col-xl-9',
    fontawe_str = 'fa-procedures',
  ),
  
  ## Vaccination
  'VBB': dict(
    plot_tag = 'vaccination_by_brand',
    js_path = 'vaccination_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-tag',
  ),
  'VP': dict(
    plot_tag = 'vaccination_progress',
    js_path = 'vaccination_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-parachute-box',
  ),
  'VBD': dict(
    plot_tag = 'vaccination_by_dose',
    js_path = 'vaccination_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-syringe',
  ),
  'VBA': dict(
    plot_tag = 'vaccination_by_age',
    js_path = 'vaccination_county_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-baby-carriage',
  ),
  'VBC': dict(
    plot_tag = 'vaccination_by_county',
    js_path = 'vaccination_county_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-city',
  ),
  
  ## Deaths
  'DC': dict(
    plot_tag = 'death_counts',
    js_path = 'status_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-skull-crossbones',
  ),
  'CFR': dict(
    plot_tag = 'case_fatality_rates',
    js_path = 'status_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-virus',
  ),
  'DD': dict(
    plot_tag = 'death_delay',
    js_path = 'death_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-arrows-alt-h',
  ),
  'DBA': dict(
    plot_tag = 'death_by_age',
    js_path = 'others/',
    wdt_str = None,
    fontawe_str = 'fa-tired',
  ),
  
  ## Others
  'TC': dict(
    plot_tag = 'test_counts',
    js_path = 'test_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-vial',
  ),
  'TPR': dict(
    plot_tag = 'test_positive_rate',
    js_path = 'others/',
    wdt_str = None,
    fontawe_str = 'fa-plus-circle',
  ),
  'BS': dict(
    plot_tag = 'border_statistics',
    js_path = 'border_sheet/',
    wdt_str = None,
    fontawe_str = 'fa-plane-slash',
  ),
  
  ## Comparison
  'SIM': dict(
    plot_tag = 'stats_in_mirror',
    js_path = 'others/',
    wdt_str = {'latest': 'col-xl-9 col-lg-12', 'overall': 'col-xl-12'},
    fontawe_str = 'fa-yin-yang',
  ),
  
  ## Timeline
  'CT': dict(
    plot_tag = 'criteria_timeline',
    js_path = 'timeline_sheet/',
    wdt_str = 'col-xl-8',
    fontawe_str = 'fa-clock',
  ),
  'ET': dict(
    plot_tag = 'event_timeline',
    js_path = 'timeline_sheet/',
    wdt_str = 'col-xl-12',
    fontawe_str = {'2020': 'fa-calendar-alt', '2022': 'fa-calendar-check', '2024': 'fa-calendar-alt', },
  ),
  
  ## Other pages
  'DS': dict(
    plot_tag = 'data_source',
    js_path = '',
    wdt_str = 'col-lg-6 col-xl-4',
    fontawe_str = ['fa-server', 'fa-box-open', 'fa-archive'],
  ),
  'NRR': dict(
    plot_tag = 'no_right_reserved',
    js_path = '',
    wdt_str = 'col-lg-6',
    fontawe_str = 'fa-times-circle',
  ),
}

################################################################################
## Functions - non-plots

def makeStr_header(page_tag):
  if page_tag == 'home':
    page_tag = 'index'
    url = page_tag + '.html'
  else:
    url = 'page/' + page_tag + '.html'
    
  author = 'Chieh-An Lin'
  autogen = 'Autogenerated'
  
  length = max([len(str_) for str_ in [url, author, autogen]])
  url += ' ' * (length - len(url))
  author += ' ' * (length - len(author))
  autogen += ' ' * (length - len(autogen))
  line = '-' * length
  
  str_ = '\n\
  <!----{}----\n\
    --  {}  --\n\
    --  {}  --\n\
    --  {}  --\n\
    ----{}---->\n\n'.format(line, url, author, autogen, line)
  return str_
  
def makeStr_html_front(page_tag):
  if page_tag == 'home':
    page_tag = 'index'
    url = page_tag + '.html'
  else:
    url = 'page/' + page_tag + '.html'
    
  site_name = 'COVID-19 Statistics in Taiwan'
  page_name = PAGE_DICT[page_tag]['name']
  
  str_ = '<!DOCTYPE html>\n<html lang="en">\n\
    <head>\n\
        <!-- Metadata - common part -->\n\
        <meta charset="utf-8" />\n\
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n\
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />\n\
        <meta name="description" content="This site informs general public about COVID-19 with data visualization. It shows cases, testing, & vaccination statistics in Taiwan." />\n\
        <meta property="og:type" content="website" />\n\
        <meta property="og:image" content="http://covidtaiwan.linc.tw/figures/screenshot.png" />\n\
        <meta property="og:description" content="This site informs general public about COVID-19 with data visualization. It shows cases, testing, & vaccination statistics in Taiwan." />\n\
        \n\
        <!-- CSS & favicon -->\n\
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Roboto&display=swap" rel="stylesheet">\n\
        <link href="../css/template.css" rel="stylesheet" />\n\
        <link href="../css/plots.css" rel="stylesheet" />\n\
        <link href="../figures/favicon.png" rel="shortcut icon" />\n\
        \n\
        <!-- Metadata - variable part -->\n\
        <meta property="og:title" content="{page_name} | {site_name}" />\n\
        <meta property="og:url" content="http://covidtaiwan.linc.tw/{url}" />\n\
        <title>{page_name} | {site_name}</title>\n\
    </head>\n\
    \n\
    <body class="sb-nav-fixed">\n'.format(url=url, page_name=page_name, site_name=site_name)
  return str_
  
def makeStr_redirection():
  str_ = '\
        <!-- Redirection -->\n\
        <script>\n\
          window.location.replace("page/index.html");\n\
        </script>\n'
  return str_

def makeStr_sideBar_lang():
  site_abrv = 'COVID · TAIWAN'
  
  str_ = '\
        <!-- Navigation bar -->\n\
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-gray-dark">\n\
            <a class="navbar-brand ps-3" href="index.html">{site_abrv}</a>\n\
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#"><i class="fas fa-bars"></i></button>\n\
        </nav>\n\
        \n\
        <div id="layoutSidenav">\n\
            <!-- Side bar -->\n\
            <div id="layoutSidenav_nav">\n\
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">\n\
                    <div class="sb-sidenav-menu">\n\
                        <div class="nav">\n\
                            \n\
                            <!-- Language buttons -->\n\
                            <div class="sb-sidenav-menu-heading-nouppercase">\n\
                                <div class="btn-group-vertical btn-group-sm btn-group-toggle" data-toggle="buttons"> \n\
                                    <label id="menu_lang_en" class="btn btn-covid-white">\n\
                                        <input type="radio" class="btn-check" name="language" value="en">English<br>\n\
                                    </label>\n\
                                    <label id="menu_lang_fr" class="btn btn-covid-white">\n\
                                        <input type="radio" class="btn-check" name="language" value="fr">Français<br>\n\
                                    </label>\n\
                                    <label id="menu_lang_zh-tw" class="btn btn-covid-white">\n\
                                        <input type="radio" class="btn-check" name="language" value="zh-tw">正體中文<br>\n\
                                    </label>\n\
                                </div>\n\
                            </div>\n\
                            \n\
                            <!-- Menu -->\n\
                            <div class="sb-sidenav-menu-heading"></div>\n\
                            \n\
                            <a class="nav-link" href="index.html">\n\
                                <div class="sb-nav-link-icon"><i class="fas fa-home"></i></div>\n\
                                <span id="menu_index"></span>\n\
                            </a>\n'.format(site_abrv=site_abrv)
  return str_
  
def makeStr_sideBar_pages():
  str_ = '\
                            \n\
                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapse_latest" aria-expanded="false" aria-controls="collapse_latest">\n\
                                <div class="sb-nav-link-icon"><i class="fas fa-fast-forward"></i></div>\n\
                                <span id="menu_latest"></span>\n\
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>\n\
                            </a>\n\
                            <div class="collapse" id="collapse_latest" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">\n\
                                <nav class="sb-sidenav-menu-nested nav">\n\
                                    <a class="nav-link" href="latest_cases.html">\n\
                                        <span id="menu_latest_cases"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="latest_incidence.html">\n\
                                        <span id="menu_latest_incidence"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="latest_vaccination.html">\n\
                                        <span id="menu_latest_vaccination"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="latest_deaths.html">\n\
                                        <span id="menu_latest_deaths"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="latest_others.html">\n\
                                        <span id="menu_latest_others"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="latest_comparison.html">\n\
                                        <span id="menu_latest_comparison"></span>\n\
                                    </a>\n\
                                </nav>\n\
                            </div>\n\
                            \n\
                            <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapse_overall" aria-expanded="false" aria-controls="collapse_overall">\n\
                                <div class="sb-nav-link-icon"><i class="fas fa-calculator"></i></div>\n\
                                <span id="menu_overall"></span>\n\
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>\n\
                            </a>\n\
                            <div class="collapse" id="collapse_overall" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">\n\
                                <nav class="sb-sidenav-menu-nested nav">\n\
                                    <a class="nav-link" href="overall_cases.html">\n\
                                        <span id="menu_overall_cases"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="overall_incidence.html">\n\
                                        <span id="menu_overall_incidence"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="overall_vaccination.html">\n\
                                        <span id="menu_overall_vaccination"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="overall_deaths.html">\n\
                                        <span id="menu_overall_deaths"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="overall_others.html">\n\
                                        <span id="menu_overall_others"></span>\n\
                                    </a>\n\
                                    <a class="nav-link" href="overall_comparison.html">\n\
                                        <span id="menu_overall_comparison"></span>\n\
                                    </a>\n\
                                </nav>\n\
                            </div>\n'
  return str_

def makeStr_sideBar_socialMedia():
  str_ = '\
                            \n\
                            <a class="nav-link" href="timeline.html">\n\
                                <div class="sb-nav-link-icon"><i class="fas fa-hourglass-half"></i></div>\n\
                                <span id="menu_timeline"></span>\n\
                            </a>\n\
                            \n\
                            <a class="nav-link" href="data_source.html">\n\
                                <div class="sb-nav-link-icon"><i class="fas fa-database"></i></div>\n\
                                <span id="menu_source"></span>\n\
                            </a>\n\
                            \n\
                            <a class="nav-link" href="no_right_reserved.html">\n\
                                <div class="sb-nav-link-icon"><i class="fab fa-creative-commons-zero"></i></div>\n\
                                <span id="menu_copyleft"></span>\n\
                            </a>\n\
                            \n\
                        </div>\n\
                    </div>\n\
                    \n\
                    <!-- Social media -->\n\
                    <div class="sb-sidenav-footer-covid icon">\n\
                        <a href="https://github.com/Linc-tw/COVID_breakdown" target="_blank">\n\
                            <img src="../figures/GitHub-Mark-Light-64px.png" alt="GitHub"></img>\n\
                        </a>\n\
                        <span style="display:inline-block; width: 24px;"></span>\n\
                        <a href="https://twitter.com/Linc_tw" target="_blank">\n\
                            <img src="../figures/Twitter_Social_Icon_Circle_Color.png" alt="Twitter"></img>\n\
                        </a>\n\
                    </div>\n\
                </nav>\n\
            </div>\n'
  return str_

def makeStr_title(page_tag):
  str_ = '\
            \n\
            <div id="layoutSidenav_content">\n\
                <!-- Main body -->\n\
                <main>\n\
                    <div class="container-fluid px-4">\n\
                        <h1 id="title" class="mt-4"></h1>\n\
                        <h4 id="title_{page_tag}" class="mb-4"></h4>\n\
                        <div class="row">\n'.format(page_tag=page_tag)
  return str_

def makeStr_footer(page_tag):
  plot_list = PAGE_DICT[page_tag]['plot_list']
  plot_js_str = []
  
  for plot_abrv in plot_list:
    plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
    js_path = PLOT_DICT[plot_abrv]['js_path']
    
    str_ = '\
        <script src="../js/{js_path}{plot_tag}.js"></script>\n\
        <script src="../js/{js_path}{plot_tag}_param.js"></script>\n'.format(plot_tag=plot_tag, js_path=js_path)
    
    plot_js_str.append(str_)
    
  plot_js_str = ''.join(plot_js_str)
  
  if len(plot_list) > 0:
    main_js_str = '\
        <script src="../js/plot/plot_{page_tag}.js"></script>\n'.format(page_tag=page_tag)
  else:
    main_js_str = ''
  
  str_ = '\
                        \n\
                        </div>\n\
                    </div>\n\
                </main>\n\
                \n\
                <!-- Footer -->\n\
                <footer class="py-4 bg-light mt-auto">\n\
                    <div class="container-fluid px-4">\n\
                        <div class="d-flex align-items-center justify-content-between small">\n\
                            <span id="footer_last_update"></span>\n\
                        </div>\n\
                    </div>\n\
                </footer>\n\
            </div>\n\
        </div>\n\
        \n\
        <!-- External -->\n\
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>\n\
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>\n\
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js" crossorigin="anonymous"></script>\n\
        <script src="https://d3js.org/d3.v4.js"></script>\n\
        <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>\n\
        <script src="https://cdnjs.cloudflare.com/ajax/libs/javascript-canvas-to-blob/3.19.0/js/canvas-to-blob.min.js"></script>\n\
        <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js"></script>\n\
        <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js"></script>\n\
        \n\
        <!-- Google Analytics -->\n\
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-58898441-4"></script>\n\
        <script src="../js/utility/analytics.js"></script>\n\
        \n\
        <!-- Utilities -->\n\
        <script src="../js/utility/saveSvgAsPng.js"></script>\n\
        <script src="../js/utility/toggle_sidebar.js"></script>\n\
        <script src="../js/utility/language_setting.js"></script>\n\
        <script src="../js/utility/general_plotting.js"></script>\n\
        \n\
        <!-- Plots -->\n{plot_js_str}\
        \n\
        <!-- Main -->\n{main_js_str}\
        \n'.format(plot_js_str=plot_js_str, main_js_str=main_js_str)
  return str_

def makeStr_html_back():
  str_ = '\
    </body>\n</html>\n'
  return str_
  
################################################################################
## Functions - plots

def makeStr_cmtAndSaveBtn(plot_tag, gr_tag):
  if gr_tag is None:
    gr_tag = ''
  if gr_tag != '':
    gr_tag = '_' + gr_tag
    
  str_ = '\
                                            <button class="btn btn-sm btn-covid me-2" data-bs-toggle="collapse" data-bs-target="#{plot_tag}_collapse" aria-expanded="false" aria-controls="{plot_tag}_collapse">\n\
                                                <i class="fas fa-comment-alt"></i>\n\
                                            </button>\n\
                                            \n\
                                            <button id="{plot_tag}{gr_tag}_save" class="btn btn-sm btn-covid"><i class="fas fa-download"></i></button>\n'.format(plot_tag=plot_tag, gr_tag=gr_tag)
  return str_

def makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str):
  if gr_tag is None:
    gr_tag = ''
  if gr_tag != '':
    gr_tag = '_' + gr_tag
  
  if wdt_str is None:
    wdt_str = 'col-xl-6'
    
  str_ = '\
                            \n\
                            <!-- {plot_tag} -->\n\
                            <div class="{wdt_str}">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="fas {fontawe_str} me-1"></i> <span id="{plot_tag}_title"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div class="card-img">\n\
                                        <div class="btn-pos">\n{btn_str}\
                                        </div>\n\
                                    </div>\n\
                                    \n\
                                    <div class="collapse" id="{plot_tag}_collapse">\n\
                                        <div class="card-body">\n\
                                            <span id="{plot_tag}_description">\n\
                                        </div>\n\
                                    </div>\n\
                                    \n\
                                    <div class="card-body" id="{plot_tag}{gr_tag}"></div>\n\
                                </div>\n\
                            </div>\n'.format(plot_tag=plot_tag, gr_tag=gr_tag, fontawe_str=fontawe_str, btn_str=btn_str, wdt_str=wdt_str)
  return str_

def makeStr_noOtherBtn(plot_abrv, gr_tag):
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, cmt_save_btn)
  return str_

def makeStr_CC(gr_tag, index=False):
  plot_abrv = 'CC'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  if index:
    selected_0 = ''
    selected_2 = ' selected'
  else:
    selected_0 = ' selected'
    selected_2 = ''
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_cumul_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_daily"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_cumul_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=1>\n\
                                                    <span id="{plot_tag}_button_cumul"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_trans" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_trans">\n\
                                                <option value="0" id="{plot_tag}_button_total"{selected_0}></option>\n\
                                                <option value="1" id="{plot_tag}_button_imported"></option>\n\
                                                <option value="2" id="{plot_tag}_button_local"{selected_2}></option>\n\
                                                <option value="3" id="{plot_tag}_button_others"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, selected_0=selected_0, selected_2=selected_2, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_LCPC(gr_tag):
  plot_abrv = 'LCPC'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_cumul_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_daily"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_cumul_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=1>\n\
                                                    <span id="{plot_tag}_button_cumul"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_county" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_county">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_keelung"></option>\n\
                                                <option value="2" id="{plot_tag}_button_taipei"></option>\n\
                                                <option value="3" id="{plot_tag}_button_new_taipei"></option>\n\
                                                <option value="4" id="{plot_tag}_button_taoyuan"></option>\n\
                                                <option value="5" id="{plot_tag}_button_hsinchu"></option>\n\
                                                <option value="6" id="{plot_tag}_button_hsinchu_city"></option>\n\
                                                <option value="7" id="{plot_tag}_button_miaoli"></option>\n\
                                                <option value="8" id="{plot_tag}_button_taichung"></option>\n\
                                                <option value="9" id="{plot_tag}_button_changhua"></option>\n\
                                                <option value="10" id="{plot_tag}_button_nantou"></option>\n\
                                                <option value="11" id="{plot_tag}_button_yunlin"></option>\n\
                                                <option value="12" id="{plot_tag}_button_chiayi"></option>\n\
                                                <option value="13" id="{plot_tag}_button_chiayi_city"></option>\n\
                                                <option value="14" id="{plot_tag}_button_tainan"></option>\n\
                                                <option value="15" id="{plot_tag}_button_kaohsiung"></option>\n\
                                                <option value="16" id="{plot_tag}_button_pingtung"></option>\n\
                                                <option value="17" id="{plot_tag}_button_yilan"></option>\n\
                                                <option value="18" id="{plot_tag}_button_hualien"></option>\n\
                                                <option value="19" id="{plot_tag}_button_taitung"></option>\n\
                                                <option value="20" id="{plot_tag}_button_penghu"></option>\n\
                                                <option value="21" id="{plot_tag}_button_kinmen"></option>\n\
                                                <option value="22" id="{plot_tag}_button_matsu"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_CBA(gr_tag):
  plot_abrv = 'CBA'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  if gr_tag == 'latest':
    btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_period" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_period">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_w-1"></option>\n\
                                                <option value="2" id="{plot_tag}_button_w-2"></option>\n\
                                                <option value="3" id="{plot_tag}_button_w-3"></option>\n\
                                                <option value="4" id="{plot_tag}_button_w-4"></option>\n\
                                                <option value="5" id="{plot_tag}_button_w-5"></option>\n\
                                                <option value="6" id="{plot_tag}_button_w-6"></option>\n\
                                                <option value="7" id="{plot_tag}_button_w-7"></option>\n\
                                                <option value="8" id="{plot_tag}_button_w-8"></option>\n\
                                                <option value="9" id="{plot_tag}_button_w-9"></option>\n\
                                                <option value="10" id="{plot_tag}_button_w-10"></option>\n\
                                                <option value="11" id="{plot_tag}_button_w-11"></option>\n\
                                                <option value="12" id="{plot_tag}_button_w-12"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  ## new_year_token
  elif gr_tag == 'overall':
    btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_year" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_year">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_2020"></option>\n\
                                                <option value="2" id="{plot_tag}_button_2021"></option>\n\
                                                <option value="3" id="{plot_tag}_button_2022"></option>\n\
                                                <option value="4" id="{plot_tag}_button_2023"></option>\n\
                                            </select>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_month" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_month">\n\
                                                <option value="0" id="{plot_tag}_button_all_year" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_m1"></option>\n\
                                                <option value="2" id="{plot_tag}_button_m2"></option>\n\
                                                <option value="3" id="{plot_tag}_button_m3"></option>\n\
                                                <option value="4" id="{plot_tag}_button_m4"></option>\n\
                                                <option value="5" id="{plot_tag}_button_m5"></option>\n\
                                                <option value="6" id="{plot_tag}_button_m6"></option>\n\
                                                <option value="7" id="{plot_tag}_button_m7"></option>\n\
                                                <option value="8" id="{plot_tag}_button_m8"></option>\n\
                                                <option value="9" id="{plot_tag}_button_m9"></option>\n\
                                                <option value="10" id="{plot_tag}_button_m10"></option>\n\
                                                <option value="11" id="{plot_tag}_button_m11"></option>\n\
                                                <option value="12" id="{plot_tag}_button_m12"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_IR(gr_tag):
  return makeStr_noOtherBtn('IR', gr_tag)

def makeStr_IM(gr_tag):
  plot_abrv = 'IM'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  if gr_tag == 'latest':
    btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_rate_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_count"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_rate_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=1>\n\
                                                    <span id="{plot_tag}_button_rate"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_period" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_period">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_w-1"></option>\n\
                                                <option value="2" id="{plot_tag}_button_w-2"></option>\n\
                                                <option value="3" id="{plot_tag}_button_w-3"></option>\n\
                                                <option value="4" id="{plot_tag}_button_w-4"></option>\n\
                                                <option value="5" id="{plot_tag}_button_w-5"></option>\n\
                                                <option value="6" id="{plot_tag}_button_w-6"></option>\n\
                                                <option value="7" id="{plot_tag}_button_w-7"></option>\n\
                                                <option value="8" id="{plot_tag}_button_w-8"></option>\n\
                                                <option value="9" id="{plot_tag}_button_w-9"></option>\n\
                                                <option value="10" id="{plot_tag}_button_w-10"></option>\n\
                                                <option value="11" id="{plot_tag}_button_w-11"></option>\n\
                                                <option value="12" id="{plot_tag}_button_w-12"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  ## new_year_token
  elif gr_tag == 'overall':
    btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_rate_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_count"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_rate_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=1>\n\
                                                    <span id="{plot_tag}_button_rate"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_year" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_year">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_2020"></option>\n\
                                                <option value="2" id="{plot_tag}_button_2021"></option>\n\
                                                <option value="3" id="{plot_tag}_button_2022"></option>\n\
                                                <option value="4" id="{plot_tag}_button_2023"></option>\n\
                                            </select>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_month" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_month">\n\
                                                <option value="0" id="{plot_tag}_button_all_year" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_m1"></option>\n\
                                                <option value="2" id="{plot_tag}_button_m2"></option>\n\
                                                <option value="3" id="{plot_tag}_button_m3"></option>\n\
                                                <option value="4" id="{plot_tag}_button_m4"></option>\n\
                                                <option value="5" id="{plot_tag}_button_m5"></option>\n\
                                                <option value="6" id="{plot_tag}_button_m6"></option>\n\
                                                <option value="7" id="{plot_tag}_button_m7"></option>\n\
                                                <option value="8" id="{plot_tag}_button_m8"></option>\n\
                                                <option value="9" id="{plot_tag}_button_m9"></option>\n\
                                                <option value="10" id="{plot_tag}_button_m10"></option>\n\
                                                <option value="11" id="{plot_tag}_button_m11"></option>\n\
                                                <option value="12" id="{plot_tag}_button_m12"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_IEBC(gr_tag):
  return makeStr_noOtherBtn('IEBC', gr_tag)

def makeStr_IEBA(gr_tag):
  return makeStr_noOtherBtn('IEBA', gr_tag)

def makeStr_VBB(gr_tag):
  plot_abrv = 'VBB'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_cumul_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_daily"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_cumul_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=1>\n\
                                                    <span id="{plot_tag}_button_cumul"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_brand" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_brand">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_AZ"></option>\n\
                                                <option value="2" id="{plot_tag}_button_Moderna"></option>\n\
                                                <option value="3" id="{plot_tag}_button_Medigen"></option>\n\
                                                <option value="4" id="{plot_tag}_button_Pfizer"></option>\n\
                                                <option value="5" id="{plot_tag}_button_Novavax"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_VP(gr_tag):
  plot_abrv = 'VP'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_brand" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_brand">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_AZ"></option>\n\
                                                <option value="2" id="{plot_tag}_button_Moderna"></option>\n\
                                                <option value="3" id="{plot_tag}_button_Medigen"></option>\n\
                                                <option value="4" id="{plot_tag}_button_Pfizer"></option>\n\
                                                <option value="5" id="{plot_tag}_button_Novavax"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_VBD(gr_tag):
  return makeStr_noOtherBtn('VBD', gr_tag)

def makeStr_VBA(gr_tag):
  return makeStr_noOtherBtn('VBA', gr_tag)

def makeStr_VBC(gr_tag):
  plot_abrv = 'VBC'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_sort" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_sort">\n\
                                                <option value="0" id="{plot_tag}_button_geo"></option>\n\
                                                <option value="1" id="{plot_tag}_button_1st" selected></option>\n\
                                                <option value="2" id="{plot_tag}_button_2nd"></option>\n\
                                                <option value="3" id="{plot_tag}_button_3rd"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_TC(gr_tag):
  plot_abrv = 'TC'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_cumul_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_daily"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_cumul_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=1>\n\
                                                    <span id="{plot_tag}_button_cumul"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_TPR(gr_tag):
  return makeStr_noOtherBtn('TPR', gr_tag)

def makeStr_DC(gr_tag):
  plot_abrv = 'DC'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_cumul_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_daily"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_cumul_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_cumul" value=1>\n\
                                                    <span id="{plot_tag}_button_cumul"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_CFR(gr_tag):
  return makeStr_noOtherBtn('CFR', gr_tag)

def makeStr_DD(gr_tag):
  plot_abrv = 'DD'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  if gr_tag == 'latest':
    btn_str = cmt_save_btn
  
  ## new_year_token
  elif gr_tag == 'overall':
    btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_year" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_year">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_2020"></option>\n\
                                                <option value="2" id="{plot_tag}_button_2021"></option>\n\
                                                <option value="3" id="{plot_tag}_button_2022"></option>\n\
                                                <option value="4" id="{plot_tag}_button_2023"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_DBA(gr_tag):
  plot_abrv = 'DBA'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  ## new_year_token
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_rate_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_count"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_rate_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_rate" value=1>\n\
                                                    <span id="{plot_tag}_button_rate"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_year" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_year">\n\
                                                <option value="0" id="{plot_tag}_button_total" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_2020"></option>\n\
                                                <option value="2" id="{plot_tag}_button_2021"></option>\n\
                                                <option value="3" id="{plot_tag}_button_2022"></option>\n\
                                                <option value="4" id="{plot_tag}_button_2023"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_BS(gr_tag):
  plot_abrv = 'BS'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_{gr_tag}_exit_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_exit" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_entry"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_exit_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_exit" value=1>\n\
                                                    <span id="{plot_tag}_button_exit"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_{gr_tag}_exit_2">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_{gr_tag}_exit" value=2>\n\
                                                    <span id="{plot_tag}_button_total"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_SIM(gr_tag):
  plot_abrv = 'SIM'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str'][gr_tag]
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <select id="{plot_tag}_{gr_tag}_stat_0" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_stat_0">\n\
                                                <option value="0" id="{plot_tag}_button_total_case_0" selected></option>\n\
                                                <option value="1" id="{plot_tag}_button_imported_case_0"></option>\n\
                                                <option value="2" id="{plot_tag}_button_local_case_0"></option>\n\
                                                <option value="3" id="{plot_tag}_button_local_incidence_0"></option>\n\
                                                <option value="4" id="{plot_tag}_button_vaccination_0"></option>\n\
                                                <option value="5" id="{plot_tag}_button_1st_dose_0"></option>\n\
                                                <option value="6" id="{plot_tag}_button_2nd_dose_0"></option>\n\
                                                <option value="7" id="{plot_tag}_button_3rd_dose_0"></option>\n\
                                                <option value="8" id="{plot_tag}_button_4th_dose_0"></option>\n\
                                                <option value="9" id="{plot_tag}_button_death_0"></option>\n\
                                                <option value="10" id="{plot_tag}_button_weekly_fatality_0"></option>\n\
                                                <option value="11" id="{plot_tag}_button_cumulative_fatality_0"></option>\n\
                                                <option value="12" id="{plot_tag}_button_test_0"></option>\n\
                                                <option value="13" id="{plot_tag}_button_positivity_0"></option>\n\
                                            </select>\n\
                                            \n\
                                            <select id="{plot_tag}_{gr_tag}_stat_1" class="form-select form-select-sm me-2" aria-label="{plot_tag}_{gr_tag}_stat_1">\n\
                                                <option value="0" id="{plot_tag}_button_total_case_1"></option>\n\
                                                <option value="1" id="{plot_tag}_button_imported_case_1"></option>\n\
                                                <option value="2" id="{plot_tag}_button_local_case_1"></option>\n\
                                                <option value="3" id="{plot_tag}_button_local_incidence_1"></option>\n\
                                                <option value="4" id="{plot_tag}_button_vaccination_1"></option>\n\
                                                <option value="5" id="{plot_tag}_button_1st_dose_1"></option>\n\
                                                <option value="6" id="{plot_tag}_button_2nd_dose_1"></option>\n\
                                                <option value="7" id="{plot_tag}_button_3rd_dose_1"></option>\n\
                                                <option value="8" id="{plot_tag}_button_4th_dose_1"></option>\n\
                                                <option value="9" id="{plot_tag}_button_death_1" selected></option>\n\
                                                <option value="10" id="{plot_tag}_button_weekly_fatality_1"></option>\n\
                                                <option value="11" id="{plot_tag}_button_cumulative_fatality_1"></option>\n\
                                                <option value="12" id="{plot_tag}_button_test_1"></option>\n\
                                                <option value="13" id="{plot_tag}_button_positivity_1"></option>\n\
                                            </select>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, gr_tag=gr_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_CT():
  plot_abrv = 'CT'
  gr_tag = ''
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_full_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_full" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_selected"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_full_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_full" value=1>\n\
                                                    <span id="{plot_tag}_button_full"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_timeline_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_timeline" value=1 checked>\n\
                                                    <span id="{plot_tag}_button_axis"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_timeline_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_timeline" value=0>\n\
                                                    <span id="{plot_tag}_button_disk"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_
                                            
def makeStr_ET(gr_tag):
  plot_abrv = 'ET'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag'] + '_' + gr_tag
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str'][gr_tag]
  gr_tag = ''
  cmt_save_btn = makeStr_cmtAndSaveBtn(plot_tag, gr_tag)
  
  btn_str = '\
                                            <div class="btn-group btn-group-sm btn-group-toggle me-2" data-toggle="buttons">\n\
                                                <label class="btn btn-covid active" id="{plot_tag}_start_0">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_start" value=0 checked>\n\
                                                    <span id="{plot_tag}_button_sun"></span>\n\
                                                </label>\n\
                                                <label class="btn btn-covid" id="{plot_tag}_start_1">\n\
                                                    <input type="radio" class="btn-check" name="{plot_tag}_start" value=1>\n\
                                                    <span id="{plot_tag}_button_mon"></span>\n\
                                                </label>\n\
                                            </div>\n\
                                            \n{cmt_save_btn}'.format(plot_tag=plot_tag, cmt_save_btn=cmt_save_btn)
  
  str_ = makeStr_plot(plot_tag, gr_tag, wdt_str, fontawe_str, btn_str)
  return str_

def makeStr_DS():
  plot_abrv = 'DS'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  
  str_ = '\
                            \n\
                            <!-- {plot_tag}_original -->\n\
                            <div class="{wdt_str}">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="fas {fontawe_str_0} me-1"></i>\n\
                                        <span id="{plot_tag}_original_title"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div id="{plot_tag}_original_body" class="card-body" style="text-align: justify;"></div>\n\
                                </div>\n\
                            </div>\n\
                            \n\
                            <!-- {plot_tag}_raw -->\n\
                            <div class="{wdt_str}">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="fas {fontawe_str_1} me-1"></i>\n\
                                        <span id="{plot_tag}_raw_title"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div id="{plot_tag}_raw_body" class="card-body" style="text-align: justify;"></div>\n\
                                </div>\n\
                            </div>\n\
                            \n\
                            <!-- {plot_tag}_processed -->\n\
                            <div class="{wdt_str}">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="fas {fontawe_str_2} me-1"></i>\n\
                                        <span id="{plot_tag}_processed_title"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div id="{plot_tag}_processed_body" class="card-body" style="text-align: justify;"></div>\n\
                                </div>\n\
                            </div>\n\
                            \n'.format(plot_tag=plot_tag, fontawe_str_0=fontawe_str[0], fontawe_str_1=fontawe_str[1], fontawe_str_2=fontawe_str[2], wdt_str=wdt_str)
  return str_

def makeStr_NRR():
  plot_abrv = 'NRR'
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  wdt_str = PLOT_DICT[plot_abrv]['wdt_str']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  
  str_ = '\
                            \n\
                            <!-- {plot_tag} -->\n\
                            <div class="{wdt_str}">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="far {fontawe_str} me-1"></i> <span id="{plot_tag}_title"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div id="{plot_tag}_body" class="card-body" style="text-align: justify;"></div>\n\
                                </div>\n\
                            </div>\n'.format(plot_tag=plot_tag, fontawe_str=fontawe_str, wdt_str=wdt_str)
  return str_

def makeStr_vignette(plot_abrv, cate_tag):
  plot_tag = PLOT_DICT[plot_abrv]['plot_tag']
  fontawe_str = PLOT_DICT[plot_abrv]['fontawe_str']
  gr_tag_list = ['latest', 'overall']
  vignette_str = []
  
  for gr_tag in gr_tag_list:
    page_tag = gr_tag + '_' + cate_tag
    str_ = '\
                                            <a href="{page_tag}.html" class="btn btn-covid">\n\
                                                <span id="vignette_{page_tag}"></span>\n\
                                            </a>\n'.format(page_tag=page_tag)
    vignette_str.append(str_)
  
  vignette_str = ''.join(vignette_str)
  
  str_ = '\
                            \n\
                            <!-- Vignettes - {plot_tag} -->\n\
                            <div class="col-xl-3 col-sm-6">\n\
                                <div class="card mb-4">\n\
                                    <div class="card-header">\n\
                                        <i class="fas {fontawe_str} me-1"></i> <span id="vignette_title_{cate_tag}"></span>\n\
                                    </div>\n\
                                    \n\
                                    <div class="card-body" id="{plot_tag}_mini"></div>\n\
                                    \n\
                                    <div class="card-img">\n\
                                        <div class="btn-vignette d-grid gap-2 col-6 mx-auto">\n{vignette_str}\
                                        </div>\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n'.format(plot_tag=plot_tag, cate_tag=cate_tag, fontawe_str=fontawe_str, vignette_str=vignette_str)
  return str_
                            
################################################################################
## Functions - save

def saveHtml_page(page_tag, verbose=True):
  if page_tag == 'home':
    name = 'index.html'
  else:
    name = 'page/{page_tag}.html'.format(page_tag=page_tag)
    
  f = open(name, 'w')
  f.write(makeStr_header(page_tag))
  f.write(makeStr_html_front(page_tag))
  
  if page_tag == 'home':
    f.write(makeStr_redirection())
  else:
    f.write(makeStr_sideBar_lang())
    f.write(makeStr_sideBar_pages())
    f.write(makeStr_sideBar_socialMedia())
    f.write(makeStr_title(page_tag))
    
    if page_tag == 'index':
      f.write(makeStr_CC('latest', index=True))
      f.write(makeStr_VBD('latest'))
      f.write(makeStr_vignette('CC', 'cases'))
      f.write(makeStr_vignette('IR', 'incidence'))
      f.write(makeStr_vignette('VBB', 'vaccination'))
      f.write(makeStr_vignette('DC', 'deaths'))
      f.write(makeStr_vignette('TC', 'others'))
      f.write(makeStr_vignette('SIM', 'comparison'))
    
    elif page_tag == 'timeline':
      f.write(makeStr_CT())
      f.write(makeStr_ET('2020'))
      f.write(makeStr_ET('2022'))
      f.write(makeStr_ET('2024'))
      ## new_year_token
    
    elif page_tag == 'data_source':
      f.write(makeStr_DS())
    
    elif page_tag == 'no_right_reserved':
      f.write(makeStr_NRR())
    
    else:
      gr_tag, cate_tag = page_tag.split('_')
      
      if cate_tag == 'cases':
        f.write(makeStr_CC(gr_tag, index=False))
        f.write(makeStr_LCPC(gr_tag))
        f.write(makeStr_CBA(gr_tag))
        
      elif cate_tag == 'incidence':
        f.write(makeStr_IR(gr_tag))
        f.write(makeStr_IM(gr_tag))
        if gr_tag == 'latest':
          f.write(makeStr_IEBC(gr_tag))
          f.write(makeStr_IEBA(gr_tag))
      
      elif cate_tag == 'vaccination':
        f.write(makeStr_VBB(gr_tag))
        f.write(makeStr_VP(gr_tag))
        f.write(makeStr_VBD(gr_tag))
        if gr_tag == 'latest':
          f.write(makeStr_VBA(gr_tag))
          f.write(makeStr_VBC(gr_tag))
          
      elif cate_tag == 'deaths':
        f.write(makeStr_DC(gr_tag))
        f.write(makeStr_CFR(gr_tag))
        f.write(makeStr_DD(gr_tag))
        if gr_tag == 'overall':
          f.write(makeStr_DBA(gr_tag))
      
      elif cate_tag == 'others':
        f.write(makeStr_TC(gr_tag))
        f.write(makeStr_TPR(gr_tag))
        if gr_tag == 'overall':
          f.write(makeStr_BS(gr_tag))
      
      elif cate_tag == 'comparison':
        f.write(makeStr_SIM(gr_tag))
    
    f.write(makeStr_footer(page_tag))
  
  f.write(makeStr_html_back())
  f.close()
  
  if verbose:
    print('Saved \"{}\"'.format(name))
  return

def saveHtml_all(verbose=True):
  saveHtml_page('home')
  for page_tag in PAGE_DICT.keys():
    saveHtml_page(page_tag)
  return

## End of file
################################################################################
