
    ##############################
    ##  COVID_common.py         ##
    ##  Chieh-An Lin            ##
    ##  Version 2021.09.05      ##
    ##############################

import os
import sys
import warnings
import collections as clt
import calendar as cld
import datetime as dtt
import copy
import json

import numpy as np
import scipy as sp
import scipy.signal as signal
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
  'Mongolia': {'zh-tw': '蒙古', 'fr': 'Mongolie'},
  'Myanmar': {'zh-tw': '緬甸', 'fr': 'Myanmar'},
  'Nepal': {'zh-tw': '尼泊爾', 'fr': 'Népal'},
  'Pakistan': {'zh-tw': '巴基斯坦', 'fr': 'Pakistan'},
  'Philippines': {'zh-tw': '菲律賓', 'fr': 'Philippines'},
  'Singapore': {'zh-tw': '新加坡', 'fr': 'Singapour'},
  'Thailand': {'zh-tw': '泰國', 'fr': 'Thaïlande'},
  'Vietnam': {'zh-tw': '越南', 'fr': 'Vietnam'},
  
  ## West & Central Asia
  'Afghanistan': {'zh-tw': '阿富汗', 'fr': 'Afghanistan'},
  'Iran': {'zh-tw': '伊朗', 'fr': 'Iran'},
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
  'Armania': {'zh-tw': '亞美尼亞', 'fr': 'Arménie'},
  'Austria': {'zh-tw': '奧地利', 'fr': 'Autriche'},
  'Belarus': {'zh-tw': '白俄羅斯', 'fr': 'Biélorussie'},
  'Belgium': {'zh-tw': '比利時', 'fr': 'Belgique'},
  'Bulgaria': {'zh-tw': '保加利亞', 'fr': 'Bulgarie'},
  'Croatia': {'zh-tw': '克羅埃西亞', 'fr': 'Croatie'},
  'Cyprus': {'zh-tw': '賽普勒斯', 'fr': 'Chypre'},
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
  'Lithuania': {'zh-tw': '立陶宛', 'fr': 'Lituanie'},
  'Luxemburg': {'zh-tw': '盧森堡', 'fr': 'Luxembourg'},
  'Netherlands': {'zh-tw': '荷蘭', 'fr': 'Pays-Bas'},
  'Poland': {'zh-tw': '波蘭', 'fr': 'Pologne'},
  'Portugal': {'zh-tw': '葡萄牙', 'fr': 'Portugal'},
  'Romania': {'zh-tw': '羅馬尼亞', 'fr': 'Roumanie'},
  'Russia': {'zh-tw': '俄羅斯', 'fr': 'Russie'},
  'Serbia': {'zh-tw': '塞爾維亞', 'fr': 'Serbie'},
  'Slovakia': {'zh-tw': '斯洛伐克', 'fr': 'Slovaquie'},
  'Spain': {'zh-tw': '西班牙', 'fr': 'Espagne'},
  'Sweden': {'zh-tw': '瑞典', 'fr': 'Suède'}, 
  'Switzerland': {'zh-tw': '瑞士', 'fr': 'Suisse'},
  'UK': {'zh-tw': '英國', 'fr': 'Royaume-Uni'},
  'Ukraine': {'zh-tw': '烏克蘭', 'fr': 'Ukraine'},
  
  ## Africa
  'Africa': {'zh-tw': '非洲', 'fr': 'Afrique'},
  'Burkina Faso': {'zh-tw': '布吉納法索', 'fr': 'Burkina Faso'},
  'Cameroon': {'zh-tw': '喀麥隆', 'fr': 'Cameroun'},
  'Eswatini': {'zh-tw': '史瓦帝尼', 'fr': 'Eswatini'},
  'Egypt': {'zh-tw': '埃及', 'fr': 'Égypte'},
  'Ethiopia': {'zh-tw': '衣索比亞', 'fr': 'Éthiopie'},
  'Gambia': {'zh-tw': '甘比亞', 'fr': 'Gambie'},
  'Ghana': {'zh-tw': '迦納', 'fr': 'Ghana'},
  'Kenya': {'zh-tw': '肯亞', 'fr': 'Kenya'},
  'Lesotho': {'zh-tw': '賴索托', 'fr': 'Lesotho'},
  'Mauritania': {'zh-tw': '茅利塔尼亞', 'fr': 'Mauritanie'},
  'Morocco': {'zh-tw': '摩洛哥', 'fr': 'Maroc'},
  'Nigeria': {'zh-tw': '奈及利亞', 'fr': 'Nigéria'}, 
  'Senegal': {'zh-tw': '塞內加爾', 'fr': 'Sénégal'},
  'Somaliland': {'zh-tw': '索馬利蘭', 'fr': 'Somaliland'},
  'South Africa': {'zh-tw': '南非', 'fr': 'Afrique du Sud'},
  'Tunisia': {'zh-tw': '突尼西亞', 'fr': 'Tunisie'},
  'Uganda': {'zh-tw': '烏干達', 'fr': 'Ouganda'},
  
  ## North & South America
  'Argentina': {'zh-tw': '阿根廷', 'fr': 'Argentine'},
  'Belize': {'zh-tw': '貝里斯', 'fr': 'Belize'},
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
  'Nicaragua': {'zh-tw': '尼加拉瓜', 'fr': 'Nicaragua'},
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
    'total': {'zh-tw': '所有年齡', 'fr': 'Tous âges', 'en': 'All ages'},
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

BRAND_DICT = {
  'ALL': 'total',
  'Oxford/AstraZeneca': 'AZ',
  'Moderna': 'Moderna',
  '高端': 'Medigen',
  '\u9ad8\u7aef': 'Medigen',
  'BNT': 'Pfizer', 
}

DELIVERY_LIST = [
  ## brand, source, quantity, delivery_date, available_date, delivery_news, available_news
  
  ## 2021/03
  [     'AZ',        'AZ',  116500, '2021-03-03', '2021-03-19', 'https://www.cna.com.tw/news/firstnews/202103035003.aspx', 'https://www.cna.com.tw/news/firstnews/202103225002.aspx'],
  
  ## 2021/04
  [     'AZ',     'COVAX',  198600, '2021-04-04', '2021-04-13', 'https://www.cna.com.tw/news/firstnews/202104040008.aspx', 'https://www.cna.com.tw/news/firstnews/202104120047.aspx'],
  
  ## 2021/05
  [     'AZ',     'COVAX',  409800, '2021-05-19', '2021-05-27', 'https://www.cna.com.tw/news/firstnews/202105190224.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600326'],
  
  ## 2021/06
  ['Moderna',   'Moderna',  148800, '2021-05-28', '2021-06-08', 'https://www.cna.com.tw/news/firstnews/202105285010.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600375'],
  [     'AZ',     'Japan', 1237860, '2021-06-04', '2021-06-12', 'https://www.cna.com.tw/news/firstnews/202106045008.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600389'],
  ['Moderna',   'Moderna',  239400, '2021-06-18', '2021-06-26', 'https://www.cna.com.tw/news/firstnews/202106180294.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600409'],
  ['Moderna',       'USA', 2498440, '2021-06-20', '2021-06-29', 'https://www.cna.com.tw/news/firstnews/202106205005.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600416'],
  
  ## 2021/07
  ['Moderna',   'Moderna',  409800, '2021-06-30', '2021-07-09', 'https://www.cna.com.tw/news/firstnews/202106305007.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600434'],
  [     'AZ',        'AZ',  625900, '2021-07-07', '2021-07-15', 'https://www.cna.com.tw/news/firstnews/202107070181.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600446'],
  [     'AZ',     'Japan', 1131780, '2021-07-08', '2021-07-16', 'https://www.cna.com.tw/news/firstnews/202107085007.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600448'],
  [     'AZ',     'Japan',  973480, '2021-07-15', '2021-07-23', 'https://www.cna.com.tw/news/firstnews/202107155011.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600455'],
  [     'AZ',        'AZ',  560100, '2021-07-15', '2021-07-23', 'https://www.cna.com.tw/news/firstnews/202107150245.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600455'],
  ['Moderna',   'Moderna',  349200, '2021-07-15', '2021-07-23', 'https://www.cna.com.tw/news/firstnews/202107150215.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600455'],
  
  ## 2021/08
  ['Medigen',   'Medigen',  265528,           '', '2021-08-02',                                                        '', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600469'],
  [     'AZ',        'AZ',  581400, '2021-07-27', '2021-08-04', 'https://www.cna.com.tw/news/firstnews/202107270203.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600479'],
  ['Medigen',   'Medigen',   86910,           '', '2021-08-05',                                                        '', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600479'],
  [     'AZ', 'Lithuania',   19400, '2021-07-31', '2021-08-10', 'https://www.cna.com.tw/news/firstnews/202107310085.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600484'],
  ['Moderna',   'Moderna',   99000, '2021-08-08', '2021-08-17', 'https://www.cna.com.tw/news/firstnews/202108090129.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600498'],
  ['Medigen',   'Medigen',  261766,           '', '2021-08-17',                                                        '', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600498'],
  [     'AZ',        'AZ',  524200, '2021-08-12', '2021-08-20', 'https://www.cna.com.tw/news/firstnews/202108120201.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600505'],
  ['Moderna',   'Moderna',  249000, '2021-08-15', '2021-08-24', 'https://www.cna.com.tw/news/firstnews/202108155005.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600513'],
  ['Medigen',   'Medigen',  263586,           '', '2021-08-24',                                                        '', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600513'],
  
  ## 2021/09
  [     'AZ',        'AZ',  264400, '2021-08-27', '2021-09-04', 'https://www.cna.com.tw/news/firstnews/202108275002.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600542'],
  ['Moderna',   'Czechia',   28800, '2021-08-29', '2021-09-07', 'https://www.cna.com.tw/news/firstnews/202108290099.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600550'],
  [     'AZ',        'AZ',  594900, '2021-08-31', '2021-09-07', 'https://www.cna.com.tw/news/firstnews/202108310186.aspx', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600550'],
  ['Medigen',   'Medigen',   86935,           '', '2021-09-07',                                                        '', 'https://www.fda.gov.tw/TC/newsContent.aspx?cid=4&id=t600550'],
  [     'AZ',    'Poland',  400200, '2021-09-05', '2021-09-14', 'https://www.cna.com.tw/news/firstnews/202109050008.aspx', ''],
  [     'AZ',     'COVAX',  409800, '2021-09-05', '2021-09-14', 'https://www.cna.com.tw/news/firstnews/202109055005.aspx', ''],
  ['Medigen',   'Medigen',  171681,           '', '2021-09-14',                                                        '', ''],
  [     'AZ',     'Japan',   62800, '2021-09-07', '2021-09-15', 'https://www.cna.com.tw/news/firstnews/202109075007.aspx', ''],
  [ 'Pfizer',    'Pfizer',  930732, '2021-09-02', '2021-09-17', 'https://www.cna.com.tw/news/firstnews/202109025001.aspx', 'https://www.cna.com.tw/news/firstnews/202109160346.aspx'],
  [ 'Pfizer',    'Pfizer',  909672, '2021-09-09', '2021-09-17', 'https://www.cna.com.tw/news/firstnews/202109090011.aspx', 'https://www.cna.com.tw/news/firstnews/202109160346.aspx'],
  [     'AZ',        'AZ',  457800, '2021-09-10', '2021-09-18', 'https://www.cna.com.tw/news/firstnews/202109105008.aspx', ''],
  ['Medigen',   'Medigen',   84280,           '', '2021-09-24',                                                        '', ''],
  [     'AZ',        'AZ',  640900, '2021-09-17', '2021-09-25', 'https://www.cna.com.tw/news/firstnews/202109175007.aspx', ''],
  ['Moderna',   'Moderna', 1082500, '2021-09-17', '2021-09-26', 'https://www.cna.com.tw/news/firstnews/202109180003.aspx', ''],
  ['Medigen',   'Medigen',  385680,           '', '2021-09-28',                                                        '', ''],
  
  ## 2021/10 
  [     'AZ',     'Japan',  500000, '2021-09-25',           '', 'https://www.cna.com.tw/news/firstnews/202109250088.aspx', ''],
  [ 'Pfizer',    'Pfizer',  550000, '2021-09-30',           '', 'https://www.cna.com.tw/news/firstnews/202109300013.aspx', ''],
  [     'AZ',        'AZ',  656000, '2021-09-30',           '', 'https://www.cna.com.tw/news/firstnews/202109305005.aspx', ''],
  [ 'Pfizer',    'Pfizer',  670000, '2021-10-01',           '', 'https://www.cna.com.tw/news/firstnews/202110010026.aspx', ''],
  [ 'Pfizer',    'Pfizer',  270000, '2021-10-04',           '', 'https://www.cna.com.tw/news/firstnews/202110040005.aspx', ''],
  [ 'Pfizer',    'Pfizer',  889200, '2021-10-07',           '', 'https://www.cna.com.tw/news/firstnews/202110070168.aspx', ''],
  [ 'Pfizer',    'Pfizer',  800000, '2021-10-08',           '', 'https://www.cna.com.tw/news/firstnews/202110080023.aspx', ''],
  ['Moderna',   'Moderna', 1132100, '2021-10-09',           '', 'https://www.cna.com.tw/news/firstnews/202110090004.aspx', ''],
  [     'AZ', 'Lithuania',  235900, '2021-10-09',           '', 'https://www.cna.com.tw/news/firstnews/202110095008.aspx', ''],
  ['Medigen',   'Medigen',  778344,           '', '2021-10-19',                                                        '', ''],
  [     'AZ',        'AZ', 1360000, '2021-10-13',           '', 'https://www.cna.com.tw/news/firstnews/202110135010.aspx', ''],
  [ 'Pfizer',    'Pfizer',  827000, '2021-10-14',           '', 'https://www.cna.com.tw/news/firstnews/202110140028.aspx', ''],
  [     'AZ',     'Japan',  300000, '2021-10-27',           '', 'https://www.cna.com.tw/news/firstnews/202110270032.aspx', ''],
  [ 'Pfizer',    'Pfizer',  902100, '2021-10-28',           '', 'https://www.cna.com.tw/news/firstnews/202110280177.aspx', ''],
  [ 'Pfizer',    'Pfizer',  910300, '2021-10-29',           '', 'https://www.cna.com.tw/news/firstnews/202110290017.aspx', ''],
  
  ## 2021/11 
  
]

QC_REF_DICT = {
  '2021-03': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637535562081700777',
  '2021-04': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637558184907650191',
  '2021-05': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637584168929602989',
  '2021-06': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637608147658280725',
  '2021-07': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637641134152043482',
  '2021-08': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637707534805440075',
  '2021-09': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637697404423272822',
}

################################################################################
## Global variables

README_DICT = {}

################################################################################
## Functions - files I/O

def loadCsv(name, verbose=True, **kwargs):
  data = pd.read_csv(name, dtype=object, skipinitialspace=True, **kwargs)
  if verbose:
    print('Loaded \"%s\"' % name)
  return data

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

################################################################################
## Functions - date

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

def numMonthToAbbr(num):
  return cld.month_abbr[num]

################################################################################
## Functions - other general utilities

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
  kernel = [1/7] * 7 + [0.0] * 6 ## Mean
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
## Functions - README

def initializeReadme_root():
  page = 'root'
  stock = []
  
  stock.append('processed_data/')
  stock.append('===============')
  stock.append('')
  
  stock.append('')
  stock.append('Processed data')
  stock.append('--------------')
  stock.append('')
  stock.append('Processed data contain various files that are directly used for plotting.')
  stock.append('')
  stock.append('All `csv` files were generated from files in `raw_data/` by executing')
  stock.append('```python')
  stock.append('python COVID_breakdown_data_processing.py')
  stock.append('```')
  stock.append('A `geojson` file containing a modified version of Taiwan map is also added.')
  stock.append('')
  stock.append('All files here only contain ASCII characters unless specified.')
  stock.append('')
  
  stock.append('')
  stock.append('Contents')
  stock.append('--------')
  stock.append('')
  stock.append('`2020/`')
  stock.append('- Contains statistics of 2020')
  stock.append('')
  stock.append('`2021/`')
  stock.append('- Contains statistics of 2021')
  stock.append('')
  stock.append('`latest/`')
  stock.append('- Contains statistics of last 90 days')
  stock.append('')
  stock.append('`overall/`')
  stock.append('- Contains statistics of the entire pandemic')
  stock.append('')
  README_DICT[page] = {'header': stock}
  
  stock = []
  key = 'adminMap_byCounties_offsetIslands_sphe'
  stock.append('`%s.geojson`' % key)
  stock.append('- Map of Taiwan with its islands rearranged')
  stock.append('- Contain non-ASCII characters')
  README_DICT[page][key] = stock
  return

def initializeReadme_page(page):
  stock = []
  stock.append('processed_data/%s/' % page)
  stock.append('================' + '='*len(page) + '')
  stock.append('')
  
  stock.append('')
  stock.append('Summary')
  stock.append('-------')
  stock.append('')
  dict_ = {PAGE_LATEST: 'last 90 days', PAGE_OVERALL: 'the entire pandemic', PAGE_2021: PAGE_2021, PAGE_2020: PAGE_2020}
  stock.append('This folder hosts data files which summarize COVID statistics in Taiwan during %s.' % dict_[page])
  stock.append('')
  
  stock.append('')
  stock.append('Contents')
  stock.append('--------')
  stock.append('')
  
  README_DICT[page] = {'header': stock}
  return

def initializeReadme():
  initializeReadme_root()
  for page in PAGE_LIST:
    initializeReadme_page(page)
  return

def saveMarkdown_readme(verbose=True):
  for page in ['root']+PAGE_LIST:
    hdr = README_DICT[page].pop('header')
    
    ## Sort
    sect_dict = {key: value for key, value in sorted(README_DICT[page].items(), key=lambda item: item[0])}
    
    if page == 'root':
      page = ''
    
    name = '%sprocessed_data/%s/README.md' % (DATA_PATH, page)
    f = open(name, 'w')
    
    ## Print header
    str_ = '\n'.join(hdr)
    f.write('%s' % str_)
    
    for row_list in sect_dict.values():
      str_ = '\n'.join(row_list)
      f.write('\n%s\n' % str_)
    f.close()
    
    if verbose:
      print('Saved \"%s\"' % name)
  return

################################################################################
## Classes - template

class Template:
  def getCol(self, col):
    return self.data[col].values
  
  def __str__(self):
    return str(self.data.head(25))

## End of file
################################################################################
