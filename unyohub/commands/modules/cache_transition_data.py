# coding: utf-8

import traceback
import os
import json
import sqlite3
from datetime import date, timedelta

from modules import diagram_funcs


def do_nothing (*args):
    pass


def cache_railroad_transition_data (mes, main_dir, date_obj):
    if not os.path.isdir(main_dir):
        mes("路線系統 " + os.path.basename(main_dir) + " は存在しません", True)
        return False
    
    
    previous_day_date_obj = date_obj - timedelta(days=1)
    previous_day_date_str = previous_day_date_obj.isoformat()
    current_date_str = date_obj.isoformat()
    
    diagram = diagram_funcs.diagram(main_dir, mes=mes)
    diagram_revision, diagram_id = diagram.get_diagram_id(current_date_str)
    
    if diagram_id is None:
        mes("路線系統 " + os.path.basename(main_dir) + " で指定された日付に該当するダイヤを判別できませんでした", True)
        return False
    
    
    try:
        with open(main_dir + "/formations.json", "r", encoding="utf-8") as json_f:
            formations = json.load(json_f)
    except Exception:
        mes("路線系統 " + os.path.basename(main_dir) + " の編成表JSONファイルを読み込めませんでした", True)
        return False
    
    latter_operation_data = {}
    for formation_name in formations["formations"].keys():
        latter_operation_data[formation_name] = {}
    
    
    try:
        conn = sqlite3.connect(main_dir + "/railroad.db")
        cur = conn.cursor()
        
        
        cur.execute("SELECT `operation_number`, `starting_time`, `ending_time` FROM `unyohub_operations` WHERE `diagram_revision` = :diagram_revision AND `diagram_id` = :diagram_id", { "diagram_revision" : diagram_revision, "diagram_id" : diagram_id })
        
        operation_info = {}
        for operation in cur.fetchall():
            if (operation[1] is not None) and (operation[2] is not None):
                operation_info[operation[0]] = operation[1:]
        
        
        cur.execute("SELECT `formations`, `operation_number` FROM ( SELECT *, RANK() OVER( PARTITION BY `operation_number` ORDER BY `assign_order` ASC ) as `rnk` FROM `unyohub_assigned_formation_caches` WHERE `operation_date` = :operation_date ) `t` WHERE `rnk` = 1", { "operation_date" : current_date_str })
        
        for operation_data in cur.fetchall():
            if operation_data[0] is not None:
                for formation_name in operation_data[0].split("+"):
                    if formation_name in latter_operation_data:
                        latter_operation_data[formation_name][operation_data[1]] = operation_data[0]
        
        
        cur.execute("SELECT `formations`, `operation_number` FROM ( SELECT *, RANK() OVER( PARTITION BY `operation_number` ORDER BY `assign_order` DESC ) as `rnk` FROM `unyohub_assigned_formation_caches` WHERE `operation_date` = :operation_date ) `t` WHERE `rnk` = 1", { "operation_date" : current_date_str })
        
        transition_data = {}
        for operation_data in cur.fetchall():
            if operation_data[0] is not None and operation_data[1] in operation_info:
                for formation_name in operation_data[0].split("+"):
                    if formation_name in latter_operation_data:
                        for latter_operation_number in latter_operation_data[formation_name].keys():
                            if latter_operation_number in operation_info and operation_info[operation_data[1]][1] < operation_info[latter_operation_number][0]:
                                transition_data[operation_data[1] + "->" + latter_operation_number] = { "operation_date" : current_date_str, "former_operation_number" : operation_data[1], "former_formations" : operation_data[0], "operation_number" : latter_operation_number, "formations" : latter_operation_data[formation_name][latter_operation_number] }
        
        cur.execute("DELETE FROM `unyohub_transition_data_caches_same_day` WHERE `operation_date` = :operation_date", { "operation_date" : current_date_str })
        
        for transition_data_key in transition_data.keys():
            cur.execute("INSERT INTO `unyohub_transition_data_caches_same_day` (`operation_date`, `former_operation_number`, `former_formations`, `operation_number`, `formations`) VALUES (:operation_date, :former_operation_number, :former_formations, :operation_number, :formations)", transition_data[transition_data_key])
        
        
        cur.execute("SELECT `formations`, `operation_number` FROM ( SELECT *, RANK() OVER( PARTITION BY `operation_number` ORDER BY `assign_order` DESC ) as `rnk` FROM `unyohub_assigned_formation_caches` WHERE `operation_date` = :operation_date ) `t` WHERE `rnk` = 1", { "operation_date" : previous_day_date_str })
        
        transition_data = {}
        for operation_data in cur.fetchall():
            if operation_data[0] is not None:
                for formation_name in operation_data[0].split("+"):
                    if formation_name in latter_operation_data:
                        for latter_operation_number in latter_operation_data[formation_name].keys():
                            transition_data[operation_data[1] + "->" + latter_operation_number] = { "operation_date" : current_date_str, "previous_day_operation_number" : operation_data[1], "previous_day_formations" : operation_data[0], "operation_number" : latter_operation_number, "formations" : latter_operation_data[formation_name][latter_operation_number] }
        
        cur.execute("DELETE FROM `unyohub_transition_data_caches_from_previous_day` WHERE `operation_date` = :operation_date", { "operation_date" : current_date_str })
        
        for transition_data_key in transition_data.keys():
            cur.execute("INSERT INTO `unyohub_transition_data_caches_from_previous_day` (`operation_date`, `previous_day_operation_number`, `previous_day_formations`, `operation_number`, `formations`) VALUES (:operation_date, :previous_day_operation_number, :previous_day_formations, :operation_number, :formations)", transition_data[transition_data_key])
        
        
        conn.commit()
        conn.close()
    except:
        mes("路線系統 " + os.path.basename(main_dir) + " でキャッシュデータの生成に失敗しました", True)
        mes(traceback.format_exc())
        return False
    
    
    return True


def cache_transition_data (mes, data_dir_path, config_dir_path, start_date=None, end_date=None, options=set()):
    if "-s" not in options:
        mes("運用遷移データキャッシュの生成", is_heading=True)
    
    
    timedelta_1day = timedelta(days=1)
    
    if start_date is None:
        start_date_obj = date.today() - timedelta_1day
        end_date_obj = start_date_obj
    else:
        try:
            start_date_obj = date.fromisoformat(start_date)
        except:
            mes("キャッシュ対象範囲開始日が正しい日付文字列ではありません", True)
            return False
        
        if end_date is None:
            end_date_obj = start_date_obj
        else:
            try:
                end_date_obj = date.fromisoformat(end_date)
            except:
                mes("キャッシュ対象範囲終了日が正しい日付文字列ではありません", True)
                return False
    
    
    try:
        with open(config_dir_path + "/railroads.json", "r", encoding="utf-8") as json_f:
            railroads = json.load(json_f)
    except Exception:
        mes("railroads.json の読み込みに失敗しました", True)
        return False
    
    railroad_list = list(railroads["railroads"].keys())
    
    
    succeeded = True
    current_date_obj = start_date_obj
    while current_date_obj <= end_date_obj:
        if "-s" not in options:
            mes(current_date_obj.isoformat() + "の運用遷移データキャッシュを生成しています...")
        
        for railroad_id in railroad_list:
            if "-s" in options:
                result = cache_railroad_transition_data(do_nothing, data_dir_path + "/" + railroad_id, current_date_obj)
            else:
                result = cache_railroad_transition_data(mes, data_dir_path + "/" + railroad_id, current_date_obj)
            succeeded = result and succeeded
        
        current_date_obj += timedelta_1day
    
    
    if "-s" not in options:
        mes("全ての処理が完了しました")

    return succeeded
