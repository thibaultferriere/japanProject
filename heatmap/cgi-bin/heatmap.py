#!/usr/bin/env python
# -*- coding:utf-8 -*-

import cgi
from string import Template
import json
import datetime
import time
import MySQLdb
import pandas as pd
import pandas.io.sql as pandasql
from logging import getLogger, StreamHandler, DEBUG, INFO, WARNING, Formatter
logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(INFO)
logger.setLevel(INFO)
handler.setFormatter(Formatter('%(asctime)s %(name)s %(levelname)s %(message)s'))
logger.addHandler(handler)

def to_unixtime(pd_ts):
    return int(time.mktime(pd_ts.timetuple()))

fs = cgi.FieldStorage()
print('Content-type: text/html\n')
t = Template(open('./template_index.html').read())
# message = fs.getfirst('message', None)
# if message is not None:
#     flag_sent = True
# else:
#     flag_sent = False
date_e = fs.getfirst('datetime', None)
if date_e is None:
    # date_str = pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
    date_unixtime = time.mktime(pd.Timestamp.now().to_datetime().timetuple())
else:
    # date_str = pd.Timestamp(date_e).strftime('%Y-%m-%d %H:%M:%S')
    date_unixtime = time.mktime(pd.Timestamp(date_e).to_datetime().timetuple())
# html = t.substitute({'sent': '送信しました' if flag_sent else ''})
# debug = date_str
debug = str(pd.Timestamp(date_e))

dbname = 'campustraffic'
tblname = 'campus_nowcasts_scaled'
#con = MySQLdb.connect(host='192.168.0.51', user='crw', passwd='receiver00', db='aibeacon')
con = MySQLdb.connect(host='192.168.0.51', user='vagrant', passwd='act0001', db='campustraffic')
#query = 'select * from alldata order by timestamp desc limit 100'
#query = 'select * from unit_spot_lut'
#query = 'select * from campus_nowcasts order by calculated_at desc limit 100'

def getJSONforCongestion(date_unixtime):
    query = 'select * from {} where calculated_at < "{}" order by calculated_at desc limit 50'.format(tblname, date_unixtime)
# query = 'select * from {} order by created desc limit 100'.format(tblname)
    df = pandasql.read_sql(query, con)
# data.to_csv('./{}_{}.csv'.format(dbname, tblname), index=False)
# debug = debug + str([str(pd.Timestamp(d)) for d in df['calculated_at']])
    df['calculated_at'] = df['calculated_at'].apply(pd.Timestamp.fromtimestamp)
    df = df.ix[df.groupby('spot_id')['calculated_at'].idxmax()][['spot_id', 'congestion', 'calculated_at']]
    df.columns = ['spot_id', 'count', 'calculated_at']
    # df = df.pivot_table(index='calculated_at', columns='spot_id', values='congestion')
# df.to_csv('./tmp.csv', index=False)
# df.to_json('./tmp.json', orient='records')
    # coord = pd.DataFrame([(1, 33.596531, 130.222394), (4, 33.596632, 130.222811)], columns=['spot_id', 'lat', 'lng'])
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
    # debug = debug + str(df2)
    df2.to_csv('./tmp.csv', index=False)
    df2['calculated_at'] = df2['calculated_at'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))
# json.dump(df2.to_dict('records'), open('./tmp.json', 'w'))
    testData = {'max':100, 'data':df2.to_dict('records')}
    testData_str = json.dumps(testData)
    # testData_str = json.dumps({'max':100, 'data':df2.to_dict('index')})
    # return testData_str
    return testData

def getJSONStrforCongestion(date_unixtime):
    testData = getJSONforCongestion(date_unixtime)
    return json.dumps(testData)

testData_str = getJSONStrforCongestion(date_unixtime)
open('./tmp.txt', 'w').write(testData_str)
testDataList = []
date_i = date_unixtime
# while date_i < date_unixtime + 60*600:
#while date_i < date_unixtime + 60*300:
#while date_i < date_unixtime + 60*60*16:
while date_i < date_unixtime + 60*60*5:
    testData = getJSONforCongestion(date_i)
    testDataList.append(testData)
    date_i = date_i + 60*3
    # logger.error(str(date_i))
    pass
testDataList_str = json.dumps(testDataList)
open('./tmp.txt', 'w').write(testDataList_str)

# html = t.substitute({'testData':testData_str, 'debug':debug})
html = t.substitute({'testData':testData_str, 'testDataList':testDataList_str, 'debug':debug})

print(html)
# print('<html><body>{}</body></html>'.format(str(fs)))

