#!/usr/bin/python3
# -*- coding:utf-8 -*-

import cgi
from string import Template
import json
import math 
import datetime
import time
import pymysql.cursors
import pandas as pd
import pandas.io.sql as psql
from logging import getLogger, StreamHandler, DEBUG, INFO, WARNING, Formatter
logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(INFO)
logger.setLevel(INFO)
handler.setFormatter(Formatter('%(asctime)s %(name)s %(levelname)s %(message)s'))
logger.addHandler(handler)

# 注意[lng, lat]
dict_SpotCoord = {
    1: [130.222394, 33.596531],
    2: [130.223915, 33.597103],
    3: [130.223975, 33.596960],
    4: [130.222811, 33.596632],
    5: [130.222345, 33.596790],
    6: [130.222731, 33.596846],
    7: [130.223279, 33.597002],
    8: [130.223933, 33.597229],
    9: [130.224375, 33.597335],
    10: [130.223534, 33.597365],
    11: [130.223057, 33.597235],
    12: [130.222478, 33.597075],
    13: [130.222768, 33.597546],
    14: [130.223867, 33.597816],
    15: [130.223545, 33.598100],
    16: [130.223072, 33.597904],
    17: [130.221920, 33.597745],
    18: [130.221516, 33.597645],
    19: [130.224126, 33.597132],
    20: [130.224147, 33.597038]
    }
dict_SpotName = {
    1: 'Dining hall A',
    2: 'Dining hall B',
    3: 'Learning space',
    4: 'Dining hall C',
    5: 'Spot 5',
    6: 'Spot 6',
    7: 'Spot 7',
    8: 'Spot 8',
    9: 'Spot 9',
    10: 'Spot 10',
    11: 'Spot 11',
    12: 'Spot 12',
    13: 'Spot 13',
    14: 'Spot 14',
    15: 'Spot 15',
    16: 'Spot 16',
    17: 'Bus stop A',
    18: 'Bus stop B',
    19: 'room2107',
    20: 'room2108'
    }

def to_unixtime(pd_ts):
    return int(time.mktime(pd_ts.timetuple()))


# totalの数値をカラーコードに変換
def conv_total_color(total):
    # 分母はとりあえず。本当は過去のデータから決めるのが良いはず
    v = total / 10
    t = math.cos(4 * math.pi * v)
    c = int(((-t / 2) + 0.5) * 255)
    if v >= 1.0:
        rgb = (255, 0, 0)
    elif v >= 0.75:
        rgb = (255, c, 0)
    elif v >= 0.5:
        rgb = (c, 255, 0)
    elif v >= 0.25:
        rgb = (0, 255, c)
    elif v >= 0:
        rgb = (0, c, 255)
    else:
        rgb = (0, 0, 255)

    return '#{0[0]:02X}{0[1]:02X}{0[2]:02X}'.format(rgb)


fs = cgi.FieldStorage()
print('Content-type: text/html\n')
t = Template(open('../template_movemapindex.html').read())

date_e = fs.getfirst('datetime', None)
if date_e is None:
    date_unixtime = time.mktime(pd.to_datetime('2017-09-16 00:00').timetuple())
    # date_unixtime = time.mktime(pd.Timestamp.now().to_datetime().timetuple()) # 現在までのデータがローカルにはないから9/17 
else:
    date_unixtime = time.mktime(pd.Timestamp(date_e).to_datetime().timetuple())
debug = str(pd.Timestamp(date_e))

dbname = 'movecount'
tblname = 'movecount_10m'

con = pymysql.connect(host='localhost', user='phpmyadmin', passwd='limu828', db=dbname)


# 移動人数可視化のためのJSONファイル作成
def getJSONforMoveCount(date_unixtime):
    # とりあえず滞在は除外
    query = 'select * from {} where timestamp = "{}" and total >= 1 and unit_from != unit_to'.format(tblname, date_unixtime)
    df = psql.read_sql(query, con)
    df['timestamp'] = df['timestamp'].apply(pd.Timestamp.fromtimestamp)
    df2 = pd.DataFrame(columns=['from', 'to', 'labels', 'color'])
    for i, v in df.iterrows():
        colorcode = conv_total_color(v['total'])
        series_df2 = pd.Series([dict_SpotCoord[v['unit_from']], dict_SpotCoord[v['unit_to']], [dict_SpotName[v['unit_from']], dict_SpotName[v['unit_to']]], colorcode], index=df2.columns)
        df2 = df2.append(series_df2, ignore_index=True)
    # df2.to_csv('./tmp.csv', index=False)
    time = datetime.datetime.fromtimestamp(date_unixtime).strftime('%Y-%m-%d %H:%M:%S')
    testData = {'time': time, 'data': df2.to_dict('records')}
    return testData


def getJSONStrforMoveCount(date_unixtime):
    testData = getJSONforMoveCount(date_unixtime)
    return json.dumps(testData)


testData_str = getJSONStrforMoveCount(date_unixtime)
# open('./tmp.txt', 'w').write(testData_str)
testDataList = []
date_i = date_unixtime

while date_i < date_unixtime + 60*60*5:
    testData = getJSONforMoveCount(date_i)
    testDataList.append(testData)
    date_i = date_i + 60*10
    # logger.error(str(date_i))
    pass
testDataList_str = json.dumps(testDataList)
# open('./tmp.txt', 'w').write(testDataList_str)

html = t.substitute({'testData': testData_str, 'testDataList': testDataList_str, 'debug': debug})

print(html)
