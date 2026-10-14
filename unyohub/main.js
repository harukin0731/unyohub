/* 鉄道運用Hub main.js */

const UNYOHUB_INDEXEDDB_VERSION = 2602001;


const UNYOHUB_GENERIC_TRAIN_ICON = "data:image/webp;base64,UklGRo4CAABXRUJQVlA4TIICAAAvT8AdEJVIkiRJkaR+ukUtMzxjvplZnV2RIXvd8GYoiIADybZp69nvfdu2bdtm/CMboW3bNmLbtm2bewLyX/0z3aCFs7lMugxa0Hx9ZKGKD2Dy4/Zw9E6MC7nkHFE30NiRWLcwXM1llpiYD/iS5vlyXaT70QvFEp1/8TtEZkq05gEFKDNzpkui2IkZ8S8OjzldfiOzpwvmLo4c6WJm6SExvIhT6D0QJ1GSPvIunT0QIw6g1QY5iQvGbJldO+eR182+AT22jYflxBJjF2mQq0G7afYAxixgzcwZbZLYAibkiGKz+YvfITJhNQswHkps6eAFmPx0vqZfUFwCLrl6Q/tBG3A6aPkhxQvJftj0wrYbxOX2nZgXi/BDuBfG/DDq5AOH/fqxv/dc0zwHJXMhkhL6mOecXzlenuvrfp0HJejb3tDm9eJOXc/0msey1zsR5hQgM++E9kCUSyBEzueRv3iWFCRrEGqEAmESWOMgDvYriCvQtcAyEswLc4lk/j8DnCNZCmwjMZvCTCLBuBh0Ihm0CpQjQbFAOpJ3EsU7oUjgL2CNBOYCFN9x8LVDFslxHBxmlck4GK/REQdtNfLiIKdGdBxrzbziwLOGehyDWu0jSxww15KnKOYcZSEK5sdoi4LWMZKjIGkMnyiOY5lJRX+UZyPx/RHXYn794duCc3/m1DJo9YdmC4L9vRNo+UnsD1JL8tQbjztEM5u9sdHGQG/0t9HQG/VtZPRGepuF9UZoG969mVebGfWGYdsg1dvWBmNvMLbtkHz0xeerLTnsi4M8IBN9MX4Ii6Bl7+IyaXHZez1EY5GTFuk6Hl4lXqbZpJMv0iVSp1mlm69E/ZgTH4/5rw4=";

const UNYOHUB_UNKNOWN_TRAIN_ICON = "data:image/webp;base64,UklGRroDAABXRUJQVlA4TK0DAAAvT8AdEJVQtm07bS3l05fsYmZmZmau6jFXj5mZKQ/sSNbRGfd1zwkndm4ipAAQQICRbdu2bdtGXrIRbdu2t8+2bds2bwLsoH6afOVNSkjNuqu8kZN1iirT/IDs0/1GUG3OCxfJc8zEIMcdd66HctJC6uDOiaHD3n0YFsud+3oqhRF3ti4QHwmYmTtr1qGDm5kNbLszIiQE8995OLV8dqY093xBhIgpj3wRwk2CEbRwnqIggXp3Rk2Grd3nEqh1HiDXVtm784Jj4TJ3w3M+8nUffoNv9ns+7GZc4tjCvbJvQ27lgwREQiRqZjbgQzO3ICOPGAmxF4iPBMxQC5GISGgSxyZfIPtsvjS5CPESRPLqDmE5+IDQylsOrVJokcNNKdwWg4WLrc2lhEo5VEjhmByOCjlZM/yVE/6dpJ1nWzmHVKoYZR/nec5fF7zbHvbr5VA5o5B2h3DI7nnnRQ/shcxdVG3KOVeQM7VxBGa8BBV5Pky4QJxLriTXkGijDNSkqI0HenC/BQtX9LBBlCZENEJqZ2dxP+/yDX8y5gjJqz/4ire5hzPobMhxAx8z5ggZV+9zNdIuYXmE7O9xAaLu5h96gX9zB4Ke5wgyxzyJmAfppY65DyE3shLT/8+1iKj5jiMI/pYKCU/Si34UATW/I+s31vluo48d8zKXUQPJJ3ElbxLV30K+V4hZ3YF3/BBRL5Hvc2JexDt/h5jPyPcHMRfR3bXE/E6+/4mYB7o7nZj/yddHbr37k4npD34yT7z2MXMdriXmd3R4i5jPUOF++tiXKeM0hmnESVzJmxwh+lZKeIE+56ZGm6dxZX7iFJT5n+txZR7GlXkW1+Vv7sJ1+YALAU3GfMA1eLdFrP7gK97iHs7Au5b3GJ77BI0UTUhpEKdJiG2EUE0IaVS+mlTeDVyyicapgY0mtWWjNtYEgwZqmqDSQIjfevBrJNgwHuvBQ2vlpB4cb2NTD9bb6M91eITIXS5626jRg5q2kK0HWW146FG5t52iqgcqbcYnLQabyAUtOD+JdS1Ym0RLJsE0TyJXi+kkM2OyPCYskYbyqE8J+eWRl0JKeSE5pfIuD68UjMqrDVPOkSwPqRTjU2l8HAkkc7M0bqRxoDT2p7FYGgtpdJZGR1ooL42yNHJKC9lpIbg0gtIq69L2aSiVhlLaSJAfZfGzTzMelsUD65ATZXG8i1DJanRjkbWxiD7sIrFhWRsmWh++uvMlz959JosOd9ryHLqvZBkeU8s8ndpBHQA=";

const UNYOHUB_CANCELED_TRAIN_ICON = "data:image/webp;base64,UklGRiQEAABXRUJQVlA4TBgEAAAvT8AdEBfkIJIkRco+ZlBy/s3xvwfGbSQp8kL+Wd79mHkYtI3kyHPf+z+S50/u1m1sO66ykhbvXUZGBAWQkhPREGVQDzE10IUHjf5VQoQCuVQe/lVpqFhFEtvILpKXWmMjmGQOgaENwQiCIQwCgZSGpc/tLP1e7eMeIhSAjIhEE2mEgkSW9/At/vYvx+HYvHOzN9/4qnWelvPi00zteSrTkPmT59/L2B2f0pAAAIAAAAD8AIADAIcjAIADvBBwgAB/CAAASMoBFQpFRRsKRRcVFfqLLjQpiSvAAyQlAABJISmelABlGbzIjbIMVHVEIW3b9jRP3N3XMRzmvmXu7u7D3d0d+s9p3+Z57hQ+N08i+g/JkSRFkof7LJyYqn7g/693srX+gTWb/MHya35QseckAbI/oiB78QPGn3Fln7z74Jyyk44wq6xzTp4om/xBccfa2Wu+iCg7R3mr5qz1ReTarLIOxOZrO/bH5yOnz9TrDczrngdvHwL58tqOniBYtvaOj0GctcsIbqS+TnatHXn4ePzF8JB7paw4l7wYf/xwRNndlI/gmL2B4PqnXyLitpaeKsae3/l4zRf59em6gPbx/pBiz91PBLdM0PfRy+s4tixoCY6bKBIcEyie4n4MWdgSFCs43qF4iGOKSm5heV1VQ15GCj/f4Hh9lEJGXkNVXXlhbkB6fq0XWnH7h5U7M49eDCjg5EUy41Y+tBd7odXmp/tS4KXuaq8yNEm81BX4OTVepMYTl1PoSbSmEyms8HSaTiqqPa2Gk+pKT6/ZpLJBCBpNGvKEosnEZRSRNJjL8OvPkDSWq/dFupo8/S51I+hrpLy5nf5fPvTRNFPPhxCKqJFUClRNlApZfBHQRRcFQ2yRcEQWDUtcGnii0sEUkxauiPSw5UeALzcKAHmRQMiJBkR6RDBSowLx/AVaZDDSokMTEgOigDhQZceCLDMedFkxYciIC0dybDhepHCux8aMy90G6WskvtDNhhdVLqzoMuHEkQcjnizoceVAji8DagjpYDp7hSSVddCfWq4J4nroUAv1lxvGjwGfQYHcDPiKCeVWwA4kmN8C9hDh/B5wAAjoYcAvfkiPQ6eWr7ghfZXmB3vODOqYH2KSF9aHYe6zAjsXZoET2tth3jKC+zbMGj2878NskzPgdpg2aiZsDZFVQsyIZdl/qS+N0zlSab0fv3Ou+J3Dxe+cMH7nmPE7Z43fOXD8zqnjd44eu3P+yHuI5j5lbE4i7iEi7klaOvqVwSXiQvckmrsqw5sQ7aZN80DPXdMkem6Z5paed6ZZ1bNmmoRwu26aL3r2TOP0/DbNbz1pg2ZxaaLfmFmcEJg0y0PSbe69yAUk2vHeLifcBYDfrn+OIWsd/+3CckvZRcDbhd12Ani7/tMT";


var funcs_load_resolve;
var funcs_load_promise = new Promise(function (resolve) {
    funcs_load_resolve = resolve;
});


function escape_html (text) {
    return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function escape_form_data (data) {
    return encodeURIComponent(data).replace(/%20/g, "+");
}

function add_slashes (text) {
    return text.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "\\\"");
}

function convert_to_html (text) {
    var split_text = escape_html(text).replace(/https?:\/\/[^\s\\`\|\[\]\{\}\^]+/g, "<a href='$&' target='_blank' class='external_link'>$&</a>").split("\n");
    
    for (var cnt = 0; cnt < split_text.length; cnt++) {
        if (split_text[cnt].substring(0, 2) === "# ") {
            split_text[cnt] = "<h4>" + split_text[cnt].substring(2) + "</h4>";
        } else if (cnt + 1 < split_text.length && split_text[cnt + 1].substring(2) !== "# ") {
            split_text[cnt] += "<br>";
        }
    }
    
    return split_text.join("");
}

function str_to_halfwidth (str) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (char) {
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
    });
}


function get_timestamp () {
    return Math.floor(Date.now() / 1000);
}

function get_date_string (ts) {
    var dt = new Date((ts - 14400) * 1000);
    return dt.getFullYear() + "-" + ("0" + String(dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2);
}

function get_hh_mm (ts = null) {
    if (ts === null) {
        var dt = new Date();
    } else {
        var dt = new Date(ts * 1000);
    }
    
    var hours = dt.getHours();
    var minutes = ("0" + dt.getMinutes()).slice(-2);

    if (hours < 4) {
        hours += 24;
    }
    hours = ("0" + hours).slice(-2);

    return hours + ":" + minutes;
}

function get_date_and_time (ts_or_date_str) {
    if (typeof ts_or_date_str === "string") {
        var dt = new Date(ts_or_date_str);
    } else if (ts_or_date_str === null) {
        return "データなし";
    } else {
        var dt = new Date(ts_or_date_str * 1000);
    }
    
    var date_str = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    
    var now_ts = get_timestamp();
    var dt_2 = new Date(now_ts * 1000);
    if (date_str === dt_2.getFullYear() + "/" + (dt_2.getMonth() + 1) + "/" + dt_2.getDate()) {
        date_str = "今日";
    } else {
        dt_2 = new Date((now_ts - 86400) * 1000);
        if (date_str === dt_2.getFullYear() + "/" + (dt_2.getMonth() + 1) + "/" + dt_2.getDate()) {
            date_str = "昨日";
        } else {
            dt_2 = new Date((now_ts - 172800) * 1000);
            if (date_str === dt_2.getFullYear() + "/" + (dt_2.getMonth() + 1) + "/" + dt_2.getDate()) {
                date_str = "一昨日";
            }
        }
    }
    
    return date_str + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
}


function get_default_config () {
    return {
        "unyohub_version" : UNYOHUB_VERSION,
        "guest_id" : null,
        "dark_mode" : false,
        "enlarge_display_size" : false,
        "refresh_interval" : 5,
        "operation_data_cache_period" : 7,
        "position_mode_minute_step" : 1,
        "show_final_destinations_in_position_mode" : false,
        "retain_position_mode_last_seen_line" : true,
        "show_deadhead_trains_on_timetable" : true,
        "show_starting_trains_only_on_timetable" : false,
        "colorize_corrected_posts" : false,
        "colorize_beginners_posts" : false,
        "force_arrange_west_side_car_on_left" : false,
        "group_formations_by_prefix" : false,
        "show_unregistered_formations_on_formation_table" : true,
        "colorize_formation_table" : true,
        "operation_table_view" : window.innerWidth <= 500 ? "simple" : "timeline",
        "show_start_end_times_on_operation_table" : true,
        "show_current_trains_on_operation_table" : true,
        "show_comments_on_operation_table" : true,
        "show_assigned_formations_on_operation_table" : true,
        "operation_table_timeline_scale" : 2,
        "show_formation_captions_on_operation_data" : false,
        "simplify_operation_details" : false,
        "show_favorite_railroads" : true,
        "show_favorite_stations" : true,
        "favorite_railroads" : [],
        "favorite_stations" : []
    };
}

function save_config () {
    localStorage.setItem("unyohub_config", JSON.stringify(config));
}

var config = new Object();
(function () {
    var config_json = localStorage.getItem("unyohub_config");
    
    if (config_json !== null) {
        config = JSON.parse(config_json);
    }
    
    if (!("unyohub_version" in config) || config["unyohub_version"] !== UNYOHUB_VERSION) {
        var default_config = get_default_config();
        
        config = Object.assign({}, default_config, config);
        
        Object.keys(config).forEach(function (key) {
            if (!(key in default_config)) {
                delete config[key];
            }
        });
        
        config["unyohub_version"] = UNYOHUB_VERSION;
        
        save_config();
    }
}());


function ajax_post (end_point_name, query_str, callback_func, timeout = 30) {
    var ajax_request = new XMLHttpRequest();
    ajax_request.onloadend = function () {
        if (ajax_request.responseText.substring(0, 6) === "ERROR:") {
            mes(ajax_request.responseText, true);
            callback_func(false, null);
        } else {
            switch (ajax_request.status) {
                case 0:
                    mes("ERROR: ネットワークが不安定です", true);
                    callback_func(false, null);
                    break;
                
                case 200:
                case 201:
                    callback_func(ajax_request.responseText, ajax_request.getResponseHeader("last-modified"));
                    break;
                
                default:
                    mes("ERROR: データの取得に失敗しました(" + ajax_request.status + ")", true);
                    callback_func(false, null);
                    break;
            }
        }
    };
    
    ajax_request.open("POST", "/api/" + end_point_name, true);
    ajax_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    ajax_request.timeout = timeout * 1000;
    ajax_request.send(query_str);
}


function change_title (title_text, url = null) {
    document.getElementsByTagName("title")[0].innerText = title_text;
    
    if (history_back_promise instanceof Promise) {
        history_back_promise.then(function () {
            if (url !== null && url !== location.pathname + location.hash) {
                history.pushState(null, "", url);
            }
        });
    } else if (url !== null && url !== location.pathname + location.hash) {
        history.pushState(null, "", url);
    }
}


var message_area_elm = document.getElementById("message_area");
var message_elm_list = [];

function mes (message_text, is_error = false, display_time = 10) {
    var box_elm = document.createElement("div");
    
    box_elm.innerText = message_text;
    
    var box_elm_touch_start_x = 0;
    var box_elm_move_distance_x = 0;
    box_elm.addEventListener("touchstart", function (event) {
        box_elm_touch_start_x = event.touches[0].pageX;
    });
    box_elm.addEventListener("touchmove", function (event) {
        box_elm_move_distance_x = event.touches[0].pageX - box_elm_touch_start_x;
        box_elm.style.transform = box_elm_move_distance_x > 0 ? "translateX(" + box_elm_move_distance_x + "px)" : "";
    });
    box_elm.addEventListener("touchend", function () {
        if (box_elm_move_distance_x >= 50) {
            delete_mes(box_elm);
        } else {
            box_elm.style.transform = "";
        }
    });
    
    var close_button_elm = document.createElement("button");
    
    box_elm.appendChild(close_button_elm);
    close_button_elm.className = "message_close_button";
    close_button_elm.onclick = function () {
        delete_mes(box_elm);
    };
    
    if (is_error) {
        box_elm.className = "error_message";
        
        if (message_elm_list.length >= 1 && message_elm_list[message_elm_list.length - 1].innerText === message_text) {
            delete_mes(message_elm_list[message_elm_list.length - 1]);
        }
    }
    
    if (message_elm_list.length >= 3) {
        delete_mes(message_elm_list[0]);
    }
    
    message_area_elm.prepend(box_elm);
    message_elm_list.push(box_elm);
    
    setTimeout(delete_mes, display_time * 1000, box_elm);
}

function delete_mes (box_elm) {
    var message_index = message_elm_list.indexOf(box_elm);
    
    if (message_index !== -1) {
        message_area_elm.removeChild(box_elm);
        message_elm_list.splice(message_index, 1);
    }
}


var instance_info;

function update_instance_info () {
    change_title(instance_info["instance_name"]);
    document.getElementById("instance_name").innerText = instance_info["instance_name"];
    document.getElementById("menu_instance_name").innerText = instance_info["instance_name"];
    document.getElementById("menu_reload_button").innerText = instance_info["instance_name"];
    
    var menu_manual_button_elm = document.getElementById("menu_manual_button");
    if ("manual_url" in instance_info) {
        menu_manual_button_elm.style.display = "block";
        menu_manual_button_elm.setAttribute("href", instance_info["manual_url"]);
    } else {
        menu_manual_button_elm.style.display = "none";
    }
    
    if (location.pathname === "/") {
        document.getElementById("splash_screen_instance_name").innerText = instance_info["instance_name"];
    }
    
    if (instance_info["unyohub_version"] > UNYOHUB_VERSION) {
        document.getElementById("menu_about").className = "new_icon";
        if (location.pathname === "/") {
            document.getElementById("splash_screen_update_info").style.display = "block";
        }
    }
}

(function () {
    var instance_info_json = localStorage.getItem("unyohub_instance_info");
    
    if (instance_info_json !== null) {
        instance_info = JSON.parse(instance_info_json);
        
        var last_modified_timestamp_q = "&last_modified_timestamp=" + instance_info["last_modified_timestamp"];
    } else {
        instance_info = {
            unyohub_version : UNYOHUB_VERSION,
            instance_name : UNYOHUB_APP_NAME,
            available_days_ahead : 1,
            allow_guest_user : false,
            require_comments_on_speculative_posts : false
        };
        
        var last_modified_timestamp_q = "";
    }
    
    update_instance_info();
    
    if (navigator.onLine) {
        ajax_post("instance_info.php", "client_unyohub_version=" + UNYOHUB_VERSION + last_modified_timestamp_q, function (response, last_modified) {
            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                instance_info = JSON.parse(response);
                
                var last_modified_date = new Date(last_modified);
                instance_info["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                
                localStorage.setItem("unyohub_instance_info", JSON.stringify(instance_info));
                
                update_instance_info();
                
                if (last_modified_timestamp_q === null) {
                    funcs_load_promise.then(function () { show_welcome_message(); });
                }
            }
        });
    }
}());


var db_open_promise = new Promise(function (resolve, reject) {
    var open_request = indexedDB.open("unyohub_caches", UNYOHUB_INDEXEDDB_VERSION);
    
    open_request.onerror = function () {
        mes("IndexedDBの初期化に失敗したため、" + UNYOHUB_APP_NAME + "は正常に動作できません", true);
    };
    
    open_request.onupgradeneeded = function () {
        const DB_TABLES = {
            railroads : {
                keyPath : "railroad_id"
            },
            train_icons : {
                keyPath : "railroad_id"
            },
            formations : {
                keyPath : "railroad_id"
            },
            formation_overviews : {
                keyPath : "railroad_id"
            },
            diagram_revisions : {
                keyPath : "railroad_id"
            },
            diagrams : {
                keyPath : ["railroad_id", "diagram_revision"]
            },
            operations : {
                keyPath : ["railroad_id", "diagram_revision", "diagram_id"]
            },
            line_operations : {
                keyPath : ["railroad_id", "diagram_revision", "diagram_id"]
            },
            timetables : {
                keyPath : ["railroad_id", "diagram_revision", "timetable_id"]
            },
            operation_data : {
                keyPath : ["railroad_id", "operation_date"],
                indexes : {
                    idx_od1 : {
                        keyPath : "operation_date"
                    }
                }
            },
            announcements : {
                keyPath : "railroad_id"
            },
            user_data : {
                keyPath : "railroad_id"
            }
        };
        
        var db = open_request.result;
        
        var existing_tables = new Set(db.objectStoreNames);
        var required_tables = new Set(Object.keys(DB_TABLES));
        
        var tables_to_add = required_tables.difference(existing_tables);
        var tables_to_delete = existing_tables.difference(required_tables);
        
        for (var table_name of tables_to_add) {
            var obj_store = db.createObjectStore(table_name, {keyPath : DB_TABLES[table_name]["keyPath"]});
            
            if ("indexes" in DB_TABLES[table_name]) {
                for (var index_name of Object.keys(DB_TABLES[table_name]["indexes"])) {
                    obj_store.createIndex(index_name, DB_TABLES[table_name]["indexes"][index_name]["keyPath"]);
                }
            }
        }
        
        for (table_name of tables_to_delete) {
            db.deleteObjectStore(table_name);
        }
    };
    
    open_request.onsuccess = function () {
        var transaction = open_request.result.transaction("operation_data", "readwrite");
        open_request.result.close();
        
        var operation_data_store = transaction.objectStore("operation_data");
        var idx_od1 = operation_data_store.index("idx_od1");
        
        var cursor_request = idx_od1.openCursor(IDBKeyRange.upperBound(get_date_string(get_timestamp() - 14400 - 86400 * (config["operation_data_cache_period"])), true), "next");
        
        cursor_request.onsuccess = function () {
            var cursor = cursor_request.result;
            
            if (cursor !== null) {
                operation_data_store.delete([cursor.value["railroad_id"], cursor.value["operation_date"]]);
                cursor.continue();
            }
            
            resolve();
        };
    };
});


var railroad_info = null;
var train_icons = null;
var joined_railroad_train_icons = {};
var formations = null;
var joined_railroad_formations = {};
var formation_overviews = null;
var joined_railroad_formation_overviews = {};
var diagram_revisions = null;
var diagram_info = {};
var joined_railroad_diagram_info = {};


function idb_start_transaction (tables, writable, callback_func) {
    var open_request = indexedDB.open("unyohub_caches", UNYOHUB_INDEXEDDB_VERSION);
    
    open_request.onsuccess = function () {
        if (writable) {
            var transaction = open_request.result.transaction(tables, "readwrite");
        } else {
            var transaction = open_request.result.transaction(tables, "readonly");
        }
        
        open_request.result.close();
        
        callback_func(transaction);
    };
}


function rgb2hsl (color_hex) {
    var r = parseInt(color_hex.substring(1, 3), 16);
    var g = parseInt(color_hex.substring(3, 5), 16);
    var b = parseInt(color_hex.substring(5), 16);
    
    var rgb_max = Math.max(r, g, b);
    var rgb_min = Math.min(r, g, b);
    
    var h = 0;
    var s = 0;
    
    var l = Math.round((rgb_max + rgb_min) / 2);
    
    if (rgb_max !== rgb_min) {
        if (r === rgb_max) {
            h = Math.round((g - b) / (rgb_max - rgb_min) * 60);
        } else if (g === rgb_max) {
            h = Math.round((b - r) / (rgb_max - rgb_min) * 60 + 120);
        } else {
            h = Math.round((r - g) / (rgb_max - rgb_min) * 60 + 240);
        }
        
        if (h < 0) {
            h += 360;
        }
        
        if (l <= 127) {
            s = Math.round((rgb_max - rgb_min) / (rgb_max + rgb_min) * 255);
        } else {
            s = Math.round((rgb_max - rgb_min) / (510 - rgb_max - rgb_min) * 255);
        }
    }
    
    return [h, s, l];
}

function convert_color_dark_mode (color_hex) {
    var hsl = rgb2hsl(color_hex);
    
    return "hsl(" + hsl[0] + "deg " + Math.round(Math.min(hsl[1] * 0.75, 127) / 2.55) + "% " + Math.round(Math.min(Math.max(319 - hsl[2], 255), 95) / 2.55) + "%)";
}

function convert_font_color_dark_mode (color_hex) {
    var hsl = rgb2hsl(color_hex);
    
    return "hsl(" + hsl[0] + "deg " + Math.round(hsl[1] / 2.55) + "% " + Math.round(Math.min(Math.max(255 - hsl[2], 170), 255) / 2.55) + "%)";
}

function update_display_settings (redraw = false) {
    var body_elm = document.getElementsByTagName("body")[0];
    
    if (/(iPhone|iPad)/i.test(navigator.userAgent)) {
        body_elm.classList.add("ios");
    }
    
    if (config["dark_mode"]) {
        body_elm.classList.add("dark_mode");
    } else {
        body_elm.classList.remove("dark_mode");
    }
    
    if (config["enlarge_display_size"]) {
        body_elm.classList.add("enlarge");
    } else {
        body_elm.classList.remove("enlarge");
    }
    
    if (redraw) {
        if (railroad_info !== null) {
            update_formation_styles();
        }
        
        switch (mode_val) {
            case -1:
                get_railroad_list(function (railroads, loading_completed) {
                    update_railroad_list(railroads, document.getElementById("splash_screen_inner"), loading_completed);
                });
                break;
            
            case 0:
                position_change_lines(position_selected_line);
                break;
            
            case 1:
                update_selected_line(timetable_selected_line, false);
                if (timetable_selected_station !== null) {
                    timetable_select_station(timetable_selected_station);
                }
                break;
            
            case 2:
                operation_data_draw();
                break;
            
            case 3:
                if (selected_formation_name === null) {
                    draw_formation_table();
                }
                break;
            
            case 4:
                if (operation_table === null) {
                    operation_table_mode(null);
                } else {
                    operation_table_list_number();
                }
                break;
        }
    }
    
    if (document.getElementById("tips").classList.contains("tips_active")) {
        show_tips();
    }
}


var splash_screen_elm = document.getElementById("splash_screen");

update_display_settings();

if (location.pathname === "/") {
    var splash_screen_login_status_elm = document.getElementById("splash_screen_login_status");
}

splash_screen_elm.classList.remove("splash_screen_loading");


var header_elm = document.getElementsByTagName("header")[0];


var popup_background_elm = document.getElementById("popup_background");
var popup_history = [];
var square_popup_is_open = false;


var user_info = null;

var menu_admin_elm = document.getElementById("menu_admin");
var menu_logged_in_elm = document.getElementById("menu_logged_in");
var menu_not_logged_in_elm = document.getElementById("menu_not_logged_in");

function update_user_info (user_info_next = null) {
    user_info = user_info_next;
    
    menu_admin_elm.style.display = "none";
    
    if (user_info !== null) {
        menu_logged_in_elm.style.display = "block";
        menu_not_logged_in_elm.style.display = "none";
        
        var menu_user_name_elm = document.getElementById("menu_user_name");
        menu_user_name_elm.className = "";
        
        var user_name = user_info["user_name"] !== null ? user_info["user_name"] : "ハンドルネーム未設定";
        
        if (user_info["is_management_member"]) {
            menu_admin_elm.style.display = "block";
            var honorific = "(管)";
        } else {
            if (user_info["is_control_panel_user"]) {
                menu_admin_elm.style.display = "block";
            }
            
            var honorific = "さん";
            
            if (user_info["is_beginner"]) {
                menu_user_name_elm.className = "beginner";
            }
        }
        
        menu_user_name_elm.innerText = user_name + " " + honorific;
        
        if (location.pathname === "/") {
            splash_screen_login_status_elm.innerHTML = "<b>" + escape_html(user_name) + "</b> さん<button type='button' id='logout_button' onclick='user_logout();'>ログアウト</button><button type='button' id='user_info_button' onclick='window.open(\"/user/user_info.php\");'>利用者情報</button>";
        }
    } else {
        menu_logged_in_elm.style.display = "none";
        menu_not_logged_in_elm.style.display = "block";
        
        if (location.pathname === "/") {
            splash_screen_login_status_elm.innerHTML = "<b>ゲストモード</b>です<button type='button' id='login_button' onclick='show_login_form();'>ログイン</button><button type='button' id='sign_up_button' onclick='window.open(\"/user/sign_up.php\");'>新規登録</button>";
        }
    }
}

function check_logged_in () {
    ajax_post("check_logged_in.php", null, function (response) {
        if (response !== false) {
            if (response !== "NOT_LOGGED_IN") {
                update_user_info(JSON.parse(response));
            } else {
                update_user_info();
            }
        } else if (location.pathname === "/") {
            splash_screen_login_status_elm.innerText = "【!】ログイン状態の確認に失敗しました";
        }
    });
}


var railroads = null;

var icon_area_elm = null;
var icon_area_scroll_amount = null;

function get_railroad_list (callback_func) {
    if (railroads !== null) {
        callback_func(railroads, true);
        
        return;
    }
    
    var cache_json = localStorage.getItem("unyohub_railroads_caches");
    
    if (cache_json !== null) {
        railroads = JSON.parse(cache_json);
    } else {
        railroads = {
            railroads : {},
            categories : [],
            last_modified_timestamp : 0
        };
    }
    
    if (navigator.onLine) {
        if (railroads["categories"].length >= 1) {
            callback_func(railroads, false);
        }
        
        ajax_post("railroads.php", "last_modified_timestamp=" + railroads["last_modified_timestamp"], function (response, last_modified) {
            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                railroads = JSON.parse(response);
                
                var last_modified_date = new Date(last_modified);
                railroads["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                
                localStorage.setItem("unyohub_railroads_caches", JSON.stringify(railroads));
            }
            
            callback_func(railroads, true);
        }, 10);
    } else {
        callback_func(railroads, true);
    }
}

var railroad_list_area;
var railroad_list_active_index;

function update_railroad_list (railroads, area_elm = null, loading_completed = true) {
    if (area_elm !== null) {
        railroad_list_area = area_elm;
    } else {
        area_elm = railroad_list_area;
    }
    
    var favorite_category_style = " style='color: #" + (!config["dark_mode"] ? "333333" : "999999") + ";'";
    var favorite_subcategory_style = " style='color: #808080;'";
    
    if (config["show_favorite_railroads"] || config["show_favorite_stations"]) {
        var categories_html = "<li class='category_index' onclick='scroll_to_category(0);'" + favorite_category_style + "><b>お気に入り</b></li>";
        var icons_html = "<h3 class='icon_heading'" + favorite_category_style + "><b>お気に入り</b></h3>";
        var heading_cnt = 1;
        
        if (config["show_favorite_railroads"]) {
            if (config["show_favorite_stations"]) {
                icons_html += "<h4" + favorite_subcategory_style + "><span>お気に入り路線系統</span></h4>";
            }
            
            var buf = "";
            for (var railroad_id of config["favorite_railroads"]) {
                if (!(railroad_id in railroads["railroads"])) {
                    continue;
                }
                
                buf += "<a href='/railroad_" + railroad_id + "/' onclick='event.preventDefault(); select_railroad(\"" + railroad_id + "\");' oncontextmenu='event.preventDefault(); railroad_icon_context_menu(\"" + railroad_id + "\");' ontouchstart='railroad_icon_touch_start(event);' ontouchmove='railroad_icon_touch_move(event);' ontouchend='railroad_icon_touch_end(\"" + railroad_id + "\");'><img src='" + railroads["railroads"][railroad_id]["railroad_icon"] + "' alt='' style='background-color: " + railroads["railroads"][railroad_id]["main_color"] + ";'>" + escape_html(railroads["railroads"][railroad_id]["railroad_name"]) + "</a>";
            }
            
            if (buf.length >= 1) {
                icons_html += buf;
            } else {
                icons_html += "<div class='informational_text'>アイコンを長押し/右クリックすると路線系統をお気に入りに追加できます</div>";
            }
        }
        
        if (config["show_favorite_stations"]) {
            if (config["show_favorite_railroads"]) {
                icons_html += "<h4" + favorite_subcategory_style + "><span>お気に入り駅</span></h4>";
            }
            
            var buf = "";
            for (var station_data of config["favorite_stations"]) {
                if (!(station_data["railroad_id"] in railroads["railroads"])) {
                    continue;
                }
                
                buf += "<button type='button' class='railroad_link' onclick='select_railroad(\"" + station_data["railroad_id"] + "\", \"timetable_mode\", \"" + station_data["line_id"] + "\", \"" + station_data["station_name"] + "\");' oncontextmenu='event.preventDefault(); remove_favorite_station(\"" + station_data["railroad_id"] + "\", \"" + station_data["line_id"] + "\", \"" + station_data["station_name"] + "\", true);'><img src='" + railroads["railroads"][station_data["railroad_id"]]["railroad_icon"] + "' alt='' style='background-color: " + railroads["railroads"][station_data["railroad_id"]]["main_color"] + ";'>" + escape_html(station_data["station_name"]) + "</button>";
            }
            
            if (buf.length >= 1) {
                icons_html += buf;
            } else {
                icons_html += "<div class='informational_text'>各駅の時刻表からその駅をお気に入りに追加できます</div>";
            }
        }
    } else {
        var categories_html = "";
        var icons_html = "";
        var heading_cnt = 0;
    }
    
    for (var category of railroads["categories"]) {
        var category_html = " style='color: " + (config["dark_mode"] ? convert_color_dark_mode(category["category_color"]) : category["category_color"]) + ";'><b>" + escape_html(category["category_name"]) + "</b></";
        categories_html += "<li class='category_index' onclick='scroll_to_category(" + heading_cnt + ");'" + category_html + "li>";
        icons_html += "<h3 class='icon_heading'" + category_html + "h3>";
        
        var category_index = heading_cnt;
        heading_cnt++;
        
        if ("subcategories" in category) {
            for (var subcategory of category["subcategories"]) {
                var subcategory_html = " style='color: " + (config["dark_mode"] ? convert_color_dark_mode(subcategory["subcategory_color"]) : subcategory["subcategory_color"]) + ";'><span>" + escape_html(subcategory["subcategory_name"]) + "</span></";
                categories_html += "<li class='subcategory_index category_items_" + category_index + "' onclick='scroll_to_category(" + heading_cnt + ");'" + subcategory_html + "li>";
                icons_html += "<h4 class='icon_heading'" + subcategory_html + "h4>";
                
                heading_cnt++;
                
                for (var railroad_id of subcategory["railroads"]) {
                    icons_html += "<a href='/railroad_" + railroad_id + "/' onclick='event.preventDefault(); select_railroad(\"" + railroad_id + "\");' oncontextmenu='event.preventDefault(); railroad_icon_context_menu(\"" + railroad_id + "\");' ontouchstart='railroad_icon_touch_start(event);' ontouchmove='railroad_icon_touch_move(event);' ontouchend='railroad_icon_touch_end(\"" + railroad_id + "\");'><img src='" + railroads["railroads"][railroad_id]["railroad_icon"] + "' alt='' style='background-color: " + railroads["railroads"][railroad_id]["main_color"] + ";'>" + escape_html(railroads["railroads"][railroad_id]["railroad_name"]) + "</a>";
                }
            }
        } else if ("railroads" in category) {
            for (var railroad_id of category["railroads"]) {
                icons_html += "<a href='/railroad_" + railroad_id + "/' onclick='event.preventDefault(); select_railroad(\"" + railroad_id + "\");' oncontextmenu='event.preventDefault(); railroad_icon_context_menu(\"" + railroad_id + "\");' ontouchstart='railroad_icon_touch_start(event);' ontouchmove='railroad_icon_touch_move(event);' ontouchend='railroad_icon_touch_end(\"" + railroad_id + "\");'><img src='" + railroads["railroads"][railroad_id]["railroad_icon"] + "' alt='' style='background-color: " + railroads["railroads"][railroad_id]["main_color"] + ";'>" + escape_html(railroads["railroads"][railroad_id]["railroad_name"]) + "</a>";
            }
        }
    }
    
    if (!loading_completed) {
        categories_html += "<div class='loading_icon'></div>";
    } else if (railroads["categories"].length === 0) {
        icons_html = "<div class='no_data'>利用可能なデータがありません</div>";
    }
    
    area_elm.innerHTML = "<ul id='category_area'>" + categories_html + "</ul><div id='icon_area'>" + icons_html + "</div>";
    
    splash_screen_elm.className = "splash_screen_loaded";
    
    icon_area_elm = document.getElementById("icon_area");
    icon_area_elm.addEventListener("scroll", icon_area_onscroll, { passive : true });
    
    railroad_list_active_index = null;
    
    if (icon_area_scroll_amount !== null) {
        icon_area_elm.scrollTop = icon_area_scroll_amount;
    }
    icon_area_onscroll();
}

function scroll_to_category (index_val) {
    icon_area_elm.scrollTop += document.getElementsByClassName("icon_heading")[index_val].getBoundingClientRect().top - icon_area_elm.getBoundingClientRect().top - 5;
}

function icon_area_onscroll () {
    var heading_elms = document.getElementsByClassName("icon_heading");
    var index_elms = document.getElementById("category_area").getElementsByTagName("li");
    
    var icon_area_top = icon_area_elm.getBoundingClientRect().top;
    
    for (var cnt = 0; cnt < heading_elms.length; cnt++) {
        if (heading_elms[cnt].getBoundingClientRect().top > icon_area_top) {
            break;
        }
    }
    
    if (cnt >= heading_elms.length) {
        cnt = -1;
    }
    
    if (cnt === railroad_list_active_index) {
        return;
    }
    
    if (cnt === -1 || index_elms[cnt].classList.contains("category_index")) {
        var category_id = "category_items_" + cnt;
    } else {
        for (var class_name of index_elms[cnt].className.split(" ")) {
            if (class_name.startsWith("category_items_")) {
                var category_id = class_name;
                break;
            }
        }
    }
    
    railroad_list_active_index = cnt;
    
    for (cnt = 0; cnt < heading_elms.length; cnt++) {
        if (cnt === railroad_list_active_index) {
            index_elms[cnt].classList.add("active_index");
        } else {
            index_elms[cnt].classList.remove("active_index");
        }
        
        if (index_elms[cnt].classList.contains("subcategory_index")) {
            if (index_elms[cnt].classList.contains(category_id)) {
                index_elms[cnt].classList.add("active_category_item");
            } else {
                index_elms[cnt].classList.remove("active_category_item");
            }
        }
    }
    
    setTimeout(function () {
        icon_area_scroll_amount = icon_area_elm.scrollTop;
    }, 500);
}

var railroad_icon_touch_start_time = null;
var railroad_icon_touch_start_y = 0;

function railroad_icon_touch_start (event) {
    railroad_icon_touch_start_time = Date.now();
    railroad_icon_touch_start_y = event.touches[0].screenY;
}

function railroad_icon_touch_move (event) {
    if (Math.abs(railroad_icon_touch_start_y - event.touches[0].screenY) > 10) {
        railroad_icon_touch_start_time = null;
    }
}

function railroad_icon_touch_end (railroad_id) {
    if (railroad_icon_touch_start_time !== null && Date.now() - railroad_icon_touch_start_time > 1000) {
        railroad_icon_context_menu(railroad_id);
    } else {
        railroad_icon_touch_start_time = null;
    }
}


var menu_off_line_elm = document.getElementById("menu_off_line");

window.ononline = function () {
    setTimeout(function () {
        if (navigator.onLine) {
            menu_off_line_elm.style.display = "none";
            
            check_logged_in();
        }
    }, 2000);
}

function on_off_line () {
    setTimeout(function () {
        if (!navigator.onLine) {
            menu_off_line_elm.style.display = "block";
            
            menu_admin_elm.style.display = "none";
            menu_logged_in_elm.style.display = "none";
            menu_not_logged_in_elm.style.display = "none";
            
            if (location.pathname === "/") {
                splash_screen_login_status_elm.innerHTML = "<b class='off_line_message' onclick='show_off_line_message();'>オフラインモード</b>";
            }
        }
    }, 2000);
}

window.onoffline = on_off_line;


window.onload = function () {
    db_open_promise.then(function () {
        if (location.pathname.startsWith("/railroad_")) {
            var path_info = location.pathname.split("/");
            
            if (path_info.length >= 3 && path_info[2].length >= 1) {
                if (path_info.length >= 4 && path_info[3].length >= 1) {
                    var mode_option_1 = decodeURIComponent(path_info[3]);
                    
                    if (path_info.length >= 5 && path_info[4].length >= 1) {
                        var mode_option_2 = decodeURIComponent(path_info[4]);
                    } else {
                        var mode_option_2 = null;
                    }
                } else {
                    var mode_option_1 = null;
                    var mode_option_2 = null;
                }
                
                if (path_info[2] === "operation_data") {
                    var url_params = new URLSearchParams(window.location.search);
                    
                    if (url_params.has("date")) {
                        mode_option_1 = url_params.get("date");
                    }
                }
                
                select_railroad(path_info[1].substring(9), path_info[2] + "_mode", mode_option_1, mode_option_2);
            } else {
                select_railroad(path_info[1].substring(9));
            }
            
            funcs_load_promise.then(function () {
                check_announcements();
            });
        } else {
            get_railroad_list(function (railroads, loading_completed) {
                update_railroad_list(railroads, document.getElementById("splash_screen_inner"), loading_completed);
            });
            
            funcs_load_promise.then(function () {
                check_announcements(true);
            });
        }
        
        if (navigator.onLine) {
            check_logged_in();
        } else {
            on_off_line();
        }
    });
};


function update_railroad_info (data) {
    railroad_info = data
    
    var railroad_name_splitted = escape_html(railroad_info["railroad_name"]).split(" ");
    railroad_name_splitted[0] += "<small>";
    
    document.getElementById("railroad_name").innerHTML = railroad_name_splitted.join(" ") + "</small>";
    
    var main_color_hsl = rgb2hsl(railroad_info["main_color"]);
    document.getElementById("railroad_icon").style.backgroundImage = "url(" + railroad_info["railroad_icon"] + "), linear-gradient(to right, " + railroad_info["main_color"] + ", hsl(" + main_color_hsl[0] + "deg " + Math.round(main_color_hsl[1] / 2.55) + "% " + Math.round(Math.min(main_color_hsl[2] * 1.2, 255) / 2.55) + "%))";
    
    railroad_info["deadhead_train_number_regexp"] = new RegExp(railroad_info["deadhead_train_number"]);
    
    for (var cnt = 0; cnt < railroad_info["train_color_rules"].length; cnt++) {
        railroad_info["train_color_rules"][cnt]["regexp"] = new RegExp(railroad_info["train_color_rules"][cnt]["pattern"]);
    }
    
    header_elm.className = "railroad_select_mode";
}


var series_icon_ids = {};
var joined_railroad_series_icon_ids = {};
var formation_styles_available = false;

function update_formation_styles (railroad_id = null) {
    if (railroad_id === null) {
        var series_data = formations["series"];
        var series_names = formations["series_names"];
        if ("prefixes" in formations) {
            var prefix_data = formations["prefixes"];
            var prefix_order = formations["prefix_order"];
        } else {
            var prefix_data = {};
            var prefix_order = [];
        }
    } else {
        var series_data = joined_railroad_formations[railroad_id]["series"];
        var series_names = joined_railroad_formations[railroad_id]["series_names"];
        if ("prefixes" in joined_railroad_formations[railroad_id]) {
            var prefix_data = joined_railroad_formations[railroad_id]["prefixes"];
            var prefix_order = joined_railroad_formations[railroad_id]["prefix_order"];
        } else {
            var prefix_data = {};
            var prefix_order = [];
        }
    }
    
    var icon_ids_data = {};
    
    for (var series_name of series_names) {
        if ("unregistered" in series_data[series_name] && series_data[series_name]["unregistered"]) {
            continue;
        }
        
        icon_ids_data[series_name] = series_data[series_name]["icon_id"];
        
        if ("subseries_names" in series_data[series_name]) {
            for (var subseries_name of series_data[series_name]["subseries_names"]) {
                if (!("unregistered" in series_data[series_name]["subseries"][subseries_name] && series_data[series_name]["subseries"][subseries_name]["unregistered"])) {
                    icon_ids_data[series_name + subseries_name] = series_data[series_name]["subseries"][subseries_name]["icon_id"];
                }
            }
        }
    }
    
    for (var prefix of prefix_order) {
        icon_ids_data[prefix] = prefix_data[prefix]["icon_id"];
    }
    
    if (railroad_id !== null) {
        joined_railroad_series_icon_ids[railroad_id] = icon_ids_data;
        
        return;
    }
    
    series_icon_ids = icon_ids_data;
    
    var formation_css = document.getElementById("formation_styles").sheet;
    for (var cnt = formation_css.cssRules.length - 1; cnt >= 0; cnt--) {
        formation_css.deleteRule(cnt);
    }
    
    formation_styles_available = false;
    
    if ("body_colorings" in formations) {
        try {
            var coloring_ids = Object.keys(formations["body_colorings"]);
            
            for (cnt = 0; cnt < coloring_ids.length; cnt++) {
                var base_color = formations["body_colorings"][coloring_ids[cnt]]["base_color"];
                
                var css_code = ".car_coloring_" + coloring_ids[cnt] + " { background-color: " + base_color + "; color: " + formations["body_colorings"][coloring_ids[cnt]]["font_color"] + "; text-shadow: -1.4px -1.4px " + base_color + ", -0.5px -1.4px " + base_color + ", 0.5px -1.4px " + base_color + ", 1.4px -1.4px " + base_color + ", -1.4px -0.5px " + base_color + ", 1.4px -0.5px " + base_color + ", -1.4px 0.5px " + base_color + ", 1.4px 0.5px " + base_color + ", -1.4px 1.4px " + base_color + ", -0.5px 1.4px " + base_color + ", 0.5px 1.4px " + base_color + ", 1.4px 1.4px " + base_color + ";";
                
                if ("stripes" in formations["body_colorings"][coloring_ids[cnt]]) {
                    var gradient_code = "";
                    for (var stripe_data of formations["body_colorings"][coloring_ids[cnt]]["stripes"]) {
                        if (!config["force_arrange_west_side_car_on_left"] || !("forward_direction_is_east" in railroad_info) || !railroad_info["forward_direction_is_east"] || !("verticalize" in stripe_data) || !stripe_data["verticalize"]) {
                            var stripe_start = stripe_data["start"];
                            var stripe_end = stripe_data["end"];
                        } else {
                            var stripe_start = 100 - stripe_data["end"];
                            var stripe_end = 100 - stripe_data["start"];
                        }
                        
                        gradient_code += (gradient_code.length >= 1 ? "," : "") + " linear-gradient(" + ("verticalize" in stripe_data && stripe_data["verticalize"] ? "to right, " : "to bottom, ") + "transparent 0% " + stripe_start + "%, " + stripe_data["color"] + " " + stripe_start + "% " + stripe_end + "%, transparent " + stripe_end + "% 100%)";
                    }
                    
                    css_code += " background-image:" + gradient_code + ";";
                }
                
                css_code += "}";
                
                formation_css.insertRule(css_code, cnt);
                
                if ("wheel_color" in formations["body_colorings"][coloring_ids[cnt]]) {
                    formation_css.insertRule(".car_coloring_" + coloring_ids[cnt] + " :before, .car_coloring_" + coloring_ids[cnt] + " :after { background-color: " + formations["body_colorings"][coloring_ids[cnt]]["wheel_color"] + "; }");
                }
                
                if ("driving_wheel_color" in formations["body_colorings"][coloring_ids[cnt]]) {
                    formation_css.insertRule(".car_coloring_" + coloring_ids[cnt] + " :is(.car_M span, .formation_table .car_M1 span:first-of-type, .reversed_formation_table .car_M2 span:first-of-type, .formation_table .car_M2 span:last-of-type, .reversed_formation_table .car_M1 span:last-of-type, .formation_table .car_MO1 span:first-of-type, .reversed_formation_table .car_OM2 span:first-of-type, .formation_table .car_MO2 span:last-of-type, .reversed_formation_table .car_OM1 span:last-of-type):before, .car_coloring_" + coloring_ids[cnt] + " :is(.car_M span, .formation_table .car_M1 span:first-of-type, .reversed_formation_table .car_M2 span:first-of-type, .formation_table .car_M2 span:last-of-type, .reversed_formation_table .car_M1 span:last-of-type, .formation_table .car_OM1 span:first-of-type, .reversed_formation_table .car_MO2 span:first-of-type, .formation_table .car_OM2 span:last-of-type, .reversed_formation_table .car_MO1 span:last-of-type):after { background-color: " + formations["body_colorings"][coloring_ids[cnt]]["driving_wheel_color"] + " !important; }");
                }
            }
            
            formation_styles_available = true;
        } catch (err) {
            mes("編成表の車体塗装情報が破損しています", true);
        }
    }
}


var use_group_divisions_on_operation_data;
var railroad_rules_last_read;

function set_railroad_user_data (user_data) {
    if (user_data !== null) {
        position_selected_line = config["retain_position_mode_last_seen_line"] && (user_data["position_selected_line"] in railroad_info["lines"]) ? user_data["position_selected_line"] : railroad_info["lines_order"][0];
        position_scroll_amount = config["retain_position_mode_last_seen_line"] ? user_data["position_scroll_amount"] : 0;
        use_group_divisions_on_operation_data = "use_group_divisions_on_operation_data" in user_data ? user_data["use_group_divisions_on_operation_data"] : true;//2027-04末まで暫定
        railroad_rules_last_read = "rules_last_read" in user_data ? user_data["rules_last_read"] : null;//2027-04末まで暫定
    } else {
        position_selected_line = railroad_info["lines_order"][0];
        position_scroll_amount = 0;
        use_group_divisions_on_operation_data = true;
        railroad_rules_last_read = null;
    }
}


function load_railroad_data (railroad_id, is_main_railroad, resolve_func_1, resolve_func_2, reject_func) {
    var joined_railroads = [];
    var added_railroads = [];
    
    var promise_list_1 = [];
    var promise_list_2 = [];
    
    if (is_main_railroad) {
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                idb_start_transaction("railroads", false, function (transaction) {
                    var railroads_store = transaction.objectStore("railroads");
                    var get_request = railroads_store.get(railroad_id);
                    
                    get_request.onsuccess = function (evt) {
                        if (evt.target.result !== undefined) {
                            var railroad_info_data = evt.target.result;
                            
                            update_railroad_info(railroad_info_data);
                            
                            joined_railroads = "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : [];
                            
                            var last_modified_timestamp = railroad_info_data["last_modified_timestamp"];
                            
                            resolve_1();
                        } else {
                            var last_modified_timestamp = 0;
                            reject_1();
                        }
                        
                        if (navigator.onLine) {
                            ajax_post("railroad_info.php", "railroad_id=" + escape_form_data(railroad_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                                if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                    var railroad_info_data = JSON.parse(response);
                                    
                                    railroad_info_data["railroad_id"] = railroad_id;
                                    
                                    var last_modified_date = new Date(last_modified);
                                    railroad_info_data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                    
                                    update_railroad_info(railroad_info_data);
                                    
                                    idb_start_transaction("railroads", true, function (transaction) {
                                        var railroads_store = transaction.objectStore("railroads");
                                        railroads_store.put(railroad_info_data);
                                    });
                                    
                                    added_railroads = [...new Set("joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : []).difference(new Set(joined_railroads))];
                                    
                                    resolve_2(true);
                                } else {
                                    if (last_modified_timestamp > 0) {
                                        resolve_2(false);
                                    } else {
                                        reject_2(null);
                                    }
                                }
                            });
                        } else {
                            if (last_modified_timestamp > 0) {
                                resolve_2(false);
                            } else {
                                reject_2(null);
                            }
                        }
                    };
                });
            }));
        }));
    }
    
    promise_list_1.push(new Promise(function (resolve_1, reject_1) {
        promise_list_2.push(new Promise(function (resolve_2, reject_2) {
            idb_start_transaction("train_icons", false, function (transaction) {
                var icons_store = transaction.objectStore("train_icons");
                var get_request = icons_store.get(railroad_id);
                
                get_request.onsuccess = function (evt) {
                    if (evt.target.result !== undefined) {
                        var train_icons_data = evt.target.result;
                        last_modified_timestamp = train_icons_data["last_modified_timestamp"];
                        
                        if (is_main_railroad) {
                            train_icons = train_icons_data;
                        } else {
                            joined_railroad_train_icons[railroad_id] = train_icons_data;
                        }
                        
                        resolve_1();
                    } else {
                        if (is_main_railroad) {
                            train_icons = {railroad_id : null};
                        }
                        var last_modified_timestamp = 0;
                        
                        reject_1();
                    }
                    
                    if (navigator.onLine) {
                        ajax_post("train_icons.php", "railroad_id=" + escape_form_data(railroad_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                var train_icons_data = {icons : JSON.parse(response)};
                                
                                train_icons_data["railroad_id"] = railroad_id;
                                
                                var last_modified_date = new Date(last_modified);
                                train_icons_data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                
                                idb_start_transaction("train_icons", true, function (transaction) {
                                    var icons_store = transaction.objectStore("train_icons");
                                    icons_store.put(train_icons_data);
                                });
                                
                                if (is_main_railroad) {
                                    train_icons = train_icons_data;
                                } else {
                                    joined_railroad_train_icons[railroad_id] = train_icons_data;
                                }
                                
                                resolve_2(true);
                            } else {
                                if (last_modified_timestamp > 0) {
                                    resolve_2(false);
                                } else {
                                    reject_2(null);
                                }
                            }
                        });
                    } else {
                        if (last_modified_timestamp > 0) {
                            resolve_2(false);
                        } else {
                            reject_2(null);
                        }
                    }
                };
            });
        }));
    }));
    
    promise_list_1.push(new Promise(function (resolve_1, reject_1) {
        promise_list_2.push(new Promise(function (resolve_2, reject_2) {
            idb_start_transaction("formations", false, function (transaction) {
                var formations_store = transaction.objectStore("formations");
                var get_request = formations_store.get(railroad_id);
                
                get_request.onsuccess = function (evt) {
                    if (evt.target.result !== undefined) {
                        var formations_data = evt.target.result;
                        var last_modified_timestamp = formations_data["last_modified_timestamp"];
                        
                        if (is_main_railroad) {
                            formations = formations_data;
                            
                            update_formation_styles();
                        } else {
                            joined_railroad_formations[railroad_id] = formations_data;
                            
                            update_formation_styles(railroad_id);
                        }
                        
                        resolve_1();
                    } else {
                        var last_modified_timestamp = 0;
                        
                        reject_1();
                    }
                    
                    if (navigator.onLine) {
                        ajax_post("formations.php", "railroad_id=" + escape_form_data(railroad_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                var formations_data = JSON.parse(response);
                                
                                formations_data["railroad_id"] = railroad_id;
                                
                                var last_modified_date = new Date(last_modified);
                                formations_data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                
                                idb_start_transaction("formations", true, function (transaction) {
                                    var formations_store = transaction.objectStore("formations");
                                    formations_store.put(formations_data);
                                });
                                
                                if (is_main_railroad) {
                                    formations = formations_data;
                                } else {
                                    joined_railroad_formations[railroad_id] = formations_data;
                                    
                                    update_formation_styles(railroad_id);
                                }
                                
                                resolve_2(true);
                            } else {
                                if (last_modified_timestamp > 0) {
                                    resolve_2(false);
                                } else {
                                    reject_2(null);
                                }
                            }
                        });
                    } else {
                        if (last_modified_timestamp > 0) {
                            resolve_2(false);
                        } else {
                            reject_2(null);
                        }
                    }
                };
            });
        }));
    }));
    
    promise_list_1.push(new Promise(function (resolve_1, reject_1) {
        promise_list_2.push(new Promise(function (resolve_2, reject_2) {
            idb_start_transaction("formation_overviews", false, function (transaction) {
                var formation_overviews_store = transaction.objectStore("formation_overviews");
                var get_request = formation_overviews_store.get(railroad_id);
                
                get_request.onsuccess = function (evt) {
                    if (evt.target.result !== undefined) {
                        var formation_overviews_data = evt.target.result;
                        var last_modified_timestamp = formation_overviews_data["last_modified_timestamp"];
                        
                        if (is_main_railroad) {
                            formation_overviews = formation_overviews_data;
                        } else {
                            joined_railroad_formation_overviews[railroad_id] = formation_overviews_data;
                        }
                        
                        resolve_1();
                    } else {
                        var last_modified_timestamp = 0;
                        
                        reject_1();
                    }
                    
                    if (navigator.onLine) {
                        ajax_post("formation_overviews.php", "railroad_id=" + escape_form_data(railroad_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                var formation_overviews_data = {formations : JSON.parse(response)};
                                
                                formation_overviews_data["railroad_id"] = railroad_id;
                                
                                var last_modified_date = new Date(last_modified);
                                formation_overviews_data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                
                                idb_start_transaction("formation_overviews", true, function (transaction) {
                                    var formation_overviews_store = transaction.objectStore("formation_overviews");
                                    formation_overviews_store.put(formation_overviews_data);
                                });
                                
                                if (is_main_railroad) {
                                    formation_overviews = formation_overviews_data;
                                } else {
                                    joined_railroad_formation_overviews[railroad_id] = formation_overviews_data;
                                }
                                
                                resolve_2(true);
                            } else {
                                if (last_modified_timestamp > 0) {
                                    resolve_2(false);
                                } else {
                                    reject_2(null);
                                }
                            }
                        });
                    } else {
                        if (last_modified_timestamp > 0) {
                            resolve_2(false);
                        } else {
                            reject_2(null);
                        }
                    }
                };
            });
        }));
    }));
    
    if (is_main_railroad) {
        var user_data = null;
        
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                var tmp_diagram_revision = null;
                
                idb_start_transaction("diagram_revisions", false, function (transaction) {
                    var diagram_revisions_store = transaction.objectStore("diagram_revisions");
                    var get_request = diagram_revisions_store.get(railroad_id);
                    
                    get_request.onsuccess = function (evt) {
                        if (evt.target.result !== undefined) {
                            diagram_revisions = evt.target.result;
                            var last_modified_timestamp = diagram_revisions["last_modified_timestamp"];
                            
                            resolve_1();
                            tmp_diagram_revision = get_diagram_revision();
                        } else {
                            var last_modified_timestamp = 0;
                            
                            reject_1();
                        }
                        
                        if (navigator.onLine) {
                            ajax_post("diagram_revisions.php", "railroad_id=" + escape_form_data(railroad_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                                if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                    diagram_revisions = {diagram_revisions : JSON.parse(response)};
                                    
                                    diagram_revisions["railroad_id"] = railroad_id;
                                    
                                    var last_modified_date = new Date(last_modified);
                                    diagram_revisions["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                    
                                    idb_start_transaction("diagram_revisions", true, function (transaction) {
                                        var diagram_revisions_store = transaction.objectStore("diagram_revisions");
                                        diagram_revisions_store.put(diagram_revisions);
                                    });
                                    
                                    resolve_2(true);
                                } else {
                                    if (tmp_diagram_revision !== null) {
                                        resolve_2(false);
                                    } else {
                                        reject_2(null);
                                    }
                                }
                            });
                        } else {
                            if (tmp_diagram_revision !== null) {
                                resolve_2(false);
                            } else {
                                reject_2(null);
                            }
                        }
                    };
                });
            }));
        }));
        
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            idb_start_transaction("user_data", false, function (transaction) {
                var user_data_store = transaction.objectStore("user_data");
                var get_request = user_data_store.get(railroad_id);
                
                get_request.onsuccess = function (evt) {
                    if (evt.target.result !== undefined) {
                        user_data = evt.target.result;
                    } else {
                        user_data = null;
                    }
                    
                    resolve_1();
                }
            });
        }));
        
        if (!location.pathname.startsWith("/railroad_" + railroad_id + "/")) {
            document.getElementById("tab_position_mode").setAttribute("href", "/railroad_" + railroad_id + "/");
            document.getElementById("tab_timetable_mode").setAttribute("href", "/railroad_" + railroad_id + "/timetable/");
            document.getElementById("tab_operation_data_mode").setAttribute("href", "/railroad_" + railroad_id + "/operation_data/");
            document.getElementById("tab_formations_mode").setAttribute("href", "/railroad_" + railroad_id + "/formations/");
            document.getElementById("tab_operation_table_mode").setAttribute("href", "/railroad_" + railroad_id + "/operation_table/");
        }
        
        update_railroad_announcement(railroad_id, true);
    }
    
    Promise.all(promise_list_1).then(function () {
        if (is_main_railroad) {
            update_formation_styles();
            set_railroad_user_data(user_data);
        }
        
        if (joined_railroads.length >= 1) {
            var joined_railroads_promise_list = [];
            
            for (let joined_railroad_id of joined_railroads) {
                joined_railroads_promise_list.push(new Promise(function (resolve, reject) {
                    load_railroad_data(joined_railroad_id, false, resolve, resolve, reject);
                }));
            }
            
            Promise.all(joined_railroads_promise_list).then(function () {
                resolve_func_1();
            }, function () {
                reject_func();
            });
        } else {
            resolve_func_1();
        }
    }, function () {});
    Promise.allSettled(promise_list_1).then(function () {
        Promise.all(promise_list_2).then(function (update_exists_list) {
            if (update_exists_list.includes(true)) {
                if (is_main_railroad) {
                    update_formation_styles();
                    set_railroad_user_data(user_data);
                }
                
                if (added_railroads.length >= 1) {
                    var joined_railroads_promise_list = [];
                    
                    for (let joined_railroad_id of added_railroads) {
                        joined_railroads_promise_list.push(new Promise(function (resolve, reject) {
                            load_railroad_data(joined_railroad_id, false, resolve, resolve, reject);
                        }));
                    }
                    
                    Promise.all(joined_railroads_promise_list).then(function () {
                        resolve_func_2();
                    }, function () {
                        reject_func();
                    });
                } else {
                    resolve_func_2();
                }
            }
        }, function () {
            reject_func();
        });
    });
}

function select_mode (mode_name, mode_option_1 = null, mode_option_2 = null, mode_option_3 = null, mode_option_4 = null) {
    switch (mode_name) {
        case "position_mode":
            position_mode(mode_option_1, mode_option_3 === null ? "__today__" : mode_option_3, mode_option_2, mode_option_4);
            break;
        
        case "timetable_mode":
            timetable_mode(true, false);
            
            if (mode_option_2 !== null) {
                show_station_timetable(mode_option_1, mode_option_2, mode_option_3);
            } else {
                timetable_change_lines(mode_option_1, true);
            }
            
            break;
        
        case "operation_data_mode":
            operation_data_mode(mode_option_1);
            break;
        
        case "formations_mode":
            formations_mode(mode_option_1);
            break;
        
        case "operation_table_mode":
            operation_table_mode(mode_option_1, mode_option_2, mode_option_3);
            break;
    }
}

var blank_article_elm = document.getElementById("blank_article");

function select_railroad (railroad_id, mode_name = "position_mode", mode_option_1 = null, mode_option_2 = null, mode_option_3 = null, mode_option_4 = null) {
    splash_screen_elm.style.display = "none";
    if (popup_history.length >= 1) {
        popup_close();
    }
    
    if (railroad_info !== null && railroad_id !== railroad_info["railroad_id"]) {
        save_railroad_user_data(railroad_info["railroad_id"]);
    }
    
    change_mode(-1);
    
    header_elm.className = "";
    
    joined_railroad_train_icons = {};
    joined_railroad_formations = {};
    joined_railroad_formation_overviews = {};
    joined_railroad_series_icon_ids = {};
    
    diagram_info = {};
    joined_railroad_diagram_info = {};
    timetable_selected_line = null;
    
    load_railroad_data(railroad_id, true, function () {
        select_mode(mode_name, mode_option_1, mode_option_2, mode_option_3, mode_option_4);
    }, function () {
        select_mode(mode_name, mode_option_1, mode_option_2, mode_option_3, mode_option_4);
    }, function () {
        mes("選択された路線系統はデータが利用できません", true);
        
        funcs_load_promise.then(function () {
            show_railroad_list();
            blank_article_elm.innerHTML = "<div class='no_data'><a href='javascript:void(0);' onclick='show_railroad_list();'>路線系統を選択</a>してください</div>";
        });
    });
}


function get_holiday_list (year) {
    var holiday_list = ["01-01", "02-11", "02-23", "04-29", "05-03", "05-04", "05-05", "08-11", "11-03", "11-23"];
    var happy_monday_list = [["01", 2], ["07", 3], ["09", 3], ["10", 2]];
    
    holiday_list.push("03-" + (Math.floor(20.8431 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4)));
    var shubun = Math.floor(23.2488 + 0.242194 * (year - 1980)) - Math.floor((year - 1980) / 4);
    holiday_list.push("09-" + shubun);
    
    for (var happy_monday of happy_monday_list) {
        var dt = new Date(String(year) + "-" + happy_monday[0] + "-01 12:00:00");
        
        var day_number = dt.getDay();
        if (day_number <= 1) {
            day_number += 7;
        }
        holiday_list.push(happy_monday[0] + "-" + ("0" + ((2 - day_number) + (7 * happy_monday[1]))).slice(-2));
    }
    
    for (var holiday of holiday_list) {
        var dt = new Date(String(year) + "-" + holiday + " 12:00:00");
        
        if (dt.getDay() === 0) {
            var furikae_cnt = 0;
            do {
                furikae_cnt++;
                var furikae_date = holiday.substring(0, 2) + "-" + ("0" + (Number(holiday.substring(3)) + furikae_cnt)).slice(-2);
            } while (holiday_list.includes(furikae_date));
            
            holiday_list.push(furikae_date);
        }
    }
    
    if (holiday_list.includes("09-" + (shubun - 2))) {
        holiday_list.push("09-" + (shubun - 1));
    }
    
    return holiday_list;
}

function get_diagram_revision (date_str = null) {
    if (date_str === null) {
        date_str = get_date_string(get_timestamp());
    }
    
    for (var diagram_revision of diagram_revisions["diagram_revisions"]) {
        if (diagram_revision <= date_str) {
            return diagram_revision;
        }
    }
    
    mes("指定された日付のダイヤ情報は利用できません", true);
    
    return false;
}

function search_diagram_schedules (diagram_revision, date_str, railroad_id = null) {
    var diagram_info_data = railroad_id === null ? diagram_info : joined_railroad_diagram_info[railroad_id];
    
    if ("exceptional_dates" in diagram_info_data[diagram_revision] && date_str in diagram_info_data[diagram_revision]["exceptional_dates"]) {
        return diagram_info_data[diagram_revision]["exceptional_dates"][date_str];
    }
    
    for (var diagram_schedule of diagram_info_data[diagram_revision]["diagram_schedules"]) {
        for (var diagram_period of diagram_schedule["periods"]) {
            if (diagram_period["start_date"] <= date_str && (diagram_period["end_date"] === null || diagram_period["end_date"] >= date_str)) {
                if (get_holiday_list(Number(date_str.substring(0, 4))).includes(date_str.substring(5))) {
                    return diagram_schedule["diagrams_by_day"][0];
                } else {
                    var dt = new Date(date_str + " 12:00:00");
                    
                    return diagram_schedule["diagrams_by_day"][dt.getDay()];
                }
            }
        }
    }
}

function get_diagram_id (dates, joined_railroads, callback_1, callback_2 = null) {
    var railroad_ids = joined_railroads === null ? [null] : [null, ...joined_railroads];
    
    callback_2 = typeof callback_2 === "function" ? callback_2 : callback_1;
    
    if (typeof dates === "string") {
        dates = [dates];
    }
    
    var diagram_revisions = {};
    var diagram_revision_set = new Set();
    var diagram_revision_dates = {};
    for (var date_str of dates) {
        var diagram_revision = get_diagram_revision(date_str);
        
        if (diagram_revision === false) {
            callback_2(null);
            return;
        }
        
        diagram_revisions[date_str] = diagram_revision;
        diagram_revision_set.add(diagram_revision);
        if (!(diagram_revision in diagram_revision_dates)) {
            diagram_revision_dates[diagram_revision] = [];
        }
        diagram_revision_dates[diagram_revision].push(date_str);
    }
    
    var promise_list_1 = [];
    var promise_list_2 = [];
    var updates_exist = false;
    var diagram_ids = {};
    
    for (let railroad_id_or_null of railroad_ids) {
        let railroad_id;
        if (railroad_id_or_null === null) {
            railroad_id = railroad_info["railroad_id"];
        } else {
            railroad_id = railroad_id_or_null;
            joined_railroad_diagram_info[railroad_id] = {};
        }
        
        diagram_ids[railroad_id] = {};
        for (let diagram_revision of diagram_revision_set) {
            let tmp_diagram_ids_1;
            let promise_1;
            let last_modified_timestamp;
            
            if (diagram_revision in diagram_ids[railroad_id]) {
                tmp_diagram_ids_1 = diagram_ids[railroad_id][diagram_revision];
                
                for (var date_str of diagram_revision_dates[diagram_revision]) {
                    tmp_diagram_ids_1[date_str] = search_diagram_schedules(diagram_revision, date_str, railroad_id_or_null);
                }
                diagram_ids[railroad_id][diagram_revision] = tmp_diagram_ids_1;
                
                promise_1 = Promise.resolve();
            } else {
                tmp_diagram_ids_1 = {};
                promise_1 = new Promise(function (resolve_1, reject_1) {
                    idb_start_transaction("diagrams", false, function (transaction) {
                        var diagrams_store = transaction.objectStore("diagrams");
                        var get_request = diagrams_store.get([railroad_id, diagram_revision]);
                        
                        get_request.onsuccess = function (evt) {
                            if (evt.target.result !== undefined) {
                                var diagram_info_data = evt.target.result;
                                last_modified_timestamp = diagram_info_data["last_modified_timestamp"];
                                
                                if (railroad_id_or_null === null) {
                                    diagram_info[diagram_revision] = diagram_info_data;
                                } else {
                                    joined_railroad_diagram_info[railroad_id][diagram_revision] = diagram_info_data;
                                }
                                
                                for (var date_str of diagram_revision_dates[diagram_revision]) {
                                    tmp_diagram_ids_1[date_str] = search_diagram_schedules(diagram_revision, date_str, railroad_id_or_null);
                                }
                                diagram_ids[railroad_id][diagram_revision] = tmp_diagram_ids_1;
                                
                                resolve_1();
                            } else {
                                last_modified_timestamp = 0;
                                
                                reject_1();
                            }
                        };
                    });
                });
            }
            
            promise_list_1.push(promise_1);
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                promise_1.then(function () {}, function () {}).finally(function () {
                    if (navigator.onLine) {
                        ajax_post("diagram_info.php", "railroad_id=" + escape_form_data(railroad_id) + "&diagram_revision=" + escape_form_data(diagram_revision) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                            if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                                var diagram_info_data = JSON.parse(response);
                                
                                diagram_info_data["railroad_id"] = railroad_id;
                                diagram_info_data["diagram_revision"] = diagram_revision;
                                
                                var last_modified_date = new Date(last_modified);
                                diagram_info_data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                
                                idb_start_transaction("diagrams", true, function (transaction) {
                                    var diagrams_store = transaction.objectStore("diagrams");
                                    diagrams_store.put(diagram_info_data);
                                });
                                
                                if (railroad_id_or_null === null) {
                                    diagram_info[diagram_revision] = diagram_info_data;
                                } else {
                                    joined_railroad_diagram_info[railroad_id][diagram_revision] = diagram_info_data;
                                }
                                
                                var tmp_diagram_ids_2 = {};
                                for (date_str of diagram_revision_dates[diagram_revision]) {
                                    tmp_diagram_ids_2[date_str] = search_diagram_schedules(diagram_revision, date_str, railroad_id_or_null);
                                    if (!(date_str in tmp_diagram_ids_1) || tmp_diagram_ids_1[date_str] !== tmp_diagram_ids_2[date_str]) {
                                        updates_exist = true;
                                    }
                                }
                                
                                diagram_ids[railroad_id][diagram_revision] = tmp_diagram_ids_2;
                                
                                resolve_2();
                            } else {
                                if (tmp_diagram_ids_1.length === 0) {
                                    reject_2();
                                } else {
                                    resolve_2();
                                }
                            }
                        });
                    } else if (tmp_diagram_ids_1.length === 0) {
                        mes("オフラインのためダウンロードが完了していないダイヤ情報データは利用できません", true);
                        
                        reject_2();
                    } else {
                        resolve_2();
                    }
                });
            }));
        }
    }
    
    Promise.all(promise_list_1).then(function () {
        callback_1(...dates.map(function (date_str) {
            if (joined_railroads === null) {
                return { diagram_revision : diagram_revisions[date_str], diagram_id : diagram_ids[railroad_info["railroad_id"]][diagram_revisions[date_str]][date_str], joined_railroad_diagram_ids : null };
            } else {
                var joined_railroad_diagram_ids = {}
                for (var joined_railroad_id of joined_railroads) {
                    joined_railroad_diagram_ids[joined_railroad_id] = diagram_ids[joined_railroad_id][diagram_revisions[date_str]][date_str];
                }
                
                return { diagram_revision : diagram_revisions[date_str], diagram_id : diagram_ids[railroad_info["railroad_id"]][diagram_revisions[date_str]][date_str], joined_railroad_diagram_ids : joined_railroad_diagram_ids };
            }
        }));
    }, function () {});
    Promise.allSettled(promise_list_1).then(function () {
        Promise.all(promise_list_2).then(function () {
            if (updates_exist) {
                callback_2(...dates.map(function (date_str) {
                    if (joined_railroads === null) {
                        return { diagram_revision : diagram_revisions[date_str], diagram_id : diagram_ids[railroad_info["railroad_id"]][diagram_revisions[date_str]][date_str], joined_railroad_diagram_ids : null };
                    } else {
                        var joined_railroad_diagram_ids = {}
                        for (var joined_railroad_id of joined_railroads) {
                            joined_railroad_diagram_ids[joined_railroad_id] = diagram_ids[joined_railroad_id][diagram_revisions[date_str]][date_str];
                        }
                        
                        return { diagram_revision : diagram_revisions[date_str], diagram_id : diagram_ids[railroad_info["railroad_id"]][diagram_revisions[date_str]][date_str], joined_railroad_diagram_ids : joined_railroad_diagram_ids };
                    }
                }));
            }
        }, function () { callback_2(null); });
    });
}


var tab_area_elm = document.getElementById("tab_area");
var article_elms = document.getElementsByTagName("article");

tab_area_elm.onselectstart = function (event) { event.preventDefault(); };

var mode_val = -1;

function change_mode (num) {
    if (num === -1) {
        blank_article_elm.innerHTML = "";
        blank_article_elm.style.display = "block";
        
        article_elms[0].scrollTop = 0;
    } else {
        if (num === mode_val) {
            return;
        }
        
        blank_article_elm.style.display = "none";
    }
    
    mode_val = num;
    
    var tabs = tab_area_elm.getElementsByTagName("a");
    var footer_boxes = document.getElementsByTagName("footer")[0].getElementsByTagName("div");
    for (var cnt = 0; cnt < article_elms.length; cnt++) {
        if (cnt === num) {
            article_elms[cnt].style.display = "block";
            tabs[cnt].className = "active_tab";
            footer_boxes[cnt].style.display = "block";
        } else {
            article_elms[cnt].style.display = "none";
            tabs[cnt].className = "";
            footer_boxes[cnt].style.display = "none";
        }
    }
    
    if (document.getElementById("tips").classList.contains("tips_active")) {
        show_tips();
    }
}


var operation_table = null;
var line_operations = null;
var joined_operation_tables = {};
var joined_line_operations = {};

function set_operation_table (joined_railroad_id, data) {
    if (joined_railroad_id === null) {
        if (data["railroad_id"] === railroad_info["railroad_id"]) {
            operation_table = data;
        }
    } else {
        joined_operation_tables[joined_railroad_id] = data;
    }
}

function set_line_operations (joined_railroad_id, data) {
    if (joined_railroad_id === null) {
        if (data["railroad_id"] === railroad_info["railroad_id"]) {
            line_operations = data;
        }
    } else {
        var lines = Object.keys(data["lines"]);
        for (var line_id of lines) {
            var train_numbers = Object.keys(data["lines"][line_id]["inbound_trains"]);
            for (var train_number of train_numbers) {
                for (var cnt = 0; cnt < data["lines"][line_id]["inbound_trains"][train_number].length; cnt++) {
                    for (var cnt_2 = 0; cnt_2 < data["lines"][line_id]["inbound_trains"][train_number][cnt]["operation_numbers"].length; cnt_2++) {
                        data["lines"][line_id]["inbound_trains"][train_number][cnt]["operation_numbers"][cnt_2] += "@" + joined_railroad_id;
                    }
                }
            }
        
            var train_numbers = Object.keys(data["lines"][line_id]["outbound_trains"]);
            for (var train_number of train_numbers) {
                for (var cnt = 0; cnt < data["lines"][line_id]["outbound_trains"][train_number].length; cnt++) {
                    for (var cnt_2 = 0; cnt_2 < data["lines"][line_id]["outbound_trains"][train_number][cnt]["operation_numbers"].length; cnt_2++) {
                        data["lines"][line_id]["outbound_trains"][train_number][cnt]["operation_numbers"][cnt_2] += "@" + joined_railroad_id;
                    }
                }
            }
        }
        
        joined_line_operations[joined_railroad_id] = data;
    }
}

function load_operation_table (resolve_func_1, reject_func_1, resolve_func_2, reject_func_2, diagram_revision, diagram_ids, joined_railroads = null) {
    var railroad_ids = joined_railroads === null ? [null] : [null, ...joined_railroads];
    
    var promise_list_1 = [];
    var promise_list_2 = [];
    
    joined_operation_tables = {};
    joined_line_operations = {};
    
    for (let railroad_id_or_null of railroad_ids) {
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                var railroad_id = railroad_id_or_null === null ? railroad_info["railroad_id"] : railroad_id_or_null;
                
                var data = null;
                var last_modified_timestamp = 0;
                
                idb_start_transaction(["operations", "line_operations"], false, function (transaction) {
                    var operations_store = transaction.objectStore("operations");
                    var operations_get_request = operations_store.get([railroad_id, diagram_revision, diagram_ids[railroad_id]]);
                    
                    var line_operations_store = transaction.objectStore("line_operations");
                    var line_operations_get_request = line_operations_store.get([railroad_id, diagram_revision, diagram_ids[railroad_id]]);
                    
                    var promise_list_3 = [
                        new Promise(function (resolve, reject) {
                            operations_get_request.onsuccess = function (evt) {
                                if (evt.target.result !== undefined) {
                                    data = evt.target.result;
                                    last_modified_timestamp = data["last_modified_timestamp"];
                                    
                                    set_operation_table(railroad_id_or_null, data);
                                }
                                
                                resolve();
                            };
                        }),
                        new Promise(function (resolve, reject) {
                            line_operations_get_request.onsuccess = function (evt) {
                                if (evt.target.result !== undefined) {
                                    set_line_operations(railroad_id_or_null, evt.target.result);
                                }
                                
                                resolve();
                            };
                        })
                    ];
                    
                    Promise.all(promise_list_3).then(function () {
                        if (last_modified_timestamp > 0) {
                            resolve_1();
                        } else {
                            reject_1();
                        }
                        
                        update_operation_table(resolve_2, reject_2, railroad_id_or_null, diagram_revision, diagram_ids[railroad_id], last_modified_timestamp);
                    });
                });
            }));
        }));
    }
    
    Promise.all(promise_list_1).then(resolve_func_1, reject_func_1);
    
    Promise.allSettled(promise_list_1).then(function () {
        Promise.all(promise_list_2).then(function (update_exists_list) {
            resolve_func_2(update_exists_list.includes(true));
        }, reject_func_2);
    });
}

function update_operation_table (resolve_func, reject_func, railroad_id_or_null, diagram_revision, diagram_id, last_modified_timestamp) {
    var railroad_id = railroad_id_or_null === null ? railroad_info["railroad_id"] : railroad_id_or_null;
    
    if (!navigator.onLine) {
        if (last_modified_timestamp === 0) {
            mes("オフラインのためダウンロードが完了していない運用データは利用できません", true);
            
            reject_func(null);
        } else {
            resolve_func(false);
        }
        
        return;
    }
    
    ajax_post("operation_table.php", "railroad_id=" + escape_form_data(railroad_id) + "&diagram_revision=" + escape_form_data(diagram_revision) + "&diagram_id=" + escape_form_data(diagram_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
        if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
            var operation_response = JSON.parse(response);
            
            var last_modified_date = new Date(last_modified);
            last_modified_timestamp = Math.floor(last_modified_date.getTime() / 1000);
            
            operation_response["railroad_id"] = railroad_id;
            operation_response["diagram_revision"] = diagram_revision;
            operation_response["diagram_id"] = diagram_id;
            operation_response["last_modified_timestamp"] = last_modified_timestamp;
            
            var line_operations_data = { railroad_id : railroad_id, diagram_revision : diagram_revision, diagram_id : diagram_id, last_modified_timestamp : last_modified_timestamp, lines : {} };
            
            var operations_stopped_trains = {};
            
            var operation_groups = {};
            var operation_group_names = [];
            var operation_group_mapping = {};
            for (var operation_group of operation_response["operation_groups"]) {
                operation_groups[operation_group["operation_group_name"]] = { operation_numbers : operation_group["operation_numbers"] };
                operation_group_names.push(operation_group["operation_group_name"]);
                
                if ("main_color" in operation_group) {
                    operation_groups[operation_group["operation_group_name"]]["main_color"] = operation_group["main_color"];
                }
                
                for (var operation_number of operation_group["operation_numbers"]) {
                    operation_group_mapping[operation_number] = operation_group["operation_group_name"];
                }
            }
            
            operation_response["operation_groups"] = operation_groups;
            operation_response["operation_group_names"] = operation_group_names;
            
            for (var operation_number of Object.keys(operation_response["operations"])) {
                operation_response["operations"][operation_number]["operation_group_name"] = operation_group_mapping[operation_number];
                
                operations_stopped_trains[operation_number] = [];
                
                for_2: for (var cnt_2 = 0; cnt_2 < operation_response["operations"][operation_number]["trains"].length; cnt_2++) {
                    if (operation_response["operations"][operation_number]["trains"][cnt_2]["train_number"].startsWith("_")) {
                        var train = operation_response["operations"][operation_number]["trains"].splice(cnt_2, 1)[0];
                        
                        operations_stopped_trains[operation_number].push(train);
                        
                        cnt_2--;
                    } else {
                        var train = operation_response["operations"][operation_number]["trains"][cnt_2];
                    }
                    
                    if (train["direction"] === "inbound") {
                        var train_direction = "inbound_trains";
                    } else if (train["direction"] === "outbound") {
                        var train_direction = "outbound_trains";
                    } else {
                        if (!("temporary_garaged_times" in operation_response["operations"][operation_number])) {
                            operation_response["operations"][operation_number]["temporary_garaged_times"] = [];
                        }
                        
                        operation_response["operations"][operation_number]["temporary_garaged_times"].push([train["first_departure_time"], train["final_arrival_time"]]);
                        
                        if ("formations_can_changed" in train && train["formations_can_changed"]) {
                            if (!("times_formations_can_changed" in operation_response["operations"][operation_number])) {
                                operation_response["operations"][operation_number]["times_formations_can_changed"] = [];
                            }
                            
                            operation_response["operations"][operation_number]["times_formations_can_changed"].push(train["final_arrival_time"]);
                        }
                        
                        continue;
                    }
                    
                    if (!(train["line_id"] in line_operations_data["lines"])) {
                        line_operations_data["lines"][train["line_id"]] = {
                            inbound_trains : {},
                            outbound_trains : {}
                        };
                    }
                    
                    if (!(train["train_number"] in line_operations_data["lines"][train["line_id"]][train_direction])) {
                        line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]] = [];
                    }
                    
                    var operation_number_with_symbol = "formation_reversed" in train && train["formation_reversed"] ? "<=>" + operation_number : operation_number;
                    
                    for (var cnt_3 = 0; cnt_3 < line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]].length; cnt_3++) {
                        if (line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]][cnt_3]["starting_station"] === train["starting_station"]) {
                            var train_operations = line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]][cnt_3]["operation_numbers"];
                            
                            for_4: for (var cnt_4 = 0; cnt_4 < train_operations.length; cnt_4++) {
                                var coupling_operation = train_operations[cnt_4].startsWith("<=>") ? train_operations[cnt_4].substring(3) : train_operations[cnt_4];
                                
                                if (!train["train_number"].startsWith("_")) {
                                    var operation_trains = operation_response["operations"][coupling_operation]["trains"];
                                } else {
                                    var operation_trains = operations_stopped_trains[coupling_operation];
                                }
                                
                                for (var operation_train of operation_trains) {
                                    if (operation_train["train_number"] === train["train_number"] && operation_train["starting_station"] === train["starting_station"] && operation_train["position_forward"] > train["position_forward"]) {
                                        break for_4;
                                    }
                                }
                            }
                            
                            line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]][cnt_3]["operation_numbers"].splice(cnt_4, 0, operation_number_with_symbol);
                            
                            continue for_2;
                        } else if (line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]][cnt_3]["first_departure_time"] > train["first_departure_time"]) {
                            break;
                        }
                    }
                    
                    line_operations_data["lines"][train["line_id"]][train_direction][train["train_number"]].splice(cnt_3, 0, {
                        first_departure_time : train["first_departure_time"],
                        final_arrival_time : train["final_arrival_time"],
                        starting_station : train["starting_station"],
                        terminal_station : train["terminal_station"],
                        operation_numbers : [operation_number_with_symbol]
                    });
                }
            }
            
            if ("group_divisions" in operation_response) {
                var group_divisions = {};
                var group_division_names = [];
                for (var group_division of operation_response["group_divisions"]) {
                    group_divisions[group_division["group_division_name"]] = { operation_group_names : group_division["operation_group_names"] };
                    group_division_names.push(group_division["group_division_name"]);
                }
                
                operation_response["group_divisions"] = group_divisions;
                operation_response["group_division_names"] = group_division_names;
            }
            
            set_operation_table(railroad_id_or_null, operation_response);
            set_line_operations(railroad_id_or_null, structuredClone(line_operations_data));
            
            idb_start_transaction(["operations", "line_operations"], true, function (transaction) {
                var operations_store = transaction.objectStore("operations");
                operations_store.put(operation_response);
                
                var line_operations_store = transaction.objectStore("line_operations");
                line_operations_store.put(line_operations_data);
            });
            
            resolve_func(true);
        } else {
            if (last_modified_timestamp > 0) {
                resolve_func(false);
            } else {
                reject_func(null);
            }
        }
    });
}


var timetable = null;
var timetable_date = null;

function update_timetable (resolve_1, reject_1, resolve_2, reject_2, diagram_revision, timetable_id) {
    timetable = null;
    
    var railroad_id = railroad_info["railroad_id"];
    
    idb_start_transaction("timetables", false, function (transaction) {
        var timetables_store = transaction.objectStore("timetables");
        var get_request = timetables_store.get([railroad_id, diagram_revision, timetable_id]);
        
        get_request.onsuccess = function (evt) {
            if (evt.target.result !== undefined) {
                timetable = evt.target.result;
                var last_modified_timestamp = timetable["last_modified_timestamp"];
                
                resolve_1();
            } else {
                var last_modified_timestamp = 0;
                
                reject_1();
            }
            
            if (navigator.onLine) {
                ajax_post("timetable.php", "railroad_id=" + escape_form_data(railroad_id) + "&diagram_revision=" + escape_form_data(diagram_revision) + "&timetable_id=" + escape_form_data(timetable_id) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                    if (response !== false && response !== "NO_UPDATES_AVAILABLE") {
                        timetable = {timetable : JSON.parse(response)};
                        
                        timetable["railroad_id"] = railroad_id;
                        timetable["diagram_revision"] = diagram_revision;
                        timetable["timetable_id"] = timetable_id;
                        
                        var last_modified_date = new Date(last_modified);
                        timetable["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                        
                        idb_start_transaction("timetables", true, function (transaction) {
                            var timetable_store = transaction.objectStore("timetables");
                            timetable_store.put(timetable);
                        });
                        
                        resolve_2(true);
                    } else {
                        if (timetable !== null) {
                            resolve_2(false);
                        } else {
                            reject_2();
                        }
                    }
                });
            } else {
                if (timetable !== null) {
                    resolve_2(false);
                } else {
                    mes("オフラインのためダウンロードが完了していない時刻表データは利用できません", true);
                    
                    reject_2();
                }
            }
        };
    });
}


var operation_data = null;
var joined_operation_data = {};
var operation_date_last;
var operation_data_last_updated = null;

function set_operation_data (joined_railroad_id, data) {
    if (joined_railroad_id === null) {
        if (data["railroad_id"] === railroad_info["railroad_id"] && data["operation_date"] === operation_date_last) {
            operation_data = data;
        }
    } else {
        joined_operation_data[joined_railroad_id] = data;
    }
}

function update_operation_data (resolve_func_1, reject_func_1, resolve_func_2, reject_func_2, operation_date, joined_railroads = null, remote_data_only = false) {
    var railroad_ids = joined_railroads === null ? [null] : [null, ...joined_railroads];
    
    var promise_list_1 = [];
    var promise_list_2 = [];
    var updates_exist = false;
    
    for (let railroad_id_or_null of railroad_ids) {
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                var railroad_id = railroad_id_or_null === null ? railroad_info["railroad_id"] : railroad_id_or_null;
                
                var data = null;
                var resolved = false;
                
                idb_start_transaction("operation_data", false, function (transaction) {
                    var operation_data_store = transaction.objectStore("operation_data");
                    var get_request = operation_data_store.get([railroad_id, operation_date]);
                    
                    get_request.onsuccess = function (evt) {
                        if (evt.target.result !== undefined) {
                            data = evt.target.result;
                            var last_modified_timestamp = data["last_modified_timestamp"];
                            
                            if (!remote_data_only) {
                                resolved = true;
                            }
                        } else {
                            if (!remote_data_only) {
                                data = {railroad_id : railroad_id, operation_date : operation_date, operations : {}, last_modified_timestamp : null};
                                
                                resolved = true;
                            }
                            
                            var last_modified_timestamp = 0;
                        }
                        
                        if (resolved) {
                            set_operation_data(railroad_id_or_null, data);
                            
                            resolve_1();
                        } else {
                            reject_1();
                        }
                        
                        if (navigator.onLine) {
                            if (data === null) {
                                data = {railroad_id : railroad_id, operation_date : operation_date, operations : {}, last_modified_timestamp : null};
                            }
                            
                            ajax_post("operation_data.php", "railroad_id=" + escape_form_data(railroad_id) + "&date=" + escape_form_data(operation_date) + "&last_modified_timestamp=" + last_modified_timestamp, function (response, last_modified) {
                                if (response !== false) {
                                    if (response !== "NO_UPDATES_AVAILABLE") {
                                        Object.assign(data["operations"], JSON.parse(response));
                                        
                                        var last_modified_date = new Date(last_modified);
                                        data["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                                        
                                        idb_start_transaction("operation_data", true, function (transaction) {
                                            var operation_data_store = transaction.objectStore("operation_data");
                                            operation_data_store.put(data);
                                        });
                                        
                                        set_operation_data(railroad_id_or_null, data);
                                        
                                        updates_exist = true;
                                    } else if (!resolved) {
                                        set_operation_data(railroad_id_or_null, data);
                                        
                                        updates_exist = true;
                                    }
                                    
                                    resolve_2(updates_exist);
                                } else if (resolved) {
                                    resolve_2(false);
                                } else {
                                    reject_2();
                                }
                            });
                        } else {
                            resolve_2(false);
                        }
                    };
                });
            }));
        }));
    }
    
    operation_data_last_updated = get_timestamp();
    
    Promise.all(promise_list_1).then(resolve_func_1, reject_func_1);
    
    Promise.allSettled(promise_list_1).then(function () {
        Promise.all(promise_list_2).then(function () {
            resolve_func_2(updates_exist);
        }, reject_func_2);
    });
}


function load_data (callback_1, callback_2, reject_func, diagram_revision, diagram_id, joined_railroad_diagram_ids = null, operation_data_date = null) {
    var diagram_ids = { [railroad_info["railroad_id"]] : diagram_id };
    
    if (joined_railroad_diagram_ids === null) {
        var joined_railroads = null;
    } else {
        var joined_railroads = Object.keys(joined_railroad_diagram_ids);
        
        for (var joined_railroad_id of joined_railroads) {
            diagram_ids[joined_railroad_id] = joined_railroad_diagram_ids[joined_railroad_id];
        }
    }
    
    var promise_list_1 = [];
    var promise_list_2 = [];
    
    promise_list_1.push(new Promise(function (resolve_1, reject_1) {
        promise_list_2.push(new Promise(function (resolve_2, reject_2) {
            load_operation_table(resolve_1, reject_1, resolve_2, reject_2, diagram_revision, diagram_ids, joined_railroads);
        }));
    }));
    
    promise_list_1.push(new Promise(function (resolve_1, reject_1) {
        promise_list_2.push(new Promise(function (resolve_2, reject_2) {
            update_timetable(resolve_1, reject_1, resolve_2, reject_2, diagram_revision, diagram_info[diagram_revision]["diagrams"][diagram_id]["timetable_id"]);
        }));
    }));
    
    joined_operation_data = {};
    if (operation_data_date !== null) {
        operation_date_last = operation_data_date;
        
        promise_list_1.push(new Promise(function (resolve_1, reject_1) {
            promise_list_2.push(new Promise(function (resolve_2, reject_2) {
                update_operation_data(resolve_1, reject_1, resolve_2, reject_2, operation_data_date, joined_railroads);
            }));
        }));
    } else {
        operation_date_last = null;
        operation_data = null;
        operation_data_last_updated = null;
    }
    
    Promise.all(promise_list_1).then(function () {
        callback_1();
    }, function () {});
    Promise.allSettled(promise_list_1).then(function () {
        Promise.all(promise_list_2).then(function (update_exists_list) {
            if (typeof callback_2 === "function") {
                callback_2(update_exists_list.includes(true));
            } else if (update_exists_list.includes(true)) {
                callback_1();
            }
        }, function () {
            reject_func();
        });
    });
}


var position_selected_line = null;
var position_scroll_amount = null;

var position_line_select_elm = document.getElementById("position_line_select");
var position_area_elm = document.getElementById("position_area");
var position_reload_button_elm = document.getElementById("position_reload_button");
var position_time_button_elm = document.getElementById("position_time_button");

function position_mode (line_id = null, date_str = "__today__", scroll_target_station = null, position_time_additions = null) {
    change_title(railroad_info["railroad_name"] + "の車両運用情報 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/");
    
    change_mode(0);
    
    if (line_id !== null) {
        position_selected_line = line_id;
    }
    
    var scroll_amount = position_scroll_amount !== null ? position_scroll_amount : article_elms[0].scrollTop;
    position_scroll_amount = null;
    
    position_area_elm.innerHTML = "";
    position_line_select_elm.style.display = "none";
    
    timetable_date = date_str;
    
    var position_diagram_elm = document.getElementById("position_diagram");
    
    if (date_str === "__today__") {
        var diagram_date = get_date_string(get_timestamp());
        position_diagram_elm.innerHTML = "今日";
        
        if (position_time_additions === null) {
            position_reload_button_elm.style.display = "none";
        }
    } else {
        position_last_updated = null;
        position_reload_button_elm.style.display = "block";
        
        if (date_str === "__tomorrow__") {
            var diagram_date = get_date_string(get_timestamp() + 86400);
            position_diagram_elm.innerHTML = "明日";
        } else {
            var diagram_date = get_date_string(get_timestamp());
            position_diagram_elm.innerHTML = "";
        }
    }
    
    get_diagram_id(diagram_date, "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : null, function (diagram_data) {
        if (diagram_data === null) {
            return;
        }
        
        if (date_str !== "__today__" && date_str !== "__tomorrow__") {
            var diagram_id = date_str;
            var joined_railroad_diagram_ids = null;
            var operation_data_date = null;
            position_diagram_elm.innerHTML = "<small>" + escape_html(diagram_info[diagram_data["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]) + "</small>";
        } else {
            var diagram_id = diagram_data["diagram_id"];
            var joined_railroad_diagram_ids = diagram_data["joined_railroad_diagram_ids"];
            var operation_data_date = diagram_date;
        }
        
        if (config["show_final_destinations_in_position_mode"]) {
            document.getElementById("show_final_destinations_radio").checked = true;
        } else {
            document.getElementById("show_train_numbers_radio").checked = true;
        }
        
        position_change_time(position_time_additions, false, false);
        
        var data_loaded = false;
        load_data(function () {
            position_line_select_elm.style.display = "block";
            position_change_lines(position_selected_line, scroll_target_station !== null ? scroll_target_station : scroll_amount);
            
            data_loaded = true;
        }, function (updates_exist) {
            if (!data_loaded) {
                position_line_select_elm.style.display = "block";
                position_change_lines(position_selected_line, scroll_target_station !== null ? scroll_target_station : scroll_amount);
            } else if (updates_exist) {
                position_change_time(0);
            }
        }, function () {
            position_area_elm.innerHTML = "<div class='no_data'>表示に必要なデータが利用できません</div>";
            position_line_select_elm.style.display = "none";
        }, diagram_data["diagram_revision"], diagram_id, joined_railroad_diagram_ids, operation_data_date);
    });
}

function update_selected_line (line_id, position_mode) {
    if (line_id !== null) {
        var line_color = config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][line_id]["line_color"]) : railroad_info["lines"][line_id]["line_color"];
        
        if ("line_symbol" in railroad_info["lines"][line_id]) {
            var line_symbol = railroad_info["lines"][line_id]["line_symbol"];
        } else {
            var line_symbol = railroad_info["lines"][line_id]["line_name"].substring(0, 1);
        }
        
        var line_name = escape_html(railroad_info["lines"][line_id]["line_name"]);
    } else {
        var line_color = "transparent";
        var line_symbol = "";
        var line_name = "全ての路線";
    }
    
    var line_select_html = "<abbr style='color: " + line_color + ";'>" + line_symbol + "</abbr>" + line_name;
    if (position_mode) {
        position_selected_line = line_id;
        position_line_select_elm.innerHTML = line_select_html;
    } else {
        timetable_selected_line = line_id;
        document.getElementById("timetable_line_select").innerHTML = line_select_html;
    }
}

function position_change_lines (line_id, scroll_target = -1) {
    if (!config["dark_mode"]) {
        var line_color = railroad_info["lines"][line_id]["line_color"];
        
        var line_color_hsl = rgb2hsl(line_color);
        var station_color = "hsl(" + line_color_hsl[0] + "deg " + Math.round(line_color_hsl[1] / 2.55) + "% " + Math.round((line_color_hsl[2] + 1275) / 6 / 2.55) + "%)";
        var major_station_row_color = "hsl(" + line_color_hsl[0] + "deg " + Math.round(line_color_hsl[1] / 2.55) + "% " + Math.round((line_color_hsl[2] + 2295) / 10 / 2.55) + "%)";
    } else {
        var line_color = convert_color_dark_mode(railroad_info["lines"][line_id]["line_color"]);
        
        var line_color_hsl = rgb2hsl(railroad_info["lines"][line_id]["line_color"]);
        var station_color = "hsl(" + line_color_hsl[0] + "deg " + Math.round(line_color_hsl[1] / 4 / 2.55) + "% " + Math.round(Math.min(255 - line_color_hsl[2] + 32, 127) / 2.55) + "%)";
        var major_station_row_color = "hsl(" + line_color_hsl[0] + "deg " + Math.round(line_color_hsl[1] / 16 / 2.55) + "% " + Math.round(Math.min(Math.max(255 - line_color_hsl[2] + 16, 255), 85) / 2.55) + "%)";
    }
    
    update_selected_line(line_id, true);
    
    var buf = "";
    for (var cnt = 0; cnt <= railroad_info["lines"][line_id]["stations"].length; cnt++) {
        var border_style = "";
        var position_station_class = "";
        var connecting_lines_html = "";
        
        if (cnt >= 1) {
            buf += "<tr";
            
            if ("connecting_lines" in railroad_info["lines"][line_id]["stations"][cnt - 1]) {
                var junction_class_list = [];
                
                for (var connecting_line of railroad_info["lines"][line_id]["stations"][cnt - 1]["connecting_lines"]) {
                    for (var line_direction of connecting_line["directions"]) {
                        if ((line_direction === "TL" || line_direction === "TR") && !("T" in junction_class_list)) {
                            junction_class_list.push("T");
                        } else if ((line_direction === "L" || line_direction === "R") && !("LR" in junction_class_list)) {
                            junction_class_list.push("LR");
                        } else if ((line_direction === "BL" || line_direction === "BR") && !("B" in junction_class_list)) {
                            junction_class_list.push("B");
                        }
                        
                        if (!("affiliated_railroad_id" in railroad_info["lines"][connecting_line["line_id"]])) {
                            connecting_lines_html += "<button type='button' class='connecting_line_" + line_direction + "' onclick='position_change_lines(\"" + connecting_line["line_id"] + "\", \"" + add_slashes(railroad_info["lines"][line_id]["stations"][cnt - 1]["station_name"]) + "\");' style='color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][connecting_line["line_id"]]["line_color"]) : railroad_info["lines"][connecting_line["line_id"]]["line_color"]) + ";'><div>" + escape_html(railroad_info["lines"][connecting_line["line_id"]]["line_name"]) + "</div></button>";
                        } else {
                            connecting_lines_html += "<a href='/railroad_" + railroad_info["lines"][connecting_line["line_id"]]["affiliated_railroad_id"] + "/' class='connecting_line_" + line_direction + "' onclick='event.preventDefault(); select_railroad(\"" + railroad_info["lines"][connecting_line["line_id"]]["affiliated_railroad_id"] + "\", \"position_mode\", \"" + connecting_line["line_id"] + "\", null, timetable_date === \"__tomorrow__\" ? \"__tomorrow__\" : \"__today__\", 0);' style='color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][connecting_line["line_id"]]["line_color"]) : railroad_info["lines"][connecting_line["line_id"]]["line_color"]) + ";'><div>" + escape_html(railroad_info["lines"][connecting_line["line_id"]]["line_name"]) + "</div></a>";
                        }
                    }
                }
                
                var buf_2 = "";
                for (var junction_class of junction_class_list) {
                    buf_2 += (buf_2.length >= 1 ? " " : "") + "position_row_junction_" + junction_class;
                }
                buf += " class='" + buf_2 + "'";
            }
            
            buf += "><th>";
            
            var station_name = "canonical_station_name" in railroad_info["lines"][line_id]["stations"][cnt - 1] ? railroad_info["lines"][line_id]["stations"][cnt - 1]["canonical_station_name"] : railroad_info["lines"][line_id]["stations"][cnt - 1]["station_name"];
            
            if ("is_signal_station" in railroad_info["lines"][line_id]["stations"][cnt - 1] && railroad_info["lines"][line_id]["stations"][cnt - 1]["is_signal_station"]) {
                var is_signal_station = true;
                
                buf += "<div class='position_station position_signal_station'";
                
                border_style = " style='border-top-color: transparent;'";
                position_station_class = " position_line_signal_station";
            } else {
                var is_signal_station = false;
                
                buf += "<a href='/railroad_" + railroad_info["railroad_id"] + "/timetable/" + line_id + "/" + encodeURIComponent(station_name) + "/' onclick='event.preventDefault(); show_station_timetable(\"" + line_id + "\", \"" + add_slashes(station_name) + "\");' class='position_station'";
                
                if ("is_major_station" in railroad_info["lines"][line_id]["stations"][cnt - 1] && railroad_info["lines"][line_id]["stations"][cnt - 1]["is_major_station"]) {
                    buf += " style='background-color: " + station_color + ";'";
                    
                    border_style = " style='border-top: 2px solid " + major_station_row_color + ";'";
                    position_station_class = " position_line_major_station";
                }
            }
            
            buf += ">";
            
            if (station_name.length > 5) {
                buf += escape_html(station_name.substring(0, 4) + "..");
            } else{
                buf += escape_html(station_name);
            }
            
            buf += is_signal_station ? "</div>" : "</a>";
            
            if (connecting_lines_html.length >= 1 || ("connecting_railroads" in railroad_info["lines"][line_id]["stations"][cnt - 1] && railroad_info["lines"][line_id]["stations"][cnt - 1]["connecting_railroads"].length >= 1)) {
                buf += "<button type='button' class='connecting_railroads_button' onclick='select_lines(\"" + line_id + "\", \"" + add_slashes(station_name) + "\");' aria-label='接続路線'></button>";
            }
        } else {
            buf += "<tr><th>";
        }
        
        buf += "</th><td class='position_inbound'" + border_style + "></td><td class='position_line" + position_station_class + "' style='color: " + line_color + ";'>" + connecting_lines_html + "</td><td class='position_outbound'" + border_style + "></td></tr>";
        
        if ("double_station_spacing" in railroad_info["lines"][line_id] && railroad_info["lines"][line_id]["double_station_spacing"] && cnt !== 0 && cnt !== railroad_info["lines"][line_id]["stations"].length) {
                buf += "<tr class='position_row_no_station'><th></th><td class='position_inbound'></td><td class='position_line" + position_station_class + "' style='color: " + line_color + ";'></td><td class='position_outbound'></td></tr>";
        }
    }
    
    position_area_elm.innerHTML = buf;
    
    if (typeof scroll_target === "string") {
        for (cnt = 0; cnt < railroad_info["lines"][line_id]["stations"].length; cnt++) {
            if (railroad_info["lines"][line_id]["stations"][cnt]["station_name"] === scroll_target) {
                var article_rect = article_elms[0].getBoundingClientRect();
                var station_rect = position_area_elm.getElementsByClassName("position_station")[cnt].getBoundingClientRect();
                
                article_elms[0].scrollTop += station_rect.top - article_rect.top - (article_rect.height / 2) + (station_rect.height / 2);
                
                break;
            }
        }
    } else if (scroll_target >= 0) {
        article_elms[0].scrollTop = scroll_target;
    }
    
    position_change_time(0);
}

function convert_train_position_data (train_data, hh_and_mm) {
    train_data["train_title"] = train_data["train_number"].startsWith("_") ? train_data["train_number"].substring(1).split("__")[0] : train_data["train_number"].split("__")[0];
    
    train_data["formation_html"] = escape_html(train_data["formation_text"]).replace(/\+/g, "<wbr>+");
    
    if (train_data["comment_exists"]) {
        train_data["formation_html"] += "*";
    }
    
    if (train_data["reassigned"]) {
        train_data["formation_html"] = "<b style='color: " + (!config["dark_mode"] ? "#cc0000" : "#ff9999") + ";'>" + train_data["formation_html"] + "</b>";
    } else if (train_data["is_quotation"]) {
        train_data["formation_html"] = "<b style='color: " + (!config["dark_mode"] ? "#9966ff" : "#cc99ff") + ";'>" + train_data["formation_html"] + "</b>";
    } else if (train_data["min_posts_count"] === 0 || hh_and_mm >= train_data["time_formations_can_be_changed"]) {
        train_data["formation_html"] = "<b style='color: " + (!config["dark_mode"] ? "#0099cc" : "#33ccff") + ";'>" + train_data["formation_html"] + "</b>";
    } else if (config["colorize_corrected_posts"] && train_data["variant_exists"]) {
        train_data["formation_html"] = "<b style='color: " + (!config["dark_mode"] ? "#ee7700" : "#ffcc99") + ";'>" + train_data["formation_html"] + "</b>";
    } else if (config["colorize_beginners_posts"] && train_data["from_beginner"]) {
        train_data["formation_html"] = "<b style='color: #33cc99;'>" + train_data["formation_html"] + "</b>";
    } else {
        train_data["formation_html"] = "<b>" + train_data["formation_html"] + "</b>";
    }
    
    return train_data;
}

function draw_train_position (hh_and_mm) {
    var directions = ["inbound", "outbound"];
    var position_elms = [document.getElementsByClassName("position_inbound"), document.getElementsByClassName("position_outbound")];
    
    var inbound_trains = line_operations["lines"][position_selected_line]["inbound_trains"];
    var outbound_trains = line_operations["lines"][position_selected_line]["outbound_trains"];
    if ("joined_railroads" in railroad_info) {
        for (var railroad_id of railroad_info["joined_railroads"]) {
            if (railroad_id in joined_line_operations && position_selected_line in joined_line_operations[railroad_id]["lines"]) {
                inbound_trains = Object.assign(inbound_trains, joined_line_operations[railroad_id]["lines"][position_selected_line]["inbound_trains"]);
                outbound_trains = Object.assign(outbound_trains, joined_line_operations[railroad_id]["lines"][position_selected_line]["outbound_trains"]);
            }
        }
    }
    
    var line_positions = [get_train_positions(inbound_trains, position_selected_line, hh_and_mm, true), get_train_positions(outbound_trains, position_selected_line, hh_and_mm, false)];
    
    for (var direction_cnt = 0; direction_cnt <= 1; direction_cnt++) {
        for (var cnt = 0; cnt < line_positions[direction_cnt].length; cnt++) {
            if (line_positions[direction_cnt][cnt].length === 1) {
                var train = convert_train_position_data(line_positions[direction_cnt][cnt][0], hh_and_mm);
                
                if (railroad_info["deadhead_train_number_regexp"].test(train["train_title"])) {
                    train["train_type"] = "回送";
                }
                
                var train_color = config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train["train_title"], train["train_type"], "#333333")) : get_train_color(train["train_title"], train["train_type"], "#333333");
                
                var buf = "<div onclick='train_detail(\"" + position_selected_line + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + directions[direction_cnt] + "_trains\", " + (operation_data !== null ? "true" : "false") + ");' style='color: " + train_color + ";'><span class='train_icon_wrapper'><img src='" + (operation_data !== null ? get_icon(train["first_formation"], train["railroad_id"], train["default_icon"]) : (train["default_icon"] === null ? UNYOHUB_GENERIC_TRAIN_ICON : get_icon_base64(train["default_icon"], train["railroad_id"]))) + "' alt='' class='train_icon'";
                
                if (train["train_type"] === "回送") {
                    buf += " style='opacity: 0.5;'";
                }
                
                buf += "></span><span class='train_type' style='background-color: " + train_color + "; border-color: " + train_color + ";'><small>" + train["train_type"].substring(0, 1) + "</small>";
                
                if (config["show_final_destinations_in_position_mode"]) {
                    buf += get_final_destination(position_selected_line, direction_cnt === 0, train["train_number"], train["starting_station"], 4);
                } else {
                    buf += train["train_title"];
                }
                
                buf += "</span><br>" + train["formation_html"] + "</div>";
            } else if (line_positions[direction_cnt][cnt].length >= 2) {
                var buf = "<div class='multiple_trains'>";
                for (var line_train of line_positions[direction_cnt][cnt]) {
                    var train = convert_train_position_data(line_train, hh_and_mm);
                    
                    if (railroad_info["deadhead_train_number_regexp"].test(train["train_title"])) {
                        train["train_type"] = "回送";
                    }
                    
                    buf += "<span class='train_icon_wrapper' onclick='train_detail(\"" + position_selected_line + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + directions[direction_cnt] + "_trains\", " + (operation_data !== null ? "true" : "false") + ");' style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train["train_title"], train["train_type"], "#333333")) : get_train_color(train["train_title"], train["train_type"], "#333333")) + ";'><img src='" + (operation_data !== null ? get_icon(train["first_formation"], train["railroad_id"], train["default_icon"]) : (train["default_icon"] === null ? UNYOHUB_GENERIC_TRAIN_ICON : get_icon_base64(train["default_icon"], train["railroad_id"]))) + "' alt='' class='train_icon'";
                    
                    if (train["train_type"] === "回送") {
                        buf += " style='opacity: 0.5;'"
                    }
                    
                    buf += "></span>";
                }
                buf += "</div>";
            } else {
                var buf = "";
            }
            
            if (direction_cnt === 0) {
                position_elms[0][line_positions[direction_cnt].length - cnt].innerHTML = buf;
            } else {
                position_elms[1][cnt].innerHTML = buf;
            }
        }
    }
}

function hh_mm_to_minutes (hh_and_mm) {
    var h_and_m = hh_and_mm.split(":");
    return Number(h_and_m[0]) * 60 + Number(h_and_m[1]);
}

function calculate_train_position (line_id, minutes_now, previous_station_index, next_station_index, previous_station_time, next_station_time) {
    if ("double_station_spacing" in railroad_info["lines"][line_id] && railroad_info["lines"][line_id]["double_station_spacing"]) {
        var station_spacing = 2;
    } else {
        var station_spacing = 1;
    }
    
    if (next_station_time === previous_station_time) {
        return next_station_index * station_spacing;
    }
    
    return Math.ceil(((next_station_index - previous_station_index) * (minutes_now - previous_station_time) / (next_station_time - previous_station_time) + previous_station_index) * station_spacing);
}

function get_train_positions (trains, line_id, hh_and_mm, is_inbound) {
    var station_list = [...railroad_info["lines"][line_id]["stations"]];
    
    if (is_inbound) {
        station_list.reverse();
    }
    
    var minutes_now = hh_mm_to_minutes(hh_and_mm);
    
    if ("double_station_spacing" in railroad_info["lines"][line_id] && railroad_info["lines"][line_id]["double_station_spacing"]) {
        var line_rows_count = station_list.length * 2 - 1;
    } else {
        var line_rows_count = station_list.length;
    }
    
    var line_positions = new Array(line_rows_count);
    for (var cnt = 0; cnt < line_rows_count; cnt++) {
        line_positions[cnt] = [];
    }
    
    var train_direction = is_inbound ? "inbound_trains" : "outbound_trains";
    
    for (var train_number of Object.keys(trains)) {
        if (trains[train_number][0]["first_departure_time"] > hh_and_mm) {
            continue;
        }
        
        for (var train of trains[train_number]) {
            if (train["final_arrival_time"] <= hh_and_mm) {
                continue;
            }
            
            var operation_list = get_operations(line_id, train_number, train["starting_station"], train_direction);
            
            var train_type = null;
            
            if (!train_number.startsWith("_") && train_number in timetable["timetable"][line_id][train_direction]) {
                for_3: for (var timetable_train of timetable["timetable"][line_id][train_direction][train_number]) {
                    var departure_times = timetable_train["departure_times"];
                    var arrival_times = "arrival_times" in timetable_train ? timetable_train["arrival_times"] : departure_times;
                    
                    if (timetable_train["starting_station"] === train["starting_station"]) {
                        var last_stopped = null;
                        var last_stopped_time = null;
                        
                        for (cnt = 0; cnt < station_list.length; cnt++) {
                            if (departure_times[cnt] !== null) {
                                var departure_time = departure_times[cnt].slice(-5);
                                
                                if (departure_time >= hh_and_mm) {
                                    var arrival_time = arrival_times[cnt].slice(-5);
                                    
                                    if (arrival_time >= hh_and_mm && last_stopped !== null) {
                                        var train_position = calculate_train_position(line_id, minutes_now, last_stopped, cnt, hh_mm_to_minutes(last_stopped_time), hh_mm_to_minutes(arrival_time));
                                    } else {
                                        if ("double_station_spacing" in railroad_info["lines"][line_id] && railroad_info["lines"][line_id]["double_station_spacing"]) {
                                            var train_position = cnt * 2;
                                        } else {
                                            var train_position = cnt;
                                        }
                                    }
                                    
                                    train_type = timetable_train["train_type"];
                                    
                                    break for_3;
                                }
                                
                                last_stopped = cnt;
                                last_stopped_time = departure_time;
                            }
                        }
                    }
                }
            }
            
            if (train_type === null) {
                train_type = "＊＊＊";
                
                if (train_number.startsWith("_")) {
                    train_number = train_number.substring(1, train_number.lastIndexOf("__"));
                    
                    if (train_number in timetable["timetable"][line_id][train_direction]) {
                        train_type = timetable["timetable"][line_id][train_direction][train_number][0]["train_type"];
                    }
                }
                
                for (var cnt = 0; cnt < station_list.length; cnt++) {
                    if (station_list[cnt]["station_name"] === train["starting_station"]) {
                        var starting_station_index = cnt;
                    }
                    if (station_list[cnt]["station_name"] === train["terminal_station"]) {
                        var terminal_station_index = cnt;
                    }
                }
                
                var train_position = calculate_train_position(line_id, minutes_now, starting_station_index, terminal_station_index, hh_mm_to_minutes(train["first_departure_time"]), hh_mm_to_minutes(train["final_arrival_time"]));
            }
            
            if (train_position < 0 || train_position > line_rows_count) {
                break;
            }
            
            var formation_data = convert_formation_data(line_id, operation_list, is_inbound);
            
            var hidden_by_default = true;
            var default_icon = null;
            for (var operation_number of operation_list) {
                if (operation_number.startsWith("<=>")) {
                    operation_number = operation_number.substring(3);
                }
                
                if (!operation_number.includes("@")) {
                    var operations = operation_table["operations"];
                } else {
                    var at_pos = operation_number.indexOf("@");
                    
                    var operations = joined_operation_tables[operation_number.substring(at_pos + 1)]["operations"];
                    operation_number = operation_number.substring(0, at_pos);
                }
                
                default_icon = "default_icon" in operations[operation_number] ? operations[operation_number]["default_icon"] : null;
                
                if (!("hidden_by_default" in operations[operation_number] && operations[operation_number]["hidden_by_default"])) {
                    hidden_by_default = false;
                    break;
                }
            }
            
            if (!(hidden_by_default && formation_data["formation_text"] === "運休")) {
                line_positions[train_position].push({
                    railroad_id : formation_data["railroad_id"],
                    train_number : train_number,
                    train_type : train_type,
                    starting_station : train["starting_station"],
                    first_departure_time : train["first_departure_time"],
                    final_arrival_time : train["final_arrival_time"],
                    operation_numbers : train["operation_numbers"],
                    formation_text : formation_data["formation_text"],
                    reassigned : formation_data["reassigned"],
                    min_posts_count : formation_data["min_posts_count"],
                    variant_exists : formation_data["variant_exists"],
                    comment_exists : formation_data["comment_exists"],
                    from_beginner : formation_data["from_beginner"],
                    is_quotation : formation_data["is_quotation"],
                    time_formations_can_be_changed : formation_data["time_formations_can_be_changed"],
                    first_formation : formation_data["first_formation"],
                    default_icon : default_icon
                });
            }
            
            break;
        }
    }
    
    return line_positions;
}

function convert_formation_data (line_id, operation_list, is_inbound) {
    var railroad_id = null;
    var first_formation = null;
    var reassigned = false;
    var min_posts_count = null;
    var variant_exists = false;
    var comment_exists = false;
    var from_beginner = false;
    var is_quotation = false;
    var time_formations_can_be_changed = "99:99";
    
    if (operation_list !== null) {
        var formation_text = "";
        if (operation_data !== null) {
            for (var operation_number of operation_list) {
                if (operation_number.startsWith("<=>")) {
                    operation_number = operation_number.substring(3);
                    
                    var formation_reversed = true;
                } else {
                    var formation_reversed = false;
                }
                
                if (!operation_number.includes("@")) {
                    var data = operation_data["operations"];
                    var operations = operation_table["operations"];
                } else {
                    var at_pos = operation_number.indexOf("@");
                    railroad_id = operation_number.substring(at_pos + 1);
                    
                    operation_number = operation_number.substring(0, at_pos);
                    var data = joined_operation_data[railroad_id]["operations"];
                    var operations = joined_operation_tables[railroad_id]["operations"];
                }
                
                if (operation_number in data && data[operation_number] !== null) {
                    if (data[operation_number]["formations"] === "") {
                        continue;
                    }
                    
                    var operation_formation_list = data[operation_number]["formations"].split("+");
                    if (!formation_reversed) {
                        var operation_formation_data = data[operation_number]["formations"];
                    } else {
                        operation_formation_list.reverse();
                        var operation_formation_data = operation_formation_list.join("+");
                    }
                    
                    if (railroad_info["lines"][line_id]["inbound_forward_direction"] === is_inbound) {
                        if (formation_text.length === 0) {
                            first_formation = operation_formation_list[0];
                        } else {
                            formation_text += "+";
                        }
                        
                        formation_text += operation_formation_data;
                    } else {
                        if (formation_text.length === 0) {
                            first_formation = operation_formation_list[operation_formation_list.length - 1];
                        } else {
                            formation_text = "+" + formation_text;
                        }
                        
                        formation_text = operation_formation_data + formation_text;
                    }
                    
                    reassigned = reassigned || ("relieved_formations" in data[operation_number] && data[operation_number]["relieved_formations"].length >= 1);
                    min_posts_count = min_posts_count === null ? data[operation_number]["posts_count"] : Math.min(min_posts_count, data[operation_number]["posts_count"]);
                    variant_exists = variant_exists || ("variant_exists" in data[operation_number] && data[operation_number]["variant_exists"]);
                    comment_exists = comment_exists || ("comment_exists" in data[operation_number] && data[operation_number]["comment_exists"]);
                    from_beginner = from_beginner || ("from_beginner" in data[operation_number] && data[operation_number]["from_beginner"]);
                    is_quotation = is_quotation || ("is_quotation" in data[operation_number] && data[operation_number]["is_quotation"]);
                    
                    if ("times_formations_can_changed" in operations[operation_number] && operations[operation_number]["times_formations_can_changed"].length >= 1) {
                        if (data[operation_number]["confirmed_train_final_arrival_time"] !== null) {
                            for (var time_str of operations[operation_number]["times_formations_can_changed"]) {
                                if (time_str >= data[operation_number]["confirmed_train_final_arrival_time"]) {
                                    time_formations_can_be_changed = time_str;
                                    
                                    break;
                                }
                            }
                        } else {
                            time_formations_can_be_changed = operations[operation_number]["times_formations_can_changed"][0];
                        }
                    }
                } else {
                    if ("hidden_by_default" in operations[operation_number] && operations[operation_number]["hidden_by_default"]) {
                        continue;
                    }
                    
                    if (formation_text.length === 0) {
                        formation_text = "?";
                    } else if (railroad_info["lines"][line_id]["inbound_forward_direction"] === is_inbound) {
                        formation_text += "+?";
                    } else {
                        formation_text = "?+" + formation_text;
                    }
                }
            }
            
            if (formation_text.length === 0) {
                formation_text = "運休";
                first_formation = "";
            }
        }
    } else {
        var formation_text = "?";
    }
    
    return {
        railroad_id : railroad_id,
        formation_text : formation_text,
        reassigned : reassigned,
        min_posts_count : min_posts_count,
        variant_exists : variant_exists,
        comment_exists : comment_exists,
        from_beginner : from_beginner,
        is_quotation : is_quotation,
        time_formations_can_be_changed : time_formations_can_be_changed,
        first_formation : first_formation
    };
}


function get_train (line_id, is_inbound, train_number, starting_station) {
    if (is_inbound === null) { //v25.09-1以前の仕様で作成された時刻表データとの互換性維持
        is_inbound = train_number in timetable["timetable"][line_id]["inbound_trains"];
    }
    
    if (!(train_number in timetable["timetable"][line_id][is_inbound ? "inbound_trains" : "outbound_trains"])) {
        return null;
    }
    
    var train_data = { line_id : line_id, is_inbound : is_inbound, train_number : train_number };
    
    for (var train of timetable["timetable"][line_id][is_inbound ? "inbound_trains" : "outbound_trains"][train_number]) {
        if (train["starting_station"] === starting_station) {
            Object.assign(train_data, train);
            
            return train_data;
        }
    }
    
    return null;
}

function get_operations (line_id, train_number, starting_station, train_direction) {
    if (line_id in line_operations["lines"] && train_number in line_operations["lines"][line_id][train_direction]) {
        for (var train of line_operations["lines"][line_id][train_direction][train_number]) {
            if (train["starting_station"] === starting_station) {
                return [...train["operation_numbers"]];
            }
        }
    }
    
    if ("joined_railroads" in railroad_info) {
        for (railroad_id of railroad_info["joined_railroads"]) {
            if (railroad_id in joined_line_operations && line_id in joined_line_operations[railroad_id]["lines"] && train_number in joined_line_operations[railroad_id]["lines"][line_id][train_direction]) {
                for (var train of joined_line_operations[railroad_id]["lines"][line_id][train_direction][train_number]) {
                    if (train["starting_station"] === starting_station) {
                        return [...train["operation_numbers"]];
                    }
                }
            }
        }
    }
    
    return null;
}

function get_final_destination (line_id, is_inbound, train_number, starting_station, max_length = 10) {
    if (!train_number.startsWith("_")) {
        var next_trains = [{ line_id : line_id, direction : (is_inbound ? "inbound" : "outbound"), train_number : train_number, starting_station : starting_station }];
    } else {
        if (!(train_number in line_operations["lines"][line_id][(is_inbound ? "inbound" : "outbound") + "_trains"])) {
            return "";
        }
        
        var next_trains = [{ line_id : line_id, direction : (is_inbound ? "inbound" : "outbound"), train_number : train_number.substring(1, train_number.lastIndexOf("__")), starting_station : starting_station }];
    }
    
    var buf = "";
    
    for (var next_train of next_trains) {
        var train_data = get_train(next_train["line_id"], "direction" in next_train ? next_train["direction"] === "inbound" : null/*v25.09-1以前の仕様で作成された時刻表データとの互換性維持*/, next_train["train_number"], next_train["starting_station"]);
        
        if (train_data !== null) {
            if ("destination" in train_data) {
                buf += (buf.length >= 1 ? " / " : "") + escape_html(train_data["destination"]);
                
                if ("is_temporary_train" in train_data && train_data["is_temporary_train"]) {
                    buf += "方面";
                }
            } else if (train_data["next_trains"].length >= 1) {
                next_trains.push(...train_data["next_trains"]);
            } else {
                for (var last_stopped_index = train_data["departure_times"].length - 1; last_stopped_index >= 1; last_stopped_index--) {
                    if (train_data["departure_times"][last_stopped_index] !== null && !train_data["departure_times"][last_stopped_index].startsWith("|")) {
                        break;
                    }
                }
                
                var station_list = [...railroad_info["lines"][next_train["line_id"]]["stations"]];
                
                if (train_data["is_inbound"]) {
                    station_list.reverse();
                }
                
                buf += (buf.length >= 1 ? " / " : "") + escape_html(station_list[last_stopped_index]["station_name"]);
                
                if ("is_temporary_train" in train_data && train_data["is_temporary_train"]) {
                    buf += "方面";
                }
            }
        }
    }
    
    if (buf.length > max_length) {
        return buf.substring(0, max_length - 1) + "..";
    }
    
    return buf;
}


var position_time;
var position_last_updated = null;

var position_time_touch_start_y;
var position_time_touch_end_y;

function position_change_time (position_time_additions = null, multiply_step_value = false, draw_train_position_now = true) {
    if (position_time_additions === null) {
        position_time = Math.floor(Date.now() / 60000);
    } else if (position_time_additions !== 0) {
        position_time += multiply_step_value ? position_time_additions * config["position_mode_minute_step"] : position_time_additions;
        
        position_last_updated = null;
        position_reload_button_elm.style.display = "block";
    }
    
    var position_date_time = new Date(position_time * 60000);
    
    var hours = position_date_time.getHours();
    var minutes = ("0" + position_date_time.getMinutes()).slice(-2);
    var hh_and_mm_24 = ("0" + hours).slice(-2) + ":" + minutes;
    
    if (position_time_additions === null) {
        position_last_updated = hh_and_mm_24;
    }
    
    if (hours < 4) {
        hours += 24;
    }
    hours = ("0" + hours).slice(-2);
    
    var hh_and_mm = hours + ":" + minutes;
    
    document.getElementById("position_hours").innerHTML = Number(hours) + "<small>時</small>";
    document.getElementById("position_minutes").innerHTML = Number(minutes) + "<small>分</small>";
    
    position_time_button_elm.value = hh_and_mm_24;
    
    if (draw_train_position_now) {
        draw_train_position(hh_and_mm);
    }
}


function show_station_timetable (line_id, station_name, is_inbound = null) {
    if (popup_history.length >= 1) {
        popup_close(true);
    }
    
    if (!(line_id in railroad_info["lines"])) {
        mes("路線情報が利用できません", true);
        
        timetable_change_lines(null, true);
        
        return;
    }
    
    if (mode_val !== 1) {
        timetable_mode(false, false);
    }
    
    if (is_inbound !== null) {
        var radio_inbound_elm = document.getElementById("radio_inbound");
        var radio_outbound_elm = document.getElementById("radio_outbound");
        
        if (is_inbound) {
            radio_inbound_elm.checked = true;
            radio_outbound_elm.checked = false;
        } else {
            radio_inbound_elm.checked = false;
            radio_outbound_elm.checked = true;
        }
    }
    
    timetable_select_station(station_name, line_id, true);
}


var timetable_selected_line = null;
var timetable_promise;

var timetable_area_elm = document.getElementById("timetable_area");

var timetable_drop_down_status;
var timetable_wrapper_scroll_amount;

function timetable_mode (require_load_data = true, draw_station_list = true) {
    change_mode(1);
    
    timetable_drop_down_status = {};
    
    if (require_load_data) {
        var ts = get_timestamp();
        var date_string = get_date_string(ts);
        
        var resolved = false;
        timetable_promise = new Promise(function (resolve, reject) {
            get_diagram_id(date_string, "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : null, function (diagram_data) {
                if (diagram_data === null) {
                    return;
                }
                
                update_timetable_date(diagram_data["diagram_revision"], diagram_data["diagram_id"], date_string);
                
                load_data(resolve, function () {
                    if (!resolved) {
                        resolve();
                    } else if (timetable_selected_station !== null) {
                        timetable_select_station(timetable_selected_station);
                    }
                }, reject, diagram_data["diagram_revision"], diagram_data["diagram_id"], diagram_data["joined_railroad_diagram_ids"], date_string);
            });
        });
        
        timetable_promise.then(function () {
            resolved = true;
        });
        
        if (draw_station_list) {
            timetable_change_lines(null, true);
        }
    } else {
        timetable_promise = Promise.resolve();
        
        update_timetable_date(operation_table["diagram_revision"], operation_table["diagram_id"], operation_data !== null ? operation_data["operation_date"]: null);
    }
}

function update_timetable_date (diagram_revision, diagram_id, date_string) {
    var timetable_operation_name_elm = document.getElementById("timetable_operation_name");
    
    if (date_string !== null) {
        var now_ts = get_timestamp();
        
        if (date_string === get_date_string(now_ts)) {
            timetable_date = "__today__";
            
            timetable_operation_name_elm.innerHTML = "今日<small>(" + diagram_info[diagram_revision]["diagrams"][diagram_id]["diagram_name"] + ")</small>";
            
            return;
        } else if (date_string === get_date_string(now_ts + 86400)) {
            timetable_date = "__tomorrow__";
            
            timetable_operation_name_elm.innerHTML = "明日<small>(" + diagram_info[diagram_revision]["diagrams"][diagram_id]["diagram_name"] + ")</small>";
            
            return;
        }
    }
    
    timetable_date = diagram_id;
    
    timetable_operation_name_elm.innerHTML = diagram_info[diagram_revision]["diagrams"][diagram_id]["diagram_name"];
}

var timetable_selected_station = null;

function timetable_wrapper_onscroll () {
    if (timetable_selected_station !== null) {
        timetable_wrapper_scroll_amount = article_elms[1].scrollTop;
    }
}

function timetable_change_lines (line_id, force_station_select_mode = false) {
    if (line_id !== null) {
        if ("clockwise_is_inbound" in railroad_info["lines"][line_id] && railroad_info["lines"][line_id]["clockwise_is_inbound"] !== null) {
            var directions = railroad_info["lines"][line_id]["clockwise_is_inbound"] ? ["外回り<small>(右回り)</small>", "内回り<small>(左回り)</small>"] : ["内回り<small>(左回り)</small>", "外回り<small>(右回り)</small>"];
        } else {
            var directions = ["上り<small>(" + escape_html(railroad_info["lines"][line_id]["stations"][0]["station_name"]) + "方面)</small>", "下り<small>(" + escape_html(railroad_info["lines"][line_id]["stations"][railroad_info["lines"][line_id]["stations"].length - 1]["station_name"]) + "方面)</small>"];
        }
        
        document.getElementById("radio_inbound_label").innerHTML = directions[0];
        document.getElementById("radio_outbound_label").innerHTML = directions[1];
    }
    
    update_selected_line(line_id, false);
    
    if (force_station_select_mode || timetable_selected_station === null) {
        const KANA_ROWS_REGEXP = [/^[あ-お]/, /^[か-こが-ご]/, /^[さ-そざ-ぞ]/, /^[た-とだ-ど]/, /^[な-の]/, /^[は-ほば-ぼぱ-ぽ]/, /^[ま-も]/, /^[や-よ]/, /^[ら-ろ]/, /^[わ-を]/, /.*/];
        const KANA_ROWS = ["あ 行", "か 行", "さ 行", "た 行", "な 行", "は 行", "ま 行", "や 行", "ら 行", "わ 行", "その他"];
        
        timetable_wrapper_scroll_amount = 0;
        
        if (line_id === null) {
            change_title(railroad_info["railroad_name"] + "の駅別発着車両運用 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/timetable/");
            
            var lines = railroad_info["lines_order"];
        } else {
            change_title(railroad_info["lines"][line_id]["line_name"] + "の駅別発着車両運用 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/timetable/" + line_id + "/");
            
            var lines = [line_id];
        }
        
        timetable_selected_station = null;
        document.getElementById("timetable_back_button").style.display = "none";
        document.getElementById("direction_radio_area").style.display = "none";
        
        var station_indexes = {};
        for (var line of lines) {
            for (var cnt = 0; cnt < railroad_info["lines"][line]["stations"].length; cnt++) {
                if (("is_signal_station" in railroad_info["lines"][line]["stations"][cnt] && railroad_info["lines"][line]["stations"][cnt]["is_signal_station"]) || "canonical_station_name" in railroad_info["lines"][line]["stations"][cnt]) {
                    continue;
                }
                
                if (!(railroad_info["lines"][line]["stations"][cnt]["station_name_kana"] in station_indexes)) {
                    station_indexes[railroad_info["lines"][line]["stations"][cnt]["station_name_kana"]] = { line_id : line, index : cnt };
                }
            }
        }
        
        var buf = "";
        var kana_rows_cnt = -1;
        for (var station_name_kana of Object.keys(station_indexes).toSorted(new Intl.Collator("ja").compare)) {
            for (var cnt = Math.max(kana_rows_cnt, 0); !KANA_ROWS_REGEXP[cnt].test(station_name_kana); cnt++) {}
            if (cnt > kana_rows_cnt) {
                buf += (kana_rows_cnt >= 0 ? "</div>" : "") + "<input type='checkbox' id='timetable_kana_rows_" + cnt + "'><label for='timetable_kana_rows_" + cnt + "' class='drop_down'>" + KANA_ROWS[cnt] + "の駅</label><div>";
                kana_rows_cnt = cnt;
            }
            
            var station_name = railroad_info["lines"][station_indexes[station_name_kana]["line_id"]]["stations"][station_indexes[station_name_kana]["index"]]["station_name"];
            buf += "<a href='/railroad_" + railroad_info["railroad_id"] + "/timetable/" + station_indexes[station_name_kana]["line_id"] + "/" + encodeURIComponent(station_name) + "/' onclick='event.preventDefault(); timetable_select_station(\"" + station_name + "\", \"" + station_indexes[station_name_kana]["line_id"] + "\");'><b>" + escape_html(station_name) + "</b> <small>(" + station_name_kana + ")</small></a>";
        }
        buf += "</div>";
        
        timetable_area_elm.innerHTML = buf;
    } else if (line_id !== null && timetable_selected_station !== null) {
        timetable_select_station(timetable_selected_station);
    }
}

function timetable_select_station (station_name, line_id = null, reset_scroll_amount = false) {
    timetable_selected_station = station_name;
    
    if (reset_scroll_amount) {
        timetable_wrapper_scroll_amount = 0;
    }
    
    if (line_id !== null && line_id !== timetable_selected_line) {
        timetable_selected_line = line_id;
        
        timetable_change_lines(line_id);
        
        return;
    } else if (timetable_selected_line === null) {
        return;
    }
    
    change_title(station_name + "駅(" + railroad_info["lines"][timetable_selected_line]["line_name"] + ")発着列車の充当車両 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/timetable/" + timetable_selected_line + "/" + encodeURIComponent(station_name) + "/");
    
    document.getElementById("timetable_back_button").style.display = "block";
    document.getElementById("direction_radio_area").style.display = "block";
    
    document.getElementById("timetable_station_name").innerHTML = "<h2>" + escape_html(station_name) + "</h2>";
    timetable_area_elm.innerHTML = "";
    
    timetable_promise.then(function () {
        draw_station_timetable(station_name);
    }, function () {
        timetable_area_elm.innerHTML = "<div class='no_data'>表示に必要なデータが利用できません</div>";
    });
}

function get_station_trains_info (line_id, station_index, train_direction) {
    if (train_direction === "inbound_trains") {
        station_index = railroad_info["lines"][line_id]["stations"].length - 1 - station_index;
    }
    
    var trains_info = {};
    for (var train_number of Object.keys(timetable["timetable"][line_id][train_direction])) {
        for (var train of timetable["timetable"][line_id][train_direction][train_number]) {
            var departure_time = train["departure_times"][station_index];
            
            if (departure_time === null || departure_time.startsWith("|")) {
                continue;
            }
            
            var is_deadhead_train = (railroad_info["deadhead_train_number_regexp"].test(train_number) || train["train_type"] === "回送") ? true : false;
            
            var is_terminal_station = true;
            
            for (var cnt = station_index + 1; cnt < train["departure_times"].length; cnt++) {
                if (train["departure_times"][cnt] !== null) {
                    is_terminal_station = false;
                    break;
                }
            }
            
            if (is_terminal_station) {
                for (var next_train of train["next_trains"]) {
                    if (next_train["line_id"] === line_id) {
                        is_terminal_station = false;
                        break;
                    }
                }
            }
            
            if (!config["show_deadhead_trains_on_timetable"] && (is_deadhead_train || is_terminal_station)) {
                continue;
            }
            
            if (train["previous_trains"].length == 0) {
                var is_starting_station = true;
                
                for (var cnt = 0; cnt < station_index; cnt++) {
                    if (train["departure_times"][cnt] !== null) {
                        is_starting_station = false;
                        break;
                    }
                }
            } else {
                var is_starting_station = false;
            }
            
            if (config["show_starting_trains_only_on_timetable"] && !is_starting_station) {
                continue;
            }
            
            hh_and_mm = departure_time.split(":");
            
            if (!(hh_and_mm[0] in trains_info)) {
                trains_info[hh_and_mm[0]] = {};
            }
            if (!(hh_and_mm[1] in trains_info[hh_and_mm[0]])) {
                trains_info[hh_and_mm[0]][hh_and_mm[1]] = [];
            }
            
            trains_info[hh_and_mm[0]][hh_and_mm[1]].push({
                train_number : train_number,
                starting_station : train["starting_station"],
                train_type : train["train_type"],
                is_starting_station : is_starting_station,
                is_terminal_station : is_terminal_station,
                is_deadhead_train :  is_deadhead_train,
                is_temporary_train : ("is_temporary_train" in train ? train["is_temporary_train"] : false)
            });
        }
    }
    
    return trains_info;
}

function draw_station_timetable (station_name) {
    for (var station_index = 0; station_index < railroad_info["lines"][timetable_selected_line]["stations"].length; station_index++) {
        if (railroad_info["lines"][timetable_selected_line]["stations"][station_index]["station_name"] === station_name) {
            break;
        }
    }
    
    if (station_index >= railroad_info["lines"][timetable_selected_line]["stations"].length) {
        mes("存在しない駅名です", true);
        
        timetable_change_lines(timetable_selected_line, true);
        
        return;
    }
    
    if (document.getElementById("radio_inbound").checked) {
        var train_direction = "inbound_trains";
        var is_inbound = true;
    } else {
        var train_direction = "outbound_trains";
        var is_inbound = false;
    }
    
    var trains_info = get_station_trains_info(timetable_selected_line, station_index, train_direction);
    
    if ("station_name_alias" in railroad_info["lines"][timetable_selected_line]["stations"][station_index]) {
        var station_name_alias = railroad_info["lines"][timetable_selected_line]["stations"][station_index]["station_name_alias"];
        
        for (var station_index_2 = 0; station_index_2 < railroad_info["lines"][timetable_selected_line]["stations"].length; station_index_2++) {
            if (railroad_info["lines"][timetable_selected_line]["stations"][station_index_2]["station_name"] === station_name_alias) {
                break;
            }
        }
        
        var trains_info_2 = get_station_trains_info(timetable_selected_line, station_index_2, train_direction);
        
        for (var hh of Object.keys(trains_info_2)) {
            if (hh in trains_info) {
                Object.assign(trains_info[hh], trains_info_2[hh]);
            } else {
                trains_info[hh] = trains_info_2[hh];
            }
        }
    }
    
    var previous_station = timetable_get_neighboring_station(timetable_selected_line, station_name, -1);
    var next_station = timetable_get_neighboring_station(timetable_selected_line, station_name, 1);
    
    document.getElementById("timetable_station_name").innerHTML = "<a href='/railroad_" + railroad_info["railroad_id"] + "/timetable/" + timetable_selected_line + "/" + encodeURIComponent(previous_station) + "/' class='previous_button' onclick='event.preventDefault(); timetable_select_station(\"" + previous_station + "\", null, true);'>" + escape_html(previous_station) + "</a><h2>" + escape_html(station_name) + "</h2><a href='/railroad_" + railroad_info["railroad_id"] + "/timetable/" + timetable_selected_line + "/" + encodeURIComponent(next_station) + "/' class='next_button' onclick='event.preventDefault(); timetable_select_station(\"" + next_station + "\", null, true);'>" + escape_html(next_station) + "</a>";
    
    document.getElementById("show_deadhead_trains_check").checked = config["show_deadhead_trains_on_timetable"];
    document.getElementById("show_starting_trains_only_check").checked = config["show_starting_trains_only_on_timetable"];
    
    if (timetable_date === "__today__" || timetable_date === "__tomorrow__") {
        var show_operation_data = true;
        
        if (timetable_date === "__today__") {
            var is_today = true;
            
            var now_hh_mm = get_hh_mm();
            var now_hh = now_hh_mm.substring(0, 2);
        } else {
            var is_today = false;
        }
    } else {
        var show_operation_data = false;
        var is_today = false;
    }
    
    var bg_color = diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["main_color"];
    var bg_color_hsl = rgb2hsl(bg_color);
    
    if (config["dark_mode"]) {
        bg_color = convert_color_dark_mode(bg_color);
        var bg_color_past = "hsl(" + bg_color_hsl[0] + "deg " + Math.round(bg_color_hsl[1] / 4 / 2.55) + "% " + Math.round(Math.min(255 - bg_color_hsl[2] + 32, 127) / 2.55) + "%)";
        
        var color_style = "";
    } else {
        var bg_color_past = "hsl(" + bg_color_hsl[0] + "deg " + Math.round(bg_color_hsl[1] / 2.55) + "% " + Math.round(bg_color_hsl[2] / 1.5 / 2.55 + 33.3) + "%)";
        
        var color_style = " color: #444444;";
    }
    
    var buf = "";
    for (var hh of Object.keys(trains_info).toSorted()) {
        var buf_2 = "";
        for (var mm of Object.keys(trains_info[hh]).toSorted()) {
            for (var train_info of trains_info[hh][mm]) {
                var train_operations = get_operations(timetable_selected_line, train_info["train_number"], train_info["starting_station"], train_direction);
                
                if (train_operations === null && train_info["is_temporary_train"]) {
                    continue;
                }
                
                buf_2 += "<div onclick='train_detail(\"" + timetable_selected_line + "\", \"" + train_info["train_number"] + "\", \"" + train_info["starting_station"] + "\", \"" + train_direction + "\", " + show_operation_data + ");' class='timetable_train" + (is_today && hh + ":" + mm < now_hh_mm ? " after_operation" : "") + "'>";
                
                var default_icon = null;
                if (train_operations !== null) {
                    var operation_number = train_operations[0].startsWith("<=>") ? train_operations[0].substring(3) : train_operations[0];
                    
                    if (!operation_number.includes("@")) {
                        var first_formation_railroad_id = null;
                        
                        if ("default_icon" in operation_table["operations"][operation_number]) {
                            default_icon = operation_table["operations"][operation_number]["default_icon"];
                        }
                    } else {
                        var operation_info = operation_number.split("@");
                        var first_formation_railroad_id = operation_info[1];
                        
                        if ("default_icon" in joined_operation_tables[first_formation_railroad_id]["operations"][operation_info[0]]) {
                            default_icon = joined_operation_tables[first_formation_railroad_id]["operations"][operation_info[0]]["default_icon"];
                        }
                    }
                }
                
                var icon_style = train_info["is_deadhead_train"] ? " style='opacity: 0.5;'" : "";
                if (show_operation_data && train_operations !== null) {
                    var formation_data = convert_formation_data(timetable_selected_line, train_operations, is_inbound);
                    
                    buf_2 += "<img src='" + get_icon(formation_data["first_formation"], formation_data["railroad_id"], default_icon) + "' alt='' class='train_icon'" + icon_style + ">";
                } else {
                    buf_2 += "<img src='" + (default_icon === null ? UNYOHUB_GENERIC_TRAIN_ICON : get_icon_base64(default_icon, first_formation_railroad_id)) + "' alt='' class='train_icon'" + icon_style + ">";
                }
                
                buf_2 += "<span style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_info["train_number"], train_info["train_type"])) : get_train_color(train_info["train_number"], train_info["train_type"])) + ";'><b>" + Number(mm);
                
                if (train_info["is_starting_station"]) {
                    buf_2 += "<small>(始)</small>";
                } else if (train_info["is_terminal_station"]) {
                    buf_2 += "(着)";
                }
                
                buf_2 += "</b>" + escape_html(train_info["train_type"]) + "</span>　";
                
                buf_2 += get_final_destination(timetable_selected_line, is_inbound, train_info["train_number"], train_info["starting_station"]);
                
                if (railroad_info["lines"][timetable_selected_line]["inbound_forward_direction"] === is_inbound) {
                    var direction_sign_left = "<span class='direction_sign'>◀</span> ";
                    var direction_sign_right = "";
                } else {
                    var direction_sign_left = "";
                    var direction_sign_right = " <span class='direction_sign'>▶</span>";
                }
                
                if (show_operation_data) {
                    buf_2 += "　<small>";
                    if (train_operations !== null) {
                        var car_count = 0;
                        for (var train_operation of train_operations) {
                            if (train_operation.startsWith("<=>")) {
                                train_operation = train_operation.substring(3);
                            }
                            
                            if (!train_operation.includes("@")) {
                                car_count += operation_table["operations"][train_operation]["car_count"];
                            } else {
                                var operation_number_and_railroad_id = train_operation.split("@");
                                
                                car_count += joined_operation_tables[operation_number_and_railroad_id[1]]["operations"][operation_number_and_railroad_id[0]]["car_count"];
                            }
                        }
                        
                        buf_2 += "(所定" + car_count + "両)";
                    } else {
                        buf_2 += "(不明な運用)";
                    }
                    buf_2 += "</small><br>";
                    
                    if (train_operations !== null) {
                        if (formation_data["comment_exists"]) {
                            formation_data["formation_text"] += "*";
                        }
                        
                        buf_2 += direction_sign_left;
                        if (formation_data["reassigned"]) {
                            buf_2 += "<span style='color: " + (!config["dark_mode"] ? "#cc0000" : "#ff9999") + ";'>" + escape_html(formation_data["formation_text"]) + "</span>";
                        } else if (formation_data["is_quotation"]) {
                            buf_2 += "<span style='color: " + (!config["dark_mode"] ? "#9966ff" : "#cc99ff") + ";'>" + escape_html(formation_data["formation_text"]) + "</span>";
                        } else if (formation_data["min_posts_count"] === 0 || hh + ":" + mm >= formation_data["time_formations_can_be_changed"]) {
                            buf_2 += "<span style='color: " + (!config["dark_mode"] ? "#0099cc" : "#33ccff") + ";'>" + escape_html(formation_data["formation_text"]) + "</span>";
                        } else if (config["colorize_corrected_posts"] && formation_data["variant_exists"]) {
                            buf_2 += "<span style='color: " + (!config["dark_mode"] ? "#ee7700" : "#ffcc99") + ";'>" + escape_html(formation_data["formation_text"]) + "</span>";
                        } else if (config["colorize_beginners_posts"] && formation_data["from_beginner"]) {
                            buf_2 += "<span style='color: #33cc99;'>" + escape_html(formation_data["formation_text"]) + "</span>";
                        } else {
                            buf_2 += escape_html(formation_data["formation_text"]);
                        }
                        buf_2 += direction_sign_right;
                    }
                } else if (train_operations !== null) {
                    buf_2 += "<br>";
                    
                    if (railroad_info["lines"][timetable_selected_line]["inbound_forward_direction"] !== is_inbound) {
                        train_operations.reverse();
                    }
                    
                    buf_2 += direction_sign_left;
                    for (var cnt = 0; cnt < train_operations.length; cnt++) {
                        var operation_number = train_operations[cnt].startsWith("<=>") ? train_operations[cnt].substring(3) : train_operations[cnt];
                        
                        if (!train_operations[cnt].includes("@")) {
                            buf_2 += (cnt >= 1 ? "+" : "") + train_operations[cnt] + "運用<small>(" + operation_table["operations"][operation_number]["operation_group_name"] + " " + operation_table["operations"][operation_number]["car_count"] + "両)</small>";
                        } else {
                            var operation_number_and_railroad_id = operation_number.split("@");
                            
                            buf_2 += (cnt >= 1 ? "+" : "") + operation_number_and_railroad_id[0] + "運用<small>(" + joined_operation_tables[operation_number_and_railroad_id[1]]["operations"][operation_number_and_railroad_id[0]]["operation_group_name"] + " " + joined_operation_tables[operation_number_and_railroad_id[1]]["operations"][operation_number_and_railroad_id[0]]["car_count"] + "両)</small>";
                        }
                    }
                    buf_2 += direction_sign_right;
                } else {
                    buf_2 += "<br>不明な運用";
                }
                
                buf_2 += "</div>";
            }
        }
        
        if (buf_2.length >= 1) {
            var checkbox_id = "timetable_hour_" + hh;
            buf += "<input type='checkbox' id='" + checkbox_id + "'" + (checkbox_id in timetable_drop_down_status && timetable_drop_down_status[checkbox_id] ? " checked='checked'" : "") + " onclick='update_timetable_drop_down_status(this);'><label for='" + checkbox_id + "' style='background-color: " + (is_today && hh < now_hh ? bg_color_past : bg_color) + ";" + color_style + "' class='drop_down'>" + Number(hh) + "時</label><div>" + buf_2 + "</div>";
        }
    }
    
    if (buf.length !== 0) {
        timetable_area_elm.innerHTML = buf + "<a href='#about_railroad_data_popup' class='bottom_link' onclick='event.preventDefault(); about_railroad_data();'>使用しているデータについて</a>";
    } else {
        timetable_area_elm.innerHTML = "<div class='no_data'>条件に合う列車は登録されていません</div>";
    }
    
    article_elms[1].scrollTop = timetable_wrapper_scroll_amount;
}

function timetable_get_neighboring_station (line_id, station_name, move_count) {
    var station_list = railroad_info["lines"][line_id]["stations"];
    
    for (var cnt = 0; cnt < station_list.length; cnt++) {
        if (station_list[cnt]["station_name"] === station_name) {
            break;
        }
    }
    
    var station_index = cnt + move_count;
    
    while (true) {
        if (station_index < 0) {
            station_index = station_list.length - 1;
        } else if (station_index > station_list.length - 1) {
            station_index = 0;
        }
        
        if (!(("is_signal_station" in station_list[station_index] && station_list[station_index]["is_signal_station"]) || "canonical_station_name" in station_list[station_index])) {
            break;
        }
        
        if (move_count > 0) {
            station_index++;
        } else {
            station_index--;
        }
    }
    
    return station_list[station_index]["station_name"];
}


var operation_number_order = null;

var operation_data_heading_elm = document.getElementById("operation_data_heading");
var operation_data_area_elm = document.getElementById("operation_data_area");
var operation_date_button_elm = document.getElementById("operation_date_button");

var operation_all_data_loaded = false;

var operation_data_active_tab = null;

function operation_data_mode (operation_date = null) {
    change_title(railroad_info["railroad_name"] + "の運用履歴データ | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/operation_data/");
    
    change_mode(2);
    
    operation_date_button_elm.max = get_date_string(get_timestamp() + (86400 * instance_info["available_days_ahead"]));
    
    operation_data_active_tab = null;
    
    if (operation_date !== null && !(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(operation_date))) {
        mes("日付の指定が異常です", true);
        
        operation_date = null;
    }
    
    operation_data_change_date(operation_date);
}

function operation_data_change_date (date_additions, callback_func = null) {
    var error_occurred = false;
    
    var ts = get_timestamp();
    
    if (date_additions === null) {
        var operation_data_date = ts;
    } else if (typeof date_additions === "string") {
        var dt = new Date(date_additions + " 04:00:00");
        var operation_data_date = Math.floor(dt.getTime() / 1000);
    } else {
        var dt = new Date(operation_data["operation_date"] + " 04:00:00");
        var operation_data_date = Math.floor(dt.getTime() / 1000) + (date_additions * 86400);
    }
    
    if (operation_data_date > ts + (86400 * instance_info["available_days_ahead"])) {
        operation_data_date = ts + (86400 * instance_info["available_days_ahead"]);
        
        mes((instance_info["available_days_ahead"] + 1) + "日以上先の運用情報は表示できません");
        
        error_occurred = true;
    }
    
    operation_data_heading_elm.innerText = "";
    operation_data_area_elm.innerHTML = "";
    
    if (use_group_divisions_on_operation_data) {
        document.getElementById("use_group_divisions_radio").checked = true;
    } else {
        document.getElementById("not_use_group_divisions_radio").checked = true;
    }
    
    var date_string = get_date_string(operation_data_date);
    operation_date_button_elm.value = date_string;
    
    if (date_string === get_date_string(ts)) {
        history.replaceState(null, "", "/railroad_" + railroad_info["railroad_id"] + "/operation_data/");
    } else {
        history.replaceState(null, "", "/railroad_" + railroad_info["railroad_id"] + "/operation_data/?date=" + date_string);
    }
    
    operation_all_data_loaded = false;
    
    get_diagram_id(date_string, null, function (diagram_data) {
        if (diagram_data === null) {
            operation_data_area_elm.innerHTML = "<div class='no_data'>指定された日付のデータは利用できません</div>";
            
            if (typeof callback_func === "function") {
                callback_func(false);
            }
            
            return;
        }
        
        document.getElementById("operation_data_date").innerHTML = date_string.substring(0, 4) + "<small>年</small> " + Number(date_string.substring(5, 7)) + "<small>月</small> " + Number(date_string.substring(8)) + "<small>日</small>";
        
        load_data(function () {
            operation_all_data_loaded = true;
            
            operation_data_draw();
            
            if (typeof callback_func === "function") {
                callback_func(!error_occurred);
            }
        }, null, function () {
            operation_data_area_elm.innerHTML = "<div class='no_data'>表示に必要なデータが利用できません</div>";
            
            if (typeof callback_func === "function") {
                callback_func(false);
            }
        }, diagram_data["diagram_revision"], diagram_data["diagram_id"], null, date_string);
    });
    
}

function sort_station_names (station_names) {
    var station_names_sorted = [];
    var station_names_tmp = {};
    var station_names_tmp_keys = [];
    var station_names_tmp_2 = [];
    
    for_1: for (var station_name of station_names) {
        for (var cnt_2 = 0; cnt_2 < railroad_info["lines_order"].length; cnt_2++) {
            var station_list = railroad_info["lines"][railroad_info["lines_order"][cnt_2]]["stations"];
            
            for (var cnt_3 = 0; cnt_3 < station_list.length; cnt_3++) {
                if (station_list[cnt_3]["station_name"] === station_name) {
                    var station_names_tmp_key = ("00" + cnt_2).slice(-3) + "-" + ("00" + cnt_3).slice(-3);
                    
                    station_names_tmp[station_names_tmp_key] = station_name;
                    station_names_tmp_keys.push(station_names_tmp_key);
                    
                    continue for_1;
                }
            }
        }
        
        station_names_tmp_2.push(station_name);
    }
    
    for (var station_name_tmp of station_names_tmp_keys.toSorted()) {
        station_names_sorted.push(station_names_tmp[station_name_tmp]);
    }
    
    station_names_sorted.push(...station_names_tmp_2);
    
    return station_names_sorted;
}

function get_operation_data_cell_html (operation_number, tag_name, days_before, now_str, highlighted_formation = null, additional_text = null) {
    var default_icon = "default_icon" in operation_table["operations"][operation_number] ? operation_table["operations"][operation_number]["default_icon"] : null;
    
    if (days_before >= 1 || (days_before === 0 && (operation_table["operations"][operation_number]["starting_time"] === null || operation_table["operations"][operation_number]["ending_time"] < now_str))) {
        var buf = "<" + tag_name + " class='after_operation'";
    } else if (days_before <= -1 || operation_table["operations"][operation_number]["starting_time"] > now_str) {
        var buf = "<" + tag_name + " class='before_operation'";
    } else {
        var buf = "<" + tag_name;
        
        if ("temporary_garaged_times" in operation_table["operations"][operation_number]) {
            for (var temporary_garaged_time of operation_table["operations"][operation_number]["temporary_garaged_times"]) {
                if (temporary_garaged_time[0] <= now_str && temporary_garaged_time[1] > now_str) {
                    buf += " class='temporary_garaged'";
                    
                    break;
                }
            }
        }
    }
    
    if (operation_number in operation_data["operations"] && operation_data["operations"][operation_number] !== null) {
        if ("relieved_formations" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["relieved_formations"].length >= 1) {
            buf += " style='color: " + (!config["dark_mode"] ? "#cc0000" : "#ff9999") + ";'>";
        } else if ("is_quotation" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["is_quotation"]) {
            buf += " style='color: " + (!config["dark_mode"] ? "#9966ff" : "#cc99ff") + ";'>";
        } else {
            var time_formations_can_be_changed = null;
            if ("times_formations_can_changed" in operation_table["operations"][operation_number] && operation_table["operations"][operation_number]["times_formations_can_changed"].length >= 1) {
                if (operation_data["operations"][operation_number]["confirmed_train_final_arrival_time"] !== null) {
                    for (var time_str of operation_table["operations"][operation_number]["times_formations_can_changed"]) {
                        if (time_str >= operation_data["operations"][operation_number]["confirmed_train_final_arrival_time"]) {
                            time_formations_can_be_changed = time_str;
                        } else {
                            break;
                        }
                    }
                } else {
                    time_formations_can_be_changed = operation_table["operations"][operation_number]["times_formations_can_changed"][0];
                }
            }
            
            if (days_before >= 1) {
                now_str = "99:99";
            } else if (days_before <= -1) {
                now_str = "00:00";
            }
            
            if (operation_data["operations"][operation_number]["posts_count"] === 0 || (time_formations_can_be_changed !== null && now_str >= time_formations_can_be_changed)) {
                buf += " style='color: " + (!config["dark_mode"] ? "#0099cc" : "#33ccff") + ";'>";
            } else if (config["colorize_corrected_posts"] && "variant_exists" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["variant_exists"]) {
                buf += " style='color: " + (!config["dark_mode"] ? "#ee7700" : "#ffcc99") + ";'>";
            } else if (config["colorize_beginners_posts"] && "from_beginner" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["from_beginner"]) {
                buf += " style='color: #33cc99;'>";
            } else {
                buf += ">";
            }
        }
        
        var assigned_formations = [operation_data["operations"][operation_number]["formations"]];
        
        if ("relieved_formations" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["relieved_formations"].length >= 1) {
            assigned_formations = operation_data["operations"][operation_number]["relieved_formations"].concat(assigned_formations);
        }
        
        var formation_list = null;
        for (var cnt = 0; cnt < assigned_formations.length; cnt++) {
            buf += "<div" + (cnt + 1 < assigned_formations.length ? " class='relieved_formations'" : "") + ">";
            
            if (cnt >= 1) {
                buf += "→ ";
            }
            
            if (assigned_formations[cnt] !== "") {
                formation_list = assigned_formations[cnt].split("+");
                
                for (var cnt_2 = 0; cnt_2 < formation_list.length; cnt_2++) {
                    if (highlighted_formation === null) {
                        buf += (cnt_2 >= 1 ? " <wbr>+" : "") + "<img src='" + get_icon(formation_list[cnt_2], null, default_icon) + "' alt='' class='train_icon'>" + formation_list[cnt_2];
                    } else if (formation_list[cnt_2] === highlighted_formation || (highlighted_formation in formations["series"] && formation_list[cnt_2].startsWith(highlighted_formation))) {
                        buf += (cnt_2 >= 1 ? " <wbr>+ " : "") + "<b>" + formation_list[cnt_2] + "</b>";
                    } else {
                        buf += (cnt_2 >= 1 ? " <wbr>+ " : "") + formation_list[cnt_2];
                    }
                }
            } else {
                formation_list = null;
                
                buf += (highlighted_formation === null ? "<img src='" + UNYOHUB_CANCELED_TRAIN_ICON + "' alt='' class='train_icon'>" : "") + "運休";
            }
            
            if (cnt + 1 === assigned_formations.length) {
                if ("comment_exists" in operation_data["operations"][operation_number] && operation_data["operations"][operation_number]["comment_exists"]) {
                    buf += "*";
                }
                
                if (additional_text !== null) {
                    buf += "<wbr> <small>" + additional_text + "</small>";
                }
            }
            
            buf += "</div>";
        }
        
        if (config["show_formation_captions_on_operation_data"] && formation_list !== null) {
            for (var formation_name of formation_list) {
                var overview = get_formation_overview(formation_name);
                
                if (overview["caption"].length >= 1) {
                    buf += "<div class='operation_data_formation_caption'>" + escape_html((formation_list.length >= 2 ? formation_name + " : " : "") + overview["caption"]) + "</div>";
                }
            }
        }
    } else {
        buf += "><div>" + (highlighted_formation === null ? "<img src='" + (default_icon === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(default_icon)) + "' alt='' class='train_icon'>" : "") + "?" + (additional_text !== null ? "<wbr> <small>" + additional_text + "</small>" : "") + "</div>";
    }
    
    buf += "</" + tag_name + ">";
    
    return buf;
}

function operation_data_draw (reset_active_tab = false) {
    if (!operation_all_data_loaded) {
        return;
    }
    
    if (reset_active_tab) {
        operation_data_active_tab = null;
    }
    
    var bg_color = diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["main_color"];
    
    if (config["dark_mode"]) {
        operation_data_heading_elm.style.borderColor = convert_color_dark_mode(bg_color);
    } else {
        operation_data_heading_elm.style.borderColor = bg_color;
    }
    
    var buf_h2 = diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["diagram_name"] + " ";
    
    var today_ts = get_timestamp();
    var now_str = get_hh_mm(today_ts);
    var dt = new Date(operation_data["operation_date"] + " 04:00:00");
    var operation_data_date = Math.floor(dt.getTime() / 1000);
    var days_before = Math.floor((today_ts - operation_data_date) / 86400);
    
    var show_write_operation_data_button = "true";
    if (days_before >= 1) {
        if (days_before === 1) {
            buf_h2 += "(昨日)";
        } else {
            if (user_info === null || !user_info["is_control_panel_user"]) {
                show_write_operation_data_button = "false";
            }
            
            if (days_before === 2) {
                buf_h2 += "(一昨日)";
            } else {
                buf_h2 += "(" + days_before + "日前)";
            }
        }
    } else if (days_before === 0) {
        buf_h2 += "(今日)";
    } else if (days_before === -1) {
        buf_h2 += "(明日)";
    } else if (days_before === -2) {
        buf_h2 += "(明後日)";
    } else {
        buf_h2 += "(" + Math.abs(days_before) + "日後)";
    }
    
    operation_data_heading_elm.innerText = buf_h2;
    
    if (!document.getElementById("radio_operation_groups").checked) {
        var operation_numbers = [];
        for (var operation_group_name of operation_table["operation_group_names"]) {
            operation_numbers.push(...operation_table["operation_groups"][operation_group_name]["operation_numbers"]);
        }
    }
    
    operation_number_order = [];
    
    var buf = ("joined_railroads" in railroad_info && railroad_info["joined_railroads"].length >= 1) ? "<u class='railroad_select_link' onclick='select_joined_railroads(\"" + operation_data["operation_date"] + "\");'>直通先路線系統のデータ</u>" : "";
    
    if (!document.getElementById("radio_formations").checked) {
        if (document.getElementById("radio_operation_groups").checked) {
            var sorting_criteria = "operation_groups";
            
            var groups = operation_table["operation_groups"];
            
            if (use_group_divisions_on_operation_data && "group_division_names" in operation_table) {
                var divisions = [];
                buf += "<div class='inner_tab_area'>";
                
                for (var group_division_name of operation_table["group_division_names"]) {
                    divisions.push({ "division_name" : group_division_name, "group_names" : operation_table["group_divisions"][group_division_name]["operation_group_names"] });
                    
                    if (operation_data_active_tab === null) {
                        operation_data_active_tab = group_division_name;
                    }
                    
                    buf += "<button type='button'" + (group_division_name === operation_data_active_tab ? " class='active_tab'" : "") + " id='operation_data_division_tab_" + group_division_name + "' onclick='activate_operation_data_tab(\"" + add_slashes(group_division_name) + "\");'>" + escape_html(group_division_name) + "</a>";
                }
                
                buf += "</div>";
            } else {
                var divisions = [{ "division_name" : null, "group_names" : operation_table["operation_group_names"] }];
            }
        } else {
            if (document.getElementById("radio_starting_location").checked) {
                var sorting_criteria = "starting_location";
            } else {
                var sorting_criteria = "terminal_location";
                
                var formations_last_assigned = {};
                var reoperated_operation_numbers = new Set();
            }
            
            var operations_list = {};
            var locations = [];
            
            for (var operation_number of operation_numbers) {
                if (!locations.includes(operation_table["operations"][operation_number][sorting_criteria])) {
                    locations.push(operation_table["operations"][operation_number][sorting_criteria]);
                    operations_list[operation_table["operations"][operation_number][sorting_criteria]] = [];
                }
                
                operations_list[operation_table["operations"][operation_number][sorting_criteria]].push(operation_number);
                
                if (sorting_criteria === "terminal_location" && operation_number in operation_data["operations"] && operation_data["operations"][operation_number] !== null) {
                    var assigned_formations = operation_data["operations"][operation_number]["formations"].split("+");
                    
                    for (var assigned_formation of assigned_formations) {
                        if (assigned_formation in formations["formations"]) {
                            if (assigned_formation in formations_last_assigned) {
                                if (operation_table["operations"][operation_number]["ending_time"] > operation_table["operations"][formations_last_assigned[assigned_formation]]["ending_time"]) {
                                    reoperated_operation_numbers.add(formations_last_assigned[assigned_formation]);
                                    
                                    formations_last_assigned[assigned_formation] = operation_number;
                                } else {
                                    reoperated_operation_numbers.add(operation_number);
                                }
                            } else {
                                formations_last_assigned[assigned_formation] = operation_number;
                            }
                        }
                    }
                }
            }
            
            var groups = {};
            var group_names = [];
            for (var location of sort_station_names(locations)) {
                groups[location] = { operation_numbers: operations_list[location] };
                group_names.push(location);
            }
            
            var divisions = [{ "division_name" : null, "group_names" : group_names }];
        }
        
        for (var division_info of divisions) {
            var buf_2 = "";
            for (var group_name of division_info["group_names"]) {
                buf_2 += "<h3>" + escape_html(group_name) + "</h3>";
                
                buf_2 += "<table>";
                for (var operation_number of groups[group_name]["operation_numbers"]) {
                    buf_2 += "<tr onclick='operation_detail(" + operation_number_order.length + ", " + operation_data_date + ", " + show_write_operation_data_button + ");'><th style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(operation_table["operations"][operation_number]["main_color"]) : operation_table["operations"][operation_number]["main_color"]) + ";'>";
                    if (sorting_criteria === "starting_location" && operation_table["operations"][operation_number]["starting_track"] !== null) {
                        buf_2 += "<small>" + operation_table["operations"][operation_number]["starting_track"] + "停泊</small><br>";
                    } else if (sorting_criteria === "terminal_location" && operation_table["operations"][operation_number]["terminal_track"] !== null) {
                        buf_2 += "<small>" + operation_table["operations"][operation_number]["terminal_track"] + "停泊</small><br>";
                    }
                    buf_2 += "<u>" + operation_number + "</u><small>(" + operation_table["operations"][operation_number]["car_count"] + ")</small>";
                    if (sorting_criteria === "starting_location" && operation_table["operations"][operation_number]["starting_time"] >= "12:00") {
                        buf_2 += "<br><small>午後出庫</small><br>";
                    } else if (sorting_criteria === "terminal_location" && operation_table["operations"][operation_number]["ending_time"] < "12:00") {
                        buf_2 += "<br><small>午前入庫</small><br>";
                    }
                    buf_2 += "</th>";
                    
                    buf_2 += get_operation_data_cell_html(operation_number, "td", days_before, now_str, null, (sorting_criteria === "terminal_location" && reoperated_operation_numbers.has(operation_number) ? "(再出庫有)" : null));
                    
                    buf_2 += "</tr>";
                    
                    operation_number_order.push(operation_number);
                }
                buf_2 += "</table>";
            }
            
            if (division_info["division_name"] !== null) {
                buf += "<div id='operation_data_division_" + division_info["division_name"] + "'" + (division_info["division_name"] === operation_data_active_tab ? "" : " style='display: none;'") + " class='operation_data_division_area'>" + buf_2 + "</div>";
            } else {
                buf += buf_2;
            }
        }
    } else {
        var formation_list = Object.keys(formations["formations"]);
        
        var series_list = [];
        var series_titles = {};
        var series_formation_list = {};
        var formation_operation_data = {};
        
        for (var series_name of formations["series_names"]) {
            if ("unregistered" in formations["series"][series_name] && formations["series"][series_name]["unregistered"]) {
                continue;
            }
            
            series_list.push(series_name);
            series_titles[series_name] = series_name;
            formation_operation_data[series_name] = new Set();
            
            if ("subseries_names" in formations["series"][series_name]) {
                for (var subseries_name of formations["series"][series_name]["subseries_names"]) {
                    if (!("unregistered" in formations["series"][series_name]["subseries"][subseries_name] && formations["series"][series_name]["subseries"][subseries_name]["unregistered"])) {
                        series_titles[series_name + subseries_name] = series_name;
                    }
                }
            }
        }
        
        for (var formation_name of formation_list) {
            if ("cars" in formations["formations"][formation_name]) {
                formation_operation_data[formation_name] = new Set();
            }
        }
        
        formation_operation_data["運休"] = new Set();
        formation_operation_data["不明"] = new Set();
        
        for (var operation_number of operation_numbers) {
            if (!(operation_number in operation_data["operations"]) || operation_data["operations"][operation_number] === null) {
                formation_operation_data["不明"].add(operation_number);
                
                continue;
            } else if (operation_data["operations"][operation_number]["formations"].length === 0) {
                formation_operation_data["運休"].add(operation_number);
                
                continue;
            } else {
                for (var assigned_formation of operation_data["operations"][operation_number]["formations"].split("+")) {
                    if (assigned_formation in formations["formations"] && "cars" in formations["formations"][assigned_formation]) {
                        formation_operation_data[assigned_formation].add(operation_number);
                    } else if (assigned_formation in series_titles) {
                        formation_operation_data[series_titles[assigned_formation]].add(operation_number);
                    } else {
                        formation_operation_data["不明"].add(operation_number);
                    }
                }
            }
        }
        
        for (series_name of series_list) {
            if ("subseries_names" in formations["series"][series_name]) {
                series_formation_list[series_name] = [];
                
                for (subseries_name of formations["series"][series_name]["subseries_names"]) {
                    if (!("unregistered" in formations["series"][series_name]["subseries"][subseries_name] && formations["series"][series_name]["subseries"][subseries_name]["unregistered"])) {
                        series_formation_list[series_name].push(...formations["series"][series_name]["subseries"][subseries_name]["formation_names"]);
                    }
                }
            } else {
                series_formation_list[series_name] = [...formations["series"][series_name]["formation_names"]];
            }
            
            if (formation_operation_data[series_name].size >= 1) {
                series_formation_list[series_name].push(series_name);
            }
        }
        
        if (formation_operation_data["運休"].size >= 1) {
            series_list.push("運休");
            series_formation_list["運休"] = ["運休"];
        }
        if (formation_operation_data["不明"].size >= 1) {
            series_list.push("不明");
            series_formation_list["不明"] = ["不明"];
        }
        
        if (use_group_divisions_on_operation_data && "series_division_names" in formations) {
            var divisions = [];
            buf += "<div class='inner_tab_area'>";
            
            for (var series_division_name of formations["series_division_names"]) {
                divisions.push({ "division_name" : series_division_name, "group_names" : formations["series_divisions"][series_division_name]["series_names"] });
                
                if (operation_data_active_tab === null) {
                    operation_data_active_tab = series_division_name;
                }
                
                buf += "<button type='button'" + (series_division_name === operation_data_active_tab ? " class='active_tab'" : "") + " id='operation_data_division_tab_" + series_division_name + "' onclick='activate_operation_data_tab(\"" + add_slashes(series_division_name) + "\");'>" + escape_html(series_division_name) + "</a>";
            }
            
            if (formation_operation_data["運休"].size >= 1 || formation_operation_data["不明"].size >= 1) {
                divisions.push({ "division_name" : "その他", "group_names" : ["運休", "不明"] });
                
                buf += "<button type='button'" + ("その他" === operation_data_active_tab ? " class='active_tab'" : "") + " id='operation_data_division_tab_その他' onclick='activate_operation_data_tab(\"その他\");'>その他</button>";
            }
            
            buf += "</div>";
        } else {
            var divisions = [{ "division_name" : null, "group_names" : series_list }];
        }
        
        for (var division_info of divisions) {
            var buf_2 = "";
            for (var group_name of division_info["group_names"]) {
                if (!series_list.includes(group_name)) {
                    continue;
                }
                
                buf_2 += "<h3>" + group_name + "</h3>";
                
                buf_2 += "<table class='operation_data_3_columns'>";
                for (var formation_name of series_formation_list[group_name]) {
                    if (!(formation_name in formation_operation_data)) {
                        continue;
                    }
                    
                    var operation_numbers = Array.from(formation_operation_data[formation_name]);
                    for (var cnt = 0; cnt < operation_numbers.length || cnt === 0; cnt++) {
                        if (operation_numbers.length >= 1) {
                            var operation_number = operation_numbers[cnt];
                            
                            buf_2 += "<tr onclick='operation_detail(" + operation_number_order.length + ", " + operation_data_date + ", " + show_write_operation_data_button + ");'>";
                        } else {
                            buf_2 += "<tr>";
                        }
                        
                        if (cnt === 0) {
                            buf_2 += "<td onclick='event.stopPropagation();" + (formation_name in formations["formations"] ? " formations_mode(\"" + add_slashes(formation_name) + "\");" : "") + "'" + (operation_numbers.length >= 1 ? " rowspan='" + operation_numbers.length + "'" : "") + "><img src='";
                            
                            if (formation_name === "運休") {
                                buf_2 += UNYOHUB_CANCELED_TRAIN_ICON;
                            } else if (formation_name === "不明") {
                                buf_2 += UNYOHUB_UNKNOWN_TRAIN_ICON;
                            } else {
                                buf_2 += get_icon(formation_name);
                            }
                            
                            buf_2 += "' alt='' class='train_icon'>" + formation_name + "</td>";
                        }
                        
                        if (operation_numbers.length >= 1) {
                            buf_2 += "<th style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(operation_table["operations"][operation_number]["main_color"]) : operation_table["operations"][operation_number]["main_color"]) + ";'><u>" + operation_number + "</u></th>";
                            
                            buf_2 += get_operation_data_cell_html(operation_number, "td", days_before, now_str, formation_name);
                            
                            operation_number_order.push(operation_number);
                        } else {
                            buf_2 += "<td colspan='2' class='no_operation'>(情報がありません)</td>";
                        }
                        
                        buf_2 += "</tr>";
                    }
                }
                buf_2 += "</table>";
            }
            
            if (division_info["division_name"] !== null) {
                buf += "<div id='operation_data_division_" + division_info["division_name"] + "'" + (division_info["division_name"] === operation_data_active_tab ? "" : " style='display: none;'") + " class='operation_data_division_area'>" + buf_2 + "</div>";
            } else {
                buf += buf_2;
            }
        }
    }
    
    buf += "<br><div class='informational_text'>最新の投稿: " + get_date_and_time(operation_data["last_modified_timestamp"]) + "</div>";
    
    operation_data_area_elm.innerHTML = buf;
    
    if (!document.getElementById("radio_formations").checked ? "group_division_names" in operation_table : "series_division_names" in formations) {
        document.getElementById("whether_use_group_divisions_area").style.display = "block";
    } else {
        document.getElementById("whether_use_group_divisions_area").style.display = "none";
    }
}


var car_number_search_elm = document.getElementById("car_number_search");
var formation_table_area_elm = document.getElementById("formation_table_area");
var formation_table_area_supplement_elm = document.getElementById("formation_table_area_supplement");

var selected_formation_name = null;

var formation_table_active_tab;
var formation_table_drop_down_status;
var formation_table_wrapper_scroll_amount;

var formation_histories;

function formations_mode (formation_name = null) {
    change_mode(3);
    
    operation_table = null;
    timetable = null;
    operation_data = null;
    
    car_number_search_elm.value = "";
    formation_table_area_elm.innerHTML = "";
    formation_table_area_supplement_elm.style.display = "none";
    formation_table_active_tab = null;
    formation_table_drop_down_status = {};
    formation_table_wrapper_scroll_amount = 0;
    
    var colorize_label_elm = document.getElementById("colorize_formation_table_label");
    if (formation_styles_available) {
        colorize_label_elm.style.display = "inline-block";
        
        document.getElementById("colorize_formation_table").checked = config["colorize_formation_table"];
    } else {
        colorize_label_elm.style.display = "none";
    }
    
    var prefix_label_elm = document.getElementById("group_formations_by_prefix_label");
    if ("prefixes" in formations) {
        prefix_label_elm.style.display = "inline-block";
        
        document.getElementById("group_formations_by_prefix").checked = config["group_formations_by_prefix"];
    } else {
        prefix_label_elm.style.display = "none";
    }
    
    document.getElementById("show_unregistered_formations").checked = config["show_unregistered_formations_on_formation_table"];
    
    if (formation_name === null) {
        draw_formation_table();
    } else {
        formation_detail(formation_name);
    }
}

function formation_table_wrapper_onscroll () {
    if (selected_formation_name === null) {
        formation_table_wrapper_scroll_amount = article_elms[3].scrollTop;
    }
}

function get_formation_table_html (formation_names, reverse_formations, search_keyword) {
    var buf = "";
    var search_hit_formation_count = 0;
    var search_hit_formations_car_count = 0;
    for (var formation_name of formation_names) {
        if (search_keyword.length >= 1 && formation_name.includes(search_keyword)) {
            var search_keyword_index = formation_name.indexOf(search_keyword);
            var formation_name_html = escape_html(formation_name.substring(0, search_keyword_index)) + "<mark>" + escape_html(formation_name.substring(search_keyword_index, search_keyword_index + search_keyword.length)) + "</mark>" + escape_html(formation_name.substring(search_keyword_index + search_keyword.length));
            
            var formation_name_search_hit = true;
        } else {
            var formation_name_html = escape_html(formation_name);
            var formation_name_search_hit = false;
        }
        
        if ("cars" in formations["formations"][formation_name]) {
            var overview = get_formation_overview(formation_name);
            
            var buf_2 = "<tr onclick='formation_detail(\"" + add_slashes(formation_name) + "\");'><td><img src='" + get_icon(formation_name) + "' alt='' class='train_icon'" + (overview["unavailable"] ? " style='opacity: 0.5;'" : "") + "></td>";
            
            buf_2 += "<td><h5><a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + add_slashes(encodeURIComponent(formation_name)) + "/' onclick='event.preventDefault();'>" + formation_name_html + "</a>";
            
            if (overview["unavailable"]) {
                buf_2 += "<b class='warning_sentence'>運用離脱中</b>";
            } else if (overview["caption"].length >= 1) {
                buf_2 += escape_html(overview["caption"]);
            }
            
            buf_2 += "</h5>";
            
            var search_hit_count = 0;
            for (var car of (reverse_formations ? formations["formations"][formation_name]["cars"].toReversed() : formations["formations"][formation_name]["cars"])) {
                var car_class = "";
                
                if (search_keyword.length >= 1) {
                    if (car["car_number"].toUpperCase().includes(search_keyword) || car["abbr_number"].toUpperCase().includes(search_keyword)) {
                        car_class =  "car_highlight";
                        
                        search_hit_count++;
                    } else if (formation_name_search_hit) {
                        search_hit_count++;
                    }
                } else {
                    search_hit_count++;
                }
                
                if ("equipment" in car) {
                    for (var equipment of car["equipment"]) {
                        car_class += (car_class.length >= 1 ? " " : "") + "car_" + equipment;
                    }
                }
                
                if (formation_styles_available && config["colorize_formation_table"] && "coloring_id" in car) {
                    car_class += (car_class.length >= 1 ? " " : "") + "car_coloring_" + car["coloring_id"];
                }
                
                buf_2 += "<div class='" + car_class + "'>" + escape_html(car["abbr_number"]) + "<span></span><span></span></div>";
            }
            
            buf_2 += "</td></tr>";
            
            if (search_hit_count >= 1) {
                buf += buf_2;
                search_hit_formation_count++;
                search_hit_formations_car_count += search_hit_count;
            }
        } else if (config["show_unregistered_formations_on_formation_table"]) {
            if (search_keyword.length == 0 || formation_name.includes(search_keyword)) {
                if ("new_formation_name" in formations["formations"][formation_name]) {
                    buf += "<tr onclick='formation_detail(\"" + add_slashes(formation_name) + "\");' class='renamed_formation'><td><img src='" + UNYOHUB_GENERIC_TRAIN_ICON + "' alt='' class='train_icon'></td><td>";
                    if (formations["formations"][formation_name]["new_railroad_id"] === null) {
                        buf += "<h5><a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + add_slashes(encodeURIComponent(formations["formations"][formation_name]["new_formation_name"])) + "/' onclick='event.preventDefault();'>" + formation_name_html + "</a></h5>" + escape_html(formations["formations"][formation_name]["new_formation_name"]) + " に改番";
                    } else {
                        buf += "<h5><a href='/railroad_" + formations["formations"][formation_name]["new_railroad_id"] + "/formations/" + add_slashes(encodeURIComponent(formations["formations"][formation_name]["new_formation_name"])) + "/' onclick='event.preventDefault();'>" + formation_name_html + "</a></h5>";
                        buf += ("related_railroads" in railroad_info && formations["formations"][formation_name]["new_railroad_id"] in railroad_info["related_railroads"]) ? escape_html(railroad_info["related_railroads"][formations["formations"][formation_name]["new_railroad_id"]]["railroad_name"]) + " へ転出" : "転出済み";
                        
                        if (formations["formations"][formation_name]["new_formation_name"] !== formation_name) {
                            buf += " (→ " + escape_html(formations["formations"][formation_name]["new_formation_name"]) + ")";
                        }
                    }
                    buf += "</td>";
                } else {
                    buf += "<tr onclick='formation_detail(\"" + add_slashes(formation_name) + "\");' class='unregistered_formation'><td><img src='" + UNYOHUB_GENERIC_TRAIN_ICON + "' alt='' class='train_icon'></td><td><h5><a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + add_slashes(encodeURIComponent(formation_name)) + "/' onclick='event.preventDefault();'>" + formation_name_html + "</a></h5>除籍済み</td>";
                }
                
                if (search_keyword.length >= 1) {
                    search_hit_formation_count++;
                }
            }
        }
    }
    
    return [buf, search_hit_formation_count, search_hit_formations_car_count];
}

function get_formation_groups () {
    if (config["group_formations_by_prefix"] && "prefixes" in formations) {
        var groups = {...formations["prefixes"]};
        var group_names = [...formations["prefix_order"]];
        
        if ("no_prefix_formation_names" in formations) {
            groups["その他"] = { "formation_names" : formations["no_prefix_formation_names"] };
            group_names.push("その他");
        }
    } else {
        var groups = formations["series"];
        var group_names = formations["series_names"];
    }
    
    return [groups, group_names];
}

function draw_formation_table (update_title = true) {
    if (update_title) {
        change_title(railroad_info["railroad_name"] + "の編成表 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/formations/");
        
        var buf = "<u class='execute_link' onclick='formations_last_operated();'>全編成の最終運行情報</u>";
        
        if ("related_railroads_order" in railroad_info) {
            var buf_2 = "";
            
            for (var railroad_id of railroad_info["related_railroads_order"]) {
                if ("show_link_in_formation_table" in railroad_info["related_railroads"][railroad_id] && railroad_info["related_railroads"][railroad_id]["show_link_in_formation_table"]) {
                    buf_2 += "<a class='related_link' href='/railroad_" + add_slashes(railroad_id) + "/formations/' onclick='event.preventDefault(); select_railroad(\"" + add_slashes(railroad_id) + "\", \"formations_mode\");' style='border-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["related_railroads"][railroad_id]["main_color"]) : railroad_info["related_railroads"][railroad_id]["main_color"]) + ";'>" + escape_html(railroad_info["related_railroads"][railroad_id]["railroad_name"]) + "の編成表</a>";
                }
            }
            
            if (buf_2.length >= 1) {
                buf += "<h3>関連項目</h3>" + buf_2;
            }
        }
        
        buf += "<div class='informational_text'>";
        buf += "編成表更新日時: " + get_date_and_time(formations["last_modified_timestamp"]) + "<br>";
        buf += "車両アイコン更新日時: " + get_date_and_time(train_icons["last_modified_timestamp"]) + "<br>";
        buf += "編成概要更新日時: " + get_date_and_time(formation_overviews["last_modified_timestamp"]);
        buf += "</div>";
        buf += "<a href='#about_railroad_data_popup' class='bottom_link' onclick='event.preventDefault(); about_railroad_data();'>使用しているデータについて</a>";
        
        formation_table_area_supplement_elm.innerHTML = buf;
    }
    
    document.getElementById("formation_screenshot_button").style.display = "none";
    document.getElementById("formation_back_button").style.display = "none";
    
    var reverse_formations = (config["force_arrange_west_side_car_on_left"] && "forward_direction_is_east" in railroad_info && railroad_info["forward_direction_is_east"]);
    var search_keyword = str_to_halfwidth(car_number_search_elm.value).toUpperCase();
    
    var [groups, group_names] = get_formation_groups();
    
    if ("series_division_names" in formations && search_keyword.length === 0) {
        var divisions = [];
        var buf = "<div class='inner_tab_area'>";
        
        for (var series_division_name of formations["series_division_names"]) {
            if (config["group_formations_by_prefix"] && "prefixes" in formations) {
                if (!("prefix_order" in formations["series_divisions"][series_division_name])) {
                    continue;
                }
                
                divisions.push({ "division_name" : series_division_name, "group_names" : formations["series_divisions"][series_division_name]["prefix_order"] });
            } else {
                divisions.push({ "division_name" : series_division_name, "group_names" : formations["series_divisions"][series_division_name]["series_names"] });
            }
            
            if (formation_table_active_tab === null) {
                formation_table_active_tab = series_division_name;
            }
            
            buf += "<button type='button'" + (series_division_name === formation_table_active_tab ? " class='active_tab'" : "") + " id='formation_division_tab_" + series_division_name + "' onclick='activate_formation_table_tab(\"" + add_slashes(series_division_name) + "\");'>" + escape_html(series_division_name) + "</a>";
        }
        
        if (config["group_formations_by_prefix"] && "prefixes" in formations && "no_prefix_formation_names" in formations) {
            divisions.push({ "division_name" : "その他", "group_names" : ["その他"] });
            
            buf += "<button type='button'" + ("その他" === formation_table_active_tab ? " class='active_tab'" : "") + " id='formation_division_tab_その他' onclick='activate_formation_table_tab(\"その他\");'>その他</button>";
        }
        
        buf += "</div>";
    } else {
        var divisions = [{ "division_name" : null, "group_names" : group_names }];
        var buf = "";
    }
        
    for (var division_info of divisions) {
        var buf_2 = "";
        for (var group_name of division_info["group_names"]) {
            if ("subseries_names" in groups[group_name]) {
                var buf_3 = "";
                var search_hit_formation_count = 0;
                var search_hit_formations_car_count = 0;
                
                for (var subseries_name of groups[group_name]["subseries_names"]) {
                    var [buf_4, subseries_search_hit_formation_count, subseries_search_hit_formations_car_count] = get_formation_table_html(groups[group_name]["subseries"][subseries_name]["formation_names"], reverse_formations, search_keyword);
                    
                    if (buf_4.length >= 1) {
                        buf_3 += "<tr><th colspan='2'>" + escape_html(subseries_name) + "</th></tr>" + buf_4;
                        search_hit_formation_count += subseries_search_hit_formation_count;
                        search_hit_formations_car_count += subseries_search_hit_formations_car_count;
                    }
                }
            } else {
                var [buf_3, search_hit_formation_count, search_hit_formations_car_count] = get_formation_table_html(groups[group_name]["formation_names"], reverse_formations, search_keyword);
            }
            
            if (buf_3.length >= 1) {
                var checkbox_id = "series_" + group_name;
                
                var unregistered = ("unregistered" in groups[group_name] && groups[group_name]["unregistered"]);
                
                buf_2 += "<input type='checkbox' id='" + checkbox_id + "'" + (checkbox_id in formation_table_drop_down_status && formation_table_drop_down_status[checkbox_id] ? " checked='checked'" : "") + " onclick='update_formation_table_drop_down_status(this);'>";
                buf_2 += "<label for='" + checkbox_id + "' class='formation_table_drop_down'><span><img src='" + (unregistered ? UNYOHUB_GENERIC_TRAIN_ICON + "' style='opacity: 0.5;" : get_icon(group_name)) + "' alt='' class='train_icon'></span>" + escape_html(group_name) + (search_keyword.length >= 1 ? " (" + search_hit_formation_count + "編成該当)" : (unregistered ? "<small>(除籍済み)</small>" : "")) + "</label>";
                buf_2 += "<div id='formation_table_" + checkbox_id + "'><h3 class='formation_table_series_name'>" + escape_html(group_name) + "</h3><button type='button' class='screenshot_button' onclick='take_screenshot(\"formation_table_" + checkbox_id + "\");' aria-label='スクリーンショット'></button><table class='" + (reverse_formations ? "reversed_formation_table" : "formation_table") + "'><tr><td colspan='2'>" + search_hit_formation_count + "編成 " + search_hit_formations_car_count + "両 " + (search_keyword.length >= 1 ? "該当" : "在籍中") + "" + buf_3 + "</td></tr></table></div>";
            }
        }
        
        if (division_info["division_name"] !== null) {
            buf += "<div id='formation_division_" + division_info["division_name"] + "'" + (division_info["division_name"] === formation_table_active_tab ? "" : " style='display: none;'") + " class='formation_division_area'>" + buf_2 + "</div>";
        } else {
            buf += buf_2;
        }
    }
    
    if (buf.length !== 0) {
        formation_table_area_elm.innerHTML = buf;
        
        formation_table_area_supplement_elm.style.display = "block";
    } else {
        formation_table_area_elm.innerHTML = "<div class='no_data'>検索キーワードを含む車両が見つかりません。" + (config["show_unregistered_formations_on_formation_table"] ? "<br>除籍・転出済みの車両は編成名でのみ検索可能です。" : "") + "</div>";
        
        formation_table_area_supplement_elm.style.display = "none";
    }
    
    document.getElementById("formation_search_area").style.display = "block";
    selected_formation_name = null;
    
    article_elms[3].scrollTop = formation_table_wrapper_scroll_amount;
}

function get_operation_data_html (data, ts, clickable = true, no_data_text = "情報がありません") {
    if (data !== null) {
        buf = "";
        for (var data_item of data) {
            if (clickable) {
                buf += "<div class='key_and_value' onclick='operation_detail(\"" + add_slashes(data_item["operation_number"]) + "\", " + ts + ", false);'><u>" + escape_html(data_item["operation_number"]) + "</u>";
            } else {
                buf += "<div class='key_and_value'><b>" + escape_html(data_item["operation_number"]) + "</b>";
            }
            
            if ("relieved_formations" in data_item) {
                var buf_2 = "";
                for (var relieved_formation of data_item["relieved_formations"]) {
                    buf_2 += (buf_2.length >= 1 ? "<br>→ " : "") + (relieved_formation !== "" ? escape_html(relieved_formation) : "運休");
                }
                buf += "<span class='relieved_formations'>" + buf_2 + "</span><br>→ ";
            }
            
            buf += (data_item["formations"] !== "" ? escape_html(data_item["formations"]) : "運休") + "</div>";
        }
        
        return buf;
    } else {
        return "<div class='descriptive_text'>" + no_data_text + "</div>";
    }
}

function get_previous_formation (formation_name, group_name, subseries_name = null) {
    var [groups, group_names] = get_formation_groups();
    
    var formation_list = subseries_name !== null ? groups[group_name]["subseries"][subseries_name]["formation_names"] : groups[group_name]["formation_names"];
    var formation_index = formation_list.indexOf(formation_name);
    
    if (formation_index >= 1) {
        var previous_group_name = group_name;
        var previous_subseries_name = subseries_name;
        var previous_formation_name = formation_list[formation_index - 1];
    } else {
        var previous_formation_name = null;
        if (subseries_name !== null) {
            var subseries_index = groups[group_name]["subseries_names"].indexOf(subseries_name);
            if (subseries_index >= 1) {
                var previous_group_name = group_name;
                var previous_subseries_name = groups[group_name]["subseries_names"][subseries_index - 1];
                previous_formation_name = groups[group_name]["subseries"][previous_subseries_name]["formation_names"][groups[group_name]["subseries"][previous_subseries_name]["formation_names"].length - 1];
            }
        }
        
        if (previous_formation_name === null) {
            var series_index = group_names.indexOf(group_name);
            if (series_index >= 1) {
                var previous_group_name = group_names[series_index - 1];
            } else {
                var previous_group_name = group_names[group_names.length - 1];
            }
            
            if ("subseries_names" in groups[previous_group_name]) {
                var previous_subseries_name = groups[previous_group_name]["subseries_names"][groups[previous_group_name]["subseries_names"].length - 1];
                formation_list = groups[previous_group_name]["subseries"][previous_subseries_name]["formation_names"];
            } else {
                var previous_subseries_name = null;
                formation_list = groups[previous_group_name]["formation_names"];
            }
            
            previous_formation_name = formation_list[formation_list.length - 1];
        }
    }
    
    if ("cars" in formations["formations"][previous_formation_name]) {
        return previous_formation_name;
    } else {
        return get_previous_formation(previous_formation_name, previous_group_name, previous_subseries_name);
    }
}

function get_next_formation (formation_name, group_name, subseries_name = null) {
    var [groups, group_names] = get_formation_groups();
    
    var formation_list = subseries_name !== null ? groups[group_name]["subseries"][subseries_name]["formation_names"] : groups[group_name]["formation_names"];
    var formation_index = formation_list.indexOf(formation_name);
    
    if (formation_index <= formation_list.length - 2) {
        var next_group_name = group_name;
        var next_subseries_name = subseries_name;
        var next_formation_name = formation_list[formation_index + 1];
    } else {
        var next_formation_name = null;
        if (subseries_name !== null) {
            var subseries_index = groups[group_name]["subseries_names"].indexOf(subseries_name);
            if (subseries_index <= groups[group_name]["subseries_names"].length - 2) {
                var next_group_name = group_name;
                var next_subseries_name = groups[group_name]["subseries_names"][subseries_index + 1];
                next_formation_name = groups[group_name]["subseries"][next_subseries_name]["formation_names"][0];
            }
        }
        
        if (next_formation_name === null) {
            var series_index = group_names.indexOf(group_name);
            if (series_index <= group_names.length - 2) {
                var next_group_name = group_names[series_index + 1];
            } else {
                var next_group_name = group_names[0];
            }
            
            if ("subseries_names" in groups[next_group_name]) {
                var next_subseries_name = groups[next_group_name]["subseries_names"][0];
                next_formation_name = groups[next_group_name]["subseries"][next_subseries_name]["formation_names"][0];
            } else {
                var next_subseries_name = null;
                next_formation_name = groups[next_group_name]["formation_names"][0];
            }
        }
    }
    
    if ("cars" in formations["formations"][next_formation_name]) {
        return next_formation_name;
    } else {
        return get_next_formation(next_formation_name, next_group_name, next_subseries_name);
    }
}

function draw_formation_histories (histories, car_number = "") {
    const EVENT_TYPE_JA = { construct : "新製", modify : "改修", repaint : "塗装等変更", renewal : "更新", transfer : "転属", rearrange : "組換", unregister : "廃車", other : "その他" };
    
    var buf = "";
    for (var history of histories) {
        if (car_number.length >= 1 && !history["related_cars"].includes(car_number)) {
            continue;
        }
        
        if (history["event_year_month"].length === 4) {
            var event_year_month = history["event_year_month"] + "年";
        } else {
            var event_year_month = history["event_year_month"].substring(0, 4) + "年" + Number(history["event_year_month"].substring(5)) + "月";
        }
        
        buf += "<div class='history_item'><time datetime='" + history["event_year_month"] + "'>" + event_year_month + "</time><h5 class='event_type_" + history["event_type"] + "'>" + EVENT_TYPE_JA[history["event_type"]] + "</h5><br>" + convert_to_html(history["event_content"]) + "</div>";
    }
    
    document.getElementById("histories_area").innerHTML = buf.length >= 1 ? buf : "<div class='descriptive_text'>車歴データがありません</div>";
}

function formation_detail (formation_name) {
    if ("new_formation_name" in formations["formations"][formation_name]) {
        if (formations["formations"][formation_name]["new_railroad_id"] === null) {
            formation_detail(formations["formations"][formation_name]["new_formation_name"]);
        } else {
            select_railroad(formations["formations"][formation_name]["new_railroad_id"], "formations_mode", formations["formations"][formation_name]["new_formation_name"]);
        }
        
        return;
    }
    
    document.getElementById("formation_search_area").style.display = "none";
    formation_table_area_elm.innerHTML = "";
    
    selected_formation_name = formation_name;
    
    document.getElementById("formation_screenshot_button").style.display = "block";
    document.getElementById("formation_back_button").style.display = "block";
    
    if ("cars" in formations["formations"][formation_name]) {
        var series_name = formations["formations"][formation_name]["series_name"];
        
        change_title(series_name + " " + formation_name + " (" + railroad_info["railroad_name"] + ") の編成情報・運用 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(formation_name) + "/");
        
        if (config["group_formations_by_prefix"] && "prefixes" in formations) {
            var group_name = "prefix" in formations["formations"][formation_name] ? formations["formations"][formation_name]["prefix"] : "その他";
            var subseries_name = null;
        } else {
            var group_name = series_name;
            var subseries_name = "subseries_name" in formations["formations"][formation_name] ? formations["formations"][formation_name]["subseries_name"] : null;
        }
        
        var previous_formation_name = get_previous_formation(formation_name, group_name, subseries_name);
        var next_formation_name = get_next_formation(formation_name, group_name, subseries_name);
        
        var buf = "<div class='heading_wrapper'><a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(previous_formation_name) + "/' class='previous_button' onclick='event.preventDefault(); formation_detail(\"" + add_slashes(previous_formation_name) + "\");'>" + escape_html(previous_formation_name) + "</a><h2>" + escape_html(formation_name) + "</h2><a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(next_formation_name) + "/' class='next_button' onclick='event.preventDefault(); formation_detail(\"" + add_slashes(next_formation_name) + "\");'>" + escape_html(next_formation_name) + "</a></div>";
        
        var overview = get_formation_overview(formation_name);
        
        buf += "<img src='" + get_icon(formation_name) + "' alt='" + add_slashes(series_name) + "' class='train_icon_large'>";
        buf += "<strong id='formation_caption'>" + overview["caption"] + "</strong>";
    } else {
        change_title(formation_name + " (" + railroad_info["railroad_name"] + ") の編成情報 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(formation_name) + "/");
        
        var buf = "<div class='heading_wrapper'><h2>" + escape_html(formation_name) + "</h2></div>";
        
        var overview = null;
        
        buf += "<img src='" + UNYOHUB_GENERIC_TRAIN_ICON + "' alt='' class='train_icon_large' style='opacity: 0.5;'>";
        buf += "<strong id='formation_caption'></strong>";
    }
    
    buf += "<div id='formation_operations_area'></div>";
    if (navigator.onLine) {
        buf += "<button type='button' class='history_button' onclick='operation_data_history(\"" + add_slashes(formation_name) + "\");'>これまでの運用履歴</button>";
    }
    
    buf += "<div id='semifixed_formation_area'></div>";
    
    buf += "<h3>基本情報</h3>";
    buf += "<div class='key_and_value'><b>車両形式</b><span id='formation_series_name'>" + ("series_name" in formations["formations"][formation_name] ? escape_html(series_name + ("subseries_name" in formations["formations"][formation_name] ? " " + formations["formations"][formation_name]["subseries_name"] : "")) : "") + "</div>";
    buf += "<div class='key_and_value' id='formation_affiliation'></div>";
    
    buf += "<div class='descriptive_text' id='formation_description'></div>";
    
    buf += "<h3>検査情報</h3>";
    if (overview === null) {
        buf += "<div class='descriptive_text warning_sentence' id='inspection_information'>除籍済み</div>";
    } else if (overview["unavailable"]) {
        buf += "<div class='descriptive_text warning_sentence' id='inspection_information'>運用離脱中</div>";
    } else {
        buf += "<div class='descriptive_text' id='inspection_information'>情報がありません</div>";
    }
    
    buf += "<h3>車両情報</h3>";
    buf += "<table id='car_info_table'>";
    if ("cars" in formations["formations"][formation_name]) {
        for (var cnt = 0; cnt < formations["formations"][formation_name]["cars"].length; cnt++) {
            var car_class = "";
            if ("equipment" in formations["formations"][formation_name]["cars"][cnt]) {
                for (var equipment of formations["formations"][formation_name]["cars"][cnt]["equipment"]) {
                    car_class += (car_class.length >= 1 ? " " : "") + "car_info_car_" + equipment;
                }
            }
            
            if (formation_styles_available && "coloring_id" in formations["formations"][formation_name]["cars"][cnt] && formations["formations"][formation_name]["cars"][cnt]["coloring_id"] in formations["body_colorings"]) {
                var coloring_data = formations["body_colorings"][formations["formations"][formation_name]["cars"][cnt]["coloring_id"]];
                
                var car_style = "style='background-color: " + coloring_data["base_color"] + "; color: " + coloring_data["font_color"] + ";'";
            } else {
                var car_style = "";
            }
            
            buf += "<tr>";
            
            if (cnt === 0) {
                buf += "<td rowspan='" + formations["formations"][formation_name]["cars"].length + "'><span>▲" + escape_html(railroad_info["alias_of_forward_direction"]) + "</span></td>";
            }
            
            buf += "<td class='" + car_class + "' " + car_style + "></td><td><b>" + escape_html(formations["formations"][formation_name]["cars"][cnt]["car_number"]) + "</b><span id='car_info_" + cnt + "'></span><div class='descriptive_text' id='car_description_" + cnt + "'></div></td></tr>";
        }
    }
    buf += "</table>";
    
    buf += "<h3>車歴</h3>";
    buf += "<label for='formation_histories_car_select' class='filter_select_box'><select id='formation_histories_car_select' onchange='draw_formation_histories(formation_histories, this.value);'><option value=''>全車両の車歴</option></select></label>";
    buf += "<div id='histories_area'><div class='descriptive_text'>車歴データがありません</div></div>";
    
    buf += "<div id='formation_reference_books_area' class='descriptive_text'></div>";
    
    formation_table_area_elm.innerHTML = buf;
    article_elms[3].scrollTop = 0;
    
    var formation_operations_area_elm = document.getElementById("formation_operations_area");
    
    if (navigator.onLine) {
        formation_operations_area_elm.className = "loading_icon";
        histories_area.className = "loading_icon";
        
        ajax_post("formation_details.php", "railroad_id=" + escape_form_data(railroad_info["railroad_id"]) + "&formation_name=" + escape_form_data(formation_name), function (response) {
            if (response !== false) {
                var data = JSON.parse(response);
                
                if (data["caption"] !== null) {
                    document.getElementById("formation_caption").innerText = data["caption"];
                }
                
                document.getElementById("formation_series_name").innerText = data["series_name"] + ("subseries_name" in data ? " " + data["subseries_name"] : "");
                
                if (data["affiliation"] !== null && data["affiliation"].length >= 1) {
                    document.getElementById("formation_affiliation").innerHTML = "<b>" + ("cars" in formations["formations"][formation_name] ? "" : "最終") + "所属</b>" + escape_html(data["affiliation"]);
                }
                
                document.getElementById("formation_description").innerText = data["description"];
                
                var inspection_information_area = document.getElementById("inspection_information");
                if (data["inspection_information"] !== null) {
                    inspection_information_area.innerText = data["inspection_information"];
                }
                
                if (!("unavailable" in data)) {
                    inspection_information_area.classList.add("warning_sentence");
                    
                    if (inspection_information_area.innerText.length == 0) {
                        inspection_information_area.innerText = "除籍済み";
                    }
                } else if (data["unavailable"]) {
                    inspection_information_area.classList.add("warning_sentence");
                    
                    if (inspection_information_area.innerText.length == 0) {
                        inspection_information_area.innerText = "運用離脱中";
                    }
                } else {
                    inspection_information_area.classList.remove("warning_sentence");
                    
                    if (inspection_information_area.innerText.length == 0) {
                        inspection_information_area.innerText = "情報がありません";
                    }
                }
                
                var car_info_table_elm = document.getElementById("car_info_table");
                if (car_info_table_elm.children.length >= 1) {
                    for (var cnt = 0; cnt < data["cars"].length; cnt++) {
                        document.getElementById("car_info_" + cnt).innerText = data["cars"][cnt]["manufacturer"] + " " + data["cars"][cnt]["constructed"];
                        document.getElementById("car_description_" + cnt).innerText = data["cars"][cnt]["description"];
                    }
                } else {
                    var buf = "";
                    for (var cnt = 0; cnt < data["cars"].length; cnt++) {
                        buf += "<tr>";
                        
                        if (cnt === 0) {
                            buf += "<td rowspan='" + data["cars"].length + "'><span>▲" + escape_html(railroad_info["alias_of_forward_direction"]) + "</span></td>";
                            
                            var car_class = data["cars"].length >= 2 ? "car_info_car_C1" : "car_info_car_C";
                        } else if (cnt === data["cars"].length - 1) {
                            var car_class = "car_info_car_C2";
                        } else {
                            var car_class = "";
                        }
                        
                        buf += "<td class='" + car_class + "'></td><td><b>" + escape_html(data["cars"][cnt]["car_number"]) + "</b><span>" + escape_html(data["cars"][cnt]["manufacturer"] + " " + data["cars"][cnt]["constructed"]) + "</span><div class='descriptive_text'>" + escape_html(data["cars"][cnt]["description"]) + "</div></td></tr>";
                    }
                    
                    car_info_table_elm.innerHTML = buf;
                }
                
                var buf = "<option value=''>全車両の車歴</option>";
                for (var car_info of data["cars"]) {
                    buf += "<option value='" + add_slashes(car_info["car_number"]) + "'>" + escape_html(car_info["car_number"]) + "</option>";
                }
                
                document.getElementById("formation_histories_car_select").innerHTML = buf;
                
                if ("semifixed_formation" in data) {
                    buf = "";
                    for (var semifixed_formation of data["semifixed_formation"].split("+")) {
                        buf += (buf.length >= 1 ? " + " : "") + (semifixed_formation !== formation_name ? "<a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(semifixed_formation) + "/' onclick='event.preventDefault(); formation_detail(\"" + add_slashes(semifixed_formation) + "\");'>" : "<b>") + "<img src='" + get_icon(semifixed_formation) + "' alt='' class='train_icon'>" + escape_html(semifixed_formation) + (semifixed_formation !== formation_name ? "</a>" : "</b>");
                    }
                    
                    document.getElementById("semifixed_formation_area").innerHTML = "<h3>半固定編成</h3><div>" + buf + "</div>";
                }
                
                buf = "<input type='checkbox' id='formation_operations'><label for='formation_operations' class='drop_down'>運用情報</label>";
                if (data["operations_today"] !== null || data["operations_tomorrow"] !== null) {
                    var ts = get_timestamp();
                    
                    buf += "<div><div class='formation_operation_data'><h4>今日の運用情報</h4>" + get_operation_data_html(data["operations_today"], ts) + "</div>";
                    buf += "<div class='formation_operation_data'><h4>明日の運用情報</h4>" + get_operation_data_html(data["operations_tomorrow"], ts + 86400, true, "明日の運用情報は判明していません") + "</div></div>";
                } else if (data["last_seen_date"] !== null) {
                    var last_seen_date_split = data["last_seen_date"].split("-");
                    var dt = new Date(data["last_seen_date"] + " 12:00:00");
                    
                    buf += "<div><div class='formation_operation_data_last_seen'><h4>最終目撃情報(" + last_seen_date_split[0] + "/" + Number(last_seen_date_split[1]) + "/" + Number(last_seen_date_split[2]) + ")</h4>" + get_operation_data_html(data["operations_last_day"], Math.floor(dt.getTime() / 1000)) + "</div></div>";
                } else {
                    buf += "<div><div class='descriptive_text'>この編成の運用情報が投稿されたことはありません</div></div>";
                }
                
                formation_operations_area_elm.innerHTML = buf;
                
                formation_histories = data["histories"];
                
                draw_formation_histories(formation_histories);
                
                if ("reference_books" in data) {
                    var reference_books_html = "<h5>参考書籍</h5>";
                    for (var reference_book_info of data["reference_books"]) {
                        if (reference_book_info["authors"] !== null) {
                            reference_books_html += escape_html(reference_book_info["authors"]);
                        }
                        reference_books_html += "『" + escape_html(reference_book_info["book_title"]) + "』" + escape_html(reference_book_info["publisher_name"]);
                        if (reference_book_info["publication_year"] !== null) {
                            reference_books_html += " (" + reference_book_info["publication_year"] + ")";
                        }
                        reference_books_html += "<br>";
                    }
                    document.getElementById("formation_reference_books_area").innerHTML = reference_books_html;
                }
                
                buf = "<div id='formation_updated_area' class='informational_text'>編成情報更新日時: " + get_date_and_time(data["updated_timestamp"]) + ("edited_user_name" in data ? " (" + escape_html(data["edited_user_name"]) + ")" : "") + "</div>";
                
                if ("editable" in data && data["editable"]) {
                    buf += "<a href='/admin/formations.php?railroad_id=" + railroad_info["railroad_id"] + "&formation_name=" + escape_form_data(formation_name) + "' target='_blank' class='execute_link'>この編成の情報を編集</a>";
                }
                
                buf += "<a href='#about_railroad_data_popup' class='bottom_link' onclick='event.preventDefault(); about_railroad_data();'>使用しているデータについて</a>";
                
                formation_table_area_supplement_elm.innerHTML = buf;
                formation_table_area_supplement_elm.style.display = "block";
            }
        });
    }
}


function get_icon_base64 (icon_id, railroad_id = null) {
    if (railroad_id === null) {
        if (icon_id in train_icons["icons"]) {
            return train_icons["icons"][icon_id];
        }
    } else {
        if (icon_id in joined_railroad_train_icons[railroad_id]["icons"]) {
            return joined_railroad_train_icons[railroad_id]["icons"][icon_id];
        }
    }
    
    return UNYOHUB_GENERIC_TRAIN_ICON;
}

function get_icon (formation_name, railroad_id = null, unknown_icon_id = null) {
    if (formation_name === null || formation_name === "?") {
        return unknown_icon_id === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(unknown_icon_id, railroad_id);
    }
    
    if (formation_name === "") {
        return UNYOHUB_CANCELED_TRAIN_ICON;
    }
    
    if (railroad_id === null) {
        if (formation_name in formations["formations"]) {
            if ("icon_id" in formations["formations"][formation_name]) {
                return get_icon_base64(formations["formations"][formation_name]["icon_id"]);
            }
        } else if (formation_name in series_icon_ids) {
            return get_icon_base64(series_icon_ids[formation_name]);
        }
    } else {
        if (formation_name in joined_railroad_formations[railroad_id]["formations"]) {
            if ("icon_id" in joined_railroad_formations[railroad_id]["formations"][formation_name]) {
                return get_icon_base64(joined_railroad_formations[railroad_id]["formations"][formation_name]["icon_id"], railroad_id);
            }
        } else if (formation_name in joined_railroad_series_icon_ids[railroad_id]) {
            return get_icon_base64(joined_railroad_series_icon_ids[railroad_id][formation_name], railroad_id);
        }
    }
    
    return UNYOHUB_GENERIC_TRAIN_ICON;
}

function get_train_color (train_name, train_type = "", default_value = "inherit") {
    for (var train_color_rule of railroad_info["train_color_rules"]) {
        if (train_color_rule["regexp"].test("subject" in train_color_rule && train_color_rule["subject"] === "train_type" ? train_type : train_name)) {
            return train_color_rule["color"];
        }
    }
    
    return default_value;
}

function get_formation_overview (formation_name, railroad_id = null) {
    var overview = { caption: "", semifixed_formation : null, unavailable: false };
    
    if (railroad_id === null) {
        var overviews = formation_overviews["formations"];
    } else {
        var overviews = joined_railroad_formation_overviews[railroad_id]["formations"];
    }
    
    if (formation_name in overviews) {
        overview["unavailable"] = overviews[formation_name]["unavailable"];
        
        if (overviews[formation_name]["caption"] !== null) {
            overview["caption"] = overviews[formation_name]["caption"];
        }
        
        if ("semifixed_formation" in overviews[formation_name]) {
            overview["semifixed_formation"] = overviews[formation_name]["semifixed_formation"];
        }
    }
    
    return overview;
}


var operation_search_area_elm = document.getElementById("operation_search_area");
var operation_table_heading_elm = document.getElementById("operation_table_heading");
var operation_table_area_elm = document.getElementById("operation_table_area");
var operation_table_area_supplement_elm = document.getElementById("operation_table_area_supplement");
var operation_table_footer_inner_elm = document.getElementById("operation_table_footer_inner");

var operation_table_drop_down_status;

function operation_table_mode (diagram_revision = "__current__", diagram_id = null, operation_number = null) { //第2引数は現在非対応
    change_mode(4);
    
    operation_search_area_elm.style.display = "none";
    operation_table_heading_elm.innerHTML = "";
    operation_table_area_elm.innerHTML = "";
    operation_table_area_supplement_elm.innerHTML = "";
    operation_table_footer_inner_elm.style.display = "none";
    
    operation_table_drop_down_status = {};
    
    var current_diagram_revision = get_diagram_revision();
    
    if (diagram_revision !== null) {
        if (diagram_revision === current_diagram_revision) {
            diagram_revision = "__current__";
        }
        
        var operation_data_date = diagram_revision === "__current__" ? get_date_string(get_timestamp()) : diagram_revision;
        
        get_diagram_id(operation_data_date, null, function (diagram_data) {
            if (diagram_data === null) {
                operation_table_area_elm.innerHTML = "<div class='no_data'>指定された改正・変更日のダイヤはデータがありません</div>";
                
                return;
            }
            
            var diagram_revision_year_month = diagram_data["diagram_revision"].substring(0, 4) + "年" + Number(diagram_data["diagram_revision"].substring(5, 7)) + "月改正・変更"
            
            change_title(railroad_info["railroad_name"] + " " + diagram_revision_year_month + "ダイヤ運用表 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/operation_table/" + diagram_data["diagram_revision"] + "/");
            
            if (diagram_data["diagram_revision"] === current_diagram_revision) {
                var diagram_revision_info = "(現行ダイヤ)";
            } else if (diagram_data["diagram_revision"] > current_diagram_revision) {
                var diagram_revision_info = "<b class='warning_sentence'>(将来のダイヤ)</b>";
            } else {
                var diagram_revision_info = "<b class='warning_sentence'>(過去のダイヤ)</b>";
            }
            
            operation_table_heading_elm.innerHTML = diagram_revision_year_month + " " + diagram_revision_info;
            operation_table_footer_inner_elm.style.display = "block";
            document.getElementById("operation_table_name").innerText = diagram_info[diagram_data["diagram_revision"]]["diagrams"][diagram_data["diagram_id"]]["diagram_name"];
            document.getElementById("train_number_search").value = "";
            operation_table_wrapper_scroll_amount = 0;
            
            load_data(function () {
                operation_table_list_number(true, operation_number);
            }, null, function () {
                operation_table_area_elm.innerHTML = "<div class='no_data'>表示に必要なデータが利用できません</div>";
            }, diagram_data["diagram_revision"], diagram_data["diagram_id"], null, diagram_revision === "__current__" ? operation_data_date : null);
        });
    } else {
        change_title(railroad_info["railroad_name"] + "の運用表一覧 | " + instance_info["instance_name"], "/railroad_" + railroad_info["railroad_id"] + "/operation_table/");
        
        operation_table_heading_elm.innerHTML = "改正・変更別の運用表";
        
        operation_table = null;
        
        var buf = "";
        for (var diagram_revisions_item of diagram_revisions["diagram_revisions"]) {
            if (diagram_revisions_item === current_diagram_revision) {
                buf += "<a href='/railroad_" + railroad_info["railroad_id"] + "/operation_table/" + current_diagram_revision + "/' class='wide_button' onclick='event.preventDefault(); operation_table_mode();'>" + current_diagram_revision.substring(0, 4) + "年" + Number(current_diagram_revision.substring(5, 7)) + "月改正・変更ダイヤ<small>(現行)</small></a>";
            } else {
                buf += "<a href='/railroad_" + railroad_info["railroad_id"] + "/operation_table/" + diagram_revisions_item + "/' class='wide_button " + (diagram_revisions_item > current_diagram_revision ? "before_operation" : "after_operation") + "' onclick='event.preventDefault(); operation_table_mode(\"" + diagram_revisions_item + "\");'>" + diagram_revisions_item.substring(0, 4) + "年" + Number(diagram_revisions_item.substring(5, 7)) + "月改正・変更ダイヤ</a>";
            }
        }
        
        operation_table_area_elm.innerHTML = buf;
    }
}

function operation_table_list_number (update_operation_table_info = true, operation_number = null) {
    operation_search_area_elm.style.display = "block";
    operation_table_area_elm.innerHTML = "";
    if (update_operation_table_info) {
        operation_table_area_supplement_elm.innerHTML = "";
    }
    
    if (operation_table["diagram_revision"] === get_diagram_revision()) {
        get_diagram_id(get_date_string(get_timestamp()), null, function (diagram_data) {
            if (diagram_data !== null) {
                draw_operation_table(diagram_data["diagram_id"] === operation_table["diagram_id"], update_operation_table_info);
                if (operation_number !== null) {
                    operation_detail(operation_number, operation_table["diagram_id"], true);
                }
            }
        });
    } else {
        draw_operation_table(null, update_operation_table_info);
    }
}

function get_start_end_time_html (time_str, is_starting_time, override_text = null) {
    if (time_str === null) {
        return "<span style='color: #999999;'>" + (override_text === null ? "N/A" : override_text) + "</span>";
    }
    
    var inner_text = override_text === null ? time_str : override_text;
    
    if (is_starting_time && time_str >= "12:00") {
        return "<span style='color: " + (config["dark_mode"] ? "#99ccff" : "#0066cc") + ";'>" + inner_text + "</span>";
    }
    
    if (!is_starting_time && time_str < "12:00") {
        return "<span style='color: " + (config["dark_mode"] ? "#ff99cc" : "#cc0066") + ";'>" + inner_text + "</span>";
    }
    
    return inner_text;
}

function draw_operation_table (is_today, update_operation_table_info) {
    var search_keyword = str_to_halfwidth(document.getElementById("train_number_search").value).toUpperCase();
    if (is_today) {
        var today_ts = get_timestamp();
        var now_hh_mm = get_hh_mm(today_ts);
    }
    
    operation_number_order = [];
    
    var buf = "";
    
    if (document.getElementById("sort_by_operation_groups").checked) {
        var sorting_criteria = "operation_groups";
        
        var groups = operation_table["operation_groups"];
        var group_names = operation_table["operation_group_names"];
    } else {
        var operation_numbers = [];
        for (var operation_group_name of operation_table["operation_group_names"]) {
            operation_numbers.push(...operation_table["operation_groups"][operation_group_name]["operation_numbers"]);
        }
        
        if (document.getElementById("sort_by_starting_location").checked) {
            var sorting_criteria = "starting_location";
        } else {
            var sorting_criteria = "terminal_location";
        }
        
        var operations_list = {};
        var locations = [];
        
        for (var operation_number of operation_numbers) {
            if (!locations.includes(operation_table["operations"][operation_number][sorting_criteria])) {
                locations.push(operation_table["operations"][operation_number][sorting_criteria]);
                operations_list[operation_table["operations"][operation_number][sorting_criteria]] = [];
            }
            
            operations_list[operation_table["operations"][operation_number][sorting_criteria]].push(operation_number);
        }
        
        var groups = {};
        var group_names = [];
        for (var location of sort_station_names(locations)) {
            groups[location] = { operation_numbers: operations_list[location] };
            group_names.push(location);
        }
    }
    
    for (var group_name of group_names) {
        var buf_2 = "";
        var search_hit_count = 0;
        
        if (config["operation_table_view"] === "simple") {
            for (var operation_number of groups[group_name]["operation_numbers"]) {
                var operation_search_hit = false;
                
                if (search_keyword.length >= 1 && operation_number.includes(search_keyword)) {
                    var highlight_start = operation_number.indexOf(search_keyword);
                    var highlight_end = highlight_start + search_keyword.length;
                    
                    var operation_number_html = escape_html(operation_number.substring(0, highlight_start)) + "<mark>" + escape_html(operation_number.substring(highlight_start, highlight_end)) + "</mark>" + escape_html(operation_number.substring(highlight_end));
                    
                    operation_search_hit = true;
                } else {
                    var operation_number_html = escape_html(operation_number);
                }
                
                var buf_3 = "<tr onclick='operation_detail(" + operation_number_order.length + ", " + (is_today ? today_ts : "\"" + operation_table["diagram_id"] + "\"") + ", " + is_today + (search_keyword.length >= 1 ? ", \"" + search_keyword + "\"" : "") + ");'>";
                buf_3 += "<th style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(operation_table["operations"][operation_number]["main_color"]) : operation_table["operations"][operation_number]["main_color"]) + ";'><u>" + operation_number_html + "</u><small>(" + operation_table["operations"][operation_number]["car_count"] + ")</small></th>";
                buf_3 += search_keyword.length >= 1 ? "<td onclick='event.stopPropagation();'" : "<td";
                if (is_today && config["show_assigned_formations_on_operation_table"]) {
                    buf_3 += ">" + get_operation_data_cell_html(operation_number, "section", 0, now_hh_mm);
                } else {
                    if (operation_table["operations"][operation_number]["starting_time"] === null) {
                        buf_3 += " class='after_operation'>";
                    } else {
                        buf_3 += ">";
                    }
                }
                if (search_keyword.length >= 1) {
                    var previous_train_title = null;
                    var train_search_hit_count = 0;
                    
                    for (var train of operation_table["operations"][operation_number]["trains"]) {
                        if (train["train_number"].startsWith(".")) {
                            continue;
                        }
                        
                        var train_title = train["train_number"].split("__")[0];
                        
                        if (train_title === previous_train_title) {
                            continue;
                        }
                        
                        var train_data = get_train(train["line_id"], "direction" in train ? train["direction"] === "inbound" : null /*v25.09-1以前の仕様で作成された時刻表データとの互換性維持*/, train["train_number"], train["starting_station"]);
                        
                        if (train_title.includes(search_keyword)) {
                            if (train_search_hit_count >= 3) {
                                buf_3 += "…";
                                break;
                            }
                            
                            var highlight_start = train_title.indexOf(search_keyword);
                            var highlight_end = highlight_start + search_keyword.length;
                            
                            if (train_data !== null) {
                                buf_3 += "<button type='button' style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, train_data["train_type"], "#333333")) : get_train_color(train_title, train_data["train_type"], "#333333")) + ";' onclick='train_detail(\"" + train["line_id"] + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + train["direction"] + "_trains\", " + is_today + ", " + is_today + ");'>" + escape_html(train_title.substring(0, highlight_start)) + "<mark>" + escape_html(train_title.substring(highlight_start, highlight_end)) + "</mark>" + escape_html(train_title.substring(highlight_end)) + "</button>";
                            } else {
                                buf_3 += "<button type='button' style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, "", "#333333")) : get_train_color(train_title, "", "#333333")) + ";' onclick='train_detail(\"" + train["line_id"] + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + train["direction"] + "_trains\", " + is_today + ", " + is_today + ");'>" + escape_html(train_title.substring(0, highlight_start)) + "<mark>" + escape_html(train_title.substring(highlight_start, highlight_end)) + "</mark>" + escape_html(train_title.substring(highlight_end)) + "</button>";
                            }
                            
                            operation_search_hit = true;
                            train_search_hit_count++;
                        }
                        
                        previous_train_title = train_title;
                    }
                    
                    if (train_search_hit_count == 0) {
                        buf_3 += "<small>(該当なし)</small>";
                    }
                } else {
                    if (config["show_current_trains_on_operation_table"] && is_today) {
                        if (operation_table["operations"][operation_number]["starting_time"] === null) {
                            buf_3 += "<small>(運用なし)</small> " + escape_html(operation_table["operations"][operation_number]["starting_location"]);
                        } else if (operation_table["operations"][operation_number]["starting_time"] > now_hh_mm) {
                            buf_3 += "<small>(出庫前)</small> " + escape_html(operation_table["operations"][operation_number]["starting_location"]) + (operation_table["operations"][operation_number]["starting_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["starting_track"]) + ")</small>" : "");
                        } else {
                            var current_train_line_id = null;
                            var current_train_is_inbound = null;
                            var current_train_number = null;
                            var current_train_starting_station = null;
                            var formations_can_changed = null;
                            for (var train of operation_table["operations"][operation_number]["trains"]) {
                                if (train["final_arrival_time"] < now_hh_mm) {
                                    continue;
                                }
                                
                                current_train_line_id = train["line_id"];
                                current_train_is_inbound = "direction" in train ? train["direction"] === "inbound" : null; //v25.09-1以前の仕様で作成された時刻表データとの互換性維持
                                current_train_number = train["train_number"];
                                current_train_starting_station = train["starting_station"];
                                formations_can_changed = "formations_can_changed" in train ? train["formations_can_changed"] : false;
                                
                                break;
                            }
                            
                            if (current_train_number !== null) {
                                if (current_train_number.startsWith(".")) {
                                    buf_3 += "<small>(待機)</small> <span" + (formations_can_changed ? " class='warning_sentence'" : "") + ">" + escape_html(current_train_number.substring(1).split("__")[0]) + "</span>";
                                } else {
                                    var train_data = get_train(current_train_line_id, current_train_is_inbound, current_train_number, current_train_starting_station);
                                    var train_title = current_train_number.split("__")[0];
                                    
                                    if (train_data !== null) {
                                        buf_3 += "<span style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_title, train_data["train_type"])) : get_train_color(train_title, train_data["train_type"])) + "'>" + escape_html(train_data["train_type"].substring(0, 1)) + " <b>" + escape_html(train_title) + "</b></span>　" + escape_html("destination" in train_data ? train_data["destination"] : get_final_destination(current_train_line_id, current_train_is_inbound, current_train_number, current_train_starting_station)) + "<small> 行き</small>";
                                    } else {
                                        buf_3 += "<span style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_title)) : get_train_color(train_title)) + "'><b>" + escape_html(train_title) + "</b></span>";
                                    }
                                }
                            } else {
                                buf_3 += "<small>(入庫済み)</small> " + escape_html(operation_table["operations"][operation_number]["terminal_location"]) + (operation_table["operations"][operation_number]["terminal_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["terminal_track"]) + ")</small>" : "");
                            }
                        }
                    } else {
                        if (config["show_start_end_times_on_operation_table"]) {
                            buf_3 += "<p>" + escape_html(operation_table["operations"][operation_number]["starting_location"]) + (operation_table["operations"][operation_number]["starting_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["starting_track"]) + ")</small>" : "") + "<br>" + get_start_end_time_html(operation_table["operations"][operation_number]["starting_time"], true) + "<span class='two_headed_arrow'></span></p>";
                            buf_3 += "<p>" + escape_html(operation_table["operations"][operation_number]["terminal_location"]) + (operation_table["operations"][operation_number]["terminal_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["terminal_track"]) + ")</small>" : "") + "<br>" + get_start_end_time_html(operation_table["operations"][operation_number]["ending_time"], false) + "</p>";
                        } else {
                            buf_3 += "<p>" + get_start_end_time_html(operation_table["operations"][operation_number]["starting_time"], true, escape_html(operation_table["operations"][operation_number]["starting_location"])) + (operation_table["operations"][operation_number]["starting_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["starting_track"]) + ")</small>" : "") + "<span class='two_headed_arrow'></span></p>";
                            buf_3 += "<p>" + get_start_end_time_html(operation_table["operations"][operation_number]["ending_time"], false, escape_html(operation_table["operations"][operation_number]["terminal_location"])) + (operation_table["operations"][operation_number]["terminal_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["terminal_track"]) + ")</small>" : "") + "</p>";
                        }
                    }
                }
                buf_3 += "</td></tr>";
                
                if (search_keyword.length === 0 || operation_search_hit) {
                    buf_2 += buf_3;
                    operation_number_order.push(operation_number);
                    search_hit_count++;
                }
            }
            
            if (buf_2.length >= 1) {
                buf_2 = "<tr><th>運用番号</th><th>" + (search_keyword.length >= 1 ? "列車番号" : (config["show_current_trains_on_operation_table"] && is_today ? "現時刻の列車" : "出庫 / 入庫")) + "</th></tr>" + buf_2;
            }
        } else {
            for (var operation_number of groups[group_name]["operation_numbers"]) {
                var operation_search_hit = false;
                
                if (search_keyword.length >= 1 && operation_number.includes(search_keyword)) {
                    var highlight_start = operation_number.indexOf(search_keyword);
                    var highlight_end = highlight_start + search_keyword.length;
                    
                    var operation_number_html = escape_html(operation_number.substring(0, highlight_start)) + "<mark>" + escape_html(operation_number.substring(highlight_start, highlight_end)) + "</mark>" + escape_html(operation_number.substring(highlight_end));
                    
                    operation_search_hit = true;
                } else {
                    var operation_number_html = escape_html(operation_number);
                }
                
                var buf_3 = "<tr><th onclick='operation_detail(" + operation_number_order.length + ", " + (is_today ? today_ts : "\"" + operation_table["diagram_id"] + "\"") + ", " + is_today + (search_keyword.length >= 1 ? ", \"" + search_keyword + "\"" : "") + ");' style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(operation_table["operations"][operation_number]["main_color"]) : operation_table["operations"][operation_number]["main_color"]) + ";'><u>" + operation_number_html + "</u><small>(" + operation_table["operations"][operation_number]["car_count"] + "両)</small>";
                if (is_today && config["show_assigned_formations_on_operation_table"]) {
                    buf_3 += get_operation_data_cell_html(operation_number, "section", 0, now_hh_mm);
                }
                buf_3 += "</th>";
                
                if (config["show_start_end_times_on_operation_table"]) {
                    buf_3 += "<td class='start_end_location'>";
                    buf_3 += "○ " + escape_html(operation_table["operations"][operation_number]["starting_location"]) + (operation_table["operations"][operation_number]["starting_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["starting_track"]) + ")</small>" : "") + "<br>";
                    buf_3 += "△ " + escape_html(operation_table["operations"][operation_number]["terminal_location"]) + (operation_table["operations"][operation_number]["terminal_track"] !== null ? "<small>(" + escape_html(operation_table["operations"][operation_number]["terminal_track"]) + ")</small>" : "") + "<br>";
                    buf_3 += get_start_end_time_html(operation_table["operations"][operation_number]["starting_time"], true) + " - " + get_start_end_time_html(operation_table["operations"][operation_number]["ending_time"], false);
                    buf_3 += "</td>";
                }
                
                buf_3 += "<td" + (operation_table["operations"][operation_number]["starting_time"] === null ? " class='after_operation'" : "") + ">";
                
                if (config["operation_table_view"] === "timeline") {
                    for (var hour = 4; hour <= 27; hour++) {
                        buf_3 += "<div class='timeline_hour' style='width: " + (60 * config["operation_table_timeline_scale"] - 2) + "px;'></div>";
                    }
                    
                    if (is_today) {
                        buf_3 += "<div class='timeline_now' style='left: " + ((hh_mm_to_minutes(now_hh_mm) - 240) * config["operation_table_timeline_scale"] - 1) + "px;'></div>";
                    }
                }
                
                var previous_final_arrival_time = operation_table["operations"][operation_number]["starting_time"];
                for (var cnt = 0; cnt < operation_table["operations"][operation_number]["trains"].length; cnt++) {
                    var train = operation_table["operations"][operation_number]["trains"][cnt];
                    
                    if (train["train_number"].startsWith(".")) {
                        if (config["operation_table_view"] === "classic") {
                            buf_3 += "<div class='deposited_train_cell'><div" + ("formations_can_changed" in train && train["formations_can_changed"] ? " class='warning_sentence'" : "") + ">" + escape_html(train["train_number"].substring(1).split("__")[0]) + "</div><div" + (is_today && previous_final_arrival_time < now_hh_mm && train["final_arrival_time"] >= now_hh_mm ? " class='search_highlight'" : "") + ">" + train["first_departure_time"] + "<br>" + train["final_arrival_time"] + "</div></div>";
                        } else {
                            var first_departure_time_minutes = hh_mm_to_minutes(train["first_departure_time"]);
                            
                            buf_3 += "<div class='timeline_deposited_train' style='left: " + ((first_departure_time_minutes - 240) * config["operation_table_timeline_scale"]) + "px; width: " + ((hh_mm_to_minutes(train["final_arrival_time"]) - first_departure_time_minutes) * config["operation_table_timeline_scale"] - 4)  + "px;'><div" + ("formations_can_changed" in train && train["formations_can_changed"] ? " class='warning_sentence'" : "") + ">" + escape_html(train["train_number"].substring(1).split("__")[0]) + "</div></div>";
                        }
                        
                        previous_final_arrival_time = train["final_arrival_time"];
                    } else {
                        var train_data = get_train(train["line_id"], train["direction"] === "inbound", train["train_number"], train["starting_station"]);
                        var train_title = train["train_number"].split("__")[0];
                        var operations_list = get_operations(train["line_id"], train["train_number"], train["starting_station"], train["direction"] + "_trains");
                        
                        if (search_keyword.length >= 1 && train_title.includes(search_keyword)) {
                            var highlight_start = train_title.indexOf(search_keyword);
                            var highlight_end = highlight_start + search_keyword.length;
                            
                            var train_title_html = escape_html(train_title.substring(0, highlight_start)) + "<mark>" + escape_html(train_title.substring(highlight_start, highlight_end)) + "</mark>" + escape_html(train_title.substring(highlight_end));
                            
                            operation_search_hit = true;
                        } else {
                            var train_title_html = escape_html(train_title);
                        }
                        
                        var terminal_station_name = train["terminal_station"];
                        var final_arrival_time = train["final_arrival_time"];
                        var terminal_line_id = train["line_id"];
                        for (var cnt_2 = 1; cnt + cnt_2 < operation_table["operations"][operation_number]["trains"].length; cnt_2++) {
                            var train_index = cnt + cnt_2;
                            
                            if (operation_table["operations"][operation_number]["trains"][train_index]["train_number"] !== train["train_number"]) {
                                break;
                            }
                            
                            terminal_station_name = operation_table["operations"][operation_number]["trains"][train_index]["terminal_station"];
                            final_arrival_time = operation_table["operations"][operation_number]["trains"][train_index]["final_arrival_time"];
                            terminal_line_id = operation_table["operations"][operation_number]["trains"][train_index]["line_id"];
                        }
                        
                        for (var station of railroad_info["lines"][train["line_id"]]["stations"]) {
                            if (station["station_name"] === train["starting_station"]) {
                                var starting_station = station["station_initial"];
                                break;
                            }
                        }
                        
                        if (config["operation_table_view"] === "classic") {
                            buf_3 += "<div class='train_cell' onclick='train_detail(\"" + train["line_id"] + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + train["direction"] + "_trains\", " + is_today + ", " + is_today + ");'>";
                            if (train_data !== null) {
                                buf_3 += "<div style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, train_data["train_type"], "#333333")) : get_train_color(train_title, train_data["train_type"], "#333333")) + ";'><small>" + escape_html(train_data["train_type"].substring(0, 1)) + "</small> " + train_title_html + (operations_list.length >= 2 ? "<small>(" + train["position_forward"] + (train["position_rear"] > train["position_forward"] ? "-" + train["position_rear"] : "") + ")</small>" : "") + "</div>";
                            } else {
                                buf_3 += "<div style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, "", "#333333")) : get_train_color(train_title, "", "#333333")) + "'>" + train_title_html + "</div>";
                            }
                            
                            for (var station of railroad_info["lines"][terminal_line_id]["stations"]) {
                                if (station["station_name"] === terminal_station_name) {
                                    var terminal_station = station["station_initial"];
                                    break;
                                }
                            }
                            
                            buf_3 += "<div" + (is_today && previous_final_arrival_time < now_hh_mm && final_arrival_time >= now_hh_mm ? " class='search_highlight'" : "") + ">" + starting_station + " " + train["first_departure_time"] + "<br>" + terminal_station + " " + final_arrival_time + "</div>";
                            buf_3 += "</div>";
                        } else {
                            var first_departure_time_minutes = hh_mm_to_minutes(train["first_departure_time"]);
                            
                            if (train_data !== null) {
                                buf_3 += "<div class='timeline_train' onclick='train_detail(\"" + train["line_id"] + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + train["direction"] + "_trains\", " + is_today + ", " + is_today + ");' style='left: " + ((first_departure_time_minutes - 240) * config["operation_table_timeline_scale"]) + "px; width: " + ((hh_mm_to_minutes(final_arrival_time) - first_departure_time_minutes) * config["operation_table_timeline_scale"])  + "px;'><div style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, train_data["train_type"], "#333333")) : get_train_color(train_title, train_data["train_type"], "#333333")) + ";'><small>" + escape_html(train_data["train_type"].substring(0, 1)) + "</small> " + train_title_html + (operations_list.length >= 2 ? "<small>(" + train["position_forward"] + (train["position_rear"] > train["position_forward"] ? "-" + train["position_rear"] : "") + ")</small>" : "") + "</div><div>" + starting_station + "</div></div>";
                            } else {
                                buf_3 += "<div class='timeline_train' onclick='train_detail(\"" + train["line_id"] + "\", \"" + train["train_number"] + "\", \"" + train["starting_station"] + "\", \"" + train["direction"] + "_trains\", " + is_today + ", " + is_today + ");' style='left: " + ((first_departure_time_minutes - 240) * config["operation_table_timeline_scale"]) + "px; width: " + ((hh_mm_to_minutes(final_arrival_time) - first_departure_time_minutes) * config["operation_table_timeline_scale"])  + "px;'><div style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(get_train_color(train_title, "", "#333333")) : get_train_color(train_title, "", "#333333")) + ";'>" + train_title_html + (operations_list.length >= 2 ? "<small>(" + train["position_forward"] + (train["position_rear"] > train["position_forward"] ? "-" + train["position_rear"] : "") + ")</small>" : "") + "</div>" + starting_station + "</div>";
                            }
                        }
                        
                        previous_final_arrival_time = final_arrival_time;
                        cnt += cnt_2 - 1;
                    }
                }
                
                if (config["show_comments_on_operation_table"] && operation_table["operations"][operation_number]["comment"] !== null) {
                    buf_3 += "<div class='operation_table_comment'>" + escape_html(operation_table["operations"][operation_number]["comment"]) + "</div>";
                }
                
                buf_3 += "</td></tr>";
                
                if (search_keyword.length === 0 || operation_search_hit) {
                    buf_2 += buf_3;
                    operation_number_order.push(operation_number);
                    search_hit_count++;
                }
            }
            
            if (buf_2.length >= 1) {
                if (config["operation_table_view"] === "classic") {
                    var buf_3 = "列車一覧";
                } else {
                    var buf_3 = "";
                    for (var hour = 4; hour <= 27; hour++) {
                        buf_3 += "<div class='timeline_hour' style='width: " + (60 * config["operation_table_timeline_scale"] - 2) + "px;'>" + hour + "時</div>";
                    }
                }
                buf_2 = "<tr><th>運用番号</th>" + (config["show_start_end_times_on_operation_table"]  ? "<th>出入庫</th>" : "") + "<th>" + buf_3 + "</th></tr>" + buf_2;
            }
        }
        
        if (buf_2.length >= 1) {
            var checkbox_id = "operation_group_" + group_name;
            buf += "<input type='checkbox' id='" + checkbox_id + "'" + (checkbox_id in operation_table_drop_down_status && operation_table_drop_down_status[checkbox_id] ? " checked='checked'" : "") + " onclick='update_operation_table_drop_down_status(this);'>";
            buf += "<label for='" + checkbox_id + "' class='operation_table_drop_down" + (config["operation_table_view"] === "simple" ? "" : " wide_drop_down") + "'" + ("main_color" in groups[group_name] ? " style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(groups[group_name]["main_color"]) : groups[group_name]["main_color"]) + ";'" : "") + ">" + escape_html(group_name) + (search_keyword.length >= 1 ? "<small>(" + search_hit_count + ")</small>" : "") + "</label>";
            buf += "<div><table class='operation_table_" + config["operation_table_view"] + "'>" + buf_2 + "</table></div>";
        }
    }
    
    if (buf.length >= 1) {
        operation_table_area_elm.innerHTML = buf;
    } else {
        operation_table_area_elm.innerHTML = "<div class='no_data'>検索キーワードを含む運用・列車番号が見つかりません</div>";
    }
    
    if (update_operation_table_info) {
        buf = "";
        if ("joined_railroads" in railroad_info) {
            for (var railroad_id of railroad_info["joined_railroads"]) {
                buf += "<a class='related_link' href='/railroad_" + add_slashes(railroad_id) + "/operation_table/' onclick='event.preventDefault(); select_railroad(\"" + add_slashes(railroad_id) + "\", \"operation_table_mode\", \"" + operation_table["diagram_revision"] + "\");' style='border-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["related_railroads"][railroad_id]["main_color"]) : railroad_info["related_railroads"][railroad_id]["main_color"]) + ";'>" + escape_html(railroad_info["related_railroads"][railroad_id]["railroad_name"]) + "の運用表</a>";
            }
            
            if (buf.length >= 1) {
                buf = "<h3>関連項目</h3>" + buf;
            }
        }
        
        buf += "<div class='informational_text'>ダイヤ情報更新日時: " + get_date_and_time(diagram_info[operation_table["diagram_revision"]]["last_modified_timestamp"]) + "<br>運用表更新日時: " + get_date_and_time(operation_table["last_modified_timestamp"]) + "<br>時刻表更新日時: " + get_date_and_time(timetable["last_modified_timestamp"]) + "</div>";
        buf += "<a href='#about_railroad_data_popup' class='bottom_link' onclick='event.preventDefault(); about_railroad_data();'>使用しているデータについて</a>";
        
        operation_table_area_supplement_elm.innerHTML = buf;
    }
}


var history_back_promise = null;
var history_back_resolve = null;


(function () {
    var body_elm = document.getElementsByTagName("body")[0];
    
    var on_demand_funcs_script_elm = document.createElement("script");
    on_demand_funcs_script_elm.src = "/on_demand_funcs.js?v=" + UNYOHUB_VERSION;
    on_demand_funcs_script_elm.async = true;
    body_elm.appendChild(on_demand_funcs_script_elm);
    
    var captcha_script_elm = document.createElement("script");
    captcha_script_elm.src = "/libs/zizai_captcha/captcha.js";
    captcha_script_elm.async = true;
    body_elm.appendChild(captcha_script_elm);
    
    var elem2img_script_elm = document.createElement("script");
    elem2img_script_elm.src = "/libs/elem2img.js";
    elem2img_script_elm.async = true;
    body_elm.appendChild(elem2img_script_elm);
} ());


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service_worker.php").then(function () {
        // 旧版の更新ボタンは /?ts=... を開くだけなので、新版の画面側でWorkerの更新を完了させる
        if (new URLSearchParams(location.search).has("ts")) {
            funcs_load_promise.then(function () {
                return complete_app_update();
            }).then(function () {
                history.replaceState(null, "", location.pathname + location.hash);
            }).catch(function (error) {
                console.error("App update failed", error);
            });
        }
    }).catch(function (error) {
        console.error("Service Worker registration failed", error);
    });
}
