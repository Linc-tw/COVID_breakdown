
    ################################
    ##  COVID_common.py           ##
    ##  Chieh-An Lin              ##
    ##  2022.05.14                ##
    ################################

import os
import sys
import copy
import json
import warnings as wng
import calendar as cld
import datetime as dtt

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
## new_year_token
PAGE_2020 = '2020'
PAGE_2021 = '2021'
PAGE_2022 = '2022'
PAGE_2023 = '2023'
## new_year_token (2023)
YEAR_LIST = [PAGE_2020, PAGE_2021, PAGE_2022] ## Keep order
PAGE_LIST = [PAGE_LATEST, PAGE_OVERALL] + YEAR_LIST

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
  'diarrhea': {'zh-tw': '腹瀉', 'fr': 'diarrhée'}, 
  
  'headache': {'zh-tw': '頭痛', 'fr': 'mal de tête'},
  'eyes sore': {'zh-tw': '眼痛', 'fr': 'mal aux yeux'}, 
  'chest pain': {'zh-tw': '胸痛', 'fr': 'mal à la poitrine'}, 
  'stomachache': {'zh-tw': '腹痛', 'fr': 'mal de ventre'},
  'backache': {'zh-tw': '背痛', 'fr': 'mal de dos'}, 
  'toothache': {'zh-tw': '牙痛', 'fr': 'mal de dents'}, 
  'dermatitis': {'zh-tw': '皮膚炎', 'fr': 'dermatite'},
  
  'fatigue': {'zh-tw': '倦怠', 'fr': 'fatigue'},
  'soreness': {'zh-tw': '痠痛', 'fr': 'myalgie'},
  'hypersomnia': {'zh-tw': '嗜睡', 'fr': 'hypersomnie'},
  'insomnia': {'zh-tw': '失眠', 'fr': 'insomnie'},
  
  'dysnosmia': {'zh-tw': '嗅覺異常', 'fr': 'dysosmie'}, 
  'dysgeusia': {'zh-tw': '味覺異常', 'fr': 'dysgueusie'},
  
  'tonsillitis': {'zh-tw': '淋巴腫脹', 'fr': 'adénopathie'}, 
  'hypotension': {'zh-tw': '低血壓', 'fr': 'hypotension'},
  'hypoglycemia': {'zh-tw': '低血糖', 'fr': 'hypoglycémie'}, 
  'hypoxemia': {'zh-tw': '低血氧', 'fr': 'hypoxémie'},
  'anorexia': {'zh-tw': '食慾不佳', 'fr': 'anorexie'},
  'arrhythmia': {'zh-tw': '心律不整', 'fr': 'arythmie'},
  'coma': {'zh-tw': '意識不清', 'fr': 'coma'},
  
  'symptomatic': {'zh-tw': '有症狀', 'fr': 'symptomatique'},
  'asymptomatic': {'zh-tw': '無症狀', 'fr': 'asymptomatique'} 
}

TRAVEL_HISTORY_DICT = {
  ## East & South Asia
  'Bangladesh': {'zh-tw': '孟加拉', 'fr': 'Bangladesh'},
  'Cambodia': {'zh-tw': '柬埔寨', 'fr': 'Cambodge'},
  'China': {'zh-tw': '中國', 'fr': 'Chine'},
  'Hong Kong': {'zh-tw': '香港', 'fr': 'Hong Kong'},
  'Indonesia': {'zh-tw': '印尼', 'fr': 'Indonésie'},
  'India': {'zh-tw': '印度', 'fr': 'Inde'},
  'Japan': {'zh-tw': '日本', 'fr': 'Japon'},
  'Korea': {'zh-tw': '韓國', 'fr': 'Corée'},
  'Laos': {'zh-tw': '寮國', 'fr': 'Laos'},
  'Macao': {'zh-tw': '澳門', 'fr': 'Macao'},
  'Malaysia': {'zh-tw': '馬來西亞', 'fr': 'Malaisie'},
  'Maldives': {'zh-tw': '馬爾地夫', 'fr': 'Maldives'}, 
  'Mongolia': {'zh-tw': '蒙古', 'fr': 'Mongolie'},
  'Myanmar': {'zh-tw': '緬甸', 'fr': 'Myanmar'},
  'Nepal': {'zh-tw': '尼泊爾', 'fr': 'Népal'},
  'Pakistan': {'zh-tw': '巴基斯坦', 'fr': 'Pakistan'},
  'Papua New Guinea': {'zh-tw': '巴布亞紐幾內亞', 'fr': 'Papouasie-Nouvelle-Guinée'}, 
  'Philippines': {'zh-tw': '菲律賓', 'fr': 'Philippines'},
  'Singapore': {'zh-tw': '新加坡', 'fr': 'Singapour'},
  'Sri Lanka': {'zh-tw': '斯里蘭卡', 'fr': 'Sri Lanka'},
  'Thailand': {'zh-tw': '泰國', 'fr': 'Thaïlande'},
  'Vietnam': {'zh-tw': '越南', 'fr': 'Vietnam'},
  
  ## West & Central Asia
  'Afghanistan': {'zh-tw': '阿富汗', 'fr': 'Afghanistan'},
  'Iran': {'zh-tw': '伊朗', 'fr': 'Iran'},
  'Israel': {'zh-tw':  '以色列', 'fr': 'Israël'},
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
  'Estonia': {'zh-tw': '愛沙尼亞', 'fr': 'Estonie'}, 
  'Finland': {'zh-tw': '芬蘭', 'fr': 'Finlande'},
  'France': {'zh-tw': '法國', 'fr': 'France'},
  'Germany': {'zh-tw': '德國', 'fr': 'Allemagne'},
  'Greece': {'zh-tw': '希臘', 'fr': 'Grèce'},
  'Iceland': {'zh-tw': '冰島', 'fr': 'Islande'},
  'Ireland': {'zh-tw': '愛爾蘭', 'fr': 'Irlande'},
  'Italy': {'zh-tw': '義大利', 'fr': 'Italie'},
  'Hungary': {'zh-tw': '匈牙利',  'fr': 'Hongrie'},
  'Latvia': {'zh-tw': '拉脫維亞', 'fr': 'Lettonie'}, 
  'Lithuania': {'zh-tw': '立陶宛', 'fr': 'Lituanie'},
  'Luxemburg': {'zh-tw': '盧森堡', 'fr': 'Luxembourg'},
  'Malta': {'zh-tw': '馬爾他', 'fr': 'Malte'},
  'Netherlands': {'zh-tw': '荷蘭', 'fr': 'Pays-Bas'},
  'Norway': {'zh-tw': '挪威', 'fr': 'Norvège'},
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
  'Algeria': {'zh-tw': '阿爾及利亞', 'fr': 'Algérie'}, 
  'Burkina Faso': {'zh-tw': '布吉納法索', 'fr': 'Burkina Faso'},
  'Cameroon': {'zh-tw': '喀麥隆', 'fr': 'Cameroun'},
  'Chad': {'zh-tw': '查德', 'fr':' Tchad'},
  'Eswatini': {'zh-tw': '史瓦帝尼', 'fr': 'Eswatini'},
  'Egypt': {'zh-tw': '埃及', 'fr': 'Égypte'},
  'Ethiopia': {'zh-tw': '衣索比亞', 'fr': 'Éthiopie'},
  'Gambia': {'zh-tw': '甘比亞', 'fr': 'Gambie'},
  'Ghana': {'zh-tw': '迦納', 'fr': 'Ghana'},
  'Kenya': {'zh-tw': '肯亞', 'fr': 'Kenya'},
  'Lesotho': {'zh-tw': '賴索托', 'fr': 'Lesotho'},
  'Malawi': {'zh-tw': '馬拉威', 'fr': 'Malawi'},
  'Mauritania': {'zh-tw': '茅利塔尼亞', 'fr': 'Mauritanie'},
  'Mauritius': {'zh-tw': '模里西斯', 'fr': 'Maurice'},
  'Morocco': {'zh-tw': '摩洛哥', 'fr': 'Maroc'},
  'Nigeria': {'zh-tw': '奈及利亞', 'fr': 'Nigéria'}, 
  'Senegal': {'zh-tw': '塞內加爾', 'fr': 'Sénégal'},
  'Somaliland': {'zh-tw': '索馬利蘭', 'fr': 'Somaliland'},
  'South Africa': {'zh-tw': '南非', 'fr': 'Afrique du Sud'},
  'Tanzania': {'zh-tw': '坦尚尼亞', 'fr': 'Tanzanie'},
  'Tunisia': {'zh-tw': '突尼西亞', 'fr': 'Tunisie'},
  'Uganda': {'zh-tw': '烏干達', 'fr': 'Ouganda'},
  
  ## North & South America
  'Argentina': {'zh-tw': '阿根廷', 'fr': 'Argentine'},
  'Belize': {'zh-tw': '貝里斯', 'fr': 'Belize'},
  'Bolivia': {'zh-tw': '玻利維亞', 'fr': 'Bolivie'},
  'Brazil': {'zh-tw': '巴西', 'fr': 'Brésil'},
  'Canada': {'zh-tw': '加拿大', 'fr': 'Canada'},
  'Chile': {'zh-tw': '智利', 'fr': 'Chili'},
  'Colombia': {'zh-tw': '哥倫比亞', 'fr': 'Colombie'},
  'Costa Rica': {'zh-tw': '哥斯大黎加', 'fr': 'Costa Rica'},
  'Dominican Republic': {'zh-tw': '多明尼加', 'fr': 'République dominicaine'},
  'Ecuador': {'zh-tw': '厄瓜多', 'fr': 'Équateur'},
  'Guatemala': {'zh-tw': '瓜地馬拉', 'fr': 'Guatemala'}, 
  'Haiti': {'zh-tw': '海地', 'fr': 'Haïti'}, 
  'Honduras': {'zh-tw': '宏都拉斯', 'fr': 'Honduras'}, 
  'Latin America': {'zh-tw': '中南美洲', 'fr': 'Amérique latine'},
  'Mexico': {'zh-tw': '墨西哥', 'fr': 'Mexique'},
  'Nicaragua': {'zh-tw': '尼加拉瓜', 'fr': 'Nicaragua'},
  'Panama': {'zh-tw': '巴拿馬', 'fr': 'Panama'},
  'Paraguay': {'zh-tw': '巴拉圭', 'fr': 'Paraguay'},
  'Peru': {'zh-tw': '秘魯', 'fr': 'Pérou'},
  'Saint Kitts and Nevis': {'zh-tw': '聖克里斯多福及尼維斯', 'fr': 'Saint-Christophe-et-Niévès'},
  'Saint Lucia': {'zh-tw': '聖露西亞', 'fr': 'Sainte-Lucie'},
  'Salvador': {'zh-tw': '薩爾瓦多', 'fr': 'Salvador'},
  'Trinidad and Tobago': {'zh-tw': '千里達及托巴哥', 'fr': 'Trinité-et-Tobago'},
  'USA': {'zh-tw': '美國', 'fr': 'États-Unis'},
  
  ## Oceania
  'Australia': {'zh-tw': '澳洲', 'fr': 'Australie'},
  'Marshall Islands': {'zh-tw': '馬紹爾', 'fr': 'Îles Marshall'},
  'New Zealand': {'zh-tw': '紐西蘭', 'fr': 'Nouvelle-Zélande'},
  'Palau': {'zh-tw': '帛琉', 'fr': 'Palaos'}, 
  'Solomon Islands': {'zh-tw': '索羅門群島', 'fr': 'Îles Salomon'}, 
  
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
    
    '6-11': {'zh-tw': '6-11歲', 'fr': '6-11 ans', 'en': '6-11 yo'}, 
    '12-17': {'zh-tw': '12-17歲', 'fr': '12-17 ans', 'en': '12-17 yo'}, 
    '18-29': {'zh-tw': '18-29歲', 'fr': '18-29 ans', 'en': '18-29 yo'}, 
    '30-49': {'zh-tw': '30-49歲', 'fr': '30-49 ans', 'en': '30-49 yo'}, 
    '50-64': {'zh-tw': '50-64歲', 'fr': '50-64 ans', 'en': '50-64 yo'}, 
    '65-74': {'zh-tw': '65-74歲', 'fr': '65-74 ans', 'en': '65-74 yo'}, 
    '65+': {'zh-tw': '65+歲', 'fr': '65+ ans', 'en': '65+ yo'},
    '75+': {'zh-tw': '75+歲', 'fr': '75+ ans', 'en': '75+ yo'},
  },
  
  ## new_year_token (2023)
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
  
  '2021': {
    '0-4': 865740, '5-9': 1064421, '10-14': 959747, '15-19': 1097734, '20-24': 1424724, '25-29': 1591242, 
    '30-34': 1585715, '35-39': 1771182, '40-44': 1998162, '45-49': 1801686, '50-54': 1777772, '55-59': 1814760,
    '60-64': 1683396, '65-69': 1465460, '70-74': 1022956, '75-79': 575598, '80-84': 460369, '85-89': 258508,
    '90-94': 120495, '95-99': 30909, '100+': 4738,
  },
}

AGE_DICT_3 = {
  '75歲以上': '75+',
  '65歲以上': '65+',
  '65-74歲': '65-74',
  '50-64歲': '50-64',
  '30-49歲': '30-49',
  '18-29歲': '18-29',
  '12-17歲': '12-17',
  '06-11歲': '6-11',
  '總計': 'total',
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
  '全國': 'total',
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
  'Oxford\/AstraZeneca': 'AZ',
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
  ['Medigen',   'Medigen',  155500,           '', '2021-09-29',                                                        '', ''],
  ['Medigen',   'Medigen',   81700,           '', '2021-09-30',                                                        '', ''],
  [     'AZ',     'Japan',  657630, '2021-09-25', '2021-10-05', 'https://www.cna.com.tw/news/firstnews/202109250088.aspx', ''],
  [ 'Pfizer',    'Pfizer',  546972, '2021-09-30', '2021-10-08', 'https://www.cna.com.tw/news/firstnews/202109300013.aspx', ''], 
  [     'AZ',        'AZ',  656200, '2021-09-30', '2021-10-08', 'https://www.cna.com.tw/news/firstnews/202109305005.aspx', ''],
  [ 'Pfizer',    'Pfizer',  676162, '2021-10-01', '2021-10-09', 'https://www.cna.com.tw/news/firstnews/202110010026.aspx', ''],
  [ 'Pfizer',    'Pfizer',  262662, '2021-10-04', '2021-10-13', 'https://www.cna.com.tw/news/firstnews/202110040005.aspx', ''],
  ['Medigen',   'Medigen',  631184,           '', '2021-10-14',                                                        '', ''],
  [ 'Pfizer',    'Pfizer',  888612, '2021-10-07', '2021-10-15', 'https://www.cna.com.tw/news/firstnews/202110070168.aspx', ''],
  [ 'Pfizer',    'Pfizer',  888612, '2021-10-08', '2021-10-16', 'https://www.cna.com.tw/news/firstnews/202110080023.aspx', ''],
  ['Moderna',   'Moderna', 1131500, '2021-10-09', '2021-10-19', 'https://www.cna.com.tw/news/firstnews/202110090004.aspx', ''],
  [     'AZ', 'Lithuania',  231700, '2021-10-09', '2021-10-19', 'https://www.cna.com.tw/news/firstnews/202110095008.aspx', ''],
  ['Medigen',   'Medigen',  778344,           '', '2021-10-19',                                                        '', ''],
  [     'AZ',        'AZ', 1359600, '2021-10-13', '2021-10-22', 'https://www.cna.com.tw/news/firstnews/202110135010.aspx', ''],
  [ 'Pfizer',    'Pfizer',  826602, '2021-10-14', '2021-10-22', 'https://www.cna.com.tw/news/firstnews/202110140028.aspx', ''],
  ['Medigen',   'Medigen',   85597,           '', '2021-10-23',                                                        '', ''],
  ['Medigen',   'Medigen',   85937,           '', '2021-10-27',                                                        '', ''],
  
  ## 2021/11
  ['Medigen',   'Medigen',  541000,           '', '2021-10-30',                                                        '', ''],
  ['Medigen',   'Medigen',  255810,           '', '2021-11-03',                                                        '', ''],
  [     'AZ',     'Japan',  300400, '2021-10-27', '2021-11-05', 'https://www.cna.com.tw/news/firstnews/202110270032.aspx', ''],
  [ 'Pfizer',    'Pfizer',  895632, '2021-10-28', '2021-11-05', 'https://www.cna.com.tw/news/firstnews/202110280177.aspx', ''],
  [ 'Pfizer',    'Pfizer',  909672, '2021-10-29', '2021-11-09', 'https://www.cna.com.tw/news/firstnews/202110290017.aspx', ''],
  ['Moderna',       'USA', 1499540, '2021-11-01', '2021-11-10', 'https://www.cna.com.tw/news/firstnews/202111010135.aspx', ''],
  ['Medigen',   'Medigen',  271440,           '', '2021-11-11',                                                        '', ''],
  [     'AZ',        'AZ',  141300, '2021-11-04', '2021-11-13', 'https://www.cna.com.tw/news/firstnews/202111040163.aspx', ''],
  [     'AZ',        'AZ',  593500, '2021-11-06', '2021-11-15', 'https://www.cna.com.tw/news/firstnews/202111065006.aspx', ''],
  [ 'Pfizer',    'Pfizer',  830112, '2021-11-05', '2021-11-16', 'https://www.cna.com.tw/news/firstnews/202111050020.aspx', ''],
  ['Medigen',   'Medigen',  549570,           '', '2021-11-19',                                                        '', ''],
  [ 'Pfizer',    'Pfizer',  926052, '2021-11-12', '2021-11-23', 'https://www.cna.com.tw/news/firstnews/202111120148.aspx', ''],
  ['Moderna',   'Moderna', 1225500, '2021-11-12', '2021-11-23', 'https://www.cna.com.tw/news/firstnews/202111125008.aspx', ''],
  [     'AZ',        'AZ',  675100, '2021-11-19', '2021-11-27', 'https://www.cna.com.tw/news/firstnews/202111195010.aspx', ''],
  ['Moderna',   'Moderna', 1149820, '2021-11-19', '2021-11-30', 'https://www.cna.com.tw/news/firstnews/202111180261.aspx', ''],
  
  ## 2021/12
  [ 'Pfizer',    'Pfizer',  937752, '2021-11-25', '2021-12-03', 'https://www.cna.com.tw/news/firstnews/202111250017.aspx', ''],
  ['Medigen',   'Medigen',  173297,           '', '2021-12-09',                                                        '', ''],
  ['Medigen',   'Medigen',  255693,           '', '2021-12-14',                                                        '', ''],
  [ 'Pfizer',    'Pfizer', 1922892, '2021-12-09', '2021-12-17', 'https://www.cna.com.tw/news/firstnews/202112090163.aspx', ''],
  ['Medigen',   'Medigen',  151600,           '', '2021-12-27',                                                        '', ''],
  
  ## 2022/01
  [     'AZ',        'AZ',  737200, '2021-12-21', '2022-01-05', 'https://www.cna.com.tw/news/firstnews/202112210201.aspx', ''],
  [ 'Pfizer',    'Pfizer',  937752, '2021-12-30', '2022-01-08', 'https://www.cna.com.tw/news/firstnews/202112300017.aspx', ''],
  ['Medigen',   'Medigen',  551580,           '', '2022-01-15',                                                        '', ''],
  [     'AZ',        'AZ', 1460300, '2022-01-16', '2022-01-26', 'https://www.cna.com.tw/news/firstnews/202201130232.aspx', ''],
  [ 'Pfizer',    'Pfizer',  993912, '2022-01-21', '2022-01-28', 'https://www.cna.com.tw/news/firstnews/202201210026.aspx', ''],
  
  ## 2022/02
  ['Moderna',   'Moderna', 1511600, '2022-01-25', '2022-02-08', 'https://www.cna.com.tw/news/firstnews/202201250166.aspx', ''],
  [ 'Pfizer',    'Pfizer',  918156, '2022-01-27', '2022-02-11', 'https://www.cna.com.tw/news/firstnews/202201270022.aspx', ''],
  ['Medigen',   'Medigen',   75620,           '', '2022-02-18',                                                        '', ''],
  ['Medigen',   'Medigen',   97066,           '', '2022-02-19',                                                        '', ''],
  ['Moderna',   'Moderna', 1404200, '2022-02-15', '2022-02-24', 'https://www.cna.com.tw/news/firstnews/202202150139.aspx', ''],
  
  ## 2022/03
  ['Moderna',   'Moderna', 1224000, '2022-02-28', '2022-03-09', 'https://www.cna.com.tw/news/firstnews/202202280014.aspx', ''], 
  ['Medigen',   'Medigen',   95783,           '', '2022-03-18',                                                        '', ''],
  
  ## 2022/04
  ['Moderna',   'Moderna',  204000, '2022-04-23',           '', 'https://www.cna.com.tw/news/firstnews/202204230163.aspx', ''],
  ['Moderna',   'Moderna', 1371600, '2022-04-27',           '', 'https://www.cna.com.tw/news/firstnews/202204270325.aspx', ''],
  
  ## 2022/05
  ['Moderna',   'Moderna', 1106100, '2022-05-03',           '', 'https://www.cna.com.tw/news/firstnews/202205030148.aspx', ''],
  ['Moderna',   'Moderna', 1115500, '2022-05-04',           '', 'https://www.cna.com.tw/news/firstnews/202205040169.aspx', ''],
  
  ## 2022/06
  #['',   '', , '2022-05-',           '', '', ''],
  #['',   '', , '2022-05-',           '', '', ''],
  #['',   '', , '2022-05-',           '', '', ''],
  #['',   '', , '2022-05-',           '', '', ''],
  #['',   '', , '2022-05-',           '', '', ''],
  #['',   '', , '2022-05-',           '', '', ''],
]

QC_REF_DICT = {
  '2021-03': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637535562081700777',
  '2021-04': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637558184907650191',
  '2021-05': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637584168929602989',
  '2021-06': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637608147658280725',
  '2021-07': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637641134152043482',
  '2021-08': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637707534805440075',
  '2021-09': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637697404423272822',
  '2021-10': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637716363065289877',
  '2021-11': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637741191377186898',
  '2021-12': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637801673911438363',
  
  '2022-01': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637801671490971778',
  '2022-02': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637818952165220271',
  '2022-03': 'https://www.fda.gov.tw/TC/includes/GetFile.ashx?id=f637848437072514591',
  '2022-04': '',
  '2022-05': '',
}

################################################################################
## Global variables

README_DICT = {}

################################################################################
## Functions - files I/O

def loadCsv(name, verbose=True, **kwargs):
  data = pd.read_csv(name, dtype=object, skipinitialspace=True, **kwargs)
  if verbose:
    print('Loaded \"{}\"'.format(name))
  return data

def saveCsv(name, data, verbose=True):
  data.to_csv(name, index=False)
  if verbose:
    print('Saved \"{}\"'.format(name))
  return

def loadJson(name, verbose=True):
  file_ = open(name, 'r')
  data = json.load(file_)
  file_.close()
  if verbose:
    print('Loaded \"{}\"'.format(name))
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
  
  with wng.catch_warnings(): ## Avoid division by zero
    wng.simplefilter("ignore")
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

def pandasNAToZero(value_arr):
  ind = pd.isna(value_arr)
  value_arr = np.array(value_arr)
  value_arr[ind] = 0
  value_arr = value_arr.astype(float)
  return value_arr, ind

def sevenDayMovingAverage(value_arr):
  value_arr, ind = pandasNAToZero(value_arr)
  
  kernel = [1/7] * 7 + [0.0] * 6 ## Mean
  value_arr = signal.convolve(value_arr, kernel[::-1], mode='same')
  value_arr[ind] = np.nan
  return value_arr

################################################################################
## Functions - utilities specific to this file

def initializeStock_dailyCounts(col_tag_list):
  ord_ref = ISODateToOrd(ISO_DATE_REF)
  ord_today = getTodayOrdinal()
  date_list = [ordDateToISO(ord_) for ord_ in range(ord_ref, ord_today)]
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

def indexForYear(iso, year):
  correction = int(year % 4 == 0) - int(year % 100 == 0) + int(year % 400 == 0)
  ord_begin = ISODateToOrd('{:4d}-01-01'.format(year))
  ind = ISODateToOrd(iso) - ord_begin
  if ind < 0 or ind >= 365+correction:
    return np.nan
  return ind

def makeIndexList(iso):
  ind_latest = indexForLatest(iso)
  ind_overall = indexForOverall(iso)
  index_list = [ind_latest, ind_overall]
  
  for year in YEAR_LIST:
    ind = indexForYear(iso, int(year))
    index_list.append(ind)
  return index_list

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
  nan = [pd.NA] * (len(data.columns) - 1)
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
  
  ## new_year_token
  
  if PAGE_2020 == page:
    return stock.iloc[0:366]
    
  if PAGE_2021 == page:
    return stock.iloc[366:731]
    
  if PAGE_2022 == page:
    return stock.iloc[731:1096]
    
  if PAGE_2023 == page:
    return stock.iloc[1096:1461]
    
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
  for year in YEAR_LIST:
    stock.append('`{}/`'.format(year))
    stock.append('- Contains statistics of {}'.format(year))
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
  stock.append('`{}.geojson`'.format(key))
  stock.append('- Map of Taiwan with its islands rearranged')
  stock.append('- Contain non-ASCII characters')
  README_DICT[page][key] = stock
  return

def initializeReadme_page(page):
  dict_ = {PAGE_LATEST: 'last 90 days', PAGE_OVERALL: 'the entire pandemic'}
  for year in YEAR_LIST:
    dict_[year] = year
  
  stock = []
  stock.append('processed_data/{}/'.format(page))
  stock.append('================' + '='*len(page) + '')
  stock.append('')
  
  stock.append('')
  stock.append('Summary')
  stock.append('-------')
  stock.append('')
  stock.append('This folder hosts data files which summarize COVID statistics in Taiwan during {}.'.format(dict_[page]))
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
    
    name = '{}processed_data/{}/README.md'.format(DATA_PATH, page)
    f = open(name, 'w')
    
    ## Print header
    str_ = '\n'.join(hdr)
    f.write(str_)
    
    for row_list in sect_dict.values():
      str_ = '\n'.join(row_list)
      f.write('\n{}\n'.format(str_))
    f.close()
    
    if verbose:
      print('Saved \"{}\"'.format(name))
  return

################################################################################
## Class - template

class Template:
  def __str__(self):
    return str(self.data)

  def __getitem__(self, ind):
    return self.data.iloc[ind]
  
  def getCol(self, col):
    return self.data[col].values
  
  def getNbRows(self):
    return self.data.shape[0]

## End of file
################################################################################
