
    ##########################################
    ##  COVID_breakdown_data_processing.py  ##
    ##  Chieh-An Lin                        ##
    ##  Version 2021.07.18                  ##
    ##########################################

import os
import sys
import warnings
import collections as clt
import datetime as dtt
import copy
import json

import numpy as np
import scipy as sp
import scipy.signal as signal
import matplotlib as mpl
import pandas as pd

################################################################################
## Parameters

DATA_PATH = '/home/linc/21_Codes/COVID_breakdown/'
ISO_DATE_REF = '2020-01-01'
ISO_DATE_REF_VACC = '2021-03-01'
NB_LOOKBACK_DAYS = 90
PAGE_LATEST = 'latest'
PAGE_OVERALL = 'overall'
PAGE_2022 = '2022'
PAGE_2021 = '2021'
PAGE_2020 = '2020'
PAGE_LIST = [PAGE_LATEST, PAGE_OVERALL, PAGE_2021, PAGE_2020]

SYMPTOM_DICT = {
  'sneezing': {'zh-tw': '鼻腔症狀', 'fr': 'éternuement'},
  'cough': {'zh-tw': '咳嗽', 'fr': 'toux'},
  'throatache': {'zh-tw': '喉嚨症狀', 'fr': 'mal de gorge'},
  'earache': {'zh-tw': '耳朵痛', 'fr': 'otalgie'},
  'dyspnea': {'zh-tw': '呼吸困難', 'fr': 'dyspnée'}, 
  'bronchitis': {'zh-tw': '支氣管炎', 'fr': 'bronchite'},
  'pneumonia': {'zh-tw': '肺炎', 'fr': 'pneumonie'}, 
  
  'fever': {'zh-tw': '發燒', 'fr': 'fièvre'},
  'chills': {'zh-tw': '畏寒', 'fr': 'frissons'}, 
  
  'nausea': {'zh-tw': '噁心', 'fr': 'nausée'},
  'vomiting': {'zh-tw': '嘔吐', 'fr': 'vomissement'},
  'diarrhea': {'zh-tw': '腹瀉', 'fr': 'diarrhée'}, 
  
  'headache': {'zh-tw': '頭痛', 'fr': 'mal de tête'},
  'eyes sore': {'zh-tw': '眼痛', 'fr': 'mal aux yeux'}, 
  'chest pain': {'zh-tw': '胸痛', 'fr': 'mal à la poitrine'}, 
  'stomachache': {'zh-tw': '腹痛', 'fr': 'mal de ventre'},
  'backache': {'zh-tw': '背痛', 'fr': 'mal de dos'}, 
  'toothache': {'zh-tw': '牙痛', 'fr': 'mal de dents'}, 
  'rash': {'zh-tw': '出疹', 'fr': 'rash'},
  
  'fatigue': {'zh-tw': '倦怠', 'fr': 'fatigue'},
  'soreness': {'zh-tw': '痠痛', 'fr': 'myalgie'},
  'hypersomnia': {'zh-tw': '嗜睡', 'fr': 'hypersomnie'},
  'insomnia': {'zh-tw': '失眠', 'fr': 'insomnie'},
  
  'dysnosmia': {'zh-tw': '嗅覺異常', 'fr': 'dysosmie'}, 
  'dysgeusia': {'zh-tw': '味覺異常', 'fr': 'dysgueusie'},
  
  'tonsillitis': {'zh-tw': '淋巴腫脹', 'fr': 'adénopathie'}, 
  'hypoglycemia': {'zh-tw': '低血糖', 'fr': 'hypoglycémie'}, 
  'hypoxemia': {'zh-tw': '低血氧', 'fr': 'hypoxémie'},
  'anorexia': {'zh-tw': '食慾不佳', 'fr': 'anorexie'},
  'arrhythmia': {'zh-tw': '心律不整', 'fr': 'arythmie'},
  'coma': {'zh-tw': '意識不清', 'fr': 'coma'},
  
  'symptomatic': {'zh-tw': '有症狀', 'fr': 'symptomatique'},
  'asymptomatic': {'zh-tw': '無症狀', 'fr': 'asymptomatique'} 
}

TRAVEL_HISTORY_DICT = {
  ## Far-East Asia
  'Bangladesh': {'zh-tw': '孟加拉', 'fr': 'Bangladesh'},
  'Cambodia': {'zh-tw': '柬埔寨', 'fr': 'Cambodge'},
  'China': {'zh-tw': '中國', 'fr': 'Chine'},
  'Hong Kong': {'zh-tw': '香港', 'fr': 'Hong Kong'},
  'Indonesia': {'zh-tw': '印尼', 'fr': 'Indonésie'},
  'India': {'zh-tw': '印度', 'fr': 'Inde'},
  'Japan': {'zh-tw': '日本', 'fr': 'Japon'},
  'Korea': {'zh-tw': '韓國', 'fr': 'Corée'},
  'Macao': {'zh-tw': '澳門', 'fr': 'Macao'},
  'Malaysia': {'zh-tw': '馬來西亞', 'fr': 'Malaisie'},
  'Myanmar': {'zh-tw': '緬甸', 'fr': 'Myanmar'},
  'Nepal': {'zh-tw': '尼泊爾', 'fr': 'Népal'},
  'Pakistan': {'zh-tw': '巴基斯坦', 'fr': 'Pakistan'},
  'Philippines': {'zh-tw': '菲律賓', 'fr': 'Philippines'},
  'Singapore': {'zh-tw': '新加坡', 'fr': 'Singapour'},
  'Thailand': {'zh-tw': '泰國', 'fr': 'Thaïlande'},
  'Vietnam': {'zh-tw': '越南', 'fr': 'Vietnam'},
  
  ## West & Central Asia
  'Kazakhstan': {'zh-tw': '哈薩克', 'fr': 'Kazakhstan'}, 
  'Kyrgyzstan': {'zh-tw': '吉爾吉斯', 'fr': 'Kirghizistan'},
  'Oman': {'zh-tw': '阿曼', 'fr': 'Oman'},
  'Qatar': {'zh-tw': '卡達', 'fr': 'Qatar'},
  'Saudi Arabia': {'zh-tw': '沙烏地阿拉伯', 'fr': 'Arabie saoudite'},
  'Syria': {'zh-tw': '敘利亞', 'fr': 'Syrie'}, 
  'Turkey': {'zh-tw': '土耳其', 'fr': 'Turquie'},
  'UAE': {'zh-tw': '阿拉伯聯合大公國', 'fr': 'EAU'},
  'Uzbekistan': {'zh-tw': '烏茲別克',  'fr': 'Ouzbékistan'},
  
  ## Europe
  'Europe': {'zh-tw': '歐洲', 'fr': 'Europe'},
  'Albania': {'zh-tw': '阿爾巴尼亞', 'fr': 'Albanie'}, 
  'Austria': {'zh-tw': '奧地利', 'fr': 'Autriche'},
  'Belarus': {'zh-tw': '白俄羅斯', 'fr': 'Biélorussie'},
  'Belgium': {'zh-tw': '比利時', 'fr': 'Belgique'},
  'Bulgaria': {'zh-tw': '保加利亞', 'fr': 'Bulgarie'},
  'Croatia': {'zh-tw': '克羅埃西亞', 'fr': 'Croatie'},
  'Czechia': {'zh-tw': '捷克', 'fr': 'Tchéquie'},
  'Danmark': {'zh-tw': '丹麥', 'fr': 'Danemark'},
  'Finland': {'zh-tw': '芬蘭', 'fr': 'Finlande'},
  'France': {'zh-tw': '法國', 'fr': 'France'},
  'Germany': {'zh-tw': '德國', 'fr': 'Allemagne'},
  'Greece': {'zh-tw': '希臘', 'fr': 'Grèce'},
  'Iceland': {'zh-tw': '冰島', 'fr': 'Islande'},
  'Ireland': {'zh-tw': '愛爾蘭', 'fr': 'Irlande'},
  'Italy': {'zh-tw': '義大利', 'fr': 'Italie'},
  'Hungary': {'zh-tw': '匈牙利',  'fr': 'Hongrie'},
  'Luxemburg': {'zh-tw': '盧森堡', 'fr': 'Luxembourg'},
  'Netherlands': {'zh-tw': '荷蘭', 'fr': 'Pays-Bas'},
  'Poland': {'zh-tw': '波蘭', 'fr': 'Pologne'},
  'Portugal': {'zh-tw': '葡萄牙', 'fr': 'Portugal'},
  'Russia': {'zh-tw': '俄羅斯', 'fr': 'Russie'},
  'Slovakia': {'zh-tw': '斯洛伐克', 'fr': 'Slovaquie'},
  'Spain': {'zh-tw': '西班牙', 'fr': 'Espagne'},
  'Switzerland': {'zh-tw': '瑞士', 'fr': 'Suisse'},
  'UK': {'zh-tw': '英國', 'fr': 'Royaume-Uni'},
  'Ukraine': {'zh-tw': '烏克蘭', 'fr': 'Ukraine'},
  
  ## Africa
  'Africa': {'zh-tw': '非洲', 'fr': 'Afrique'},
  'Cameroon': {'zh-tw': '喀麥隆', 'fr': 'Cameroun'},
  'Eswatini': {'zh-tw': '史瓦帝尼', 'fr': 'Eswatini'},
  'Egypt': {'zh-tw': '埃及', 'fr': 'Égypte'},
  'Ethiopia': {'zh-tw': '衣索比亞', 'fr': 'Éthiopie'},
  'Ghana': {'zh-tw': '迦納', 'fr': 'Ghana'},
  'Lesotho': {'zh-tw': '賴索托', 'fr': 'Lesotho'},
  'Morocco': {'zh-tw': '摩洛哥', 'fr': 'Maroc'},
  'Nigeria': {'zh-tw': '奈及利亞', 'fr': 'Nigéria'}, 
  'Senegal': {'zh-tw': '塞內加爾', 'fr': 'Sénégal'},
  'South Africa': {'zh-tw': '南非', 'fr': 'Afrique du Sud'},
  'Tunisia': {'zh-tw': '突尼西亞', 'fr': 'Tunisie'},
  'Uganda': {'zh-tw': '烏干達', 'fr': 'Ouganda'},
  
  ## North & South America
  'Argentina': {'zh-tw': '阿根廷', 'fr': 'Argentine'},
  'Bolivia': {'zh-tw': '玻利維亞', 'fr': 'Bolivie'},
  'Brazil': {'zh-tw': '巴西', 'fr': 'Brésil'},
  'Canada': {'zh-tw': '加拿大', 'fr': 'Canada'},
  'Chile': {'zh-tw': '智利', 'fr': 'Chili'},
  'Dominican Republic': {'zh-tw': '多明尼加', 'fr': 'République dominicaine'},
  'Guatemala': {'zh-tw': '瓜地馬拉', 'fr': 'Guatemala'}, 
  'Haiti': {'zh-tw': '海地', 'fr': 'Haïti'}, 
  'Honduras': {'zh-tw': '宏都拉斯', 'fr': 'Honduras'}, 
  'Latin America': {'zh-tw': '中南美洲', 'fr': 'Amérique latine'},
  'Mexico': {'zh-tw': '墨西哥', 'fr': 'Mexique'},
  'Paraguay': {'zh-tw': '巴拉圭', 'fr': 'Paraguay'},
  'Peru': {'zh-tw': '秘魯', 'fr': 'Pérou'},
  'USA': {'zh-tw': '美國', 'fr': 'États-Unis'},
  
  ## Oceania
  'Australia': {'zh-tw': '澳洲', 'fr': 'Australie'},
  'Marshall Islands': {'zh-tw': '馬紹爾', 'fr': 'Îles Marshall'},
  'New Zealand': {'zh-tw': '紐西蘭', 'fr': 'Nouvelle-Zélande'},
  'Palau': {'zh-tw': '帛琉', 'fr': 'Palaos'},
  
  ## Others
  'Antarctica': {'zh-tw': '南極', 'fr': 'Antartique'},
  'Coral Princess': {'zh-tw': '珊瑚公主號', 'fr': 'Coral Princess'},
  'Diamond Princess': {'zh-tw': '鑽石公主號', 'fr': 'Diamond Princess'}, 
  'Pan-Shi': {'zh-tw': '磐石艦', 'fr': 'Pan-Shi'},
  'local': {'zh-tw': '無', 'fr': 'local'}
}

AGE_DICT = {
  '0s': {'zh-tw': '0-9歲', 'fr': '0-9 ans'},
  '10s': {'zh-tw': '10-19歲', 'fr': '10aine'},
  '20s': {'zh-tw': '20-29歲', 'fr': '20aine'},
  '30s': {'zh-tw': '30-39歲', 'fr': '30aine'},
  '40s': {'zh-tw': '40-49歲', 'fr': '40aine'},
  '50s': {'zh-tw': '50-59歲', 'fr': '50aine'},
  '60s': {'zh-tw': '60-69歲', 'fr': '60aine'},
  '70s': {'zh-tw': '70-79歲', 'fr': '70aine'},
  '80s': {'zh-tw': '80-89歲', 'fr': '80aine'},
  '90s': {'zh-tw': '90-99歲', 'fr': '90aine'},
  '100+': {'zh-tw': '100+歲', 'fr': '100+'},
}

AGE_DICT_2 = {
  'label': {
    '0-4': {'zh-tw': '0-4歲', 'fr': '0-4 ans', 'en': '0-4 yo'}, 
    '5-9': {'zh-tw': '5-9歲', 'fr': '5-9 ans', 'en': '5-9 yo'}, 
    '10-14': {'zh-tw': '10-14歲', 'fr': '10-14 ans', 'en': '10-14 yo'}, 
    '15-19': {'zh-tw': '15-19歲', 'fr': '15-19 ans', 'en': '15-19 yo'}, 
    '20-24': {'zh-tw': '20-24歲', 'fr': '20-24 ans', 'en': '20-24 yo'}, 
    '25-29': {'zh-tw': '25-29歲', 'fr': '25-29 ans', 'en': '25-29 yo'}, 
    '30-34': {'zh-tw': '30-34歲', 'fr': '30-34 ans', 'en': '30-34 yo'}, 
    '35-39': {'zh-tw': '35-39歲', 'fr': '35-39 ans', 'en': '35-39 yo'}, 
    '40-44': {'zh-tw': '40-44歲', 'fr': '40-44 ans', 'en': '40-44 yo'}, 
    '45-49': {'zh-tw': '45-49歲', 'fr': '45-49 ans', 'en': '45-49 yo'}, 
    '50-54': {'zh-tw': '50-54歲', 'fr': '50-54 ans', 'en': '50-54 yo'}, 
    '55-59': {'zh-tw': '55-59歲', 'fr': '55-59 ans', 'en': '55-59 yo'}, 
    '60-64': {'zh-tw': '60-64歲', 'fr': '60-64 ans', 'en': '60-64 yo'}, 
    '65-69': {'zh-tw': '65-69歲', 'fr': '65-69 ans', 'en': '65-69 yo'}, 
    '70+': {'zh-tw': '70+歲', 'fr': '70+ ans', 'en': '70+ yo'},
    'total': {'zh-tw': '全國', 'fr': 'National', 'en': 'Nationalwide'},
  },
  
  '2019': {
    '0-4': 975801, '5-9': 1019322, '10-14': 1015228, '15-19': 1254141, '20-24': 1514105, '25-29': 1609454, 
    '30-34': 1594132, '35-39': 1964945, '40-44': 1974288, '45-49': 1775328, '50-54': 1814146, '55-59': 1827585, 
    '60-64': 1657519, '65-69': 1379517, '70-74': 800166, '75-79': 609634, '80-84': 426615, '85-89': 250664, 
    '90-94': 111099, '95-99': 25626, '100+': 3806, 
  },
  
  '2020': {
    '0-4': 925302, '5-9': 1064186, '10-14': 973908, '15-19': 1154426, '20-24': 1494883, '25-29': 1597613, 
    '30-34': 1583943, '35-39': 1894274, '40-44': 2016609, '45-49': 1760217, '50-54': 1806643, '55-59': 1824832,
    '60-64': 1677085, '65-69': 1445839, '70-74': 902349, '75-79': 588493, '80-84': 445423, '85-89': 255428,
    '90-94': 117104, '95-99': 28437, '100+': 4242,
  },
}

COUNTY_DICT = {
  '00000': dict( ## Total
    tag = 'total', 
    label = ['Nationalwide', 'National', '全國'], 
    population = 23588597,
  ),
  
  ## Metropole
  '63000': dict( ## Taipei
    tag = 'Taipei', 
    label = ['Taipei', 'Taipei', '台北'], 
    population = 2635286,
  ),
  '64000': dict( ## Kaohsiung
    tag = 'Kaohsiung', 
    label = ['Kaohsiung', 'Kaohsiung', '高雄'],
    population = 2773984,
  ),
  '65000': dict( ## New_Taipei
    tag = 'New_Taipei', 
    label = ['New Taipei', 'Nouveau Taipei', '新北'],
    population = 4023620,
  ),
  '66000': dict( ## Taichung
    tag = 'Taichung',
    label = ['Taichung', 'Taichung', '台中'],
    population = 2816667,
  ),
  '67000': dict( ## Tainan
    tag = 'Tainan', 
    label = ['Tainan', 'Tainan', '台南'],
    population = 1879115,
  ),
  '68000': dict( ## Taoyuan
    tag = 'Taoyuan',
    label = ['Taoyuan', 'Taoyuan', '桃園'],
    population = 2254363,
  ),
  
  ## County
  '10002': dict( ## Yilan
    tag = 'Yilan',
    label = ['Yilan', 'Yilan', '宜蘭'],
    population = 453951,
  ),
  '10004': dict( ## Hsinchu
    tag = 'Hsinchu',
    label = ['Hsinchu County', 'Comté de Hsinchu', '竹縣'],
    population = 565272,
  ),
  '10005': dict( ## Miaoli
    tag = 'Miaoli',
    label = ['Miaoli', 'Miaoli', '苗栗'],
    population = 544762,
  ),
  '10007': dict( ## Changhua
    tag = 'Changhua',
    label = ['Changhua', 'Changhua', '彰化'],
    population = 1271015,
  ),
  '10008': dict( ## Nantou
    tag = 'Nantou',
    label = ['Nantou', 'Nantou', '南投'],
    population = 493403,
  ),
  '10009': dict( ## Yunlin
    tag = 'Yunlin',
    label = ['Yunlin', 'Yunlin', '雲林'],
    population = 680050,
  ),
  '10010': dict( ## Chiayi
    tag = 'Chiayi',
    label = ['Chiayi County', 'Comté de Chiayi', '嘉縣'],
    population = 502007,
  ),
  '10013': dict( ## Pingtung
    tag = 'Pingtung',
    label = ['Pingtung', 'Pingtung', '屏東'],
    population = 817193,
  ),
  '10014': dict( ## Taitung
    tag = 'Taitung',
    label = ['Taitung', 'Taitung', '台東'],
    population = 216308,
  ),
  '10015': dict( ## Hualien
    tag = 'Hualien',
    label = ['Hualien', 'Hualien', '花蓮'],
    population = 325706,
  ),
  '10016': dict( ## Penghu
    tag = 'Penghu',
    label = ['Penghu', 'Penghu', '澎湖'],
    population = 105117,
  ),
  
  ## City
  '10017': dict( ## Keelung
    tag = 'Keelung',
    label = ['Keelung', 'Keelung', '基隆'],
    population = 371878,
  ),
  '10018': dict( ## Hsinchu_C
    tag = 'Hsinchu_C',
    label = ['Hsinchu City', 'Ville de Hsinchu', '竹市'],
    population = 448207,
  ),
  '10020': dict( ## Chiayi_C
    tag = 'Chiayi_C',
    label = ['Chiayi City', 'Ville de Chiayi', '嘉市'],
    population = 270254,
  ),
  
  ## 09
  '09007': dict( ## Matsu
    tag = 'Matsu',
    label = ['Matsu', 'Matsu', '馬祖'],
    population = 12716,
  ),
  '09020': dict( ## Kinmen
    tag = 'Kinmen',
    label = ['Kinmen', 'Kinmen', '金門'],
    population = 127723,
  ), 
}

COUNTY_DICT_2 = {
  '基隆市': 'Keelung',
  '台北市': 'Taipei',
  '臺北市': 'Taipei',
  '新北市': 'New_Taipei',
  '桃園市': 'Taoyuan',
  '新竹縣': 'Hsinchu',
  '新竹市': 'Hsinchu_C',
  '苗栗縣': 'Miaoli',
  '台中市': 'Taichung',
  '臺中市': 'Taichung',
  '彰化縣': 'Changhua',
  '南投縣': 'Nantou',
  '雲林縣': 'Yunlin',
  '嘉義縣': 'Chiayi',
  '嘉義市': 'Chiayi_C',
  '台南市': 'Tainan',
  '臺南市': 'Tainan',
  '高雄市': 'Kaohsiung',
  '屏東縣': 'Pingtung',
  '宜蘭縣': 'Yilan',
  '花蓮縣': 'Hualien',
  '台東縣': 'Taitung',
  '臺東縣': 'Taitung',
  '澎湖縣': 'Penghu',
  '金門縣': 'Kinmen',
  '連江縣': 'Matsu',
  '空值': 'unknown',
}

DELIVERY_LIST = [
  ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
  ['AZ', 'AZ', 117000, '2021-03-03', '2021-03-22', 'https://www.cna.com.tw/news/firstnews/202103035003.aspx', 'https://www.cna.com.tw/news/firstnews/202103225002.aspx'],
  ['AZ', 'COVAX', 199200, '2021-04-04', '2021-04-13', 'https://www.cna.com.tw/news/firstnews/202104040008.aspx', 'https://www.cna.com.tw/news/firstnews/202104120047.aspx'],
  ['AZ', 'COVAX', 409800, '2021-05-19', '2021-05-27', 'https://www.cna.com.tw/news/firstnews/202105190224.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600326'],
  ['Moderna', 'Moderna', 148800, '2021-05-28', '2021-06-08', 'https://www.cna.com.tw/news/firstnews/202105285010.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600375'],
  ['AZ', 'Japan', 1237860, '2021-06-04', '2021-06-12', 'https://www.cna.com.tw/news/firstnews/202106045008.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600389'],
  ['Moderna', 'Moderna', 239400, '2021-06-18', '2021-06-26', 'https://www.cna.com.tw/news/firstnews/202106180294.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600409'],
  ['Moderna', 'USA', 2498440, '2021-06-20', '2021-06-29', 'https://www.cna.com.tw/news/firstnews/202106205005.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600416'],
  ['Moderna', 'Moderna', 409800, '2021-06-30', '2021-07-08', 'https://www.cna.com.tw/news/firstnews/202106305007.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600434'],
  ['AZ', 'AZ', 625900, '2021-07-07', '2021-07-15', 'https://www.cna.com.tw/news/firstnews/202107070181.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600446'],
  ['AZ', 'Japan', 1131780, '2021-07-08', '2021-07-16', 'https://www.cna.com.tw/news/firstnews/202107085007.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600448'],
  ['AZ', 'Japan', 973480, '2021-07-15', '', 'https://www.cna.com.tw/news/firstnews/202107155011.aspx', ''],
  ['AZ', 'AZ', 560100, '2021-07-15', '', 'https://www.cna.com.tw/news/firstnews/202107150245.aspx', ''],
  ['Moderna', 'Moderna', 349200, '2021-07-15', '', 'https://www.cna.com.tw/news/firstnews/202107150215.aspx',''],
]

################################################################################
## Functions - general utilities

def saveCsv(name, data, verbose=True):
  data.to_csv(name, index=False)
  if verbose:
    print('Saved \"%s\"' % name)
  return

def loadJson(name, verbose=True):
  file_ = open(name, 'r')
  data = json.load(file_)
  file_.close()
  if verbose:
    print('Loaded \"%s\"' % name)
  return data

def ISODateToOrd(iso):
  ord_ = dtt.date.fromisoformat(iso).toordinal()
  return ord_

def ordDateToISO(ord_):
  return dtt.date.fromordinal(ord_).isoformat()

def getTodayOrdinal():
  today = dtt.datetime.today()
  delta = dtt.timedelta(hours=12)
  ord_today = (today - delta).toordinal() + 1
  return ord_today

def normalizeBoolArr(bool_arr):
  bool_arr = bool_arr.astype(float)
  bool_arr -= bool_arr.mean()
  norm = np.sqrt(np.sum(bool_arr**2))
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter("ignore")
    bool_arr /= norm
  return bool_arr

def centerOfBins(bins, area=False):
  bins = np.array(bins, dtype=float)
  left = bins[:-1]
  right = bins[1:]
  if area is True:
    return np.sqrt(0.5 * (left**2 + right**2))
  return 0.5 * (left + right)

def makeHist(data, bins, wgt=None, factor=1.0, pdf=False):
  """
  Make the histogram such that the output can be plotted directly
  
  Parameters
  ----------
  data : array-like
  
  bins : (1, N) float array
    bin edges
    
  factor : float, optional
    rescaling factor for the histogram
    
  pdf : bool, optional
    make the output a pdf, i.e. normalized by the binwidth & the total counts
  
  Returns
  -------
  n_arr : (1, N) float array
    number counts, could be rescaled
    
  ctr_bins : (1, N) float array
    center of the bins
    n_arr & ctr_bins have the same size.
  """
  n_arr, bins = np.histogram(data, bins, weights=wgt)
  ctr_bins = centerOfBins(bins)
  
  if pdf == True:
    n_arr = n_arr.astype(float) / (float(sum(n_arr)) * (bins[1:] - bins[:-1]))
  else:
    n_arr = n_arr.astype(float) * factor
  
  return n_arr, ctr_bins

def sevenDayMovingAverage(value_arr):
  value_arr = np.array(value_arr, dtype=float)
  kernel = [1/7] * 7 + [0.0] * 6 ## Sum not mean
  value_arr = signal.convolve(value_arr, kernel[::-1], mode='same')
  return value_arr

def itpFromCumul(begin, end, length):
  if length == 1:
    return [end-begin]
  
  q = (end - begin) // length
  r = (end - begin) % length
  list_ = [q] * length
  
  for i in range(r):
    list_[i] += 1
  
  return list_

################################################################################
## Functions - utilities specific to this file

def initializeStock_dailyCounts(col_tag_list):
  ord_today = getTodayOrdinal()
  date_list = [ordDateToISO(ord_) for ord_ in range(ISODateToOrd(ISO_DATE_REF), ord_today)]
  stock = {'date': date_list}
  stock.update({col_tag: np.zeros(len(date_list), dtype=int) for col_tag in col_tag_list})
  return stock

def initializeStockDict_general(stock):
  return {page: copy.deepcopy(stock) for page in PAGE_LIST}

def indexForLatest(iso):
  ord_today = getTodayOrdinal()
  ind = ISODateToOrd(iso) - ord_today + NB_LOOKBACK_DAYS
  if ind < 0 or ind >= NB_LOOKBACK_DAYS:
    return np.nan
  return ind

def indexForOverall(iso):
  ord_begin_overall = ISODateToOrd(ISO_DATE_REF)
  ind = ISODateToOrd(iso) - ord_begin_overall
  if ind < 0:
    return np.nan
  return ind

def indexFor2021(iso):
  ord_begin_2021 = ISODateToOrd('2021-01-01')
  ind = ISODateToOrd(iso) - ord_begin_2021
  if ind < 0 or ind >= 365:
    return np.nan
  return ind

def indexFor2020(iso):
  ord_begin_2020 = ISODateToOrd('2020-01-01')
  ind = ISODateToOrd(iso) - ord_begin_2020
  if ind < 0 or ind >= 366:
    return np.nan
  return ind

def makeIndexList(iso):
  ind_latest = indexForLatest(iso)
  ind_overall = indexForOverall(iso)
  ind_2021 = indexFor2021(iso)
  ind_2020 = indexFor2020(iso)
  return [ind_latest, ind_overall, ind_2021, ind_2020]

def addMovingAverageToStock(stock):
  date = stock.pop('date')
  count_mat = list(stock.values())
  
  avg_arr = np.sum(count_mat, axis=0)
  avg_arr = sevenDayMovingAverage(avg_arr)
  avg_arr = np.around(avg_arr, decimals=4)
  
  stock_new = {'date': date, 'moving_avg': avg_arr}
  stock_new.update(stock)
  return stock_new
    
def makeMovingAverage(value_arr):
  avg_arr = sevenDayMovingAverage(value_arr)
  avg_arr = np.around(avg_arr, decimals=4)
  return avg_arr
    
def adjustDateRange(data):
  ord_ref = ISODateToOrd(ISO_DATE_REF)
  ord_begin = ISODateToOrd(data['date'].values[0])
  ord_end = ISODateToOrd(data['date'].values[-1]) + 1
  ord_today = getTodayOrdinal()
  
  zero = [0] * (len(data.columns) - 1)
  nan = [np.nan] * (len(data.columns) - 1)
  stock1 = []
  stock2 = []
  
  for ord_ in range(ord_ref, ord_begin):
    iso = ordDateToISO(ord_)
    stock1.append([iso] + zero)
    
  for ord_ in range(ord_end, ord_today):
    iso = ordDateToISO(ord_)
    stock2.append([iso] + nan)
  
  if ord_ref > ord_begin:
    data = data[ord_ref-ord_begin:]
  
  data1 = pd.DataFrame(stock1, columns=data.columns)
  data2 = pd.DataFrame(stock2, columns=data.columns)
  data = pd.concat([data1, data, data2])
  return data

def truncateStock(stock, page):
  if PAGE_LATEST == page:
    return stock.iloc[-NB_LOOKBACK_DAYS:]
  
  if PAGE_2022 == page:
    return stock.iloc[731:1096]
    
  if PAGE_2021 == page:
    return stock.iloc[366:731]
    
  if PAGE_2020 == page:
    return stock.iloc[0:366]
    
  ## If overall
  return stock

################################################################################
## Classes - template

class Template:
  def getCol(self, col):
    return self.data[col].values
  
  def __str__(self):
    return str(self.data.head(25))

################################################################################
## Classes - main sheet

class MainSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_case = '案例'
    self.coltag_report_date = '新聞稿發布日期'
    self.coltag_gender = '性別'
    self.coltag_age = '年齡'
    self.coltag_nationality = '國籍'
    self.coltag_city = '區域'
    self.coltag_transmission = '來源'
    self.coltag_trav_hist = '旅遊史'
    self.coltag_entry_date = '入境臺灣日期'
    self.coltag_onset_date = '出現症狀日期'
    self.coltag_hosp_date = '就醫日期'
    self.coltag_channel = '發現管道'
    self.coltag_symptom = '症狀'
    self.coltag_disease = '疾病史'
    self.coltag_link = '感染源'
    self.coltag_notes = '備註'
    self.coltag_discharged = '痊癒'
    self.coltag_dis_date = '痊癒日期'
    self.coltag_dis_date_2 = '出院日期'
    self.coltag_conf_press_rel = '疾管署新聞稿'
    self.coltag_dis_press_rel = '出院新聞稿'
    
    self.n_total = 0
    self.n_latest = 0
    self.n_2022 = 0
    self.n_2021 = 0
    self.n_2020 = 0
    self.n_empty = 0
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_case_breakdown.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    case_nb_list = data[self.coltag_case].values
    ind = case_nb_list == case_nb_list
    self.data = data[ind]
    
    self.setCaseCounts()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
      print('N_latest = %d' % self.n_latest)
      print('N_2021 = %d' % self.n_2021)
      print('N_2020 = %d' % self.n_2020)
      print('N_empty = %d' % self.n_empty)
    return 
    
  def setCaseCounts(self):
    for report_date, trans in zip(self.getReportDate(), self.getCol(self.coltag_transmission)):
      if trans != trans: ## NaN
        self.n_empty += 1
        continue
      
      self.n_total += 1
      
      ind_latest = indexForLatest(report_date)
      ind_2022 = np.nan
      ind_2021 = indexFor2021(report_date)
      ind_2020 = indexFor2020(report_date)
      
      ## If not NaN
      if ind_latest == ind_latest:
        self.n_latest += 1
      if ind_2022 == ind_2022:
        self.n_2022 += 1
      if ind_2021 == ind_2021:
        self.n_2021 += 1
      if ind_2020 == ind_2020:
        self.n_2020 += 1
    return
  
  def getReportDate(self):
    report_date_list = []
    
    for report_date, trans in zip(self.getCol(self.coltag_report_date), self.getCol(self.coltag_transmission)):
      if trans != trans: ## NaN
        report_date_list.append(np.nan)
        continue
      
      yyyymdday_zh = report_date.split('年')
      y = int(yyyymdday_zh[0])
      mdday_zh = yyyymdday_zh[1].split('月')
      m = int(mdday_zh[0])
      dday_zh = mdday_zh[1].split('日')
      d = int(dday_zh[0])
      report_date = '%04d-%02d-%02d' % (y, m, d)
      report_date_list.append(report_date)
        
    return report_date_list
  
  def getAge(self):
    age_list = []
    for i, age in enumerate(self.getCol(self.coltag_age)):
      if age in [
        '1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X', '9X',
        '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', 
      ]:
        age_list.append(age[0]+'0s')
      elif age in ['1XX', '10X', '11X', '100s', '102']:
        age_list.append('100+')
        
      elif age in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '<10', '<1', '<5', '<6', '8月大']:
        age_list.append('0s')
      elif age in ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '10-14']:
        age_list.append('10s')
      elif age in ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '20-24']:
        age_list.append('20s')
      elif age in ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39']:
        age_list.append('30s')
      elif age in ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '40-44']:
        age_list.append('40s')
      elif age in ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '50-54']:
        age_list.append('50s')
      elif age in ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69']:
        age_list.append('60s')
      elif age in ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79']:
        age_list.append('70s')
      elif age in ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89']:
        age_list.append('80s')
      elif age in ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99']:
        age_list.append('90s')
        
      elif age in [
        '<5-4X', '<5-6X', '<5-7X', '<5-8X', '<5-9X', '<5-1XX', '<10-4X', '<10-8X', '<10-9X', '3-77', 
        '1X-2X', '1X-4X', '1X-7X', '2X-3X', '2X-4X', '2X-6X', '3X-4X', '3X-8X', '5X-7X', '5X-8X'
      ]:
        age_list.append(np.nan)
      elif age != age:
        age_list.append(np.nan)
      else:
        print('Age, Case %d, %s' % (i+1, age))
        age_list.append(np.nan)
    return age_list
  
  def getTransmission(self):
    trans_list = []
    
    for i, trans in enumerate(self.getCol(self.coltag_transmission)):
      if trans != trans:
        trans_list.append(np.nan)
      
      elif i+1 in [760, 766]:
        trans_list.append('plane')
      
      elif trans == '境外':
        trans_list.append('imported')
      
      elif trans in ['敦睦遠訓', '敦睦\n遠訓']:
        trans_list.append('fleet')
      
      elif trans == '本土':
        trans_list.append('local')
      
      elif trans == '不明':
        trans_list.append('unknown')
      
      else:
        print('Transmission, Case %d, %s' % (i+1, trans))
        trans_list.append(np.nan)
        
    return trans_list
  
  def getNationality(self):
    nat_list = []
    for nat in self.getCol(self.coltag_nationality):
      nat_list.append(nat)
    return nat_list
  
  def getTravHist(self):
    key_dict = {
      ## Far-East Asia
      'Bangladesh': ['孟加拉'],
      'Cambodia': ['柬埔寨'],
      'China': ['中國', '武漢', '深圳', '廣州', '遼寧', '江蘇', '浙江'],
      'Hong Kong': ['香港'],
      'India': ['印度'], 
      'Indonesia': ['印尼'], 
      'Japan': ['日本', '東京', '大阪', '北海道'],
      'Korea': ['韓國', '首爾'],
      'Macao': ['澳門'],
      'Malaysia': ['馬來西亞'], 
      'Myanmar' : ['緬甸'],
      'Nepal': ['尼泊爾'],
      'Pakistan': ['巴基斯坦'],
      'Philippines': ['菲律賓'], 
      'Singapore': ['新加坡'], 
      'Thailand': ['泰國', '曼谷'], 
      'Vietnam': ['越南'],
      
      ## West & Central Asia
      'Kazakhstan': ['哈薩克'], 
      'Kyrgyzstan': ['吉爾吉斯'],
      'Oman': ['阿曼'],
      'Qatar': ['阿拉伯－卡達', '卡達'], 
      'Saudi Arabia': ['沙烏地阿拉伯'],
      'Syria': ['敘利亞'], 
      'Turkey': ['土耳其'], 
      'UAE': ['阿拉伯－杜拜', '杜拜'], 
      'Uzbekistan': ['烏茲別克'],
      
      ## Europe
      'Europe': ['歐洲'], 
      'Albania': ['阿爾巴尼亞'], 
      'Austria': ['奧地利'], 
      'Belarus': ['白俄羅斯'],
      'Belgium': ['比利時'], 
      'Bulgaria': ['保加利亞'], 
      'Croatia': ['克羅埃西亞'],
      'Czechia': ['捷克'], 
      'Danmark': ['丹麥'], 
      'Finland': ['芬蘭'], 
      'France': ['法國', '巴黎'], 
      'Germany': ['德國', '紐倫堡', '慕尼黑'], 
      'Greece': ['希臘'],
      'Iceland': ['冰島'], 
      'Ireland': ['愛爾蘭'], 
      'Italy': ['義大利'], 
      'Hungary': ['匈牙利'],
      'Luxemburg': ['盧森堡'], 
      'Netherlands': ['荷蘭'], 
      'Poland': ['波蘭'], 
      'Portugal': ['葡萄牙'], 
      'Russia': ['俄羅斯'],
      'Slovakia': ['斯洛伐克'],
      'Spain': ['西班牙'], 
      'Switzerland': ['瑞士'], 
      'UK': ['英國', '倫敦'], 
      'Ukraine': ['烏克蘭'],
      
      ## Africa
      'Africa': ['非洲'],
      'Cameroon': ['喀麥隆'],
      'Eswatini': ['史瓦帝尼'],
      'Egypt': ['埃及'], 
      'Ethiopia': ['衣索比亞'],
      'Ghana': ['迦納'], 
      'Lesotho': ['賴索托'],
      'Morocco': ['摩洛哥'], 
      'Nigeria': ['奈及利亞'], 
      'Senegal': ['塞內加爾'],
      'South Africa': ['南非'], 
      'Tunisia': ['突尼西亞'], 
      'Uganda': ['烏干達'],
      
      ## North & South America
      'Argentina': ['阿根廷'], 
      'Bolivia': ['玻利維亞'], 
      'Brazil': ['巴西'],
      'Canada': ['加拿大'], 
      'Chile': ['智利', '聖地牙哥'], 
      'Dominican Republic': ['多明尼加'],
      'Guatemala': ['瓜地馬拉'], 
      'Haiti': ['海地'], 
      'Honduras': ['宏都拉斯'], 
      'Latin America': ['中南美洲'], 
      'Mexico': ['墨西哥'], 
      'Paraguay': ['巴拉圭'],
      'Peru': ['秘魯', '祕魯'], 
      'USA': ['美國', '加州', '紐約'], 
      
      ## Oceania
      'Australia': ['澳大利亞', '澳洲'], 
      'Marshall Islands': ['馬紹爾'],
      'New Zealand': ['紐西蘭'], 
      'Palau': ['帛琉'], 
      
      ## Others
      'Antarctica': ['南極'], 
      'Coral Princess': ['珊瑚公主號'], 
      'Diamond Princess': ['鑽石公主號'], 
      'Pan-Shi': ['海軍敦睦支隊磐石艦', '整隊登艦', '台灣啟航', '左營靠泊檢疫'],
      'local': ['無', 'x', 'X']
    }
    nat_list = self.getNationality()
    trav_hist_list = []
    
    for i, trav_hist in enumerate(self.getCol(self.coltag_trav_hist)):
      if trav_hist != trav_hist: ## Is nan
        trav_hist_list.append([])
        continue
      
      stock = []
      
      ## Scan the content with all keys
      for key, value_list in key_dict.items():
        for value in value_list:
          if value in trav_hist:
            trav_hist = ''.join(trav_hist.split(value))
            stock.append(key) ## Put the translation in stock
      
      ## Remove meaningless words
      trav_hist = ''.join(trav_hist.split('2017年8月就入境台灣，期間並未出境'))
      trav_hist = ''.join(trav_hist.split('2020年3月入境後未再出境'))
      trav_hist = ''.join(trav_hist.split('自離境前往'))
      trav_hist = ''.join(trav_hist.split('從搭機'))
      trav_hist = ''.join(trav_hist.split('轉機'))
      trav_hist = ''.join(trav_hist.split('出海'))
      trav_hist = ''.join(trav_hist.split('出境'))
      trav_hist = ''.join(trav_hist.split('上旬'))
      trav_hist = ''.join(trav_hist.split('中旬'))
      trav_hist = ''.join(trav_hist.split('下旬'))
      trav_hist = ''.join(trav_hist.split('返國'))
      trav_hist = ''.join(trav_hist.split('回台'))
      trav_hist = ''.join(trav_hist.split('來台'))
      
      for key in [
        '臺灣', '台灣', '北部', '台北', '萬華', '板橋', '新北', '桃園', '苗栗', '台中', '彰化', '新竹', '南投', 
        '雲林', '嘉縣', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '馬祖'
      ]:
        trav_hist = ''.join(trav_hist.split(key))
      
      trav_hist = trav_hist.lstrip(' 0123456789-/()、月及到等經\n→ ')
      
      ## Complain if unrecognized texts remain
      if len(trav_hist) > 0:
        print('Travel history, Case %d, %s' % (i+1, trav_hist))
      
      ## If no travel history but imported, add nationality (only for i >= 460)
      if i >= 460 and len(stock) == 0:
        for key, value_list in key_dict.items():
          for value in value_list:
            if value in nat_list[i]:
              stock.append(key)
              break
      
      stock = list(set(stock))
      trav_hist_list.append(stock)
      
    trav_hist_list = [trav_hist if len(trav_hist) > 0 else np.nan for trav_hist in trav_hist_list]
    return trav_hist_list
  
  def getEntryDate(self):
    entry_date_list = []
    
    for i, entry_date in enumerate(self.getCol(self.coltag_entry_date)):
      if entry_date != entry_date: ## NaN
        entry_date_list.append(np.nan)
        
      elif entry_date in ['x', 'X', '3/7-5/12', '2017年8月']:
        entry_date_list.append(np.nan)
        
      elif entry_date in ['3/1\n3/8']:
        entry_date_list.append('2020-03-08')
      
      elif entry_date in ['10/28(29)']:
        entry_date_list.append('2020-10-28')
      
      elif entry_date in ['11/7(8)']:
        entry_date_list.append('2020-11-07')
      
      elif entry_date in ['11/20(-27)']:
        entry_date_list.append('2020-11-24')
        
      elif entry_date in ['11/28(12/2)']:
        entry_date_list.append('2020-11-30')
        
      elif entry_date in ['12/4\n12/15', '12/7\n12/15']:
        entry_date_list.append('2020-12-15')
        
      elif entry_date in ['12/27(30)']:
        entry_date_list.append('2020-12-29')
        
      elif entry_date in ['5/5(6)']:
        entry_date_list.append('2021-05-05')
        
      elif entry_date in ['5/17(18)']:
        entry_date_list.append('2021-05-17')
        
      else:
        try:
          mmdd = entry_date.split('/')
          y = 2020
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 < 100 and m > 6:
            y = 2019
          elif i+1 >= 800 and m <= 6:
            y = 2021
            
          entry_date = '%04d-%02d-%02d' % (y, m, d)
          entry_date_list.append(entry_date)
        except:
          print('Entry date, Case %d, %s' % (i+1, entry_date))
          entry_date_list.append(np.nan)
    
    return entry_date_list
  
  def getOnsetDate(self):
    onset_date_list = []
    
    for i, onset_date in enumerate(self.getCol(self.coltag_onset_date)):
      if onset_date != onset_date: ## NaN
        onset_date_list.append(np.nan)
      
      elif onset_date in [
        '1月', '2/18-25', '3月', '4/1-6/3', '4/6-5/15', '4/25-5/22', '4/26-5/26', '4/28-6/2', '4/29-5/27', '4/29-5/30', '4/30-5/18', 
        '5/1-19', '5/2-13', '5/2-22', '5/2-6/1', '5/5-16', '5/5-17', '5/6-22', '5/6-27', '5/6-6/13', '5/7-20', '5/7-24', '5/7-25', '5/7-28', 
        '5/8-20', '5/8-25', '5/10-16', '5/10-5/18', '5/10-20', '5/10-21', '5/10-23', '5/11-27', '5/13-25', '5/13-27', '5/13-30', '5/13-31',
        '5/14-22', '5/14-29', '5/14-6/8', '5/15-26', '5/15-6/4', '5/16\n*5/24', '5/18-6/2', '5/18-6/24', '5/19-6/10', 
        '5/20-30', '5/20-31', '5/21-6/6', '5/22-6/7', '5/22-6/9', '5/23-6/12', '5/24-6/5', '5/28-6/11', '5/28-6/13',
        '6/1-2', '6/1-14', '6/1-15', '6/3-16', '6/3-18', '6/4-19', '6/4-23', '6/8-20', '6/10-22', '6/10-26', '6/10-7/5', '6/11-25', '6/14-21', 
        '6/16-28', '6/17-7/3', '6/19-27', '6/19-7/4', '6/20-29', '6/22-30', '6/22-7/1', '6/22-7/2', '6/22-7/9', '6/26-7/6', '6/26-7/10', 
        '7/1-7', '7/1-8', 
        '9月下旬', '10月中旬', '11月初', '11月上旬', '11月下旬', '12/', '12月上旬', 'x', 'X',
      ]:
        onset_date_list.append(np.nan)
        
      elif onset_date in ['5/26 採檢\n5/26 確診']:
        onset_date_list.append('2021-05-26')
      elif onset_date in ['6/7 喉嚨痛、疲勞\n6/8 發燒']:
        onset_date_list.append('2021-06-07')
      elif onset_date in ['6/8 發燒']:
        onset_date_list.append('2021-06-08')
        
      elif onset_date in ['7月、11/1']:
        onset_date_list.append('2020-11-01')
        
      elif onset_date in ['5/8-10']:
        onset_date_list.append('2021-05-09')
        
      else:
        try:
          mmdd = onset_date.split('/')
          m = int(mmdd[0])
          d = int(mmdd[1])
          if i+1 < 100 and m > 6:
            y = 2019
          elif i+1 < 800:
            y = 2020
          elif i+1 < 10000 and m > 6:
            y = 2020
          elif i+1 < 14000:
            y = 2021
          else:
            y = 2021
          onset_date = '%04d-%02d-%02d' % (y, m, d)
          onset_date_list.append(onset_date)
        except:
          print('Onset date, Case %d, %s' % (i+1, onset_date))
          onset_date_list.append(np.nan)
    
    return onset_date_list
  
  def getChannel(self):
    channel_list = []
    key_list_out = ['採檢']
    
    for i, channel in enumerate(self.getCol(self.coltag_channel)):
      if channel != channel: ## Is nan
        channel_list.append(np.nan)
      
      elif channel in key_list_out:
        channel_list.append(np.nan)
        
      elif channel in ['機場']:
        channel_list.append('airport')
        
      elif channel in ['居家檢疫', '集中檢疫', '英國專案', '死亡']:
        channel_list.append('quarantine')
        
      elif channel in [
        '居家隔離', '住院隔離', '接觸患者', '同院患者', '框列採檢', '匡列篩檢', '匡列居隔', 
        '接觸者回溯', '接觸者檢查', '接觸者採檢', '接觸者框列', '接觸者匡列', '匡列接觸者', 
        '確診者回溯', '確診者匡列', '居家隔離期滿後採檢', '居家隔離期滿後確診'
      ]:
        channel_list.append('isolation')
        
      elif channel in ['自主健康管理', '加強自主管理', '居家隔離期滿\n自主健康管理']:
        channel_list.append('monitoring')
        
      elif channel in [
        '入院', '專案', '快篩站', '自行就醫', '自主就醫', '自費篩檢', '自費採檢', '自費檢驗', '自行通報', '定期篩檢', '定期監測', '定期監控', 
        '入院篩檢', '入院採檢', '入院檢查', '院內採檢', '社區快篩', '社區專案', '社區篩檢', '專案篩檢', '常規篩檢', 
        '萬華專案', '擴大採檢', '擴大篩檢', '預防性快篩', '預防性採檢', '鄰家擴大採檢', '入院前預防性採檢', '解隔離後自行就醫'
      ]:
        channel_list.append('hospital')
        
      elif '定期篩檢' in channel:
        channel_list.append('hospital')
        
      elif channel in ['香港檢驗', '外國檢驗', '外國篩檢']:
        channel_list.append('overseas')
        
      else:
        print('Channel, Case %d, %s' % (i+1, channel))
        channel_list.append(np.nan)
    return channel_list
  
  def getSymptom(self):
    key_dict = {
      'sneezing': ['伴隨感冒症狀', '感冒症狀', '鼻涕倒流', '打噴嚏', '流鼻水', '流鼻涕', '鼻塞', '鼻水', '鼻炎', '感冒'],
      'cough': ['輕微咳嗽', '咳嗽症狀', '咳嗽加劇', '咳嗽併痰', '咳嗽有痰', '痰有血絲', '喉嚨有痰', '有點咳嗽', '咳嗽', '乾咳', '輕咳', '有痰'],
      'throatache': [
        '上呼吸道症狀', '上呼吸道腫痛', '呼吸道症狀', '上呼吸道', '咽喉不適', '急性咽炎', '聲音沙啞', '口乾舌燥', 
        '異物感', '樓龍痛', '呼吸道', '沙啞', '乾嘔', 
        '喉嚨有異物感', '喉嚨乾澀想咳', '喉嚨不適', '喉嚨痛癢', '喉嚨乾癢', '喉嚨乾痛', '喉嚨痛', '喉嚨癢', '喉嚨腫', 
        '喉嚨乾', '喉嚨'
      ],
      'earache': [' 耳朵痛'],
      'dyspnea': [
        '講話、呼吸吃力', '活動後呼吸喘', '重度呼吸窘迫', '些微呼吸急促', '呼吸喘 困難', '呼吸窘迫', '呼吸不順', '呼吸困難', '呼吸微喘', '呼吸短促', '呼吸急促', '走路會喘', 
        '走路喘', '呼吸喘', '輕微喘', '微喘', '氣喘', '喘嗚', '喘'
      ],
      'bronchitis': ['支氣管炎'],
      'pneumonia': ['X光顯示肺炎', 'X光片顯示肺炎', 'X光顯示肺部輕微浸潤', '雙側肺部有異狀', '肺浸潤', '肺炎'], 
      
      'fever': ['出現中暑的狀態', '身體悶熱不適', '間歇性發燒', '身體微熱', '體溫偏高', '體溫升高', '反覆發燒', '身體發熱', '微燒', '低燒', '發燒', '發熱', '盜汗'], 
      'chills': ['忽冷忽熱症狀', '忽冷忽熱', '冒冷汗', '畏寒', '發冷', '寒顫'], 
      
      'nausea': ['噁心', '想吐'],
      'vomiting': ['嘔吐感', '嘔吐'],
      'diarrhea': ['腹瀉'], 
      
      'headache': ['頭暈目眩', '輕度頭痛', '頭骨痛', '偏頭痛', '頭痛', '頭暈', '頭脹', '頭昏', '暈眩', '頭重'],
      'eyes sore': ['結膜充血', '後眼窩痛', '眼睛癢', '眼睛痛', '眼壓高'], 
      'chest pain+backache': ['胸背痛'], 
      'chest pain': ['呼吸時胸痛', '心臟不舒服', '胸部不適', '胸痛', '胸悶'],
      'stomachache': ['腸胃不舒服', '腸胃道不適', '腸胃不適', '胃部不適', '腹部不適', '肚子不適', '腹悶痛', '胃痛', '腹痛', '胃脹', '腹脹'],
      'backache': ['腰酸背痛', '背痛'], 
      'toothache': ['牙痛'], 
      'rash': ['出疹'],
      
      'fatigue': [
        '全身倦怠無力', '左側肢體無力', '全身倦怠', '全身疲憊', '全身疲倦', '身體無力', '全身無力', '走路無力', '四肢無力', '精神倦怠', '體力不支', '體力變差', '全身虛弱', '全身疲軟', 
        '疲倦感', '倦怠情', '體力差', '沒精神', '倦怠', '疲憊', '疲倦', '疲勞', '疲累', '無力', '虛弱'
      ],
      'soreness': [
        '全身肌肉痠痛', '上半身骨頭刺痛', '小腿肌肉痠痛', '肌肉痠痛症狀', '肌肉關節痠痛', '手部肌肉痠痛', '關節肌肉痛', '肌肉 痠痛', '肌肉酸痛', '肌肉痠痛', '肩膀痠痛', 
        '全身痠痛', '全身酸痛', '骨頭痠痛', '骨頭酸痛', '關節痠痛', '身體痠痛', '肌肉痛', '骨頭酸', '關節痛', '身體痛', '痠痛'
      ],
      'hypersomnia': ['嗜睡'],
      'insomnia': ['睡不著'], 
      
      'dysnosmia+dysgeusia': ['味覺及嗅覺都喪失', '味覺及嗅覺喪失', '嗅覺和味覺喪失', '嗅味覺異常', '味嗅覺異常'], 
      'dysnosmia': ['嗅覺異常症狀', '嗅覺不靈敏', '失去嗅覺', '嗅覺喪失', '嗅覺變差', '嗅覺遲鈍', '嗅覺異常', '喪失嗅覺', '嗅覺降低', '無嗅覺'], 
      'dysgeusia': ['味覺喪失', '味覺異常', '喪失味覺', '失去味覺', '味覺變差', '口苦'], 
      
      'tonsillitis': ['淋巴腫脹', '扁桃腺腫痛'], 
      'hypoglycemia': ['低血糖'],
      'hypoxemia': ['血氧濃度54%', '血氧降低', '低血氧'],
      'anorexia': ['食慾不佳', '食慾不振', '食慾下降', '食欲不振', '胃口變差', '沒有食慾', '食慾差', '無食慾'],
      'arrhythmia': ['心律不整'],
      'coma': ['意識不清', '意識改變'],
      
      'symptomatic': ['全身不舒服', '出現症狀', '身體不適', '有症狀', '不舒服', '不適'] + \
        ['排尿疼痛', '眼球上吊', '肢體變黑', '鼻子乾', '低血壓', '猝死', '抽搐', '手抖', '吐血', '口渴'],
      'asymptomatic': ['首例無症狀', '無症狀', 'x', 'X'],
    }
    symp_list = []
    
    for i, symp in enumerate(self.getCol(self.coltag_symptom)):
      symp_orig = symp
      
      if symp != symp: ## Is nan
        symp_list.append([])
        continue
      
      stock = []
      symp = ''.join(symp.split('入境已無症狀'))
      symp = ''.join(symp.split('#68 #69 #70 #73其中一人無症狀'))
      
      for key, value_list in key_dict.items():
        for value in value_list:
          if value in symp:
            symp = ''.join(symp.split(value))
            for k in key.split('+'):
              stock.append(k)
      
      symp = ''.join(symp.split('(耳溫量測37.7度)'))
      symp = ''.join(symp.split('到37.5度'))
      symp = ''.join(symp.split('(37.5度)'))
      symp = ''.join(symp.split('(37.4度)'))
      symp = ''.join(symp.split('首例本土'))
      symp = ''.join(symp.split('平常就常'))
      symp = ''.join(symp.split('入境前有'))
      symp = ''.join(symp.split('心情不佳'))
      symp = ''.join(symp.split('診斷為'))
      symp = ''.join(symp.split('嚴重'))
      symp = ''.join(symp.split('輕微'))
      symp = ''.join(symp.split('伴隨'))
      symp = ''.join(symp.split('不順'))
      symp = ''.join(symp.split('自覺'))
      symp = symp.lstrip('  678/\n .，、與及有')
      
      if len(symp) > 0:
        print('Symptom, Case %d, %s' % (i+1, symp))
        print('Symptom, Case %d, %s' % (i+1, symp_orig))
      
      stock = list(set(stock))
      symp_list.append(stock)
      
    symp_list = [symp if len(symp) > 0 else np.nan for symp in symp_list]
    return symp_list

  def getLink(self):
    link_list = []
    for i, link in enumerate(self.getCol(self.coltag_link)):
      if link == '未知':
        link_list.append('unlinked')
      elif link == '院內尚不明':
        link_list.append('unlinked')
      elif link == '調查中':
        link_list.append('unlinked')
        
      elif link == '軍艦':
        link_list.append('fleet')
      
      elif link != link:
        link_list.append(np.nan)
      
      elif 'O' in link:
        link_list.append('linked')
      elif 'o' in link:
        link_list.append('linked')
      elif '#' in link:
        link_list.append('linked')
      elif '接觸' in link:
        link_list.append('linked')
      elif '群聚' in link:
        link_list.append('linked')
      elif '萬華' in link:
        link_list.append('linked')
      elif '金樽' in link:
        link_list.append('linked')
      elif '市場' in link:
        link_list.append('linked')
      elif '高血壓' in link:
        link_list.append('linked')
      elif '糖尿病' in link:
        link_list.append('linked')
      elif '林家小館' in link:
        link_list.append('linked')
      elif '長照機構' in link:
        link_list.append('linked')
      elif '美樂地KTV' in link:
        link_list.append('linked')        
        
      elif link in [
        '家祭', '北農', '遠傳案', '京元電', 
        '養護中心', '照護中心', '護理之家', '朝陽夜唱', '金沙酒店', '泰安附幼', 
        '洗腎診所', '豐原家庭', '立揚鞋業', 
        'B醫療機構', '銀河百家樂', '維納斯會館', '羅東遊藝場', '串門子餐廳', '彰化麻將團', 
        '中國醫K歌團', '小姑娘小吃店', '快樂城小吃店', '桃園觀音工地', '台北農產公司', 
        '東方紅時尚會館', '梧棲區藥局家族', '加強型防疫旅館', '鳳山早餐店家族', '國軍桃園總醫院', '桃園國軍總醫院', '台北家禽批發場', 
        '南澳雜貨店傳播鏈', '社中街攤販集中場', '復興區公所員工家族案關係圖', 
      ]:
        link_list.append('linked')

      else:
        print('Link, Case %d, %s' % (i+1, link))
        link_list.append(np.nan)
    return link_list
    
  def saveCsv_keyNb(self):
    self.getReportDate()
    timestamp = dtt.datetime.now().astimezone()
    timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC%z')
    
    population_twn = COUNTY_DICT['00000']['population']
    
    key = ['n_overall', 'n_latest', 'n_2020', 'n_2021', 'n_empty', 'timestamp', 'population_twn']
    value = [self.n_total, self.n_latest, self.n_2020, self.n_2021, self.n_empty, timestamp, population_twn]
    
    ## Make data frame
    data = {'key': key, 'value': value}
    data = pd.DataFrame(data)
    
    name = '%sprocessed_data/key_numbers.csv' % DATA_PATH
    saveCsv(name, data)
    return
    
  def increment_caseByTransmission(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    
    ## Initialize stocks
    col_tag_list = ['total', 'imported', 'local', 'others']
    stock = initializeStock_dailyCounts(col_tag_list)
    
    ## Loop over cases
    for report_date, trans in zip(report_date_list, trans_list):
      if trans != trans:
        continue
      
      ## Determine column tag
      if trans in ['imported', 'local']:
        col_tag = trans
      else:
        col_tag = 'others'
        
      try:
        ind = indexForOverall(report_date)
        stock[col_tag][ind] += 1
        stock['total'][ind] += 1
      except IndexError: ## If NaN
        pass
        
    ## Loop over column
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = makeMovingAverage(stock[col_tag])
    return stock
    
  def saveCsv_caseByTransmission(self):
    stock = self.increment_caseByTransmission()
    
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/case_by_transmission_by_report_day.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
  
  def increment_caseByDetection(self):
    report_date_list = self.getReportDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    channel_list = self.getChannel()
    
    ## Initialize data dict
    col_tag_list = ['airport', 'quarantine', 'isolation', 'monitoring', 'hospital', 'overseas', 'no_data']
    stock_r = initializeStock_dailyCounts(col_tag_list)
    stock_o = initializeStock_dailyCounts(col_tag_list)
    
    ## Loop over cases
    for report_date, onset_date, trans, channel in zip(report_date_list, onset_date_list, trans_list, channel_list):
      if trans != trans:
        continue
      
      ## Determine column tag
      if channel != channel:
        col_tag = 'no_data'
      else:
        col_tag = channel
      
      try:
        ind = indexForOverall(report_date)
        stock_r[col_tag][ind] += 1
      except IndexError: ## If NaN
        pass
        
      ## Check if NaN
      if onset_date != onset_date:
        continue
      
      try:
        ind = indexForOverall(onset_date)
        stock_o[col_tag][ind] += 1
      except IndexError: ## If NaN
        pass
      
    return stock_r, stock_o
    
  def saveCsv_caseByDetection(self):
    stock_r, stock_o = self.increment_caseByDetection()
    
    stock_r = addMovingAverageToStock(stock_r)
    stock_r = pd.DataFrame(stock_r)
    stock_r = adjustDateRange(stock_r)
    
    stock_o = addMovingAverageToStock(stock_o)
    stock_o = pd.DataFrame(stock_o)
    stock_o = adjustDateRange(stock_o)
    
    for page in PAGE_LIST:
      data_r = truncateStock(stock_r, page)
      data_o = truncateStock(stock_o, page)
      
      ## Save
      name = '%sprocessed_data/%s/case_by_detection_by_report_day.csv' % (DATA_PATH, page)
      saveCsv(name, data_r)
      name = '%sprocessed_data/%s/case_by_detection_by_onset_day.csv' % (DATA_PATH, page)
      saveCsv(name, data_o)
    return
  
  def increment_travHistSymptomCorr(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    trav_hist_list = self.getTravHist()
    symp_list = self.getSymptom()
    
    stock = {'x_list_list': [], 'y_list_list': [], 'nb_dict': {'N_total': 0, 'N_imported': 0, 'N_data': 0}}
    stock_dict = initializeStockDict_general(stock)
    
    ## Loop over case
    for report_date, trans, trav_hist, symp in zip(report_date_list, trans_list, trav_hist_list, symp_list):
      if trans != trans:
        continue
      
      index_list = makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['nb_dict']['N_total'] += 1
        
        ## Keep only imported
        if trans != 'imported':
          continue
        
        stock['nb_dict']['N_imported'] += 1
        
        ## Remove NaN
        if trav_hist != trav_hist or symp != symp:
          continue
        
        stock['nb_dict']['N_data'] += 1
        stock['x_list_list'].append(symp)
        stock['y_list_list'].append(trav_hist)
              
    return stock_dict
  
  def calculateCorr_travHistSymptomCorr(self):
    stock_dict = self.increment_travHistSymptomCorr()
    
    ## Loop over page
    for stock in stock_dict.values():
      assert len(stock['x_list_list']) == len(stock['y_list_list'])
      
      ## Make histogram
      x_hist = clt.Counter([x for x_list in stock['x_list_list'] for x in x_list])
      x_hist = sorted(x_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make histogram
      y_hist = clt.Counter([y for y_list in stock['y_list_list'] for y in y_list])
      y_hist = sorted(y_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make boolean matrix
      x_bool_mat = []
      for x_pair in x_hist:
        x_bool_arr = [int(x_pair[0] in x_list) for x_list in stock['x_list_list']]
        x_bool_mat.append(x_bool_arr)
      x_bool_mat = np.array(x_bool_mat)
      
      ## Make boolean matrix
      y_bool_mat = []
      for y_pair in y_hist:
        y_bool_arr = [int(y_pair[0] in y_list) for y_list in stock['y_list_list']]
        y_bool_mat.append(y_bool_arr)
      y_bool_mat = np.array(y_bool_mat)
      
      x_norm_mat = np.array([normalizeBoolArr(x_bool_arr) for x_bool_arr in x_bool_mat])
      y_norm_mat = np.array([normalizeBoolArr(y_bool_arr) for y_bool_arr in y_bool_mat])
      
      stock['x_hist'] = x_hist
      stock['y_hist'] = y_hist
      stock['corr_mat'] = y_norm_mat.dot(x_norm_mat.T);
      stock['count_mat'] = y_bool_mat.dot(x_bool_mat.T);
    return stock_dict
  
  def saveCsv_travHistSymptomCorr(self):
    stock_dict = self.calculateCorr_travHistSymptomCorr()
    
    n_trav = 10 ## For y
    n_symp = 10 ## For x
    
    for page, stock in stock_dict.items():
      ## Truncate
      corr_mat = stock['corr_mat'][:n_trav, :n_symp]
      count_mat = stock['count_mat'][:n_trav, :n_symp]
      x_dict = dict(stock['x_hist'][:n_symp])
      y_dict = dict(stock['y_hist'][:n_trav])
      
      ## Make matrix grid
      x_list = list(x_dict.keys())
      y_list = list(y_dict.keys())
      grid = np.meshgrid(x_list, y_list)
      
      ## Data for coefficient
      symp_arr = grid[0].flatten()
      trav_hist_arr = grid[1].flatten()
      corr_arr = corr_mat.flatten()
      corr_arr = np.around(corr_arr, decimals=4)
      count_arr = count_mat.flatten()
      
      ## Data for label
      tot_dict = stock['nb_dict'].copy()
      tot_dict.update(y_dict)
      tot_dict.update(x_dict)
      key_arr = list(tot_dict.keys())
      x_list_fr = [SYMPTOM_DICT[x]['fr'] for x in x_list]
      value_arr = list(tot_dict.values())
      label_arr_en = ['', '', ''] + y_list + [x[0].upper() + x[1:] for x in x_list]
      label_arr_fr = ['', '', ''] + [TRAVEL_HISTORY_DICT[y]['fr'] for y in y_list] + [x[0].upper() + x[1:] for x in x_list_fr]
      label_arr_zh = ['', '', ''] + [TRAVEL_HISTORY_DICT[y]['zh-tw'] for y in y_list] + [SYMPTOM_DICT[x]['zh-tw'] for x in x_list]
      
      ## Make data frame
      data_c = {'symptom': symp_arr, 'trav_hist': trav_hist_arr, 'corr': corr_arr, 'count': count_arr}
      data_c = pd.DataFrame(data_c)
      data_l = {'key': key_arr, 'count': value_arr, 'label': label_arr_en, 'label_fr': label_arr_fr, 'label_zh': label_arr_zh}
      data_l = pd.DataFrame(data_l)
      
      ## Save
      name = '%sprocessed_data/%s/travel_history_symptom_correlations.csv' % (DATA_PATH, page)
      saveCsv(name, data_c)
      name = '%sprocessed_data/%s/travel_history_symptom_correlations_label.csv' % (DATA_PATH, page)
      saveCsv(name, data_l)
    return
  
  def increment_ageSymptomCorr(self):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    age_list = self.getAge()
    symp_list = self.getSymptom()
    
    stock = {'x_list_list': [], 'y_list_list': [], 'nb_dict': {'N_total': 0, 'N_data': 0}}
    stock_dict = initializeStockDict_general(stock)
    
    ## Loop over case
    for report_date, trans, age, symp in zip(report_date_list, trans_list, age_list, symp_list):
      if trans != trans:
        continue
      
      index_list = makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock['nb_dict']['N_total'] += 1
        
        ## Remove NaN
        if age != age or symp != symp:
          continue
        
        stock['nb_dict']['N_data'] += 1
        stock['x_list_list'].append(symp)
        stock['y_list_list'].append(age)
            
    return stock_dict
  
  def calculateCorr_ageSymptomCorr(self):
    stock_dict = self.increment_ageSymptomCorr()
    
    ## Loop over page
    for stock in stock_dict.values():
      assert len(stock['x_list_list']) == len(stock['y_list_list'])
      
      ## Make histogram
      x_hist = clt.Counter([x for x_list in stock['x_list_list'] for x in x_list])
      x_hist = sorted(x_hist.items(), key=lambda t: t[1], reverse=True)
      
      ## Make histogram
      y_hist = clt.Counter(stock['y_list_list'])
      for age in AGE_DICT:
        y_hist[age] = y_hist.get(age, 0)
      y_hist = sorted(y_hist.items(), key=lambda t: str(len(t[0]))+t[0], reverse=True)
    
      ## Make boolean matrix
      x_bool_mat = []
      for x_pair in x_hist:
        x_bool_arr = [int(x_pair[0] in x_list) for x_list in stock['x_list_list']]
        x_bool_mat.append(x_bool_arr)
      x_bool_mat = np.array(x_bool_mat)
      
      ## Make boolean matrix
      y_bool_mat = []
      for y_pair in y_hist:
        y_bool_arr = [int(y_pair[0] == y_list) for y_list in stock['y_list_list']]
        y_bool_mat.append(y_bool_arr)
      y_bool_mat = np.array(y_bool_mat)
      
      x_norm_mat = np.array([normalizeBoolArr(x_bool_arr) for x_bool_arr in x_bool_mat])
      y_norm_mat = np.array([normalizeBoolArr(y_bool_arr) for y_bool_arr in y_bool_mat])
      
      stock['x_hist'] = x_hist
      stock['y_hist'] = y_hist
      stock['corr_mat'] = y_norm_mat.dot(x_norm_mat.T);
      stock['count_mat'] = y_bool_mat.dot(x_bool_mat.T);
    return stock_dict
  
  def saveCsv_ageSymptomCorr(self):
    stock_dict = self.calculateCorr_ageSymptomCorr()
    
    for page, stock in stock_dict.items():
      n_age = stock['corr_mat'].shape[0] ## For y
      n_symp = 10 ## For x
    
      ## Truncate
      corr_mat = stock['corr_mat'][:n_age, :n_symp]
      count_mat = stock['count_mat'][:n_age, :n_symp]
      x_dict = dict(stock['x_hist'][:n_symp])
      y_dict = dict(stock['y_hist'][:n_age])
      
      ## Make matrix grid
      x_list = list(x_dict.keys())
      y_list = list(y_dict.keys())
      grid = np.meshgrid(x_list, y_list)
      
      ## Data for coefficient
      symp_arr = grid[0].flatten()
      age_arr = grid[1].flatten()
      corr_arr = corr_mat.flatten()
      corr_arr = np.around(corr_arr, decimals=4)
      count_arr = count_mat.flatten()
      
      ## Data for total
      tot_dict = stock['nb_dict'].copy()
      tot_dict.update(y_dict)
      tot_dict.update(x_dict)
      key_arr = list(tot_dict.keys())
      x_list_fr = [SYMPTOM_DICT[x]['fr'] for x in x_list]
      value_arr = list(tot_dict.values())
      label_arr_en = ['', ''] + y_list + [x[0].upper() + x[1:] for x in x_list]
      label_arr_fr = ['', ''] + [AGE_DICT[y]['fr'] for y in y_list] + [x[0].upper() + x[1:] for x in x_list_fr]
      label_arr_zh = ['', ''] + [AGE_DICT[y]['zh-tw'] for y in y_list] + [SYMPTOM_DICT[x]['zh-tw'] for x in x_list]
      
      ## Make data frame
      data_c = {'symptom': symp_arr, 'age': age_arr, 'corr': corr_arr, 'count': count_arr}
      data_c = pd.DataFrame(data_c)
      data_l = {'key': key_arr, 'count': value_arr, 'label': label_arr_en, 'label_fr': label_arr_fr, 'label_zh': label_arr_zh}
      data_l = pd.DataFrame(data_l)
      
      ## Save
      name = '%sprocessed_data/%s/age_symptom_correlations.csv' % (DATA_PATH, page)
      saveCsv(name, data_c)
      name = '%sprocessed_data/%s/age_symptom_correlations_label.csv' % (DATA_PATH, page)
      saveCsv(name, data_l)
    return
  
  def increment_diffByTransmission(self):
    report_date_list = self.getReportDate()
    entry_date_list = self.getEntryDate()
    onset_date_list = self.getOnsetDate()
    trans_list = self.getTransmission()
    
    stock = {'imported': [], 'local': [], 'others': []}
    stock_dict = initializeStockDict_general(stock)

    for report_date, entry_date, onset_date, trans in zip(report_date_list, entry_date_list, onset_date_list, trans_list):
      if trans != trans:
        continue
      
      if trans in ['imported', 'local']:
        col_tag = trans
      else:
        col_tag = 'others'
        
      ord_rep = ISODateToOrd(report_date)
      ord_entry = ISODateToOrd(entry_date) if entry_date == entry_date else 0
      ord_onset = ISODateToOrd(onset_date) if onset_date == onset_date else 0
      diff = min(ord_rep-ord_entry, ord_rep-ord_onset)
      
      index_list = makeIndexList(report_date)
      
      for ind, stock in zip(index_list, stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock[col_tag].append(diff)
          
    return stock_dict
  
  def saveCsv_diffByTransmission(self):
    stock_dict = self.increment_diffByTransmission()
    
    ## Histogram bins
    bins = np.arange(-0.5, 31, 1)
    bins[-1] = 999
    
    for page, stock in stock_dict.items():
      n_imp, ctr_bins = makeHist(stock['imported'], bins)
      n_local, ctr_bins = makeHist(stock['local'], bins)
      n_other, ctr_bins = makeHist(stock['other'], bins)
      n_tot = n_imp + n_local + n_other
      
      n_imp = n_imp.round(0).astype(int)
      n_local = n_local.round(0).astype(int)
      n_other = n_other.round(0).astype(int)
      n_tot = n_tot.round(0).astype(int)
      ctr_bins = ctr_bins.round(0).astype(int)
      ctr_bins[-1] = 30
      
      data = {'difference': ctr_bins, 'all': n_tot, 'imported': n_imp, 'local': n_local, 'other': n_other}
      data = pd.DataFrame(data)
      
      name = '%sprocessed_data/%s/difference_by_transmission.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
  
  def updateNewCaseCounts(self, stock):
    report_date_list = self.getReportDate()
    trans_list = self.getTransmission()
    
    ## Date
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = getTodayOrdinal()
    date_arr = [ordDateToISO(ord_) for ord_ in range(ord_ref, ord_today)]
    nb_days = ord_today - ord_ref
    
    ## Update stock
    stock['date'] = date_arr
    stock['new_imported'] = np.zeros(nb_days, dtype=int)
    stock['new_local'] = np.zeros(nb_days, dtype=int)
    stock['new_cases'] = np.zeros(nb_days, dtype=int)
    
    ## Loop over case
    for report_date, trans in zip(report_date_list, trans_list):
      if trans != trans:
        continue
      
      ind = ISODateToOrd(report_date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      stock['new_cases'][ind] += 1
      
      if trans == 'imported':
        stock['new_imported'][ind] += 1
      elif trans == 'local':
        stock['new_local'][ind] += 1
    return
  
  def saveCsv(self):
    self.saveCsv_keyNb()
    self.saveCsv_caseByTransmission()
    #self.saveCsv_caseByDetection()
    #self.saveCsv_travHistSymptomCorr()
    #self.saveCsv_ageSymptomCorr()
    #self.saveCsv_diffByTransmission()
    return

################################################################################
## Classes - status sheet

class StatusSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_week_nb = '週次'
    self.coltag_new_nb_cases = '新增確診'
    self.coltag_new_cases_per_week = '每週新增確診'
    self.coltag_cum_cases = '確診總人數'
    self.coltag_new_males = '新增男性'
    self.coltag_cum_males = '男性總數'
    self.coltag_male_frac = '確診男性率'
    self.coltag_new_females = '新增女性'
    self.coltag_cum_females = '女性總數'
    self.coltag_female_frac = '確診女性率'
    self.coltag_new_soldiers = '新增軍人'
    self.coltag_cum_soldiers = '敦睦總人數'
    self.coltag_soldier_frac = '軍隊率'
    self.coltag_new_imported = '新增境外'
    self.coltag_cum_imported = '境外總人數'
    self.coltag_imported_frac = '境外率'
    self.coltag_newLocal = '新增本土'
    self.coltag_cumLocal = '本土總人數'
    self.coltag_local_frac = '本土率'
    self.coltag_new_deaths = '新增死亡'
    self.coltag_cum_deaths = '死亡總人數'
    self.coltag_death_frac = '死亡率'
    self.coltag_new_unknown = '當日未知感染源數'
    self.coltag_cum_unknown = '未知感染源總數'
    self.coltag_cum_known = '已知感染源數'
    self.coltag_new_dis = '新增解除隔離'
    self.coltag_cum_dis = '解除隔離數'
    self.coltag_cum_dis_and_deaths = '解除隔離+死亡'
    self.coltag_cum_hosp = '未解除隔離數'
    self.coltag_notes = '備註'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_status_evolution.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    date_list = data[self.coltag_date].values
    self.ind_2021 = (date_list == '2021分隔線').argmax()
    
    cum_dis_list = data[self.coltag_cum_dis].values
    ind = (cum_dis_list == cum_dis_list) * (date_list != '2021分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
  
  def getDate(self):
    date_list = []
    y = 2020
    
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2021:
        y = 2021 #WARNING
        
      mmdd_zh = date.split('月')
      m = int(mmdd_zh[0])
      dd_zh = mmdd_zh[1].split('日')
      d = int(dd_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
    
  def getCumCases(self):
    return self.getCol(self.coltag_cum_cases).astype(int)
    
  def getCumDeaths(self):
    return self.getCol(self.coltag_cum_deaths).astype(int)
    
  def getCumDischarged(self):
    cum_dis_list = self.getCol(self.coltag_cum_dis)
    ind = cum_dis_list == '0.00%'
    cum_dis_list[ind] = 0
    return cum_dis_list.astype(int)
    
  def getCumHospitalized(self):
    return self.getCol(self.coltag_cum_hosp).astype(int)
    
  def saveCsv_statusEvolution(self):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_dis_list = self.getCumDischarged()
    cum_hosp_list = self.getCumHospitalized()
    
    stock = {'date': date_list, 'discharged': cum_dis_list, 'hospitalized': cum_hosp_list, 'death': cum_deaths_list}
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/status_evolution.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
    
  def saveCsv_deathCounts(self):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_deaths_list_offset = np.insert(cum_deaths_list[:-1], 0, 0)
    new_deaths_list = cum_deaths_list - cum_deaths_list_offset
    avg_arr = makeMovingAverage(new_deaths_list)
    
    stock = {'date': date_list, 'death': new_deaths_list, 'death_avg': avg_arr}
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/death_counts.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
    
  def saveCsv_hospitalizationOrIsolation(self):
    date_list = self.getDate()
    cum_hosp_list = self.getCumHospitalized()
    
    stock = {'date': date_list, 'hospitalized': cum_hosp_list}
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/hospitalization_or_isolation.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
    
  def updateCumCounts(self, stock):
    date_list = self.getDate()
    cum_deaths_list = self.getCumDeaths()
    cum_cases_list = self.getCumCases()
    
    stock_tmp = {'date': date_list, 'cum_cases': cum_cases_list, 'cum_deaths': cum_deaths_list}
    stock_tmp = pd.DataFrame(stock_tmp)
    stock_tmp = adjustDateRange(stock_tmp)
    
    stock['cum_cases'] = stock_tmp['cum_cases'].values
    stock['cum_deaths'] = stock_tmp['cum_deaths'].values
    return
  
  def saveCsv(self):
    self.saveCsv_statusEvolution()
    self.saveCsv_deathCounts()
    self.saveCsv_hospitalizationOrIsolation()
    return

################################################################################
## Classes - test sheet

class TestSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '日期'
    self.coltag_from_extended = '擴大監測'
    self.coltag_cum_from_extended = '擴大監測累計'
    self.coltag_from_qt = '居檢送驗'
    self.coltag_cum_from_qt = '居檢送驗累計'
    self.coltag_from_clin_def = '武肺通報'
    self.coltag_cum_from_clin_def = '武肺通報累計'
    self.coltag_nb_tests = '檢驗人數'
    self.coltag_cum_nb_tests = '檢驗人數累計'
    self.coltag_confirmed = '確診人數'
    self.coltag_cum_confirmed = '確診人數累計'
    self.coltag_daily_pos_rate = '單日陽性率'
    self.coltag_tot_pos_rate = '陽性率'
    self.coltag_criteria = '擴大之檢驗標準(含擴大監測標準及通報定義)'
    self.coltag_note = '來源：疾管署（每天1am更新）'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_number_of_tests.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    #https://covid19dashboard.cdc.gov.tw/dash4
    
    from_extended_list = data[self.coltag_from_extended].values
    self.ind_2021 = (from_extended_list == '2021分隔線').argmax()
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = []
    y = 2020
    
    for i, date in enumerate(self.getCol(self.coltag_date)):
      if i >= self.ind_2021:
        y = 2021
      
      md_slash = date.split('/')
      m = int(md_slash[0])
      d = int(md_slash[1])
      
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
  
  def getFromExtended(self):
    from_ext_list = []
    for from_ext in self.getCol(self.coltag_from_extended):
      if from_ext != from_ext: ## Is nan
        from_ext_list.append(0)
        continue
      
      try:
        from_ext = from_ext.lstrip('+').split(',')
        from_ext = int(''.join(from_ext))
        from_ext_list.append(from_ext)
      except:
        print('From extended, %s' % from_ext)
        from_ext_list.append(0)
    return from_ext_list

  def getFromQT(self):
    from_qt_list = []
    for from_qt in self.getCol(self.coltag_from_qt):
      if from_qt != from_qt: ## Is nan
        from_qt_list.append(0)
        continue
        
      try:
        from_qt = from_qt.lstrip('+').split(',')
        from_qt = int(''.join(from_qt))
        from_qt_list.append(from_qt)
      except:
        print('From extended, %s' % from_qt)
        from_qt_list.append(0)
    return from_qt_list

  def getFromClinDef(self):
    from_clin_def_list = []
    for from_clin_def in self.getCol(self.coltag_from_clin_def):
      if from_clin_def != from_clin_def: ## Is nan
        from_clin_def_list.append(0)
        continue
        
      try:
        from_clin_def = from_clin_def.lstrip('+').split(',')
        from_clin_def = int(''.join(from_clin_def))
        from_clin_def_list.append(from_clin_def)
      except:
        print('Clinical definition, %s' % from_clin_def)
        from_clin_def_list.append(0)
    return from_clin_def_list

  def getCriteria(self):
    crit_list = []
    
    for crit in self.getCol(self.coltag_criteria):
      crit_list.append(crit)
    return crit_list
  
  def saveCsv_testByCriterion(self):
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    value_arr = np.array(from_clin_def_list, dtype=int) + np.array(from_qt_list, dtype=int) + np.array(from_ext_list, dtype=int)
    avg_arr = makeMovingAverage(value_arr)
    stock = {'date': date_list, 'total': value_arr, 'total_avg': avg_arr}
    
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/test_by_criterion.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
  
  def printCriteria(self):
    date_list = self.getDate()
    crit_list = self.getCriteria()
    
    url_list = {
      '2020-01-16': 'http://at.cdc.tw/6Jlc8w', ##   [(F&R)|P & Wuhan] | [(F&R)|P & contact]
      '2020-01-21': 'http://at.cdc.tw/9EM3mV', ##   [(F&R)|P & Wuhan] | [(F&R)|P & contact] | [P & China]
      '2020-01-25': 'http://at.cdc.tw/l99yHG', ##   [F|R|P & (Hubei | contact therein F&R)] | [F|R|P & contact] | [P & China]
      '2020-02-01': 'http://at.cdc.tw/8wN31W', ##   [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China]
      '2020-02-02': 'http://at.cdc.tw/CG90qP', ##   Started QT
                                               ##   [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong)]
      '2020-02-03': 'http://at.cdc.tw/8IYT56',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong | Wenzhou)]
      '2020-02-05': 'http://at.cdc.tw/th3S0o',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | Guangdong | Zhejiang)]
      '2020-02-06': 'http://at.cdc.tw/4sU035',   ## [F|R|P & (Hubei | contact therein F|R)] | [F|R|P & contact] | [P & China] + [F|R|P & (KM-track | China-HK-MC)]
      '2020-02-09': 'http://at.cdc.tw/n48e22',   ## Reminer TOCC
      '2020-02-10': 'http://at.cdc.tw/4sU035',   ## Reminer 2020-02-06
      '2020-02-12': 'http://at.cdc.tw/73gugZ',   ## Checked back on flu negative 
      '2020-02-15': 'http://at.cdc.tw/072iKp', ##   [F|R|P & (Hubei | Guangdong | Henan | Zhejiang] | [F|R|P & contact] | [P & China-HK-MC] + [F|R|P & (Singapore | Thailand)]
      '2020-02-16': 'http://at.cdc.tw/275pmA', ##   Started community transmission
                                               ##   [F|R|P & (Hubei | Guangdong | Henan | Zhejiang] | [F|R|P & contact] | [P & China-HK-MC]                   + [F|R|P & other countries] | [F|R & cluster] | [P & (medic | cluster | unknown)]
      '2020-02-29': 'http://at.cdc.tw/e7C892', ##   Merged QT in clinical case
                                               ##   [F|R|P & (China-HK-MC | Korea | Italy)]                               | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-01': 'http://at.cdc.tw/L20G51',   ## [F|R|P & (China-HK-MC | Korea | Italy | Iran)]                        | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-14': 'http://at.cdc.tw/Nh5CL8',   ## [F|R|P & (China-HK-MC | Korea | EU | Iran | Dubai)]                   | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-16': 'http://at.cdc.tw/6tK52h',   ## [F|R|P & (China-HK-MC | Korea | Europe | M East | C Asia | N Africa)] | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-17': 'http://at.cdc.tw/M24nK2',   ## Europe check-back
      '2020-03-18': 'http://at.cdc.tw/Y3Y592',   ## [F|R|P & (China-HK-MC | Korea | Europe | M East | C Asia | N Africa | US | Canada | Aussie | NZ)] 
                                                 ##                                                                       | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
     #'2020-03-19': 'http://at.cdc.tw/W9XhV5',   ## [F|R|P & (Asia | Europe | N Africa | US | Canada | Aussie | NZ)]      | [F|R|P & contact] | [P & unknown] + [F|R & other countries] | [F|R & cluster]
      '2020-03-20': 'http://at.cdc.tw/328jaz',   ## [F|R|P & global]                                                      | [F|R|P & contact] | [P & unknown] + [F|R & cluster]
      '2020-03-25': 'https://youtu.be/bVv-u2bcV_g?t=782', 
                                                 ## [F|R|P & global] | [F|R|P & contact] | [P & unknown] + [F|R & (medic | cluster)]
      '2020-04-01': 'http://at.cdc.tw/zU3557', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R & unknown]
      '2020-04-03': 'http://at.cdc.tw/1vI50K', ##   [(F|R|P|Ag|An)   & (global | contact therein F|R)] | [F|R|P|Ag|An & contact] | [F|R|P|Ag|An & cluster] | [P & unknown] + [F|R|Ag|An & unknown]
      '2020-04-05': 'http://at.cdc.tw/Q96xrb', ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & unknown]
      '2020-04-24': 'http://at.cdc.tw/R3sI9v'  ##   [(F|R|D-unknown) & (global | contact therein F|R)] | [F|R|D-unknown & contact] | [F|R & cluster] | [P] + [F|R|Ag|An & (cluster | unknown)]
    }
    
    for date, crit in zip(date_list, crit_list):
      if crit != crit:
        pass
      else:
        print(date, crit, url_list.get(date, np.nan))
        print()
    return
  
  def saveCsv_criteriaTimeline(self):
    crit_dict = {
      '2020-01-16': {
        'en': 'Wuhan with fever or resp. symp. or pneumonia\nClose contact of confirmed cases', ## Close contact of confirmed cases or ppl satisfying prev. cond.
        'fr': 'Wuhan avec fièvre ou sympt. resp. ou pneumonie\nContacts proches des cas confirmés',
        'zh-tw': '武漢旅遊史且有發燒或呼吸道症狀或肺炎\n確診案例之密切接觸者'
      },
      '2020-01-21': {
        'en': 'China with pneumonia',
        'fr': 'Chine avec pneumonie',
        'zh-tw': '中國旅遊史且有肺炎'
      },
      '2020-01-25': {
        'en': 'Hubei',
        'fr': 'Hubei',
        'zh-tw': '湖北旅遊史'
      },
      '2020-02-02': {
        'en': 'Started home quarantine scheme\nGuangdong', ## Kinmen & Mazhu fast tracks
        'fr': 'Début de la quarantaine à domicile\nGuangdong',
        'zh-tw': '啟動居家檢疫與居家隔離\n廣東旅遊史'
      },
      '2020-02-03': {
        'en': 'Wenzhou',
        'fr': 'Wenzhou',
        'zh-tw': '溫州旅遊史',
      },
      '2020-02-05': {
        'en': 'Zhejiang',
        'fr': 'Zhejiang',
        'zh-tw': '浙江旅遊史',
      },
      '2020-02-06': {
        'en': 'China, Hong Kong, Macao',
        'fr': 'Chine, Hong Kong, Macao',
        'zh-tw': '中國、香港、澳門旅遊史',
      },
      '2020-02-12': {
        'en': 'Checked back on flu-negative cases',
        'fr': 'Vérification des cas négatifs de grippe',
        'zh-tw': '回溯採檢有呼吸道症狀但流感陰性之病患',
      },
      '2020-02-15': {
        'en': 'Singapore, Thailand',
        'fr': 'Singapour, Thaïlande',
        'zh-tw': '新加坡、泰國旅遊史',
      },
      '2020-02-16': {
        'en': 'Started community monitoring\nMedics or local cluster with pneumonia',
        'fr': 'Surveillance supplémentaire des\ntransmissions locales\nClusters locaux ou de soignants\navec pneumonie',
        'zh-tw': '啟動擴大社區監測\n醫護或本土肺炎群聚',
      },
      '2020-02-29': {
        'en': 'Korea, Italy\nAll pneumonia\nLocal cluster with resp. symp.', ## Merged QT into clinical
        'fr': 'Corée, Italie\nToute pneumonie\nRegroupement local\navec sympt. resp.', 
        'zh-tw': '韓國、義大利旅遊史\n所有肺炎\n本土呼吸道症狀群聚'
      },
      '2020-03-01': {
        'en': 'Iran',
        'fr': 'Iran',
        'zh-tw': '伊朗旅遊史',
      },
      '2020-03-17': {
        'en': 'Europe, Middle East, Central Asia, North Africa',
        'fr': 'Europe, Moyen-Orient,\nAsie centrale, Afrique du Nord',
        'zh-tw': '歐洲、中東、西亞、北非旅遊史',
      },
      '2020-03-19': {
        'en': 'Asia, USA, Canada, Australia, New Zealand',
        'fr': 'Asie, États-Unis, Canada,\nAustralie, Nouvelle-Zélande',
        'zh-tw': '亞洲、美國、加拿大、澳洲、紐西蘭旅遊史',
      },
      '2020-03-21': {
        'en': 'Global',
        'fr': 'Monde entier',
        'zh-tw': '所有入境旅客',
      },
      '2020-03-25': {
        'en': 'Medics with resp. symp.',
        'fr': 'Soignants avec sympt. resp.',
        'zh-tw': '有呼吸道症狀之醫護',
      },
      '2020-04-01': {
        'en': 'Dysnosmia, dysgeusia',
        'fr': 'Anosmie, agueusie',
        'zh-tw': '味嗅覺異常',
      },
      '2020-04-05': {
        'en': 'Diarrhea',
        'fr': 'Diarrhée',
        'zh-tw': '腹瀉'
      },
      '2020-07-26': {
        'en': 'Philippines all passengers',
        'fr': 'Philippines tous les passagers',
        'zh-tw': '菲律賓所有旅客'
      }
    }
    
    date_list = [key for key, value in crit_dict.items()]
    en_list = [value['en'] for key, value in crit_dict.items()]
    fr_list = [value['fr'] for key, value in crit_dict.items()]
    zh_tw_list = [value['zh-tw'] for key, value in crit_dict.items()]
    
    stock = {'date': date_list, 'en': en_list, 'fr': fr_list, 'zh-tw': zh_tw_list}
    data = pd.DataFrame(stock)
    
    name = '%sprocessed_data/criteria_timeline.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def updateNewTestCounts(self, stock):
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = getTodayOrdinal()
    nb_days = ord_today - ord_ref
    
    stock['new_tests'] = np.zeros(nb_days, dtype=int)
    
    date_list = self.getDate()
    from_ext_list = self.getFromExtended()
    from_qt_list = self.getFromQT()
    from_clin_def_list = self.getFromClinDef()
    
    for date, from_clin_def, from_qt, from_ext in zip(date_list, from_clin_def_list, from_qt_list, from_ext_list):
      ind = ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      stock['new_tests'][ind] = from_clin_def + from_qt + from_ext
    return
  
  def saveCsv(self):
    self.saveCsv_testByCriterion()
    self.saveCsv_criteriaTimeline()
    return

################################################################################
## Classes - border sheet

class BorderSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '日期 '
    self.tag_dict = {
      'entry': '資料來源：各機場、港口入出境人數統計資料 入境總人數',
      'exit': '資料來源：各機場、港口入出境人數統計資料 出境總人數',
      'both': '入出境總人數_小計 ',
      'Taoyuan A1 entry': '桃園一期 入境查驗', 
      'Taoyuan A1 exit': '桃園一期 出境查驗', 
      'Taoyuan A1 both': '桃園一期 小計', 
      'Taoyuan A2 entry': '桃園二期 入境查驗', 
      'Taoyuan A2 exit': '桃園二期 出境查驗', 
      'Taoyuan A2 both': '桃園二期 小計', 
      'Taoyuan A both': '桃園一_二期 合計', 
      'Kaohsiung A entry': '高雄機場 入境查驗', 
      'Kaohsiung A exit': '高雄機場 出境查驗', 
      'Kaohsiung A both': '高雄機場 小計', 
      'Keelung S entry': '基隆港 入境查驗', 
      'Keelung S exit': '基隆港 出境查驗', 
      'Keelung S both': '基隆港 小計', 
      'Taichung S entry': '台中港 入境查驗', 
      'Taichung S exit': '台中港 出境查驗', 
      'Taichung S both': '台中港 小計', 
      'Kaohsiung S entry': '高雄港 入境查驗', 
      'Kaohsiung S exit': '高雄港 出境查驗', 
      'Kaohsiung S both': '高雄港 小計', 
      'Hualien S entry': '花蓮港 入境查驗', 
      'Hualien S exit': '花蓮港 出境查驗', 
      'Hualien S both': '花蓮港 小計', 
      'Yilan S entry': '蘇澳港 入境查驗', 
      'Yilan S exit': '蘇澳港 出境查驗', 
      'Yilan S both': '蘇澳港 小計', 
      'Penghu X entry': '澎湖港 入境查驗', 
      'Penghu X exit': '澎湖港 出境查驗', 
      'Penghu X both': '澎湖港 小計', 
      'Tainan A entry': '台南機場 入境查驗', 
      'Tainan A exit': '台南機場 出境查驗', 
      'Tainan A both': '台南機場 小計', 
      'Tainan S entry': '安平港 入境查驗', 
      'Tainan S exit': '安平港 出境查驗', 
      'Tainan S both': '安平港 小計', 
      'Taipei A entry': '松山機場 入境查驗', 
      'Taipei A exit': '松山機場 出境查驗', 
      'Taipei A both': '松山機場 小計', 
      'Kinmen SW entry': '金門港_水頭 入境查驗', 
      'Kinmen SW exit': '金門港_水頭 出境查驗', 
      'Kinmen SW both': '金門港_水頭 小計', 
      'Mazu X entry': '馬祖 入境查驗', 
      'Mazu X exit': '馬祖 出境查驗', 
      'Mazu X both': '馬祖 小計', 
      'Hualien A entry': '花蓮機場 入境查驗', 
      'Hualien A exit': '花蓮機場 出境查驗', 
      'Hualien A both': '花蓮機場 小計', 
      'Yunlin S entry': '麥寮港 入境查驗', 
      'Yunlin S exit': '麥寮港 出境查驗', 
      'Yunlin S both': '麥寮港 小計', 
      'Penghu A entry': '馬公機場 入境查驗', 
      'Penghu A exit': '馬公機場 出境查驗', 
      'Penghu A both': '馬公機場 小計', 
      'Taichung A entry': '台中機場 入境查驗', 
      'Taichung A exit': '台中機場 出境查驗', 
      'Taichung A both': '台中機場 小計', 
      'Hualien SN entry': '和平港 入境查驗', 
      'Hualien SN exit': '和平港 出境查驗', 
      'Hualien SN both': '和平港 小計', 
      'Kinmen A entry': '金門機場 入境查驗', 
      'Kinmen A exit': '金門機場 出境查驗', 
      'Kinmen A both': '金門機場 小計', 
      'Mazu AS entry': '南竿機場 入境查驗', 
      'Mazu AS exit': '南竿機場 出境查驗', 
      'Mazu AS both': '南竿機場 小計', 
      'Mazu AN entry': '北竿機場 入境查驗', 
      'Mazu AN exit': '北竿機場 出境查驗', 
      'Mazu AN both': '北竿機場 小計', 
      'Chiayi A entry': '嘉義機場 入境查驗', 
      'Chiayi A exit': '嘉義機場 出境查驗', 
      'Chiayi A both': '嘉義機場 小計', 
      'Taipei S entry': '台北港 入境查驗', 
      'Taipei S exit': '台北港 出境查驗', 
      'Taipei S both': '台北港 小計', 
      'Pintung SN1 entry': '東港 入境查驗', 
      'Pintung SN1 exit': '東港 出境查驗', 
      'Pintung SN1 both': '東港 小計', 
      'Taitung A entry': '台東機場 入境查驗', 
      'Taitung A exit': '台東機場 出境查驗', 
      'Taitung A both': '台東機場 小計', 
      'Mazu S entry': '北竿白沙港 入境查驗', 
      'Mazu S exit': '北竿白沙港 出境查驗', 
      'Mazu S both': '北竿白沙港 小計', 
      'Chiayi S entry': '布袋港 入境查驗', 
      'Chiayi S exit': '布袋港 出境查驗', 
      'Chiayi S both': '布袋港 小計', 
      'Taoyuan SS entry': '大園沙崙港 入境查驗', 
      'Taoyuan SS exit': '大園沙崙港 出境查驗', 
      'Taoyuan SS both': '大園沙崙港 小計', 
      'Taitung S entry': '台東富岡港 入境查驗', 
      'Taitung S exit': '台東富岡港 出境查驗', 
      'Taitung S both': '台東富岡港 小計', 
      'Penghu S entry': '馬公港 入境查驗', 
      'Penghu S exit': '馬公港 出境查驗', 
      'Penghu S both': '馬公港 小計', 
      'Taoyuan SN entry': '桃園竹圍港 入境查驗', 
      'Taoyuan SN exit': '桃園竹圍港 出境查驗', 
      'Taoyuan SN both': '桃園竹圍港 小計', 
      'Kinmen SE entry': '金門港_料羅 入境查驗', 
      'Kinmen SE exit': '金門港_料羅 出境查驗', 
      'Kinmen SE both': '金門港_料羅 小計', 
      'Pintung SS entry': '後壁湖遊艇港 入境查驗', 
      'Pintung SS exit': '後壁湖遊艇港 出境查驗', 
      'Pintung SS both': '後壁湖遊艇港 小計', 
      'New Taipei S entry': '淡水第二漁港遊艇碼頭 入境查驗', 
      'New Taipei S exit': '淡水第二漁港遊艇碼頭 出境查驗', 
      'New Taipei S both': '淡水第二漁港遊艇碼頭 小計', 
      'Pintung SN2 entry': '屏東大鵬灣遊艇港 入境查驗', 
      'Pintung SN2 exit': '屏東大鵬灣遊艇港 出境查驗', 
      'Pintung SN2 both': '屏東大鵬灣遊艇港 小計', 
      'Pintung A entry': '屏東機場 入境查驗', 
      'Pintung A exit': '屏東機場 出境查驗', 
      'Pintung A both': '屏東機場 小計'
    }
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_border_statistics.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True, header=[0, 1])
    #https://data.gov.tw/dataset/12369
    
    ## Change header
    hdr = []
    for pair in data.columns:
      if 'Unnamed:' in pair[0]:
        hdr.append((hdr[-1][0], pair[1]))
      elif 'Unnamed:' in pair[1]:
        hdr.append((pair[0], ''))
      else:
        hdr.append(pair)
    data.columns = [pair[0]+' '+pair[1] for pair in hdr]
    
    date_list = data[self.coltag_date].values
    ind = date_list == date_list
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = ['%s-%s-%s' % (date[:4], date[4:6], date[6:8]) for date in self.getCol(self.coltag_date)]
    return date_list
    
  def getNumbers(self, tag):
    nb_list = [int(out.replace(',', '')) for out in self.getCol(self.tag_dict[tag])]
    return nb_list
    
  def getEntry(self):
    return self.getNumbers('entry')
    
  def getExit(self):
    return self.getNumbers('exit')
    
  def getBoth(self):
    return self.getNumbers('both')
    
  def getAirportBreakdown(self, tag='both'):
    label_list = [
      'Taipei A',
      'Taoyuan A1',
      'Taoyuan A2',
      'Taichung A',
      'Chiayi A',
      'Tainan A',
      'Kaohsiung A',
      'Pintung A',
      
      'Hualien A',
      'Taitung A',
      'Penghu A',
      'Kinmen A',
      'Mazu AN',
      'Mazu AS'
    ]
    
    air_list_break = []
    for label in label_list:
      air_list_break.append((label, self.getNumbers(label+' '+tag)))
    return air_list_break
  
  def getSeaportBreakdown(self, tag='both'):
    label_list = [
      'Keelung S',
      'New Taipei S',
      'Taipei S',
      'Taoyuan SN',
      'Taoyuan SS',
      'Taichung S',
      'Yunlin S',
      'Chiayi S',
      'Tainan S',
      'Kaohsiung S',
      'Pintung SN1',
      'Pintung SN2',
      'Pintung SS',
      
      'Yilan S',
      'Hualien SN',
      'Hualien S',
      'Taitung S',
      'Penghu S',
      'Kinmen SW',
      'Kinmen SE',
      'Mazu S',
    ]
    
    sea_list_break = []
    for label in label_list:
      sea_list_break.append((label, self.getNumbers(label+' '+tag)))
    return sea_list_break
  
  def getNotSpecifiedBreakdown(self, tag='both'):
    label_list = [
      'Penghu X',
      'Mazu X'
    ]
    
    not_spec_list_break = []
    for label in label_list:
      not_spec_list_break.append((label, self.getNumbers(label+' '+tag)))
    return not_spec_list_break
  
  def getAirport(self, tag='both'):
    air_list_break = self.getAirportBreakdown(tag=tag)
    air_list_break = [air_list[1] for air_list in air_list_break]
    air_list = np.array(air_list_break).sum(axis=0)
    return air_list
  
  def getSeaport(self, tag='both'):
    sea_list_break = self.getSeaportBreakdown(tag=tag)
    sea_list_break = [sea_list[1] for sea_list in sea_list_break]
    sea_list = np.array(sea_list_break).sum(axis=0)
    return sea_list
  
  def getNotSpecified(self, tag='both'):
    not_spec_list_break = self.getNotSpecifiedBreakdown(tag=tag)
    not_spec_list_break = [not_spec_list[1] for not_spec_list in not_spec_list_break]
    not_spec_list = np.array(not_spec_list_break).sum(axis=0)
    return not_spec_list
  
  def saveCsv_borderStats(self):
    date_list = self.getDate()
    stock = {'date': date_list}
    col_tag_list = ['entry', 'exit', 'total']
    
    for col_tag in col_tag_list:
      if col_tag == 'total':
        tag = 'both'
      else:
        tag = col_tag
        
      air_list = self.getAirport(tag=tag)
      sea_list = self.getSeaport(tag=tag)
      not_spec_list = self.getNotSpecified(tag=tag)
      stock[col_tag] = np.array(air_list, dtype=int) + np.array(sea_list, dtype=int) + np.array(not_spec_list, dtype=int)
      
    ## Loop over column
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = makeMovingAverage(stock[col_tag])
      
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/border_statistics.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
      
  def updateNewEntryCounts(self, stock):
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = getTodayOrdinal()
    nb_days = ord_today - ord_ref
    
    stock['new_entries'] = np.zeros(nb_days, dtype=int)
    
    date_list = self.getDate()
    entry_list = self.getEntry()
    
    for date, entry in zip(date_list, entry_list):
      ind = ISODateToOrd(date) - ord_ref
      if ind < 0 or ind >= nb_days:
        print('Bad ind_r = %d' % ind)
        continue
      
      stock['new_entries'][ind] = entry
    return
  
  def saveCsv(self):
    self.saveCsv_borderStats()
    return

################################################################################
## Classes - timeline sheet

class TimelineSheet(Template):
  def __init__(self, verbose=True):
    self.coltag_date = '時間'
    self.coltag_twn_evt = '台灣事件'
    self.coltag_criteria = '台灣檢驗標準'
    self.coltag_global_evt = '全球事件'
    self.coltag_key_evt = '重點事件'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_timeline.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    date_list = data[self.coltag_date].values
    ind = (date_list == date_list) * (date_list != '2021分隔線')
    self.data    = data[ind]
    self.n_total = ind.sum()
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return 
    
  def getDate(self):
    date_list = []
    
    for date in self.getCol(self.coltag_date):
      yyyymmddday_zh = date.split('年')
      y = int(yyyymmddday_zh[0])
      mmddday_zh = yyyymmddday_zh[1].split('月')
      m = int(mmddday_zh[0])
      ddday_zh = mmddday_zh[1].split('日')
      d = int(ddday_zh[0])
      date = '%04d-%02d-%02d' % (y, m, d)
      date_list.append(date)
    return date_list
  
  def getTWNEvt(self):
    twn_evt_list = []
    for twn_evt in self.getCol(self.coltag_twn_evt):
      if twn_evt == twn_evt:
        twn_evt = twn_evt.rstrip('\n')
        twn_evt = '\n'.join(twn_evt.split('\n\n\n'))
        twn_evt = '\n'.join(twn_evt.split('\n\n'))
        twn_evt_list.append(twn_evt)
      else:
        twn_evt_list.append(twn_evt)
    return twn_evt_list
  
  def getGlobalEvt(self):
    global_evt_list = []
    for global_evt in self.getCol(self.coltag_global_evt):
      if global_evt == global_evt:
        global_evt = global_evt.rstrip('\n')
        global_evt = '\n'.join(global_evt.split('\n\n\n'))
        global_evt = '\n'.join(global_evt.split('\n\n'))
        global_evt_list.append(global_evt)
      else:
        global_evt_list.append(global_evt)
    return global_evt_list
  
  def getKeyEvt(self):
    key_evt_list = []
    for key_evt in self.getCol(self.coltag_key_evt):
      if key_evt == key_evt:
        key_evt_list.append(key_evt.rstrip('\n'))
      else:
        key_evt_list.append(key_evt)
    return key_evt_list
  
  def saveCsv_evtTimeline(self):
    date_list = []
    twn_evt_list = []
    global_evt_list = []
    key_evt_list = []
    
    for date, twn_evt, global_evt, key_evt in zip(self.getDate(), self.getTWNEvt(), self.getGlobalEvt(), self.getKeyEvt()):
      if twn_evt != twn_evt and global_evt != global_evt and key_evt != key_evt:
        continue
      else:
        date_list.append(date)
        twn_evt_list.append(twn_evt)
        global_evt_list.append(global_evt)
        key_evt_list.append(key_evt)
    
    stock = {'date': date_list, 'Taiwan_event': twn_evt_list, 'global_event': global_evt_list, 'key_event': key_evt_list}
    data = pd.DataFrame(stock)
    
    name = '%sprocessed_data/event_timeline_zh-tw.csv' % DATA_PATH
    saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_evtTimeline()
    return
  
################################################################################
## Classes - County breakdown

class CountySheet(Template):
  
  def __init__(self, verbose=True):
    self.coltag_disease = '確定病名'
    self.coltag_report_date = '個案研判日'
    self.coltag_county = '縣市'
    self.coltag_village = '鄉鎮'
    self.coltag_gender = '性別'
    self.coltag_imported = '是否為境外移入'
    self.coltag_age = '年齡層'
    self.coltag_nb_cases = '確定病例數'
    
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_county_age.csv' % DATA_PATH
    data = pd.read_csv(name, dtype=object, skipinitialspace=True)
    
    self.data    = data
    self.n_total = data[self.coltag_nb_cases].astype(int).sum()
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    self.age_key_list = [
      '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', 
      '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70+',
    ]
    
    if verbose:
      print('Loaded \"%s\"' % name)
      print('N_total = %d' % self.n_total)
    return
  
  def getReportDate(self):
    report_date_list = []
    
    for report_date in self.getCol(self.coltag_report_date):
      yyyy = report_date[:4]
      mm = report_date[5:7]
      dd = report_date[8:]
      report_date = '%s-%s-%s' % (yyyy, mm, dd)
      report_date_list.append(report_date)
    
    return report_date_list
  
  def getCounty(self):
    county_list = []
    
    for county in self.getCol(self.coltag_county):
      try:
        county_list.append(COUNTY_DICT_2[county])
      except KeyError:
        print('County, %s' % county)
        county_list.append('unknown')
    
    return county_list
    
  def getVillage(self):
    return self.getCol(self.coltag_village)
    
  def getGender(self):
    gender_list = [1 if gender == '男' else 2 for gender in self.getCol(self.coltag_gender)]
    return gender_list
    
  def getImported(self):
    imported_list = [1 if imported == '是' else 0 for imported in self.getCol(self.coltag_imported)]
    return imported_list
    
  def getAge(self):
    age_list = []
    
    for age in self.getCol(self.coltag_age):
      if age in ['0', '1', '2', '3', '4']:
        age_list.append('0-4')
      else:
        age_list.append(age)
    
    return age_list
  
  def getNbCases(self):
    return self.getCol(self.coltag_nb_cases).astype(int)
  
  def increment_localCasePerCounty(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock
    col_tag_list = ['total'] + self.county_key_list
    stock = initializeStock_dailyCounts(col_tag_list)
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ind = indexForOverall(report_date)
      
      try:
        stock['total'][ind] += nb_cases
        stock[county][ind] += nb_cases
      except IndexError: ## If NaN
        pass
      
    ## Moving average
    for col_tag in col_tag_list:
      key = col_tag + '_avg'
      stock[key] = makeMovingAverage(stock[col_tag])
    return stock
  
  def saveCsv_localCasePerCounty(self):
    stock = self.increment_localCasePerCounty()
    stock = pd.DataFrame(stock)
    
    for page in PAGE_LIST:
      data = truncateStock(stock, page)
      
      ## Save
      name = '%sprocessed_data/%s/local_case_per_county.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return

  def increment_caseByAge(self):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock dict
    case_hist = {age: 0 for age in self.age_key_list}
    stock = [case_hist.copy() for i in range(13)]
    stock_dict = initializeStockDict_general(stock)
    
    ## Loop over series
    for report_date, age, nb_cases in zip(report_date_list, age_list, nb_cases_list):
      index_list = makeIndexList(report_date)
      
      for ind, page, stock in zip(index_list, stock_dict.keys(), stock_dict.values()):
        if ind != ind: ## If NaN
          continue
        
        stock[0][age] += nb_cases
      
        if page == PAGE_LATEST:
          lookback_week = (ind - NB_LOOKBACK_DAYS) // 7 ## ind - NB_LOOKBACK_DAYS in [-90, -1]; this will be in [-13, -1]
          if lookback_week >= -12:
            stock[-lookback_week][age] += nb_cases
        else:
          mm = int(report_date[5:7])
          stock[mm][age] += nb_cases
            
    return stock_dict
  
  def saveCsv_caseByAge(self):
    stock_dict = self.increment_caseByAge()
    
    ## Loop over page
    for page, stock in stock_dict.items():
      if 'latest' == page:
        label_list = ['total', 'week_-1', 'week_-2', 'week_-3', 'week_-4', 'week_-5', 'week_-6', 'week_-7', 'week_-8', 'week_-9', 'week_-10', 'week_-11', 'week_-12']
      else:
        label_list = ['total', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      
      data = {'age': self.age_key_list}
      data.update({label: case_hist.values() for label, case_hist in zip(label_list, stock)})
      data = pd.DataFrame(data)
      
      ## Save
      name = '%sprocessed_data/%s/case_by_age.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return

  def increment_incidenceMap(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock dict
    county_key_list = ['total'] + self.county_key_list
    case_hist = {county: 0 for county in county_key_list}
    stock = [case_hist.copy() for i in range(13)]
    stock_dict = initializeStockDict_general(stock)
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      index_list = makeIndexList(report_date)
      
      for ind, page, stock in zip(index_list, stock_dict.keys(), stock_dict.values()):
        if ind != ind:
          continue
        
        stock[0]['total'] += nb_cases
        stock[0][county] += nb_cases
      
        if page == PAGE_LATEST:
          lookback_week = (ind - NB_LOOKBACK_DAYS) // 7 ## ind - NB_LOOKBACK_DAYS in [-90, -1]; this will be in [-13, -1]
          if lookback_week >= -12:
            stock[-lookback_week]['total'] += nb_cases
            stock[-lookback_week][county] += nb_cases
        else:
          mm = int(report_date[5:7])
          stock[mm]['total'] += nb_cases
          stock[mm][county] += nb_cases
    
    return stock_dict
  
  def saveCsv_incidenceMap(self):
    stock_dict = self.increment_incidenceMap()
    county_key_list = ['total'] + self.county_key_list
    
    ## Loop over page
    for page, stock in stock_dict.items():
      if page == PAGE_LATEST:
        continue
      
      if 'latest' == page:
        label_list = ['total', 'week_-1', 'week_-2', 'week_-3', 'week_-4', 'week_-5', 'week_-6', 'week_-7', 'week_8', 'week_-9', 'week_-10', 'week_-11', 'week_-12']
      else:
        label_list = ['total', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    
      ## Data for population & label
      inv_dict = {dict_['tag']: code for code, dict_ in COUNTY_DICT.items()}
      code_list = [inv_dict[county] for county in county_key_list]
      population = [COUNTY_DICT[code]['population'] for code in code_list]
      label_list_en = [COUNTY_DICT[code]['label'][0] for code in code_list]
      label_list_fr = [COUNTY_DICT[code]['label'][1] for code in code_list]
      label_list_zh = [COUNTY_DICT[code]['label'][2] for code in code_list]
      
      data_c = {'county': county_key_list}
      data_c.update({label: case_hist.values() for label, case_hist in zip(label_list, stock)})
      data_c = pd.DataFrame(data_c)
      
      data_p = {'key': county_key_list, 'code': code_list, 'population': population, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
      data_p = pd.DataFrame(data_p)
      
      ## Save
      name = '%sprocessed_data/%s/incidence_map.csv' % (DATA_PATH, page)
      saveCsv(name, data_c)
      name = '%sprocessed_data/%s/incidence_map_label.csv' % (DATA_PATH, page)
      saveCsv(name, data_p)
    return

  def increment_incidenceEvolutionByCounty(self):
    report_date_list = self.getReportDate()
    county_list = self.getCounty()
    nb_cases_list = self.getNbCases()
    
    ## Initialize stock
    county_key_list = ['total'] + self.county_key_list
    stock = initializeStock_dailyCounts(county_key_list)
    
    ## Loop over series
    for report_date, county, nb_cases in zip(report_date_list, county_list, nb_cases_list):
      if 'unknown' == county:
        continue
      
      ind = indexForOverall(report_date)
      
      try:
        stock[county][ind] += nb_cases
        stock['total'][ind] += nb_cases
      except IndexError:
        pass
    return stock
  
  def smooth_incidenceEvolutionByCounty(self):
    stock = self.increment_incidenceEvolutionByCounty()
    population_dict = {county['tag']: county['population'] * 0.00001 for code, county in COUNTY_DICT.items()}
    nb_lookback_days = 45
    
    ## Smooth
    for county, nb_cases_arr in stock.items():
      if 'date' == county:
        stock[county] = nb_cases_arr[-nb_lookback_days:]
        continue
      
      nb_cases_arr = sevenDayMovingAverage(nb_cases_arr)
      nb_cases_arr = nb_cases_arr[-nb_lookback_days:]
      nb_cases_arr *= 7 / population_dict[county]
      stock[county] = np.around(nb_cases_arr, decimals=2)
    return stock
  
  def saveCsv_incidenceEvolutionByCounty(self):
    stock = self.smooth_incidenceEvolutionByCounty()
    data_r = pd.DataFrame(stock)
    
    ## Data for population & label
    county_key_list = ['total'] + self.county_key_list
    county_dict = {dict_['tag']: dict_ for dict_ in COUNTY_DICT.values()}
    label_list_en = [county_dict[county]['label'][0] for county in county_key_list]
    label_list_fr = [county_dict[county]['label'][1] for county in county_key_list]
    label_list_zh = [county_dict[county]['label'][2] for county in county_key_list]
      
    data_l = {'county': county_key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data_l = pd.DataFrame(data_l)
    
    name = '%sprocessed_data/%s/incidence_evolution_by_county.csv' % (DATA_PATH, PAGE_LATEST)
    saveCsv(name, data_r)
    
    name = '%sprocessed_data/%s/incidence_evolution_by_county_label.csv' % (DATA_PATH, PAGE_LATEST)
    saveCsv(name, data_l)
    return
  
  def increment_incidenceEvolutionByAge(self):
    report_date_list = self.getReportDate()
    age_list = self.getAge()
    nb_cases_list = self.getNbCases()
    
    ## Reverse
    age_key_list = ['total'] + self.age_key_list[::-1]
    
    ## Initialize stock
    stock = initializeStock_dailyCounts(age_key_list)
    
    ## Loop over series
    for report_date, age, nb_cases in zip(report_date_list, age_list, nb_cases_list):
      ind = indexForOverall(report_date)
      
      try:
        stock[age][ind] += nb_cases
        stock['total'][ind] += nb_cases
      except IndexError:
        pass
      
    return stock
  
  def smooth_incidenceEvolutionByAge(self):
    stock = self.increment_incidenceEvolutionByAge()
    nb_lookback_days = 45
    
    ## Get year & adjust
    year = dtt.datetime.today().isoformat()[:4]
    year = str(int(year) - 1)
    population_dict = {age: population * 0.00001 for age, population in AGE_DICT_2[year].items()}
    population_dict['total'] = COUNTY_DICT['00000']['population'] * 0.00001
    
    ## Minor modif
    value = 0
    for age in ['70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+']:
      value += population_dict.pop(age)
    population_dict['70+'] = value
    
    ## Smooth
    for age, nb_cases_arr in stock.items():
      if 'date' == age:
        stock[age] = nb_cases_arr[-nb_lookback_days:]
        continue
      
      nb_cases_arr = sevenDayMovingAverage(nb_cases_arr)
      nb_cases_arr = nb_cases_arr[-nb_lookback_days:]
      nb_cases_arr *= 7 / population_dict[age]
      stock[age] = np.around(nb_cases_arr, decimals=2)
    return stock
  
  def saveCsv_incidenceEvolutionByAge(self):
    stock = self.smooth_incidenceEvolutionByAge()
    data_r = pd.DataFrame(stock)
    
    ## Reverse
    age_key_list = ['total'] + self.age_key_list[::-1]
    
    ## Data for population & label
    label_list_en = [AGE_DICT_2['label'][age]['en'] for age in age_key_list]
    label_list_fr = [AGE_DICT_2['label'][age]['fr'] for age in age_key_list]
    label_list_zh = [AGE_DICT_2['label'][age]['zh-tw'] for age in age_key_list]
    
    data_l = {'age': age_key_list, 'label': label_list_en, 'label_fr': label_list_fr, 'label_zh': label_list_zh}
    data_l = pd.DataFrame(data_l)
    
    name = '%sprocessed_data/%s/incidence_evolution_by_age.csv' % (DATA_PATH, PAGE_LATEST)
    saveCsv(name, data_r)
    
    name = '%sprocessed_data/%s/incidence_evolution_by_age_label.csv' % (DATA_PATH, PAGE_LATEST)
    saveCsv(name, data_l)
    return
  
  def saveCsv(self):
    self.saveCsv_localCasePerCounty()
    self.saveCsv_caseByAge()
    self.saveCsv_incidenceMap()
    self.saveCsv_incidenceEvolutionByCounty()
    self.saveCsv_incidenceEvolutionByAge()
    return
  
################################################################################
## Classes - Vaccination

class VaccinationSheet(Template):
  
  def __init__(self, verbose=True):
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination.json' % DATA_PATH
    data = loadJson(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/dt_002-csse_covid_19_daily_reports_vaccine.php?countryCode=TW/taiwan
    #https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine&limitColumn=a01&limitValue=taiwan%&equalValue= like &encodeKey=MTYyNjQyODMwOQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=date&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=YES&c[]=a07&t[]=int&d[]=YES&c[]=a08&t[]=decimal&d[]=YES&c[]=a09&t[]=decimal&d[]=YES&c[]=a10&t[]=decimal&d[]=YES&c[]=a11&t[]=decimal&d[]=YES&c[]=a12&t[]=decimal&d[]=YES&c[]=a13&t[]=text&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=int&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=int&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO",
                                  
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_location = 'a01'
    self.key_iso_code = 'a02'
    self.key_date = 'a03'
    self.key_cum_vacc = 'a04'
    self.key_ppl_vacc = 'a05'
    self.key_ppl_fully_vacc = 'a06'
    self.key_new_vacc_raw = 'a07' ## Unsure
    self.key_new_vacc = 'a08'
    self.key_cum_vacc_per_100 = 'a09'
    self.key_ppl_vacc_per_100 = 'a10'
    self.key_ppl_fully_vacc_per_100 = 'a11'
    self.key_new_vacc_per_1m = 'a12'
    
    self.key_manu = 'a13'
    self.key_cum_jj = 'a14'
    self.key_cum_moderna = 'a15'
    self.key_cum_az = 'a16'
    self.key_cum_pfizer = 'a17'
    self.key_cum_sinovac = 'a18'
    self.key_cum_sputnik = 'a19'
    self.key_cum_sinopharm = 'a20'
    
    self.data = data
    self.n_total = len(self.data['data'])
    self.brand_list = ['AZ', 'Moderna']
    
    if (self.n_total > 1.5 * (getTodayOrdinal() - ISODateToOrd('2021-03-21'))):
      self.n_total //= 2
      self.data['data'] = self.data['data'][:self.n_total]
    
    if verbose:
      print('N_total = %d' % self.n_total)
    return
  
  def getColData(self, key):
    return [row[key] for row in self.data['data']]
  
  def getDate(self):
    return [row[self.key_date] for row in self.data['data']]
  
  def getCumVacc(self):
    return [int(row[self.key_cum_vacc]) for row in self.data['data']]
  
  def getPplVaccRate(self):
    return [float(row[self.key_ppl_vacc_per_100]) for row in self.data['data']]
    
  def getPplFullyVaccRate(self):
    return [float(row[self.key_ppl_fully_vacc_per_100]) for row in self.data['data']]
    
  def getNewVacc(self):
    return [int(row[self.key_new_vacc]) for row in self.data['data']]
  
  def getCumAZ(self):
    return [int(row[self.key_cum_az]) for row in self.data['data']]
  
  def getCumModerna(self):
    return [int(row[self.key_cum_moderna]) for row in self.data['data']]
  
  def incrementWithInterpolation_vaccinationByBrand(self):
    date_list = self.getDate()
    cum_vacc_list = self.getCumVacc()
    cum_az_list = self.getCumAZ()
    cum_moderna_list = self.getCumModerna()
    
    ## Declare all brands
    cum_doses_dict = {}
    for date, cum_vacc, cum_az, cum_moderna in zip(date_list, cum_vacc_list, cum_az_list, cum_moderna_list):
      cum_doses_dict[date] = [cum_vacc, cum_az, cum_moderna]
    
    brand_list = ['total'] + self.brand_list
    
    ## Make stock dict
    stock = {'date': [], 'interpolated': [], 'brand_list': brand_list, 'new_doses': [[] for brand in brand_list]}
    
    ## For recording last non-missing data
    prev = [0] * len(brand_list)
    ord_prev = ISODateToOrd(date_list[0]) - 1
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    ord_today = getTodayOrdinal()
    
    ## Loop over ordinal
    for ord_ in range(ord_ref, ord_today):
      date = ordDateToISO(ord_)
      stock['date'].append(date)
      
      ## Out of provided range
      if date not in cum_doses_dict:
        stock['interpolated'].append(1)
        for list_ in stock['new_doses']:
          list_.append(0)
        continue
      
      ## In range
      cum_doses = cum_doses_dict[date]
      
      ## If data non-missing
      if 0 < sum(cum_doses):
        ord_ = ISODateToOrd(date)
        length = ord_ - ord_prev
        
        for i, _ in enumerate(brand_list):
          stock['new_doses'][i] += itpFromCumul(prev[i], cum_doses[i], length)
          
        stock['interpolated'].append(-int(1 < length))
        prev = cum_doses
        ord_prev = ord_
        
      ## If data are missing
      else:
        stock['interpolated'].append(1)
    
    ## Homogenize length caused by trailing zeros
    nb_rows = len(stock['new_doses'][0])
    stock['date'] = stock['date'][:nb_rows]
    stock['interpolated'] = stock['interpolated'][:nb_rows]
    
    ## This contains daily doses & a column indicating whether it's interpolated or not.
    return stock
          
  def saveCsv_vaccinationByBrand(self):
    stock_prev = self.incrementWithInterpolation_vaccinationByBrand()
    stock_tmp = {brand: new_doses_arr for brand, new_doses_arr in zip(stock_prev['brand_list'], stock_prev['new_doses'])}
    
    ## For order
    stock = {'date': stock_prev['date'], 'interpolated': stock_prev['interpolated']}
    stock.update(stock_tmp)
    
    ## Loop over column
    for col_tag in stock_prev['brand_list']:
      key = col_tag + '_avg'
      stock[key] = makeMovingAverage(stock[col_tag])
      
    stock = pd.DataFrame(stock)
    stock = adjustDateRange(stock)
    
    for page in PAGE_LIST:
      if page == PAGE_2020:
        continue
      
      data = truncateStock(stock, page)
      
      ## Vaccination trunk
      if page == PAGE_OVERALL:
        ind = ISODateToOrd(ISO_DATE_REF_VACC) - ISODateToOrd(ISO_DATE_REF)
        data = data[ind:]
        
      ## Save
      name = '%sprocessed_data/%s/vaccination_by_brand.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
  
  def makeDeliveries_vaccinationProgress(self):
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    nb_rows = len(DELIVERY_LIST)
    
    stock = {col: [] for col in ['index', 'date', 'source']}
    stock.update({brand: np.zeros(nb_rows, dtype=int) for brand in self.brand_list})
    
    ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
    for i, row in enumerate(DELIVERY_LIST):
      brand = row[0]
      source = row[1]
      quantity = row[2]
      delivery_date = row[3]
      available_date = row[4]
      
      if available_date is None or available_date == '':
        ind = ''
      else:
        ind = ISODateToOrd(available_date) - ord_ref 
      
      stock['index'].append(ind)
      stock['date'].append(available_date)
      stock['source'].append(source)
      stock[brand][i] = quantity
    return stock
    
  def makeAdministrated_vaccinationProgress(self):
    date_list = self.getDate()
    cum_vacc_list = self.getCumVacc()
    cum_az_list = self.getCumAZ()
    cum_moderna_list = self.getCumModerna()
    
    stock = []
    
    for date, cum_vacc, cum_az, cum_moderna in zip(date_list, cum_vacc_list, cum_az_list, cum_moderna_list):
      if 0 == cum_vacc and date != '2021-03-21':
        continue
      stock.append([date, cum_vacc, cum_az, cum_moderna])
      
    date_list = [row[0] for row in stock]
    cum_vacc_list = [row[1] for row in stock]
    cum_az_list = [row[2] for row in stock]
    cum_moderna_list = [row[3] for row in stock]
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    index_list = [ISODateToOrd(iso)-ord_ref for iso in date_list]
    
    stock = {'index': index_list, 'date': date_list, 'total': cum_vacc_list, 'AZ': cum_az_list, 'Moderna': cum_moderna_list}
    return stock
    
  def saveCsv_vaccinationProgress(self):
    stock_d = self.makeDeliveries_vaccinationProgress()
    stock_d = pd.DataFrame(stock_d)
    stock_a = self.makeAdministrated_vaccinationProgress()
    stock_a = pd.DataFrame(stock_a)
    
    name = '%sprocessed_data/%s/vaccination_progress_deliveries.csv' % (DATA_PATH, PAGE_OVERALL)
    saveCsv(name, stock_d)
    name = '%sprocessed_data/%s/vaccination_progress_administrated.csv' % (DATA_PATH, PAGE_OVERALL)
    saveCsv(name, stock_a)
    return
  
  def makeStock_vaccinationByDose(self):
    date_list = self.getDate()
    ppl_vacc_rate_list = self.getPplVaccRate()
    ppl_fully_vacc_rate_list = self.getPplFullyVaccRate()
    
    stock = []
    
    ## Not using cum_vacc_list because it contains more zeros
    for date, ppl_vacc_rate, ppl_fully_vacc_rate in zip(date_list, ppl_vacc_rate_list, ppl_fully_vacc_rate_list):
      if 0 == ppl_vacc_rate + ppl_fully_vacc_rate and date != '2021-03-21':
        continue
      stock.append([date, 0.01*ppl_vacc_rate, 0.01*ppl_fully_vacc_rate])
    
    date_list = [row[0] for row in stock]
    ppl_vacc_rate_list = [row[1] for row in stock]
    ppl_fully_vacc_rate_list = [row[2] for row in stock]
    
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    index_list = [ISODateToOrd(iso)-ord_ref for iso in date_list]
    ppl_vacc_rate_list = np.around(ppl_vacc_rate_list, decimals=4)
    ppl_fully_vacc_rate_list = np.around(ppl_fully_vacc_rate_list, decimals=4)
    
    stock = {'index': index_list, 'date': date_list, 'ppl_vacc_rate': ppl_vacc_rate_list, 'ppl_fully_vacc_rate': ppl_fully_vacc_rate_list}
    return stock
    
  def saveCsv_vaccinationByDose(self):
    stock = self.makeStock_vaccinationByDose()
    stock = pd.DataFrame(stock)
    ord_ref = ISODateToOrd(ISO_DATE_REF)
    
    for page in PAGE_LIST:
      if page == PAGE_2020:
        continue
      
      if page == PAGE_LATEST:
        ind = getTodayOrdinal() - ord_ref - 90
      elif page == PAGE_2021:
        ind = ISODateToOrd('2021-01-01') - ord_ref
      elif page == PAGE_OVERALL:
        ind = ISODateToOrd(ISO_DATE_REF_VACC) - ord_ref
        
      ind_arr = stock['index'] >= ind
      data = stock[ind_arr]
        
      name = '%sprocessed_data/%s/vaccination_by_dose.csv' % (DATA_PATH, page)
      saveCsv(name, data)
    return
  
  def saveCsv(self):
    self.saveCsv_vaccinationByBrand()
    self.saveCsv_vaccinationProgress()
    self.saveCsv_vaccinationByDose()
    return
  
################################################################################
## Classes - Vaccination

class VaccinationCountySheet(Template):
  
  def __init__(self, verbose=True):
    name = '%sraw_data/COVID-19_in_Taiwan_raw_data_vaccination_county.json' % DATA_PATH
    data = loadJson(name, verbose=verbose)
    #https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_can2_c2&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyNjU1MDY4MQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=decimal&d[]=NO&c[]=a07&t[]=int&d[]=NO&c[]=a08&t[]=int&d[]=NO&c[]=a09&t[]=decimal&d[]=NO&c[]=a10&t[]=int&d[]=NO&c[]=a11&t[]=int&d[]=NO&c[]=a12&t[]=decimal&d[]=NO&c[]=a13&t[]=int&d[]=NO&c[]=a14&t[]=int&d[]=NO&c[]=a15&t[]=decimal&d[]=NO&c[]=a16&t[]=int&d[]=NO&c[]=a17&t[]=int&d[]=NO&c[]=a18&t[]=decimal&d[]=NO&c[]=a19&t[]=int&d[]=NO&c[]=a20&t[]=int&d[]=NO&c[]=a21&t[]=int&d[]=NO
  
    self.key_row_id = 'DT_RowId'
    self.key_id = 'id'
    self.key_report_date = 'a01'
    self.key_county = 'a02'
    self.key_population = 'a03'
    
    self.key_new_vacc = 'a04'
    self.key_cum_vacc = 'a05'
    self.key_vacc_rate = 'a06'
    self.key_cum_supplies = 'a07'
    self.key_remaining_doses = 'a08'
    self.key_remaining_ratio = 'a09'
    
    self.key_new_AZ = 'a10'
    self.key_cum_AZ = 'a11'
    self.key_AZ_rate = 'a12'
    self.key_AZ_supplies = 'a13'
    self.key_remaining_AZ = 'a14'
    self.key_AZ_remaining_ratio = 'a15'
    
    self.key_new_Moderna = 'a16'
    self.key_cum_Moderna = 'a17'
    self.key_Moderna_rate = 'a18'
    self.key_Moderna_supplies = 'a19'
    self.key_remaining_Moderna = 'a20'
    self.key_Moderna_remaining_ratio = 'a21'
    
    self.data = data
    self.processed_data = {}
    self.process()
    self.county_key_list = [
      'Keelung', 'Taipei', 'New_Taipei', 'Taoyuan', 'Hsinchu', 'Hsinchu_C', 'Miaoli', 
      'Taichung', 'Changhua', 'Nantou', 'Yunlin', 
      'Chiayi' ,'Chiayi_C', 'Tainan', 'Kaohsiung', 'Pingtung', 
      'Yilan', 'Hualien', 'Taitung', 
      'Penghu', 'Kinmen', 'Matsu', 
    ]
    
    if verbose:
      print('N_total = %d' % len(self.processed_data))
    return
  
  def process(self):
    for row in self.data['data']:
      report_date = row[self.key_report_date]
      county = row[self.key_county]
      
      try:
        county = COUNTY_DICT_2[county]
      except KeyError:
        print('County label, %s' % county)
        county = 'unknown'
      
      try:
        self.processed_data[report_date][county] = row
      except KeyError:
        self.processed_data[report_date] = {county: row}
    
    self.processed_data = dict(sorted(self.processed_data.items()))
    return
    
  def getReportDate(self):
    return list(self.processed_data.keys())
  
  def getCumVacc(self, county):
    cum_vacc_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_vacc]) for row in county_dict.values()]
        cum_vacc_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_vacc_list.append(int(row[self.key_cum_vacc]))
        
    return cum_vacc_list
    
  def getCumAZ(self, county):
    cum_az_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_AZ]) for row in county_dict.values()]
        cum_az_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_az_list.append(int(row[self.key_cum_AZ]))
        
    return cum_az_list
    
  def getCumModerna(self, county):
    cum_moderna_list = []
    
    for county_dict in self.processed_data.values():
      if 'total' == county:
        value_list = [int(row[self.key_cum_Moderna]) for row in county_dict.values()]
        cum_moderna_list.append(sum(value_list))
        
      else:
        row = county_dict[county]
        cum_moderna_list.append(int(row[self.key_cum_Moderna]))
        
    return cum_moderna_list
    
  def saveCsv_vaccinationByCounty(self):
    county_key_list = ['total'] + self.county_key_list
    pop_dict = {value_dict['tag']: value_dict['population'] for value_dict in COUNTY_DICT.values()}
    
    date = self.getReportDate()[-1]
    key_list = ['latest_date']
    value_list = [date]
    
    ## Make stock
    for county in county_key_list:
      cum_vacc = self.getCumVacc(county)[-1]
      value = float(cum_vacc) / float(pop_dict[county])
      key_list.append(county)
      value_list.append('%.4f' % value)
      
    stock = {'key': key_list, 'value': value_list}
    data = pd.DataFrame(stock)
      
    name = '%sprocessed_data/%s/vaccination_by_county.csv' % (DATA_PATH, PAGE_LATEST)
    saveCsv(name, data)
    return

  def saveCsv(self):
    self.saveCsv_vaccinationByCounty()
    return
  
################################################################################
## Functions - cross-sheet operations

def makeIncidenceRates(main_sheet, border_sheet):
  stock = {}
  main_sheet.updateNewCaseCounts(stock)
  border_sheet.updateNewEntryCounts(stock)
  
  ## Index to avoid division by zero
  ind_entries = stock['new_entries'] == 0
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    ## Modify
    stock[key] = sevenDayMovingAverage(value_arr) 
  
  population_twn = COUNTY_DICT['00000']['population']
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter('ignore')
    
    value_arr = stock['new_imported'] / stock['new_entries']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_entries] = np.nan
    stock_new['arr_incidence'] = value_arr
    
    value_arr = stock['new_local'] / float(population_twn) * 1000 ## Rate over thousand
    value_arr = np.around(value_arr, decimals=4)
    stock_new['local_incidence'] = value_arr
  
  return stock_new
  
def saveCsv_incidenceRates(main_sheet, border_sheet):
  stock = makeIncidenceRates(main_sheet, border_sheet)
  stock = pd.DataFrame(stock)
  
  for page in PAGE_LIST:
    data = truncateStock(stock, page)
    
    ## Save
    name = '%sprocessed_data/%s/incidence_rates.csv' % (DATA_PATH, page)
    saveCsv(name, data)
  return
  
def makePositivityAndFatality(main_sheet, status_sheet, test_sheet):
  stock = {}
  main_sheet.updateNewCaseCounts(stock)
  status_sheet.updateCumCounts(stock)
  test_sheet.updateNewTestCounts(stock)
  
  ## Index to avoid division by zero
  ind_new_tests = stock['new_tests'] == 0
  ind_cum_cases = stock['cum_cases'] == 0
  
  ## Smooth
  for key, value_arr in stock.items():
    if 'date' == key:
      continue
    
    ## No smoothing if cumulative
    if key in ['cum_cases', 'cum_deaths']:
      value_arr = value_arr.astype(float)
    else:
      value_arr = sevenDayMovingAverage(value_arr)
    
    ## Push back
    stock[key] = sevenDayMovingAverage(value_arr) 
  
  stock_new = {}
  stock_new['date'] = stock['date']
  
  with warnings.catch_warnings(): ## Avoid division by zero
    warnings.simplefilter('ignore')
    
    value_arr = stock['new_cases'] / stock['new_tests']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_new_tests] = np.nan
    stock_new['positivity'] = value_arr
    
    value_arr = stock['cum_deaths'] / stock['cum_cases']
    value_arr = np.around(value_arr, decimals=4)
    value_arr[ind_cum_cases] = np.nan
    stock_new['fatality'] = value_arr
  return stock_new
  
def saveCsv_positivityAndFatality(main_sheet, status_sheet, test_sheet):
  stock = makePositivityAndFatality(main_sheet, status_sheet, test_sheet)
  stock = pd.DataFrame(stock)
  
  for page in PAGE_LIST:
    data = truncateStock(stock, page)
    
    ## Save
    name = '%sprocessed_data/%s/positivity_and_fatality.csv' % (DATA_PATH, page)
    saveCsv(name, data)
  return

################################################################################
## Functions - sandbox

def sandbox():
  #main_sheet = MainSheet()
  #main_sheet.saveCsv_keyNb()
  
  #status_sheet = StatusSheet()
  #status_sheet.saveCsv_deathCounts()
  
  #test_sheet = TestSheet()
  #test_sheet.saveCsv_testByCriterion()
  
  #border_sheet = BorderSheet()
  #border_sheet.saveCsv_borderStats()
  
  #timeline_sheet = TimelineSheet()
  #timeline_sheet.saveCsv_evtTimeline()
  
  #county_sheet = CountySheet()
  #county_sheet.saveCsv_incidenceEvolutionByAge()
  
  #vacc_sheet = VaccinationSheet()
  #vacc_sheet.saveCsv_vaccinationByDose()
  
  vacc_county_sheet = VaccinationCountySheet()
  vacc_county_sheet.saveCsv_vaccinationByCounty()
  
  #main_sheet = MainSheet()
  #status_sheet = StatusSheet()
  #test_sheet = TestSheet()
  #border_sheet = BorderSheet()
  #saveCsv_incidenceRates(main_sheet, border_sheet)
  #saveCsv_positivityAndFatality(main_sheet, status_sheet, test_sheet)
  return

################################################################################
## Functions - save

def saveCsv_all():
  print()
  main_sheet = MainSheet()
  main_sheet.saveCsv()
  
  print()
  status_sheet = StatusSheet()
  status_sheet.saveCsv()
  
  print()
  test_sheet = TestSheet()
  test_sheet.saveCsv()
  
  print()
  border_sheet = BorderSheet()
  border_sheet.saveCsv()
  
  print()
  timeline_sheet = TimelineSheet()
  timeline_sheet.saveCsv()
  
  print()
  county_sheet = CountySheet()
  county_sheet.saveCsv()
  
  print()
  vacc_sheet = VaccinationSheet()
  vacc_sheet.saveCsv()
  
  #print()
  #vacc_county_sheet = VaccinationCountySheet()
  #vacc_county_sheet.saveCsv_vaccinationByCounty()
  
  print()
  saveCsv_incidenceRates(main_sheet, border_sheet)
  saveCsv_positivityAndFatality(main_sheet, status_sheet, test_sheet)
  print()
  return

################################################################################
## Main

if __name__ == '__main__':
  saveCsv_all()

## End of file
################################################################################
