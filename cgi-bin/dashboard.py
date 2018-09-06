#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import cgi
from string import Template
import json
import datetime
import time
import math
import MySQLdb
import pymysql.cursors
import pandas as pd
import pandas.io.sql as pandasql
from logging import getLogger, StreamHandler, DEBUG, INFO, WARNING, Formatter
logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(INFO)
logger.setLevel(INFO)
handler.setFormatter(Formatter('%(asctime)s %(name)s %(levelname)s %(message)s'))
logger.addHandler(handler)

def heatmap():
    
    browsing_range = 60*60*5
    browsing_interval = 60*3
    browsing_offset = -browsing_range + 3600 - 120
    
    def to_unixtime(pd_ts):
        return int(time.mktime(pd_ts.timetuple()))

    fs = cgi.FieldStorage()
    date_e = fs.getfirst('datetime', None)
    if date_e is None:
        date_unixtime =  int(time.mktime(datetime.datetime.now().timetuple())) + browsing_offset
    else:
        # formatting the string passed in the form so i is %Y/%m/%d %H:%M
        date_e_tmp = date_e[:4] + "/" + date_e[4:6] + "/" + date_e[6:8] + " " + date_e[8:10] + ":" + date_e[10:12]
        date_e = date_e_tmp
        date_unixtime = int(time.mktime(datetime.datetime.strptime(date_e, "%Y/%m/%d %H:%M").timetuple()))
    now_unixtime = int(time.mktime(datetime.datetime.now().timetuple()))
    forecast_limit_unixtime = now_unixtime + 3600 - 120
    debug = str(pd.Timestamp(date_e))

    dbname = 'campustraffic'
    con = MySQLdb.connect(host='localhost', user='student', passwd='crw2018', db='campustraffic')

    def getJSONforCongestion(date_unixtime):
        nowcast_flag = True if date_unixtime <= now_unixtime - 120 else False
        tblname = 'campus_nowcasts_scaled' if nowcast_flag else 'campus_forecasts_scaled'
        query = 'select * from {} where calculated_at < "{}" order by calculated_at desc limit 50'.format(tblname, date_unixtime)
        df = pandasql.read_sql(query, con)
        df['calculated_at'] = df['calculated_at'].apply(pd.Timestamp.fromtimestamp)
        df = df.ix[df.groupby('spot_id')['calculated_at'].idxmax()][['spot_id', 'congestion', 'calculated_at']]
        df.columns = ['spot_id', 'count', 'calculated_at']
        coord = pd.DataFrame([
            (1, 33.596531, 130.222394, 'Dining hall A'),
            (2, 33.597103, 130.223915, 'Dining hall B'),
            (3, 33.596960, 130.223975, 'Learning space'),
            (4, 33.596632, 130.222811, 'Dining hall C'),
            (5, 33.596727, 130.223330, 'Spot 5'),
            (6, 33.596846, 130.222731, 'Spot 6'),
            (7, 33.597002, 130.223279, 'Spot 7'),
            (8, 33.597229, 130.223933, 'Spot 8'),
            (9, 33.597335, 130.224375, 'Spot 9'),
            (10, 33.597365, 130.223534, 'Spot 10'),
            (11, 33.597235, 130.223057, 'Spot 11'),
            (12, 33.597075, 130.222478, 'Spot 12'),
            (13, 33.597546, 130.222768, 'Spot 13'),
            (14, 33.597816, 130.223867, 'Spot 14'),
            (15, 33.598100, 130.223545, 'Spot 15'),
            (16, 33.597904, 130.223072, 'Spot 16'),
            (17, 33.597745, 130.221920, 'Bus stop A'),
            (18, 33.597645, 130.221516, 'Bus stop B'),
        ], columns=['spot_id', 'lat', 'lng', 'spot_name'])
        df2 = pd.merge(df, coord, on='spot_id', how='inner')
        if nowcast_flag:
            #applying anonymous function that allows to convert x to string
            df2['calculated_at'] = df2['calculated_at'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))
        else:
            #applying anonymous function that allows to convert x to string
            df2['calculated_at'] = df2['calculated_at'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S (forecast)'))
        testData = {'max':100, 'data':df2.to_dict('records')}
        testData_str = json.dumps(testData)
        return testData

    def getJSONStrforCongestion(date_unixtime):
        testData = getJSONforCongestion(date_unixtime)
        return json.dumps(testData)

    testData_str = getJSONStrforCongestion(date_unixtime)
    testDataList = []
    date_i = date_unixtime
    while date_i < date_unixtime + browsing_range and date_i < forecast_limit_unixtime:
        testData = getJSONforCongestion(date_i)
        testDataList.append(testData)
        date_i = date_i + browsing_interval
        pass
    testDataList_str = json.dumps(testDataList)

    testData1 = testData_str
    testDataList1 = testDataList_str
    debug1 = debug
    return testData1, testDataList1, debug1

def movemap():
    
    browsing_range = 60*60*5
#    browsing_interval = 60*3
    browsing_offset = -browsing_range + 3600 - 120

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

    date_e = fs.getfirst('datetime', None)
    if date_e is None:
        date_unixtime =  int(time.mktime(datetime.datetime.now().timetuple())) + browsing_offset
    else:
        # formatting the string passed in the form so i is %Y/%m/%d %H:%M
        date_e_tmp = date_e[:4] + "/" + date_e[4:6] + "/" + date_e[6:8] + " " + date_e[8:10] + ":" + date_e[10:12]
        date_e = date_e_tmp
        date_unixtime = int(time.mktime(datetime.datetime.strptime(date_e, "%Y/%m/%d %H:%M").timetuple()))
    debug = str(pd.Timestamp(date_e))

    dbname = 'campusanalytics'
    tblname = 'movecount_10m'
    con = MySQLdb.connect(host='localhost', user='student', passwd='crw2018', db=dbname)


    # 移動人数可視化のためのJSONファイル作成
    def getJSONforMoveCount(date_unixtime):
        # とりあえず滞在は除外
        query = 'select * from {} where timestamp = "{}" and total >= 1 and unit_from != unit_to'.format(tblname, date_unixtime)
        df = pandasql.read_sql(query, con)
        df['timestamp'] = df['timestamp'].apply(pd.Timestamp.fromtimestamp)
        df2 = pd.DataFrame(columns=['from', 'to', 'labels', 'color'])
        for i, v in df.iterrows():
            colorcode = conv_total_color(v['total'])
            series_df2 = pd.Series([dict_SpotCoord[v['unit_from']], dict_SpotCoord[v['unit_to']], [dict_SpotName[v['unit_from']], dict_SpotName[v['unit_to']]], colorcode], index=df2.columns)
            df2 = df2.append(series_df2, ignore_index=True)
        time = datetime.datetime.fromtimestamp(date_unixtime).strftime('%Y-%m-%d %H:%M:%S')
        testData = {'time': time, 'data': df2.to_dict('records')}
        return testData


    def getJSONStrforMoveCount(date_unixtime):
        testData = getJSONforMoveCount(date_unixtime)
        return json.dumps(testData)


    testData_str = getJSONStrforMoveCount(date_unixtime)
    testDataList = []
    date_i = date_unixtime

    while date_i < date_unixtime + 60*60*5:
        testData = getJSONforMoveCount(date_i)
        testDataList.append(testData)
        date_i = date_i + 60*10
        pass
    testDataList_str = json.dumps(testDataList)

    testData2 = testData_str
    testDataList2 = testDataList_str
    debug2 = debug
    return testData2, testDataList2, debug

def dashboard():
    template = Template(open('../dashboard.html').read())

    heatmap_values = heatmap() # get values returned for the heatmap
    movemap_values = movemap() # get values returned for the movemap
    # substituing var in js with actual data
    html = template.substitute({'testData1': heatmap_values[0], 'testDataList1': heatmap_values[1], 'debug1': heatmap_values[2], 'testData2': movemap_values[0], 'testDataList2': movemap_values[1], 'debug2': movemap_values[2]})

    print('Content-type: text/html\n')
    print('')

    # print the result in the browser
    print(html)

dashboard()
