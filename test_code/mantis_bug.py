#!/usr/bin/env python
# -*- coding: utf-8 -*-
from test_code.sqlop import *
import time
import datetime
import configparser

class Mantis_Bug(SqlOperate):

    def __init__(self):
        conf = configparser.ConfigParser()
        conf.read("conf/config.ini")
        self.host = conf.get('mantis_bug_db','host')
        self.user = conf.get('mantis_bug_db','user')
        self.passwd = conf.get('mantis_bug_db','passwd')
        self.database = conf.get('mantis_bug_db','database')


    #获得当天0点时间戳（单位：秒）
    def get_time_today(self):
        t = time.localtime(time.time())
        time1 = time.mktime(time.strptime(time.strftime('%Y-%m-%d 00:00:00', t), '%Y-%m-%d %H:%M:%S'))
        return int(time1)


    #获取本周周一0点时间戳
    def get_current_week_begin_timestamp(self):
        date1 = datetime.datetime.now()
        this_week_start_dt = str(date1 - datetime.timedelta(days=date1.weekday())).split()[0]
        timestamp = int(time.mktime(datetime.datetime.strptime(this_week_start_dt, "%Y-%m-%d").timetuple()))
        return timestamp


    #查询当前活跃的版本
    def active_version(self):
        today_time=self.get_time_today()
        self.dbcur()
        sql="select mantis_project_table.name,mantis_bug_table.version " \
            "from mantis_project_table,mantis_bug_table " \
            "where mantis_project_table.id = mantis_bug_table.project_id and mantis_bug_table.date_submitted >=%d " \
            "group by mantis_project_table.name,mantis_bug_table.version "% today_time
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        # data = list(self.cur.fetchall())
        data=self.cur.fetchall()
        # print(data)
        if not data:
            return "今日暂时无数据"
        L=[]
        for x,y in data:
            if x=="遗留/线上bug":
                data=x
            else:
                if y=="":
                    continue
                data=x+'_'+y
            L.append(data)
            a = list()
            [a.append(i) for i in L if a.count(i) == 0]
        s=str(a).replace("\'","")
        return s


    #近7天创建项目的bug数
    def bug_prover_statistics(self):
        last_7days_time = self.get_time_today()-86400*7
        self.dbcur()
        sql="select p.name,v.version,count(b.id) " \
            "from mantis_project_table p,mantis_bug_table b,mantis_project_version_table v " \
            "where b.project_id =p.id and b.version=v.version and p.id=v.project_id and v.date_order>=%d " \
            "group by p.name,v.version"%last_7days_time
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = self.cur.fetchall()
        d={}
        for i in data:
            key=str(i[0])+"_"+str(i[1])
            value=i[2]
            d[key]=value
        return d


    #根据处理人（开发）统计
    def bug_handler_statistics(self):
        self.dbcur()
        sql = "select mantis_user_table.realname,count(mantis_bug_table.id) " \
              "from mantis_user_table,mantis_bug_table " \
              "where mantis_bug_table.handler_id= mantis_user_table.id and mantis_user_table.access_level='40'" \
              "group by mantis_bug_table.handler_id " \
              "order by count(mantis_bug_table.id) desc "
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        d={}
        for i in data:
            d[i[0]]=i[1]
        return d


    #根据报告人（测试）统计
    def bug_reporter_statistics(self):
        self.dbcur()
        sql = "select mantis_user_table.realname,count(mantis_bug_table.id) " \
              "from mantis_user_table,mantis_bug_table " \
              "where mantis_bug_table.reporter_id= mantis_user_table.id " \
              "and mantis_user_table.access_level='70'" \
              "and mantis_user_table.enabled='1' " \
              "and mantis_user_table.id not in (8,48)"\
              "group by mantis_bug_table.reporter_id " \
              "order by count(mantis_bug_table.id) desc "
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        d={}
        for i in data:
            d[i[0]]=i[1]
        return d


    #根据bug状态统计
    def bug_status_statistics(self):
        self.dbcur()
        sql="select status,count(*) from mantis_bug_table group by status"
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        #bug状态 '10:新建,30:重新打开,40:已确认,50:已分配,80:已解决,90:已关闭'
        d={10:'新建',30:'重新打开',40:'已确认',50:'已分配',80:'已解决',90:'已关闭'}
        d1={}
        for i in data:
            k=d[i[0]]
            y=i[1]
            d1.update({k:y})
        return d1


    #根据处理类型统计
    def bug_resolution(self):
        self.dbcur()
        sql="select resolution,count(resolution) from mantis_bug_table group by resolution"
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        #处理结果 '10:未处理,20:已修正,30:重新打开,40:无法重现,50:无法修复,60:重复问题,70:不必改,80:稍后处理,90:不做修改'
        d={10:'未处理',20:'已修正',30:'重新打开',40:'无法重现',50:'无法修复',60:'重复问题',70:'不必改',80:'稍后处理',90:'不做修改'}
        d1={}
        for i in data:
            k=d[i[0]]
            y=i[1]
            d1.update({k:y})
        return d1


    #根据严重程度统计
    def bug_severity(self):
        self.dbcur()
        sql = "select severity,count(severity) from mantis_bug_table group by severity"
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        # 严重程度 '10:建议,50:较小错误,60:一般错误,70:严重错误,80:致命错误'
        d = {10:'建议',50:'较小错误',60:'一般错误',70:'严重错误',80:'致命错误'}
        d1 = {}
        for i in data:
            k = d[i[0]]
            y = i[1]
            d1.update({k: y})
        return d1


    #根据类别分类
    def bug_category(self):
        self.dbcur()
        sql="select mantis_category_table.name,count(*) " \
            "from mantis_category_table,mantis_bug_table " \
            "where mantis_bug_table.category_id= mantis_category_table.id " \
            "group by mantis_bug_table.category_id"
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        d = {}
        for i in data:
            d[i[0]] = i[1]
        return d


    #本周bug趋势(报告数量)
    def bug_trend(self):
        #7天前0点时间
        today_time=self.get_time_today()-86400*6
        week_time=self.get_current_week_begin_timestamp()
        self.dbcur()
        sqlfrom="select FROM_UNIXTIME(date_submitted,'%Y-%m-%d'),count(*) from mantis_bug_table"
        sqlwhere=" where date_submitted>%d "%week_time
        sqlgroupby="group by FROM_UNIXTIME(date_submitted,'%Y-%m-%d') desc"
        sql=sqlfrom+sqlwhere+sqlgroupby
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = list(self.cur.fetchall())
        for i in range(-4,1):
            now = datetime.datetime.now()
            delta = datetime.timedelta(days=i)
            n_days = now + delta
            m_days = n_days.strftime('%Y-%m-%d')
            for y in data:
                if m_days==y[0]:
                    break
            else:
                d=(m_days,0)
                data.append(d)
        L=sorted(data)
        d={}
        for i in L:
            d[i[0]]=i[1]
        return d


    #获取本周内bug总数
    def bug_week(self):
        week_time=self.get_current_week_begin_timestamp()
        self.dbcur()
        sql="select count(id) from mantis_bug_table where date_submitted>%d"%week_time
        self.sqlExe(sql)
        self.sqlCom()
        self.sqlclo()
        data = self.cur.fetchone()[0]
        return data