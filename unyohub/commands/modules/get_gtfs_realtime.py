# coding: utf-8

import traceback
import time
import random
import os
import urllib.request
import json
import sqlite3

from google.protobuf.json_format import MessageToDict

from google.transit import gtfs_realtime_pb2
from modules import diagram_funcs


def do_nothing (*args):
    pass


def get_railroad_gtfs_realtime (mes, main_dir, url):
    if not os.path.isdir(main_dir):
        mes("存在しない路線系統が指定されました", True)
        return
    
    
    diagram = diagram_funcs.diagram(main_dir, mes=mes)
    
    mes(url + " に接続します...")
    
    operation_date = diagram.get_date_string()
    
    feed_mes = gtfs_realtime_pb2.FeedMessage()
    
    
    try:
        with urllib.request.urlopen(urllib.request.Request(url), timeout=10) as response:
            feed_mes.ParseFromString(response.read())
    except urllib.error.HTTPError as err:
        mes("サーバがエラーコード " + str(err.code) + " を返しました", True)
        return False
    except urllib.error.URLError:
        mes("サーバに接続できませんでした", True)
        return False
    except Exception:
        mes(traceback.format_exc(), True)
        return False
    
    
    feed_dict = MessageToDict(feed_mes)
    
    if "entity" not in feed_dict:
        mes("走行中の編成の情報がありません")
        return True
    
    
    mes("取得したデータを保存しています...")
    
    try:
        with open(main_dir + "/gtfs_realtime_cache.json", "w", encoding="utf-8") as json_f:
            json.dump(feed_dict, json_f, ensure_ascii=False, separators=(',', ':'))
    except PermissionError:
        mes("gtfs_realtime_cache.jsonの書き込み権限がありません", True)
    except:
        mes("gtfs_realtime_cache.jsonの作成に失敗しました", True)
    
    
    mes("取得したデータをデータベースに記録しています...")
    
    formation_name_mappings_file_path = main_dir + "/formation_name_mappings.json"
    if os.path.isfile(formation_name_mappings_file_path):
        try:
            with open(formation_name_mappings_file_path, "r", encoding="utf-8") as json_f:
                formation_name_mappings = json.load(json_f)
        except:
            mes("formation_name_mappings.jsonの読み込みに失敗しました", True)
            formation_name_mappings = {}
    else:
        formation_name_mappings = {}
    
    diagram_revision, diagram_id = diagram.get_diagram_id(operation_date)
    now_datetime = time.strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        conn = sqlite3.connect(main_dir + "/railroad.db")
        cur = conn.cursor()
        
        cur.execute("SELECT `operation_number`, `posts_count` FROM `unyohub_metadata_caches` WHERE `operation_date` = :operation_date ORDER BY `operation_number` ASC", { "operation_date" : operation_date })
        metadata = cur.fetchall()
        metadata_count = len(metadata)
        
        cur.execute("SELECT `operation_number`, `assign_order`, `formations` FROM `unyohub_assigned_formation_caches` WHERE `operation_date` = :operation_date ORDER BY `operation_number` ASC, `assign_order` DESC", { "operation_date" : operation_date })
        
        operation_data = {}
        
        cnt = 0
        for data_item in cur.fetchall():
            if data_item[0] in operation_data:
                continue
            
            while cnt < metadata_count and data_item[0] != metadata[cnt][0]:
                cnt += 1
            
            operation_data[data_item[0]] = { "assign_order" : data_item[1], "formations" : data_item[2], "posts_count" : metadata[cnt][1] }
        
        new_operation_data = {}
        
        for trip_data in feed_dict["entity"]:
            trip_id = trip_data["tripUpdate"]["trip"]["tripId"]
            vehicle_id = trip_data["tripUpdate"]["vehicle"]["id"]
            
            cur.execute("REPLACE INTO `unyohub_operation_logs` (`operation_date`, `trip_id`, `vehicle_id`) VALUES (:operation_date, :trip_id, :vehicle_id)", { "operation_date" : operation_date, "trip_id" : trip_id, "vehicle_id" : vehicle_id })
            
            if diagram_id is None or vehicle_id not in formation_name_mappings:
                continue
            
            cur.execute("SELECT `unyohub_trains`.`operation_number`, `unyohub_trip_ids`.`train_number`, `unyohub_trains`.`final_arrival_time` FROM `unyohub_trip_ids`, `unyohub_trains` WHERE `unyohub_trip_ids`.`diagram_revision` = :diagram_revision AND `unyohub_trip_ids`.`diagram_id` = :diagram_id AND `unyohub_trip_ids`.`trip_id` = :trip_id AND `unyohub_trains`.`diagram_revision` = :diagram_revision_2 AND `unyohub_trains`.`diagram_id` = :diagram_id_2 AND `unyohub_trains`.`train_number` = `unyohub_trip_ids`.`train_number`", { "diagram_revision" : diagram_revision, "diagram_id" : diagram_id, "trip_id" : trip_id, "diagram_revision_2" : diagram_revision, "diagram_id_2" : diagram_id })
            
            operation_info = cur.fetchone()
            if operation_info is None:
                continue
            
            if operation_info[0] not in new_operation_data:
                new_operation_data[operation_info[0]] = []
            
            new_operation_data[operation_info[0]].append({ "formations" : formation_name_mappings[vehicle_id], "train_number" : operation_info[1], "final_arrival_time" : operation_info[2] })
        
        for operation_number in new_operation_data.keys():
            if len(new_operation_data[operation_number]) >= 2:
                continue
            
            if operation_number in operation_data:
                if operation_data[operation_number]["formations"] == new_operation_data[operation_number][0]["formations"]:
                    continue
                
                assign_order = operation_data[operation_number]["assign_order"] + 1
                posts_count = operation_data[operation_number]["posts_count"] + 1
                
                if operation_data[operation_number]["posts_count"] == 0:
                    cur.execute("DELETE FROM `unyohub_assigned_formation_caches` WHERE `operation_date` = :operation_date AND `operation_number` = :operation_number", { "operation_date" : operation_date, "operation_number" : operation_number })
            else:
                assign_order = 1
                posts_count = 1
            
            cur.execute("INSERT INTO `unyohub_data` (`operation_date`, `operation_number`, `assign_order`, `user_id`, `train_number`, `formations`, `is_quotation`, `posted_datetime`, `comment`, `ip_address`) VALUES (:operation_date, :operation_number, :assign_order, '#', :train_number, :formations, 1, :posted_datetime, '', NULL)", { "operation_date" : operation_date, "operation_number" : operation_number, "assign_order" : assign_order, "train_number" : new_operation_data[operation_number][0]["train_number"], "formations" : new_operation_data[operation_number][0]["formations"], "posted_datetime" : now_datetime })
            
            cur.execute("UPDATE `unyohub_assigned_formation_caches` SET `updated_datetime` = :updated_datetime WHERE `operation_date` = :operation_date AND `operation_number` = :operation_number", { "updated_datetime" : now_datetime, "operation_date" : operation_date, "operation_number" : operation_number })
            
            cur.execute("INSERT INTO `unyohub_assigned_formation_caches` (`operation_date`, `operation_number`, `assign_order`, `formations`, `updated_datetime`) VALUES (:operation_date, :operation_number, :assign_order, :formations, :updated_datetime)", { "operation_date" : operation_date, "operation_number" : operation_number, "assign_order" : assign_order, "formations" : new_operation_data[operation_number][0]["formations"], "updated_datetime" : now_datetime })
            
            cur.execute("REPLACE INTO `unyohub_metadata_caches` (`operation_date`, `operation_number`, `posts_count`, `variant_exists`, `comment_exists`, `from_beginner`, `is_quotation`, `updated_datetime`, `confirmed_train_final_arrival_time`) VALUES (:operation_date, :operation_number, :posts_count, 0, 0, 0, 1, :updated_datetime, :confirmed_train_final_arrival_time)", { "operation_date" : operation_date, "operation_number" : operation_number, "posts_count" : posts_count, "updated_datetime" : now_datetime, "confirmed_train_final_arrival_time" : new_operation_data[operation_number][0]["final_arrival_time"] })
            
            cur.execute("REPLACE INTO `unyohub_data_each_formation` (`formation_name`, `operation_date`, `operation_number`) VALUES (:formation_name, :operation_date, :operation_number)", { "formation_name" : new_operation_data[operation_number][0]["formations"], "operation_date" : operation_date, "operation_number" : operation_number })
        
        conn.commit()
        conn.close()
    except:
        mes("データベースへの記録に失敗しました", True)
        mes(traceback.format_exc())
    else:
        mes("データベースへの記録が完了しました")
    
    
    return True


def get_gtfs_realtime (mes, railroad_id=None, options=set()):
    if "-s" in options:
        time.sleep(random.randint(11,50))
    else:
        mes("運行情報データの取得", is_heading=True)
    
    with open("../config/gtfs_realtime_endpoints.json", "r", encoding="utf-8") as json_f:
        endpoints = json.load(json_f)
    
    if railroad_id is None:
        railroad_ids = endpoints.keys()
    else:
        railroad_ids = [railroad_id]
    
    for railroad_id in railroad_ids:
        if railroad_id not in endpoints:
            if "-s" not in options:
                mes("路線系統 " + railroad_id + " は運行情報を取得可能なURLが設定されていません", True)
            
            continue
        
        if "-s" in options:
            get_railroad_gtfs_realtime(do_nothing, "../data/" + railroad_id, endpoints[railroad_id])
        else:
            get_railroad_gtfs_realtime(mes, "../data/" + railroad_id, endpoints[railroad_id])
    
    if "-s" not in options:
        mes("全ての処理が完了しました")
