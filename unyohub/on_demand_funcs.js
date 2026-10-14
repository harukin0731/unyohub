/* 鉄道運用Hub on_demand_funcs.js */


function bin_to_int (uint8_bin, start, length) {
    var end = start + length;
    var byte_start = Math.floor(start / 8);
    
    if (end % 8 >= 1) {
        var bin_int = uint8_bin[byte_start] << 8;
        if (uint8_bin.length > byte_start + 1) {
            bin_int += uint8_bin[byte_start + 1];
        }
        
        return bin_int >> (8 - end % 8) & (2**length - 1);
    } else {
        return uint8_bin[byte_start] & (2**length - 1);
    }
}

function get_guest_id () {
    if (config["guest_id"] === null) {
        const BASE32_TABLE = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7"];
        
        var random_bytes = crypto.getRandomValues(new Uint8Array(8));
        var guest_id = "*"
        for (var cnt = 0; cnt < 12; cnt++) {
            guest_id += BASE32_TABLE[bin_to_int(random_bytes, cnt * 5, 5)];
        }
        
        config["guest_id"] = guest_id;
        
        save_config();
    }
    
    return config["guest_id"];
}


function save_railroad_user_data (railroad_id) {
    var scroll_amount = article_elms[0].scrollTop;
    
    idb_start_transaction("user_data", true, function (transaction) {
        var user_data_store = transaction.objectStore("user_data");
        user_data_store.put({
            railroad_id : railroad_id,
            position_selected_line : position_selected_line,
            position_scroll_amount : scroll_amount,
            use_group_divisions_on_operation_data : use_group_divisions_on_operation_data,
            rules_last_read : railroad_rules_last_read
        });
    });
}


var menu_elm = document.getElementById("menu");
var menu_button_elm = document.getElementById("menu_button");

function menu_click (force_close = false) {
    if (menu_elm.className === "menu_open" || force_close) {
        menu_elm.className = "";
        menu_button_elm.classList.remove("menu_button_active");
    } else {
        menu_elm.className = "menu_open";
        menu_button_elm.classList.add("menu_button_active");
    }
}


function open_popup (id, title = null, allow_screenshot = false) {
    if (square_popup_is_open) {
        close_square_popup();
    }
    
    popup_background_elm.style.display = "block";
    
    var elm = document.getElementById(id);
    
    if (elm === null) {
        elm = document.createElement("div");
        elm.id = id;
        elm.className = "popup";
        
        var buf = "<button type='button' class='popup_close_button' onclick='popup_close();'></button>";
        
        if (allow_screenshot) {
            buf += "<button type='button' class='screenshot_button' onclick='take_screenshot(\"" + id + "_inner\", true);'></button>";
        }
        
        if (title !== null) {
            buf += "<h2>" + title + "</h2>";
        }
        
        buf += "<div id='" + id + "_inner'></div>";
        
        elm.innerHTML = buf;
        
        document.getElementsByTagName("body")[0].appendChild(elm);
    }
    
    for (var cnt = 0; cnt < popup_history.length; cnt++) {
        document.getElementById(popup_history[cnt]).style.zIndex = cnt + 51;
        
        if (popup_history[cnt] === id) {
            popup_history.splice(cnt, 1);
            cnt--;
        }
    }
    
    popup_history.push(id);
    elm.style.zIndex = 50 + popup_history.length;
    
    if (!elm.classList.contains("popup_active")) {
        elm.classList.add("popup_active");
        
        menu_click(true);
    }
    
    if (history_back_promise instanceof Promise) {
        history_back_promise.then(function () {
            history.pushState(null, "", location.pathname + "#" + id);
        });
    } else {
        history.pushState(null, "", location.pathname + "#" + id);
    }
    
    return document.getElementById(id + "_inner");
}

function popup_close (close_all = false, update_url = true) {
    if (popup_history.length === 0) {
        return;
    }
    
    var id = popup_history.pop();
    
    if (popup_history.length === 0) {
        popup_background_elm.style.display = "none";
    }
    
    document.getElementById(id).classList.remove("popup_active");
    
    if (update_url) {
        history_popstate();
    }
    
    if (close_all && popup_history.length >= 1) {
        if (history_back_promise instanceof Promise) {
            history_back_promise.then(function () {
                popup_close(true);
            });
        } else {
            popup_close(true);
        }
    }
}

var screen_elm = document.getElementById("popup_screen");
var wait_screen_elm = document.getElementById("wait_screen");

function open_square_popup (id, is_oblong_popup = false, title = null, allow_screenshot = false) {
    if (square_popup_is_open) {
        close_square_popup();
    }
    
    screen_elm.className = "popup_screen_active";
    
    var elm = document.getElementById(id);
    
    if (elm === null) {
        elm = document.createElement("div");
        elm.id = id;
        
        if (is_oblong_popup) {
            elm.className = "oblong_popup";
        } else {
            elm.className = "square_popup";
        }
        
        var buf = "<button type='button' class='popup_close_button' onclick='close_square_popup();'></button>";
        
        if (allow_screenshot) {
            buf += "<button type='button' class='screenshot_button' onclick='take_screenshot(\"" + id + "_inner\", true);'></button>";
        }
        
        if (title !== null) {
            buf += "<h3>" + title + "</h3>";
        }
        
        buf += "<div id='" + id + "_inner'></div>";
        
        elm.innerHTML = buf;
        
        screen_elm.appendChild(elm);
    }
    
    elm.classList.add("popup_active");
    
    popup_history.push(id);
    square_popup_is_open = true;
    
    if (history_back_promise instanceof Promise) {
        history_back_promise.then(function () {
            history.pushState(null, "", location.pathname + "#" + id);
        });
    } else {
        history.pushState(null, "", location.pathname + "#" + id);
    }
    
    return document.getElementById(id + "_inner");
}

function close_square_popup (update_url = true) {
    var id = popup_history.pop();
    
    screen_elm.className = "";
    document.getElementById(id).classList.remove("popup_active");
    
    square_popup_is_open = false;
    
    if (update_url) {
        history_popstate();
    }
    
    menu_click(true);
}

function open_wait_screen () {
    wait_screen_elm.style.display = "block";
    screen_elm.style.backgroundColor = "transparent";
}

function close_wait_screen () {
    wait_screen_elm.style.display = "none";
    screen_elm.style.backgroundColor = "";
}


function show_railroad_list () {
    var popup_inner_elm = open_popup("railroad_select_popup", "路線系統の切り替え");
    
    splash_screen_elm.innerHTML = "";
    
    get_railroad_list(function (railroads, loading_completed) {
        update_railroad_list(railroads, popup_inner_elm, loading_completed);
    });
}


function show_off_line_message () {
    var popup_inner_elm = open_square_popup("off_line_message_popup", true, "オフラインモード");
    
    popup_inner_elm.innerHTML = "<div class='informational_text'>端末がオフライン状態のため、前回のアクセス時に取得したデータを表示します。<br><br>この状態ではダウンロードされていないデータや一部の機能がご利用いただけません。</div>";
}


var menu_announcements_elm = document.getElementById("menu_announcements");
var railroad_announcement_elm = document.getElementById("railroad_announcement");

function mark_announcements_read (announcements_data) {
    if (announcements_data["last_read_timestamp"] === announcements_data["last_modified_timestamp"]) {
        return;
    }
    
    var announcements_data_new = {...announcements_data};
    
    announcements_data_new["last_read_timestamp"] = announcements_data_new["last_modified_timestamp"];
    
    idb_start_transaction("announcements", true, function (transaction) {
        var announcements_store = transaction.objectStore("announcements");
        announcements_store.put(announcements_data_new);
    });
}

function fetch_announcements (railroad_id, mark_read, callback_func) {
    if (railroad_id === null) {
        var railroad_id_key = "/";
        var railroad_id_q = "";
    } else {
        var railroad_id_key = railroad_id;
        var railroad_id_q = "railroad_id=" + escape_form_data(railroad_id) + "&";
    }
    
    idb_start_transaction("announcements", false, function (transaction) {
        var announcements_store = transaction.objectStore("announcements");
        var get_request = announcements_store.get(railroad_id_key);
        
        get_request.onsuccess = function (evt) {
            if (evt.target.result !== undefined) {
                var announcements_data = evt.target.result;
            } else {
                var announcements_data = {announcements : [], last_modified_timestamp : 0, last_read_timestamp : 0};
            }
            
            if (navigator.onLine) {
                ajax_post("announcements.php", railroad_id_q + "last_modified_timestamp=" + announcements_data["last_modified_timestamp"], function (response, last_modified) {
                    if (response === "NEW_ANNOUNCEMENTS_NOT_EXIST" || response === false) {
                        if (mark_read) {
                            mark_announcements_read(announcements_data);
                        }
                        
                        callback_func(announcements_data["announcements"], announcements_data["last_read_timestamp"]);
                    } else {
                        var announcements_data_new = {announcements : JSON.parse(response)};
                        
                        announcements_data_new["railroad_id"] = railroad_id_key;
                        
                        var last_modified_date = new Date(last_modified);
                        announcements_data_new["last_modified_timestamp"] = Math.floor(last_modified_date.getTime() / 1000);
                        
                        if (mark_read) {
                            announcements_data_new["last_read_timestamp"] = announcements_data_new["last_modified_timestamp"];
                        } else {
                            announcements_data_new["last_read_timestamp"] = announcements_data["last_read_timestamp"];
                        }
                        
                        idb_start_transaction("announcements", true, function (transaction) {
                            var announcements_store = transaction.objectStore("announcements");
                            
                            announcements_store.put(announcements_data_new);
                        });
                        
                        callback_func(announcements_data_new["announcements"], announcements_data["last_read_timestamp"]);
                    }
                });
            } else {
                if (mark_read) {
                    mark_announcements_read(announcements_data);
                }
                
                callback_func(announcements_data["announcements"], announcements_data["last_read_timestamp"]);
            }
        };
    });
}

function check_announcements (show_important_announcements = false) {
    announcement_last_checked = get_timestamp();
    
    fetch_announcements(null, false, function (announcements_data, last_read_timestamp) {
        var ts = get_timestamp();
        
        var new_announcement_exists = false;
        
        for (var announcement_data of announcements_data) {
            if (announcement_data["expiration_timestamp"] >= ts && announcement_data["last_modified_timestamp"] > last_read_timestamp) {
                if (announcement_data["is_important"]) {
                    if (show_important_announcements) {
                        show_announcements(null, true);
                    } else {
                        menu_button_elm.classList.add("menu_button_with_important_notification");
                        menu_announcements_elm.className = "new_icon_red";
                    }
                    
                    return;
                }
                
                new_announcement_exists = true;
            }
        }
        
        if (new_announcement_exists) {
            menu_button_elm.classList.add("menu_button_with_notification");
            menu_announcements_elm.className = "new_icon";
        } else {
            menu_button_elm.classList.remove("menu_button_with_notification");
            menu_announcements_elm.className = "";
        }
        
        menu_button_elm.classList.remove("menu_button_with_important_notification");
    });
}

function update_railroad_announcement (railroad_id, clear_text = false) {
    railroad_announcement_last_checked = get_timestamp();
    
    if (clear_text) {
        railroad_announcement_elm.innerText = "";
    }
    
    railroad_announcement_elm.className = "";
    
    fetch_announcements(railroad_id, false, function (announcements_data, last_read_timestamp) {
        var ts = get_timestamp();
        
        var new_announcement_exists = false;
        var announcement_text = "";
        var new_important_announcement_exists = false;
        
        for (var announcement_data of announcements_data) {
            if (announcement_data["expiration_timestamp"] >= ts) {
                if (announcement_data["last_modified_timestamp"] > last_read_timestamp) {
                    new_announcement_exists = true;
                    
                    if (announcement_data["is_important"]) {
                        new_important_announcement_exists = true;
                    }
                }
                
                if (announcement_data["is_important"]) {
                    if (announcement_text.length >= 1) {
                        announcement_text = "複数の重要な情報があります";
                        
                        continue;
                    }
                    
                    announcement_text = announcement_data["title"];
                }
            }
        }
        
        railroad_announcement_elm.innerText = announcement_text;
        
        if (new_important_announcement_exists) {
            railroad_announcement_elm.className = "announcement_with_important_notification";
        } else if (new_announcement_exists) {
            railroad_announcement_elm.className = "announcement_with_notification";
        }
    });
}

function show_announcements (railroad_id = null, important_announcements_exist = false) {
    var popup_inner_elm = open_square_popup("announcements_popup", true);
    
    menu_button_elm.classList.remove("menu_button_with_notification");
    menu_button_elm.classList.remove("menu_button_with_important_notification");
    menu_announcements_elm.className = "";
    
    if (railroad_id === null) {
        if (important_announcements_exist) {
            var buf = "<h3 id='announcements_heading' class='announcements_heading_important'>重要なお知らせがあります</h3>";
        } else {
            var buf = "<h3 id='announcements_heading'>お知らせ</h3>";
        }
    } else {
        var buf = "<h3 id='announcements_heading' class='railroad_announcements_heading' style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["main_color"]) : railroad_info["main_color"]) + ";'>" + escape_html(railroad_info["railroad_name"]) + "のお知らせ</h3>";
    }
    
    buf += "<div id='announcements_area' class='wait_icon'></div>";
    
    popup_inner_elm.innerHTML = buf;
    
    fetch_announcements(railroad_id, true, function (announcements_data, last_read_timestamp) {
        draw_announcements(railroad_id, announcements_data, last_read_timestamp);
    });
}

function draw_announcements (railroad_id, announcements_data, last_read_timestamp, area_id = "announcements_area") {
    var buf = "";
    
    var ts = get_timestamp();
    
    for (var cnt = 0; cnt < announcements_data.length; cnt++) {
        if (announcements_data[cnt]["expiration_timestamp"] < ts) {
            continue;
        }
        
        buf += "<input type='checkbox' id='" + area_id + "_announcement_" + cnt + "'><label for='" + area_id + "_announcement_" + cnt + "' class='drop_down";
        
        if (announcements_data[cnt]["is_important"]) {
            buf += " important_announcement";
        }
        
        if (last_read_timestamp !== null && announcements_data[cnt]["last_modified_timestamp"] > last_read_timestamp) {
            buf += " new_icon";
        }
        
        buf += "'>" + escape_html(announcements_data[cnt]["title"]) + "</label>";
        
        var dt = new Date(announcements_data[cnt]["last_modified_timestamp"] * 1000);
        
        buf += "<div><div class='announcement'>" + convert_to_html(announcements_data[cnt]["content"]) + "<small>" + escape_html(announcements_data[cnt]["user_name"]) + "　" + dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + ("0" + dt.getMinutes()).slice(-2) + "</small></div></div>";
    }
    
    if (railroad_id !== false) {
        if (buf.length === 0 && last_read_timestamp !== null) {
            buf = "<div class='no_data'>お知らせはありません</div>";
        }
        
        if (user_info !== null && user_info["is_announcement_editor"]) {
            buf += "<a href='/admin/announcements.php?railroad_id=" + (railroad_id === null ? "/" : railroad_id) + "' target='_blank' class='execute_link'>お知らせの編集</a>";
        }
    }
    
    document.getElementById(area_id).innerHTML = buf;
}

function show_railroad_announcements () {
    railroad_announcement_elm.className = "";
    
    show_announcements(railroad_info["railroad_id"]);
}


var background_updater_last_execution = null;
var announcement_last_checked = null;
var railroad_announcement_last_checked = null;

function background_updater () {
    var date_now = new Date();
    var now_ts = Math.floor(date_now.getTime() / 1000);
    
    if (background_updater_last_execution !== null) {
        if (now_ts < background_updater_last_execution + 60) {
            var hh_and_mm = ("0" + date_now.getHours()).slice(-2) + ":" + ("0" + date_now.getMinutes()).slice(-2);
            
            if (mode_val === 0 && position_last_updated !== hh_and_mm && position_last_updated !== null) {
                if (get_date_string(now_ts) === operation_data["operation_date"]) {
                    position_change_time();
                } else {
                    operation_data_last_updated = null;
                    position_mode(null, "__today__");
                }
            }
            
            if (announcement_last_checked !== null && now_ts > announcement_last_checked + 1800) {
                check_announcements();
            }
            
            if (railroad_info !== null && railroad_announcement_last_checked !== null && now_ts > railroad_announcement_last_checked + 600) {
                update_railroad_announcement(railroad_info["railroad_id"]);
            }
            
            if (navigator.onLine && operation_data_last_updated !== null && operation_data_last_updated < now_ts - config["refresh_interval"] * 60) {
                update_operation_data(function () {}, function () {}, function (update_exists) {
                    if (!update_exists) {
                        return;
                    }
                    
                    switch (mode_val) {
                        case 0:
                            position_change_time(0);
                            break;
                        
                        case 1:
                            if (timetable_selected_station !== null) {
                                timetable_select_station(timetable_selected_station);
                            }
                            break;
                        
                        case 2:
                            operation_data_draw();
                            break;
                        
                        case 4:
                            if (operation_table !== null && config["show_assigned_formations_on_operation_table"]) {
                                draw_operation_table(true, false);
                            }
                            break;
                    }
                }, function () {}, operation_date_last, mode_val <= 1 && "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : null, true);
            }
        } else if (mode_val === 0) {
            mes("情報を更新しています...", false, 2);
        }
    }
    
    background_updater_last_execution = now_ts;
}

var background_updater_interval_id = null;

function background_updater_start_stop () {
    if (background_updater_interval_id !== null) {
        clearInterval(background_updater_interval_id);
    }
    
    if (document.visibilityState === "visible") {
        background_updater();
        background_updater_interval_id = setInterval(background_updater, 2000);
    } else {
        background_updater_interval_id = null;
    }
}

document.onvisibilitychange = background_updater_start_stop;
background_updater_start_stop();


function select_lines (line_id = null, station_name = null, position_mode = true) {
    var popup_inner_elm = open_square_popup("line_select_popup", true, "路線の選択");
    
    if (line_id === null || station_name === null) {
        var lines = [...railroad_info["lines_order"]];
        var joined_lines = "joined_lines_order" in railroad_info ? [...railroad_info["joined_lines_order"]] : [];
        var connecting_railroads = [];
        
        if (!position_mode) {
            lines.unshift(null);
        }
    } else {
        var lines = position_mode ? [] : [line_id];
        var joined_lines = [];
        
        for (var station_data of railroad_info["lines"][line_id]["stations"]) {
            if (station_data["station_name"] === station_name) {
                if ("connecting_lines" in station_data) {
                    for (var connecting_line of station_data["connecting_lines"]) {
                        if (connecting_line["line_id"] === line_id) {
                            continue;
                        }
                        
                        if (!("affiliated_railroad_id" in railroad_info["lines"][connecting_line["line_id"]])) {
                            lines.push(connecting_line["line_id"]);
                        } else {
                            joined_lines.push(connecting_line["line_id"]);
                        }
                    }
                }
                
                var connecting_railroads = "connecting_railroads" in station_data ? station_data["connecting_railroads"] : [];
                
                break;
            }
        }
    }
    
    var buf = "";
    for (var line_id of lines) {
        if (line_id !== null) {
            var line_id_text = "\"" + line_id + "\"";
            var line_color = config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][line_id]["line_color"]) : railroad_info["lines"][line_id]["line_color"];
            var line_symbol = "line_symbol" in railroad_info["lines"][line_id] ? railroad_info["lines"][line_id]["line_symbol"] : railroad_info["lines"][line_id]["line_name"].substring(0, 1);
            var line_name = escape_html(railroad_info["lines"][line_id]["line_name"]);
        } else {
            var line_id_text = null;
            var line_color = "transparent";
            var line_symbol = "";
            var line_name = "全ての路線";
        }
        
        buf += "<button type='button' onclick='close_square_popup(); ";
        
        if (position_mode) {
            buf += "position_change_lines(" + line_id_text + ", " + (station_name === null ? "0" : "\"" + add_slashes(station_name) + "\"") + ");";
        } else if (mode_val === 1 && station_name === timetable_selected_station) {
            buf += "timetable_change_lines(" + line_id_text + ");";
        } else {
            buf += "timetable_select_station(\"" + add_slashes(station_name) + "\", " + line_id_text + ", true);";
        }
        
        buf += "'><abbr style='background-color: " + line_color + ";'>" + line_symbol + "</abbr>" + line_name + "</button>";
    }
    
    if (joined_lines.length >= 1) {
        buf += "<h4>乗り入れ先の路線</h4>";
        
        for (var line_id of joined_lines) {
            buf += "<button type='button' onclick='close_square_popup(); ";
            
            if (position_mode) {
                buf += "select_railroad(\"" + railroad_info["lines"][line_id]["affiliated_railroad_id"] + "\", \"position_mode\", \"" + line_id + "\", " + (station_name === null ? "null" : "\"" + add_slashes(station_name) + "\"") + ", timetable_date === \"__tomorrow__\" ? \"__tomorrow__\" : \"__today__\", 0);";
            } else {
                buf += "select_railroad(\"" + railroad_info["lines"][line_id]["affiliated_railroad_id"] + "\", \"timetable_mode\", \"" + line_id + "\"" + (timetable_selected_station === null ? "" : ", \"" + add_slashes(timetable_selected_station) + "\"") + ");";
            }
            
            buf += "'><abbr style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][line_id]["line_color"]) : railroad_info["lines"][line_id]["line_color"]) + ";'>" + ("line_symbol" in railroad_info["lines"][line_id] ? railroad_info["lines"][line_id]["line_symbol"] : railroad_info["lines"][line_id]["line_name"].substring(0, 1)) + "</abbr>" + escape_html(railroad_info["lines"][line_id]["line_name"]) + "</button>";
        }
    }
    
    buf += "<div id='line_select_connecting_railroads'></div>";
    
    popup_inner_elm.innerHTML = buf;
    
    if (connecting_railroads.length >= 1) {
        get_railroad_list(function (railroads, loading_completed) {
            var buf = "";
            for (var connecting_railroad of connecting_railroads) {
                if (!(connecting_railroad["railroad_id"] in railroads["railroads"])) {
                    continue;
                }
                
                var railroad_color = !config["dark_mode"] ? railroads["railroads"][connecting_railroad["railroad_id"]]["main_color"] : convert_color_dark_mode(railroads["railroads"][connecting_railroad["railroad_id"]]["main_color"]);
                
                if ("lines" in connecting_railroad) {
                    buf += "<div class='connecting_railroad_link' style='border-color: " + railroad_color + ";'><h5>" + escape_html(railroads["railroads"][connecting_railroad["railroad_id"]]["railroad_name"]) + "</h5>";
                    
                    for (var line of connecting_railroad["lines"]) {
                        if (position_mode) {
                            buf += "<a href='/railroad_" + connecting_railroad["railroad_id"] + "/' onclick='event.preventDefault(); close_square_popup(); select_railroad(\"" + connecting_railroad["railroad_id"] + "\", \"position_mode\", \"" + line["line_id"] + "\", \"" + add_slashes("station_name" in line ? line["station_name"] : station_name) + "\", timetable_date === \"__tomorrow__\" ? \"__tomorrow__\" : \"__today__\", 0);'>";
                        } else {
                            buf += "<a href='/railroad_" + connecting_railroad["railroad_id"] + "/timetable/" + line["line_id"] + "/" + encodeURIComponent("station_name" in line ? line["station_name"] : station_name) + "/' onclick='event.preventDefault(); close_square_popup(); select_railroad(\"" + connecting_railroad["railroad_id"] + "\", \"timetable_mode\", \"" + line["line_id"] + "\", \"" + add_slashes("station_name" in line ? line["station_name"] : station_name) + "\");'>";
                        }
                        buf += escape_html(line["line_name"]);
                        if ("station_name" in line && line["station_name"] !== station_name) {
                            buf += "<small>(" + escape_html(line["station_name"]) + "駅)</small>";
                        }
                        buf += "</a>";
                    }
                    
                    buf += "</div>";
                } else {
                    if (position_mode) {
                        buf += "<a href='/railroad_" + connecting_railroad["railroad_id"] + "/' class='connecting_railroad_link' onclick='event.preventDefault(); close_square_popup(); select_railroad(\"" + connecting_railroad["railroad_id"] + "\", \"position_mode\", null, null, timetable_date === \"__tomorrow__\" ? \"__tomorrow__\" : \"__today__\", 0);' style='border-color: " + railroad_color + ";'>";
                    } else {
                        buf += "<a href='/railroad_" + connecting_railroad["railroad_id"] + "/timetable/' class='connecting_railroad_link' onclick='event.preventDefault(); close_square_popup(); select_railroad(\"" + connecting_railroad["railroad_id"] + "\", \"timetable_mode\");' style='border-color: " + railroad_color + ";'>";
                    }
                    
                    buf += "<h5>" + escape_html(railroads["railroads"][connecting_railroad["railroad_id"]]["railroad_name"]) + "</h5></a>";
                }
            }
            
            if (buf.length >= 1) {
                buf = "<h4>乗り換え可能な路線系統</h4>" + buf;
            }
            
            if (!loading_completed) {
                buf += "<div class='loading_icon'></div>";
            }
            
            document.getElementById("line_select_connecting_railroads").innerHTML = buf;
        })
    }
}

function position_list_diagrams () {
    var popup_inner_elm = open_square_popup("diagram_list_popup", true, "ダイヤの選択");
    
    popup_inner_elm.className = "wait_icon";
    popup_inner_elm.innerHTML = "";
    
    var diagram_list = timetable_get_diagram_list(operation_table["diagram_revision"]);
    
    var ts = get_timestamp();
    get_diagram_id([get_date_string(ts), get_date_string(ts + 86400)], null, function (today_diagram_data, tomorrow_diagram_data) {
        if (today_diagram_data === null || tomorrow_diagram_data === null) {
            return;
        }
        
        var buf = "";
        for (var diagram_id of diagram_list) {
            if (diagram_id === "__today__") {
                var diagram_name = "今日<small>(" + escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][today_diagram_data["diagram_id"]]["diagram_name"]) + ")</small>";
                var bg_color = diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][today_diagram_data["diagram_id"]]["main_color"];
            } else if (diagram_id === "__tomorrow__") {
                var diagram_name = "明日<small>(" + escape_html(diagram_info[tomorrow_diagram_data["diagram_revision"]]["diagrams"][tomorrow_diagram_data["diagram_id"]]["diagram_name"]) + ")</small>";
                var bg_color = diagram_info[tomorrow_diagram_data["diagram_revision"]]["diagrams"][tomorrow_diagram_data["diagram_id"]]["main_color"];
            } else {
                var diagram_name = escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]);
                var bg_color = diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
            }
            
            if (config["dark_mode"]) {
                bg_color = convert_color_dark_mode(bg_color);
            }
            
            buf += "<button type='button' class='wide_button' onclick='close_square_popup(); position_mode(null, \"" + diagram_id + "\", null, 0);' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>" + diagram_name + "</button>";
        }
        
        if ("special_diagram_order" in diagram_info[today_diagram_data["diagram_revision"]] && diagram_info[today_diagram_data["diagram_revision"]]["special_diagram_order"].length >= 1) {
            buf += "<h4>臨時ダイヤ</h4>";
            
            for (var diagram_id of diagram_info[today_diagram_data["diagram_revision"]]["special_diagram_order"]) {
                var bg_color = config["dark_mode"] ? convert_color_dark_mode(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"]) : diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
                buf += "<button type='button' class='wide_button' onclick='close_square_popup(); position_mode(null, \"" + diagram_id + "\", null, 0);' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>" + escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]) + "</button>";
            }
        }
        
        popup_inner_elm.innerHTML = buf;
    });
}

function position_time_swipe_start (event) {
    position_time_touch_start_y = event.touches[0].screenY;
    position_time_touch_end_y = position_time_touch_start_y;
}

function position_time_swipe (event) {
    position_time_touch_end_y = event.touches[0].screenY;
    
    if (Math.abs(position_time_touch_end_y - position_time_touch_start_y) >= 10) {
        event.currentTarget.style.opacity = "0.25";
    } else {
        event.currentTarget.style.opacity = "";
    }
}

function position_time_swipe_end (event, step) {
    event.currentTarget.style.opacity = "";
    
    if (position_time_touch_end_y >= position_time_touch_start_y + 10) {
        position_change_time(-step);
    } else if (position_time_touch_end_y <= position_time_touch_start_y - 10) {
        position_change_time(step);
    }
}

function position_time_button_change () {
    if (position_time_button_elm.value.length === 0) {
        position_reload();
        return;
    }
    
    var hours_minutes = position_time_button_elm.value.split(":");
    
    hours_minutes[0] = Number(hours_minutes[0]);
    if (hours_minutes[0] < 4) {
        hours_minutes[0] += 24;
    }
    
    var hh_and_mm = hours_minutes.join(":");
    
    position_change_time(hh_mm_to_minutes(hh_and_mm) - hh_mm_to_minutes(get_hh_mm(position_time * 60)));
}

function change_show_final_destinations (bool_val) {
    config["show_final_destinations_in_position_mode"] = bool_val;
    
    save_config();
    
    position_change_time(0);
}


var assign_order_maxima = {};

function get_operation_data_detail (operation_date, operation_number_or_list, area_id) {
    assign_order_maxima = {};
    
    var operation_number_list = Array.isArray(operation_number_or_list) ? operation_number_or_list : [operation_number_or_list];
    for (var cnt = 0; cnt < operation_number_list.length; cnt++) {
        var at_pos = operation_number_list[cnt].indexOf("@");
        
        if (at_pos === -1) {
            var railroad_id = railroad_info["railroad_id"];
        } else {
            var railroad_id = operation_number_list[cnt].substring(at_pos + 1);
            operation_number_list[cnt] = operation_number_list[cnt].substring(0, at_pos);
        }
    }
    
    if (cnt === 0) {
        return;
    }
    
    var area_elm = document.getElementById(area_id);
    
    area_elm.innerHTML = "<div class='loading_icon'></div>".repeat(operation_number_list.length);
    
    ajax_post("operation_data_detail.php", "railroad_id=" + escape_form_data(railroad_id) + "&date=" + operation_date + "&operation_numbers=" + escape_form_data(operation_number_list.join()), function (response) {
        if (response !== false) {
            var data = JSON.parse(response);
            
            var detail_html = "";
            for (var operation_number of Object.keys(data)) {
                detail_html += "<input type='checkbox' id='" + area_id + "_detail_" + add_slashes(operation_number) + "'><label for='" + area_id + "_detail_" + add_slashes(operation_number) + "' class='drop_down'>" + escape_html(operation_number) + "運用 目撃情報</label><div>";
                
                var assign_order_last = -1;
                var formation_text_last = null;
                
                for (var data_item of data[operation_number]) {
                    if (data_item["formations"] !== "") {
                        var formation_text = data_item["formations"];
                    } else {
                        var formation_text = "運休";
                    }
                    
                    if ("is_quotation" in data_item && data_item["is_quotation"]) {
                        var train_number_text = "引用情報";
                    } else {
                        var train_number_text = data_item["train_number"];
                        
                        if (train_number_text === "○") {
                            train_number_text = "出庫時";
                        } else if (train_number_text === "△") {
                            train_number_text = "入庫時";
                        } else {
                            train_number_text = train_number_text.split("__")[0];
                            
                            if (train_number_text.startsWith(".")) {
                                train_number_text = train_number_text.substring(1) + "待機";
                            }
                        }
                    }
                    
                    if (data_item["user_id"] === "#") {
                        var user_name_html = "<span>公開在線情報";
                    } else if (data_item["user_id"] !== null && !data_item["user_id"].startsWith("*")) {
                        var user_name_html = data_item["user_name"] !== null ? escape_html(data_item["user_name"]) : data_item["user_id"];
                        var class_html = "";
                        
                        if (!("is_management_member" in data_item && data_item["is_management_member"])) {
                            user_name_html += " 様";
                            
                            if ("is_beginner" in data_item && data_item["is_beginner"]) {
                                class_html = " class='beginner'";
                            }
                        }
                        
                        if ("website_url" in data_item && data_item["website_url"] !== null) {
                            user_name_html = "<span" + class_html + "><a href='" + add_slashes(data_item["website_url"]) + "' target='_blank' class='external_link'>" + user_name_html + " <small>(" + data_item["user_id"] + ")</small></a>";
                        } else {
                            user_name_html = "<span" + class_html + ">" + user_name_html + " <small>(" + data_item["user_id"] + ")</small>";
                        }
                    } else {
                        var user_name_html = "<span>(ゲスト様)";
                    }
                    
                    if ("ip_address" in data_item && data_item["ip_address"] !== null) {
                        var ip_address_str = ", \"" + add_slashes(data_item["ip_address"]) + "\"";
                    } else {
                        var ip_address_str = "";
                    }
                    
                    if (user_info !== null && (data_item["user_id"] === user_info["user_id"] || "ip_address" in data_item)) {
                        user_name_html += "<button type='button' onclick='edit_operation_data(\"" + railroad_id + "\", \"" + operation_date + "\", \"" + add_slashes(operation_number) + "\", " + data_item["assign_order"] + ", \"" + add_slashes(data_item["user_id"]) + "\", \"" + add_slashes(formation_text) + "\"" + ip_address_str + ");'>";
                        
                        if (data_item["user_id"] === "#" || data_item["user_id"] === user_info["user_id"]) {
                            user_name_html += "取り消し";
                        } else {
                            user_name_html += "詳細";
                        }
                        
                        user_name_html += "</button>";
                    }
                    
                    user_name_html += "</span>";
                    
                    if (data_item["assign_order"] !== assign_order_last) {
                        if (assign_order_last !== -1 && formation_text !== formation_text_last) {
                            detail_html += "<div class='operation_data_detail'><b class='warning_sentence'>↑ 差し替え ↑</b></div>";
                        }
                        
                        assign_order_last = data_item["assign_order"];
                        formation_text_last = formation_text;
                    }
                    
                    detail_html += "<div class='operation_data_detail'><b><small>" + train_number_text + "</small>" + formation_text + "<span>" + get_date_and_time(data_item["posted_datetime"]) + "</span></b>";
                    
                    if ("comment" in data_item && data_item["comment"] !== null) {
                        detail_html += "<div class='descriptive_text'>" + escape_html(data_item["comment"]).replace(/\n/g, "<br>") + "</div>";
                    }
                    
                    detail_html += user_name_html + "</div>";
                }
                
                if (data[operation_number].length === 0) {
                    assign_order_maxima[operation_number] = 0;
                    
                    detail_html += "<div class='descriptive_text'>";
                    if (operation_date === get_date_string(get_timestamp())) {
                        detail_html += "まだ目撃情報が投稿されていません";
                    } else {
                        detail_html += "当日の目撃情報はありません";
                    }
                    detail_html += "</div>";
                } else {
                    assign_order_maxima[operation_number] = data[operation_number][0]["assign_order"];
                }
                
                detail_html += "</div>";
            }
        } else {
            detail_html = "【!】運用情報の取得に失敗しました";
        }
        
        area_elm.innerHTML = detail_html;
    });
}

function train_detail (line_id, train_number, starting_station, train_direction, show_operation_data = true, is_today = null) {
    var popup_inner_elm = open_square_popup("train_detail_popup", true, null, true);
    
    popup_inner_elm.className = "wait_icon";
    popup_inner_elm.innerHTML = "";
    
    var previous_trains = [];
    var next_trains = [];
    
    var train_operations = get_operations(line_id, train_number, starting_station, train_direction);
    
    var train_data = [get_train(line_id, train_direction === "inbound_trains", train_number, starting_station)];
    
    var buf = "<span class='train_detail_day' style='border-color: " + (config["dark_mode"] ? convert_color_dark_mode(diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["main_color"]) : diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["main_color"]) + ";'>";
    
    buf += diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["diagram_name"];
    
    if (mode_val <= 1) {
        if (timetable_date === "__today__") {
            buf += "(今日)";
            
            var diagram_id_or_ts = get_timestamp();
            is_today = true;
        } else if (timetable_date === "__tomorrow__") {
            buf += "(明日)";
            
            var diagram_id_or_ts = get_timestamp() + 86400;
        }
        
        var diagram_is_current_revision = true;
    } else {
        var diagram_id_or_ts = "\"" + operation_table["diagram_id"] + "\"";
        var diagram_is_current_revision = (get_diagram_revision() === operation_table["diagram_revision"]);
    }
    
    buf += "</span>";
    
    var reversed_operations = new Set();
    
    if (train_operations !== null) {
        if (railroad_info["lines"][line_id]["inbound_forward_direction"] !== (train_direction === "inbound_trains")) {
            train_operations.reverse();
        }
        
        var buf_2 = "";
        for (var cnt = 0; cnt < train_operations.length; cnt++) {
            if (train_operations[cnt].startsWith("<=>")) {
                train_operations[cnt] = train_operations[cnt].substring(3);
                
                reversed_operations.add(train_operations[cnt]);
            }
            
            var train_operation = train_operations[cnt];
            
            if (buf_2.length >= 1) {
                buf_2 += "+";
            }
            
            if (!train_operation.includes("@")) {
                var railroad_id = null;
                var operation_info = operation_table["operations"][train_operation];
                
                var link_onclick_str = "operation_detail(\"" + train_operation + "\", " + (timetable_date === "__today__" || timetable_date === "__tomorrow__" ? diagram_id_or_ts + ", true" : "\"" + operation_table["diagram_id"] + "\", false") + ");";
            } else {
                var at_pos = train_operation.indexOf("@");
                var railroad_id = train_operation.substring(at_pos + 1);
                train_operation = train_operation.substring(0, at_pos);
                var operation_info = joined_operation_tables[railroad_id]["operations"][train_operation];
                
                if (timetable_date === "__today__") {
                    var link_onclick_str = "close_square_popup(); select_railroad(\"" + railroad_id + "\", \"operation_table_mode\", \"__current__\", null, \"" + train_operation + "\");";
                } else {
                    var link_onclick_str = null;
                }
            }
            
            if (link_onclick_str !== null) {
                buf_2 += "<u onclick='" + link_onclick_str + "'>"
            }
            
            buf_2 += train_operation + "運用(" + ("hidden_by_default" in operation_info && operation_info["hidden_by_default"] ? "臨時" : operation_info["car_count"] + "両") + ")";
            
            if (link_onclick_str !== null) {
                buf_2 += "</u>";
            }
        }
    } else {
        var buf_2 = "不明な運用";
        
        show_operation_data = false;
    }
    
    buf += "<h3>" + buf_2 + "</h3>";
    
    if (show_operation_data) {
        var buf_2 = "";
        var heading_str = "";
        for (var train_operation of train_operations) {
            if (!train_operation.includes("@")) {
                var railroad_id = null;
                var data = operation_data["operations"];
                var operations = operation_table["operations"];
            } else {
                var at_pos = train_operation.indexOf("@");
                var railroad_id = train_operation.substring(at_pos + 1);
                
                train_operation = train_operation.substring(0, at_pos);
                
                var data = joined_operation_data[railroad_id]["operations"];
                var operations = joined_operation_tables[railroad_id]["operations"];
            }
            
            if (buf_2.length >= 1) {
                buf_2 += " +";
            }
            
            var default_icon = "default_icon" in operations[train_operation] ? operations[train_operation]["default_icon"] : null;
            
            if (train_operation in data && data[train_operation] !== null) {
                if (data[train_operation]["formations"] !== "") {
                    var operation_formations = data[train_operation]["formations"].split("+");
                    
                    if (reversed_operations.has(train_operation)) {
                        operation_formations.reverse()
                    }
                    
                    var buf_3 = "";
                    for (var formation_name of operation_formations) {
                        if (buf_3.length >= 1) {
                            buf_3 += " +";
                        }
                        
                        if (formation_name in formations["formations"] || (railroad_id !== null && formation_name in joined_railroad_formations[railroad_id]["formations"])) {
                            buf_3 += "<a href='/railroad_" + (railroad_id === null ? railroad_info["railroad_id"] : railroad_id) + "/formations/" + encodeURIComponent(formation_name) + "/' onclick='event.preventDefault(); close_square_popup(); " + (railroad_id === null ? "formations_mode(" : "select_railroad(\"" + railroad_id + "\", \"formations_mode\", ") + "\"" + add_slashes(formation_name) + "\");'><img src='" + get_icon(formation_name, railroad_id, default_icon) + "' alt='' class='train_icon'>" + escape_html(formation_name) + "</a>";
                            
                            var overview = get_formation_overview(formation_name, railroad_id);
                            if (overview["caption"].length >= 1) {
                                if (heading_str.length >= 1) {
                                    heading_str += "<br>";
                                }
                                
                                heading_str += escape_html(formation_name + " : " + overview["caption"]);
                            }
                        } else if (formation_name === "?") {
                            buf_3 += "<img src='" + (default_icon === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(default_icon, railroad_id)) + "' alt='' class='train_icon'>?";
                        } else {
                            buf_3 += "<img src='" + get_icon(formation_name, railroad_id) + "' alt='' class='train_icon'>" + escape_html(formation_name);
                        }
                    }
                    
                    buf_2 += buf_3;
                } else {
                    buf_2 += "<img src='" + UNYOHUB_CANCELED_TRAIN_ICON + "' alt='' class='train_icon'>運休";
                }
            } else {
                buf_2 += "<img src='" + (default_icon === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(default_icon, railroad_id)) + "' alt='' class='train_icon'>?";
            }
        }
        
        buf += "<div class='formation_data_area'>" + buf_2 + "</div><div class='descriptive_text'>" + heading_str + "</div><div id='train_operation_detail_area'></div>";
    }
    
    if (train_data[0] !== null) {
        if (train_data[0]["previous_trains"].length >= 1) {
            previous_trains.push(...train_data[0]["previous_trains"]);
        }
        
        for (var previous_train of previous_trains) {
            if ("direction" in previous_train) { //v25.09-1以前の仕様で作成された時刻表データとの互換性維持
                var is_inbound = (previous_train["direction"] === "inbound");
            } else {
                var is_inbound = null;
            }
            
            train_data.unshift(get_train(previous_train["line_id"], is_inbound, previous_train["train_number"], previous_train["starting_station"]));
            
            if (train_data[0] !== null && train_data[0]["previous_trains"].length >= 1) {
                previous_trains.push(...train_data[0]["previous_trains"]);
            }
        }
        
        if (train_data[train_data.length - 1]["next_trains"].length >= 1) {
            next_trains.push(...train_data[train_data.length - 1]["next_trains"]);
        }
        
        for (var next_train of next_trains) {
            if ("direction" in next_train) { //v25.09-1以前の仕様で作成された時刻表データとの互換性維持
                var is_inbound = (next_train["direction"] === "inbound");
            } else {
                var is_inbound = null;
            }
            
            train_data.push(get_train(next_train["line_id"], is_inbound, next_train["train_number"], next_train["starting_station"]));
            
            if (train_data[train_data.length - 1] !== null && train_data[train_data.length - 1]["next_trains"].length >= 1) {
                next_trains.push(...train_data[train_data.length - 1]["next_trains"]);
            }
        }
        
        if (is_today) {
            var now_str = get_hh_mm();
        }
        var previous_departure_time = null;
        
        for (var train of train_data) {
            if (train === null) {
                continue;
            }
            
            var train_operations_2 = get_operations(train["line_id"], train["train_number"], train["starting_station"], train["is_inbound"] ? "inbound_trains" : "outbound_trains");
            
            if (train_operations_2 === null && "is_temporary_train" in train && train["is_temporary_train"]) {
                continue;
            }
            
            var timetable_train_number = train["train_number"].split("__")[0];
            
            if ("clockwise_is_inbound" in railroad_info["lines"][train["line_id"]] && railroad_info["lines"][train["line_id"]]["clockwise_is_inbound"] !== null) {
                var directions = railroad_info["lines"][train["line_id"]]["clockwise_is_inbound"] ? ["外回り", "内回り"] : ["内回り", "外回り"];
            } else {
                var directions = ["上り", "下り"];
            }
            
            var stations = [...railroad_info["lines"][train["line_id"]]["stations"]];
            
            var is_deadhead_train = (railroad_info["deadhead_train_number_regexp"].test(timetable_train_number) || train["train_type"]=== "回送") ? true : false;
            
            buf += "<h4>" + escape_html(railroad_info["lines"][train["line_id"]]["line_name"]) + "　" + (train["is_inbound"] ? directions[0] : directions[1]);
            
            buf += "<span style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(timetable_train_number, train["train_type"])) : get_train_color(timetable_train_number, train["train_type"])) + ";'>" + escape_html(train["train_type"] + "　" + timetable_train_number) + "</span>";
            
            if (train_operations_2 !== null) {
                if (railroad_info["lines"][train["line_id"]]["inbound_forward_direction"] === train["is_inbound"]) {
                    var before_train_str = "◀ ";
                    var after_train_str = " 　";
                } else {
                    train_operations_2.reverse();
                    
                    var before_train_str = "　 ";
                    var after_train_str = " ▶";
                }
                
                var buf_2 = "";
                for (var train_operation of train_operations_2) {
                    if (train_operation.startsWith("<=>")) {
                        train_operation = train_operation.substring(3);
                        
                        var formation_reversed_html = "<small>(方反)</small>";
                    } else {
                        var formation_reversed_html = "";
                    }
                    
                    if (buf_2.length >= 1) {
                        buf_2 += "+";
                    }
                    
                    if (!train_operation.includes("@")) {
                        buf_2 += "<u onclick='operation_detail(\"" + train_operation + "\",";
                        if (timetable_date === "__today__" || timetable_date === "__tomorrow__") {
                            buf_2 += " " + diagram_id_or_ts + ", true";
                        } else {
                            buf_2 += " \"" + operation_table["diagram_id"] + "\", false";
                        }
                        buf_2 += ");'>" + train_operation + "運用" + formation_reversed_html + "</u>";
                    } else {
                        buf_2 += train_operation.substring(0, train_operation.indexOf("@")) + "運用" + formation_reversed_html;
                    }
                }
                
                buf += "<div class='descriptive_text'>" + before_train_str + buf_2 + after_train_str + "</div>";
            }
            
            buf += "</h4>";
            
            var arrival_times = "arrival_times" in train ? train["arrival_times"] : train["departure_times"];
            
            buf += "<table class='station_times'>";
            for (var cnt = 0; cnt < train["departure_times"].length; cnt++) {
                if (train["departure_times"][cnt] !== null && !train["departure_times"][cnt].startsWith("|")) {
                    var station_index = train["is_inbound"] ? stations.length - 1 - cnt : cnt;
                    var station_name = "canonical_station_name" in stations[station_index] ? stations[station_index]["canonical_station_name"] : stations[station_index]["station_name"];
                    var highlight_str = is_today && ((previous_departure_time !== null && previous_departure_time < now_str && train["departure_times"][cnt] >= now_str) || train["departure_times"][cnt] === now_str) ? " train_detail_departure_time_highlight" : "";
                    var onclick_func = "affiliated_railroad_id" in railroad_info["lines"][train["line_id"]] ? "select_railroad(\"" + railroad_info["lines"][train["line_id"]]["affiliated_railroad_id"] + "\", \"timetable_mode\", \"" + train["line_id"] + "\", \"" + add_slashes(station_name) + "\", " + train["is_inbound"] + ");" : "show_station_timetable(\"" + train["line_id"] + "\", \"" + add_slashes(station_name) + "\", " + train["is_inbound"] + ");";
                    
                    buf += "<tr class='" + (is_deadhead_train ? "deadhead_train_departure_time" : "") + highlight_str + "'>";
                    if (("connecting_lines" in stations[station_index] && stations[station_index]["connecting_lines"].length >= 1) || ("connecting_railroads" in  stations[station_index] && stations[station_index]["connecting_railroads"].length >= 1)) {
                        buf += "<td><button type='button' class='connecting_railroads_button' onclick='select_lines(\"" + train["line_id"] + "\", \"" + add_slashes(station_name) + "\", " + (mode_val === 0 ? "true" : "false") + ");'></button></td>";
                    } else {
                        buf += "<td></td>";
                    }
                    
                    buf += "<td style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["lines"][train["line_id"]]["line_color"]) : railroad_info["lines"][train["line_id"]]["line_color"]) + ";'></td>";
                    buf += "<td>";
                    if (arrival_times[cnt] !== train["departure_times"][cnt]) {
                        buf += "<small>" + arrival_times[cnt] + " -</small>";
                    }
                    buf += "<time>" + train["departure_times"][cnt] + "</time></td>";
                    buf += "<td>" + (diagram_is_current_revision && (!("is_signal_station" in stations[station_index]) || !stations[station_index]["is_signal_station"]) ? "<u onclick='close_square_popup(); history_back_promise.then(function () { " + onclick_func + " });'>" + escape_html(station_name) + "</u>" : escape_html(station_name)) + "</td>";
                    buf += "</tr>";
                    
                    previous_departure_time = train["departure_times"][cnt];
                }
            }
            buf += "</table>";
        }
        
        if (is_today) {
            buf += "<div class='informational_text'>現在位置は端末の現在時刻に基づく推定です</div>";
        }
    } else {
        var train_title = train_number.split("__")[0];
        
        buf += "<h4>" + escape_html(railroad_info["lines"][line_id]["line_name"]) + "　<span style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_title)) : get_train_color(train_title)) + ";'>"
        if (railroad_info["deadhead_train_number_regexp"].test(train_title)) {
            buf += "回送　";
        }
        buf += escape_html(train_title) + "</span></h4>";
        buf += "<div class='no_data'>詳細情報はありません</div>";
    }
    
    if (navigator.onLine && train_operations !== null && is_today) {
        buf += "<button type='button' class='write_button' onclick='select_operation_to_write_data(\"" + line_id + "\",\"" + add_slashes(train_number) + "\",\"" + starting_station + "\",\"" + train_direction + "\");'>運用情報を投稿</button>";
    }
    
    popup_inner_elm.innerHTML = buf;
    
    document.getElementById("train_detail_popup").scrollTop = 0;
    
    if (show_operation_data && navigator.onLine) {
        get_operation_data_detail(operation_data["operation_date"], train_operations, "train_operation_detail_area");
    }
}

function change_show_arriving_trains (bool_val) {
    config["show_deadhead_trains_on_timetable"] = bool_val;
    
    save_config();
    
    timetable_select_station(timetable_selected_station);
}

function change_show_starting_trains_only (bool_val) {
    config["show_starting_trains_only_on_timetable"] = bool_val;
    
    save_config();
    
    timetable_select_station(timetable_selected_station);
}


function timetable_station_menu () {
    var popup_inner_elm = open_square_popup("station_menu_popup");
    
    var buf = "add_favorite_station(\"" + railroad_info["railroad_id"] + "\", \"" + add_slashes(timetable_selected_line) + "\", \"" + add_slashes(timetable_selected_station) + "\")'>お気に入り駅に追加";
    for (var favorite_station of config["favorite_stations"]) {
        if (favorite_station["railroad_id"] === railroad_info["railroad_id"] && favorite_station["line_id"] === timetable_selected_line && favorite_station["station_name"] === timetable_selected_station) {
            buf = "remove_favorite_station(\"" + railroad_info["railroad_id"] + "\", \"" + add_slashes(timetable_selected_line) + "\", \"" + add_slashes(timetable_selected_station) + "\")'>お気に入り駅から削除";
        }
    }
    
    popup_inner_elm.innerHTML = "<button type='button' class='wide_button' onclick='close_square_popup(); position_mode(\"" + add_slashes(timetable_selected_line) + "\", \"__today__\", \"" + add_slashes(timetable_selected_station) + "\")'>駅付近の列車走行位置</button><button type='button' class='wide_button' onclick='close_square_popup(); " + buf + "</button>";
}

function timetable_change_diagram (operation_table_name) {
    if (operation_table_name === "__today__" || operation_table_name === "__tomorrow__") {
        if (operation_table_name === "__today__") {
            var date_string = get_date_string(get_timestamp());
        } else {
            var date_string = get_date_string(get_timestamp() + 86400);
        }
        
        get_diagram_id(date_string, "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : null, function (diagram_data) {
            if (diagram_data !== null) {
                load_timetable_diagram(diagram_data["diagram_revision"], diagram_data["diagram_id"], diagram_data["joined_railroad_diagram_ids"], date_string);
            }
        });
    } else {
        load_timetable_diagram(operation_table["diagram_revision"], operation_table_name, null, null);
    }
}

function load_timetable_diagram (diagram_revision, diagram_id, joined_railroad_diagram_ids, date_string) {
    var resolved = false;
    
    timetable_promise = new Promise(function (resolve, reject) {
        load_data(function () {
            if (!resolved) {
                resolved = true;
                
                resolve();
            } else if (timetable_selected_station !== null) {
                timetable_select_station(timetable_selected_station);
            }
        }, null, reject, diagram_revision, diagram_id, joined_railroad_diagram_ids, date_string);
    });
    
    if (timetable_selected_station !== null) {
        timetable_select_station(timetable_selected_station);
    }
    
    update_timetable_date(diagram_revision, diagram_id, date_string);
}

function timetable_get_diagram_list (diagram_revision) {
    return ["__today__", "__tomorrow__", ...diagram_info[diagram_revision]["diagram_order"]];
}

function timetable_diagram_previous () {
    var diagram_list = timetable_get_diagram_list(operation_table["diagram_revision"]);
    var list_index = diagram_list.indexOf(timetable_date) - 1;
    
    if (list_index < 0) {
        list_index = diagram_list.length - 1;
    }
    
    timetable_change_diagram(diagram_list[list_index]);
}

function timetable_diagram_next () {
    var diagram_list = timetable_get_diagram_list(operation_table["diagram_revision"]);
    var list_index = diagram_list.indexOf(timetable_date) + 1;
    
    if (list_index >= diagram_list.length) {
        list_index = 0;
    }
    
    timetable_change_diagram(diagram_list[list_index]);
}

function timetable_list_diagrams () {
    var popup_inner_elm = open_square_popup("diagram_list_popup", true, "ダイヤの選択");
    
    popup_inner_elm.className = "wait_icon";
    popup_inner_elm.innerHTML = "";
    
    var diagram_list = timetable_get_diagram_list(operation_table["diagram_revision"]);
    
    var ts = get_timestamp();
    get_diagram_id([get_date_string(ts), get_date_string(ts + 86400)], null, function (today_diagram_data, tomorrow_diagram_data) {
        if (today_diagram_data === null || tomorrow_diagram_data === null) {
            return;
        }
        
        var buf = "";
        for (var diagram_id of diagram_list) {
            if (diagram_id === "__today__") {
                var diagram_name = "今日<small>(" + escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][today_diagram_data["diagram_id"]]["diagram_name"]) + ")</small>";
                var bg_color = diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][today_diagram_data["diagram_id"]]["main_color"];
            } else if (diagram_id === "__tomorrow__") {
                var diagram_name = "明日<small>(" + escape_html(diagram_info[tomorrow_diagram_data["diagram_revision"]]["diagrams"][tomorrow_diagram_data["diagram_id"]]["diagram_name"]) + ")</small>";
                var bg_color = diagram_info[tomorrow_diagram_data["diagram_revision"]]["diagrams"][tomorrow_diagram_data["diagram_id"]]["main_color"];
            } else {
                var diagram_name = escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]);
                var bg_color = diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
            }
            
            if (config["dark_mode"]) {
                bg_color = convert_color_dark_mode(bg_color);
            }
            
            buf += "<button type='button' class='wide_button' onclick='close_square_popup(); timetable_change_diagram(\"" + diagram_id + "\");' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>" + diagram_name + "</button>";
        }
        
        if ("special_diagram_order" in diagram_info[today_diagram_data["diagram_revision"]] && diagram_info[today_diagram_data["diagram_revision"]]["special_diagram_order"].length >= 1) {
            buf += "<h4>臨時ダイヤ</h4>";
            
            for (var diagram_id of diagram_info[today_diagram_data["diagram_revision"]]["special_diagram_order"]) {
                var bg_color = config["dark_mode"] ? convert_color_dark_mode(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"]) : diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
                buf += "<button type='button' class='wide_button' onclick='close_square_popup(); timetable_change_diagram(\"" + diagram_id + "\");' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>" + escape_html(diagram_info[today_diagram_data["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]) + "</button>";
            }
        }
        
        popup_inner_elm.innerHTML = buf;
    });
}

function update_timetable_drop_down_status (elm) {
    timetable_drop_down_status[elm.id] = elm.checked;
}

function add_favorite_station (railroad_id, line_id, station_name) {
    if (confirm(station_name + "駅 (" + railroad_info["lines"][line_id]["line_name"] + ") をお気に入りに追加しますか？")) {
        config["favorite_stations"].push({ railroad_id : railroad_id, line_id : line_id, station_name : station_name });
        save_config();
        
        mes("駅をお気に入りに追加しました");
    }
}

function remove_favorite_station (railroad_id, line_id, station_name, redraw_railroad_list = false) {
    if (confirm(station_name + "駅をお気に入りから削除しますか？")) {
        for (var cnt = 0; cnt < config["favorite_stations"].length; cnt++) {
            if (config["favorite_stations"][cnt]["railroad_id"] === railroad_id && config["favorite_stations"][cnt]["line_id"] === line_id && config["favorite_stations"][cnt]["station_name"] === station_name) {
                config["favorite_stations"].splice(cnt, 1);
                save_config();
                
                mes("駅をお気に入りから削除しました");
                
                if (redraw_railroad_list) {
                    update_railroad_list(railroads);
                }
                
                return true;
            }
        }
    }
    
    return false;
}


function activate_operation_data_tab (division_name) {
    for (var area_elm of document.getElementsByClassName("operation_data_division_area")) {
        if (area_elm.id === "operation_data_division_" + division_name) {
            area_elm.style.display = "block";
            document.getElementById("operation_data_division_tab_" + division_name).classList.add("active_tab");
        } else {
            area_elm.style.display = "none";
            document.getElementById("operation_data_division_tab_" + area_elm.id.substring(24)).classList.remove("active_tab");
        }
    }
    
    operation_data_active_tab = division_name;
}

function change_use_group_divisions (bool_val) {
    use_group_divisions_on_operation_data = bool_val;
    
    operation_data_draw();
}

function operation_date_button_change () {
    if (operation_date_button_elm.valueAsDate !== null) {
        operation_data_change_date(operation_date_button_elm.value);
    } else {
        operation_data_change_date(null);
    }
}


function select_joined_railroads (operation_date = null) {
    var popup_inner_elm = open_square_popup("joined_railroads_popup", true, "直通先路線系統");
    
    var buf = "";
    for (var railroad_id of railroad_info["joined_railroads"]) {
        buf += "<a class='related_link' href='javascript:void(0);' onclick='close_square_popup(); select_railroad(\"" + add_slashes(railroad_id) + "\", \"operation_data_mode\", \"" + operation_date + "\");' style='border-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["related_railroads"][railroad_id]["main_color"]) : railroad_info["related_railroads"][railroad_id]["main_color"]) + ";'>" + escape_html(railroad_info["related_railroads"][railroad_id]["railroad_name"]) + "</a>";
    }
    popup_inner_elm.innerHTML = buf;
}


var operation_detail_write_button_enabled = false;

function operation_detail (operation_number_or_index, operation_data_date_ts_or_diagram_id, show_write_operation_data_button = null, search_keyword = null) {
    var popup_inner_elm = open_popup("operation_detail_popup", null, true);
    
    popup_inner_elm.className = "wait_icon";
    popup_inner_elm.innerHTML = "";
    popup_inner_elm.scrollTop = 0;
    
    if (show_write_operation_data_button !== null) {
        operation_detail_write_button_enabled = show_write_operation_data_button;
    }
    
    if (typeof operation_data_date_ts_or_diagram_id !== "string") {
        var operation_data_date = get_date_string(operation_data_date_ts_or_diagram_id);
        
        get_diagram_id(operation_data_date, null, function (diagram_data) {
            if (diagram_data === null) {
                return;
            }
            
            if (operation_table === null || diagram_data["diagram_revision"] !== operation_table["diagram_revision"] || diagram_data["diagram_id"] !== operation_table["diagram_id"] || operation_data === null || operation_data_date !== operation_data["operation_date"]) {
                load_data(function () {
                    draw_operation_detail(operation_number_or_index, diagram_data["diagram_revision"], diagram_data["diagram_id"], operation_data_date_ts_or_diagram_id, search_keyword);
                }, null, function () {}, diagram_data["diagram_revision"], diagram_data["diagram_id"], null, operation_data_date);
            } else {
                draw_operation_detail(operation_number_or_index, diagram_data["diagram_revision"], diagram_data["diagram_id"], operation_data_date_ts_or_diagram_id, search_keyword);
            }
        });
    } else {
        draw_operation_detail(operation_number_or_index, operation_table["diagram_revision"], operation_data_date_ts_or_diagram_id, null, search_keyword);
    }
}

function draw_operation_detail (operation_number_or_index, diagram_revision, diagram_id, operation_data_date_ts, search_keyword) {
    var operation_number = typeof operation_number_or_index === "string" ? operation_number_or_index : operation_number_order[operation_number_or_index];
    
    if (operation_data_date_ts === null) {
        var operation_data_date_str = null;
        var is_today = false;
        var diagram_id_or_ts = "\"" + diagram_id + "\"";
        operation_detail_write_button_enabled = false;
    } else {
        var operation_data_date_str = get_date_string(operation_data_date_ts);
        
        if (operation_data_date_str === get_date_string(get_timestamp())) {
            var is_today = true;
        } else {
            var is_today = false;
        }
        
        var diagram_id_or_ts = operation_data_date_ts;
    }
    
    var buf = "<span class='train_detail_day' style='border-color: " + (config["dark_mode"] ? convert_color_dark_mode(diagram_info[diagram_revision]["diagrams"][diagram_id]["main_color"]) : diagram_info[diagram_revision]["diagrams"][diagram_id]["main_color"]) + ";'>" + diagram_info[operation_table["diagram_revision"]]["diagrams"][operation_table["diagram_id"]]["diagram_name"] + "</span>";
    
    if (operation_number in operation_table["operations"]) {
        buf += "<div class='heading_wrapper' style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(operation_table["operations"][operation_number]["main_color"]) : operation_table["operations"][operation_number]["main_color"]) + ";'><button type='button' class='previous_button' onclick='previous_operation_number(" + (typeof operation_number_or_index === "string" ? "\"" + operation_number + "\"" : operation_number_or_index) + ", " + diagram_id_or_ts + ");'></button><h2>" + operation_number + "運用<small>" + operation_table["operations"][operation_number]["operation_group_name"] + " (" + operation_table["operations"][operation_number]["car_count"] + "両)</small></h2><button type='button' class='next_button' onclick='next_operation_number(" + (typeof operation_number_or_index === "string" ? "\"" + operation_number + "\"" : operation_number_or_index) + ", " + diagram_id_or_ts + ");'></button></div>";
        
        var default_icon = "default_icon" in operation_table["operations"][operation_number] ? operation_table["operations"][operation_number]["default_icon"] : null;
    } else {
        buf += "<h2>" + operation_number + "運用</h2>";
        
        var default_icon = null;
    }
    
    if (operation_data_date_ts !== null) {
        buf += "<div class='formation_data_area'>";
        
        var formation_text = (operation_number in operation_data["operations"] && operation_data["operations"][operation_number] !== null) ? operation_data["operations"][operation_number]["formations"] : null;
        
        var heading_str = "";
        if (formation_text !== null) {
            if (formation_text !== "") {
                var buf_2 = "";
                for (var formation_name of formation_text.split("+")) {
                    if (buf_2.length >= 1) {
                        buf_2 += " +"
                    }
                    
                    if (formation_name in formations["formations"]) {
                        buf_2 += "<a href='/railroad_" + railroad_info["railroad_id"] + "/formations/" + encodeURIComponent(formation_name) + "/' onclick='event.preventDefault(); popup_close(true); formations_mode(\"" + add_slashes(formation_name) + "\");'><img src='" + get_icon(formation_name, null, default_icon) + "' alt='' class='train_icon'>" + escape_html(formation_name) + "</a>";
                        
                        var overview = get_formation_overview(formation_name);
                        if (overview["caption"].length >= 1) {
                            if (heading_str.length >= 1) {
                                heading_str += "<br>";
                            }
                            
                            heading_str += escape_html(formation_name + " : " + overview["caption"]);
                        }
                    } else if (formation_name === "?") {
                        buf_2 += "<img src='" + (default_icon === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(default_icon)) + "' alt='' class='train_icon'>?";
                    } else {
                        buf_2 += "<img src='" + get_icon(formation_name, null, default_icon) + "' alt='' class='train_icon'>" + escape_html(formation_name);
                    }
                }
                
                buf += buf_2;
            } else {
                buf += "<img src='" + UNYOHUB_CANCELED_TRAIN_ICON + "' alt='' class='train_icon'>運休";
            }
        } else {
            buf += "<img src='" + (default_icon === null ? UNYOHUB_UNKNOWN_TRAIN_ICON : get_icon_base64(default_icon)) + "' alt='' class='train_icon'>?";
        }
        
        buf += "</div><div class='descriptive_text'>" + heading_str + "</div><div id='operation_data_detail_area'></div>";
    }
    
    if (operation_number in operation_table["operations"]) {
        if (navigator.onLine) {
            buf += "<button type='button' class='history_button' onclick='operation_data_history(null, \"" + add_slashes(operation_number) + "\");'>これまでの充当編成</button>";
        }
        
        buf += "<div><input type='radio' name='switch_simplify_operation_details' id='simplify_operation_details' onchange='change_simplify_operation_details(!this.checked, \"" + add_slashes(operation_number) + "\", " + diagram_id_or_ts + ", " + is_today + ", " + (search_keyword === null ? "null" : "\"" + add_slashes(search_keyword) + "\"") + ");'" + (config["simplify_operation_details"] ? "" : " checked='checked'") + "><label for='simplify_operation_details'>詳細表示</label><input type='radio'  name='switch_simplify_operation_details' id='not_simplify_operation_details' onchange='change_simplify_operation_details(this.checked, \"" + add_slashes(operation_number) + "\", " + diagram_id_or_ts + ", " + is_today + ", " + (search_keyword === null ? "null" : "\"" + add_slashes(search_keyword) + "\"") + ");'" + (config["simplify_operation_details"] ? " checked='checked'" : "") + "><label for='not_simplify_operation_details'>簡略表示</label></div>";
        
        if (operation_table["operations"][operation_number]["comment"] !== null) {
            buf += "<div class='descriptive_text'>" + escape_html(operation_table["operations"][operation_number]["comment"]) + "</div>";
        }
        
        buf += "<div id='operation_trains_area'></div>";
        
        if (navigator.onLine && operation_detail_write_button_enabled) {
            buf += "<button type='button' class='write_button' onclick='write_operation_data(null, \"" + operation_data_date_str + "\", \"" + operation_number + "\");'>運用情報を投稿</button>";
        }
    } else {
        buf += "<div class='no_data'>運用表に登録されていない運用です</div>";
    }
    
    document.getElementById("operation_detail_popup_inner").innerHTML = buf;
    
    if (operation_number in operation_table["operations"]) {
        draw_operation_trains(operation_number, diagram_id_or_ts, is_today, search_keyword);
    }
    
    if (navigator.onLine && operation_data_date_ts !== null) {
        get_operation_data_detail(operation_data_date_str, operation_number, "operation_data_detail_area");
    }
}

function draw_operation_trains (operation_number, diagram_id_or_ts, is_today, search_keyword = null) {
    if (config["simplify_operation_details"]) {
        var train_div_class_name = "train_overview";
    } else {
        var train_div_class_name = "operation_table_train";
    }
    var buf = "<div class='" + train_div_class_name + "'" + (mode_val === 2 && operation_table["operations"][operation_number]["starting_track"] !== null ? "onclick=' show_previous_day_operation(\"" + add_slashes(operation_table["operations"][operation_number]["starting_location"]) + "\", \"" + add_slashes(operation_table["operations"][operation_number]["starting_track"]) + "\");'" : "") + "><b class='train_overview_location'>" + operation_table["operations"][operation_number]["starting_location"];
    if (operation_table["operations"][operation_number]["starting_track"] !== null) {
        buf += "<small>(" + operation_table["operations"][operation_number]["starting_track"] + ")</small>";
    }
    
    if (operation_table["operations"][operation_number]["starting_time"] !== null) {
        buf += " 出庫</b><time>" + operation_table["operations"][operation_number]["starting_time"] + "</time></div>";
        
        if (is_today) {
            var now_str = get_hh_mm();
        }
        
        var trains = operation_table["operations"][operation_number]["trains"];
        var next_train_operation_list = null;
        var starting_station = null;
        var highlight_str = "";
        for (var cnt = 0; cnt < trains.length; cnt++) {
            if (trains[cnt]["train_number"].startsWith(".")) {
                buf += "<div class='" + train_div_class_name + " operation_table_deposited_train'><div>";
                if ("formations_can_changed" in trains[cnt] && trains[cnt]["formations_can_changed"]) {
                    buf += "<b>" + trains[cnt]["train_number"].substring(1).split("__")[0] + "<small class='warning_sentence'>" + (!config["simplify_operation_details"] ? "差し替え注意" : "待機") + "</small></b>";
                } else {
                    buf += "<b>" + trains[cnt]["train_number"].substring(1).split("__")[0] + "<small>待機</small></b>";
                }
                
                if (is_today && trains[cnt]["final_arrival_time"] < now_str) {
                    highlight_str = "";
                }
                
                buf += "<div" + highlight_str + "><span>" + trains[cnt]["first_departure_time"] + "</span><span>〜</span><span>" + trains[cnt]["final_arrival_time"] + "</span></div>";
                buf += "</div></div>";
            } else {
                if (next_train_operation_list === null) {
                    var operations_list = get_operations(trains[cnt]["line_id"], trains[cnt]["train_number"], trains[cnt]["starting_station"], trains[cnt]["direction"] + "_trains");
                    if (operations_list !== null) {
                        operations_list.splice(operations_list.indexOf(operation_number), 1);
                    } else {
                        operations_list = [];
                    }
                } else {
                    var operations_list = next_train_operation_list;
                }
                
                if (starting_station === null) {
                    if (config["simplify_operation_details"]) {
                        for (var station of railroad_info["lines"][trains[cnt]["line_id"]]["stations"]) {
                            if (station["station_name"] === trains[cnt]["starting_station"]) {
                                starting_station = station["station_initial"];
                                break;
                            }
                        }
                    } else {
                        starting_station = trains[cnt]["starting_station"];
                    }
                    
                    var first_departure_time = trains[cnt]["first_departure_time"];
                    
                    if (is_today && search_keyword === null && first_departure_time <= now_str) {
                        highlight_str = " class='search_highlight'";
                    }
                }
                
                if (cnt + 1 < trains.length && trains[cnt]["train_number"] === trains[cnt + 1]["train_number"]) {
                    next_train_operation_list = get_operations(trains[cnt + 1]["line_id"], trains[cnt + 1]["train_number"], trains[cnt + 1]["starting_station"], trains[cnt + 1]["direction"] + "_trains");
                    if (next_train_operation_list !== null) {
                        next_train_operation_list.splice(next_train_operation_list.indexOf(operation_number), 1);
                    } else {
                        next_train_operation_list = [];
                    }
                    
                    if (config["simplify_operation_details"] || operations_list.toString() === next_train_operation_list.toString() ) {
                        continue;
                    }
                } else {
                    next_train_operation_list = null;
                }
                
                buf += "<div class='" + train_div_class_name + "'>";
                
                var train_type = "";
                if (trains[cnt]["train_number"] in timetable["timetable"][trains[cnt]["line_id"]][trains[cnt]["direction"] + "_trains"]) {
                    for (var timetable_train of timetable["timetable"][trains[cnt]["line_id"]][trains[cnt]["direction"] + "_trains"][trains[cnt]["train_number"]]) {
                        if (timetable_train["starting_station"] === trains[cnt]["starting_station"]) {
                            train_type = timetable_train["train_type"];
                            
                            break;
                        }
                    }
                } else {
                    if (railroad_info["deadhead_train_number_regexp"].test(trains[cnt]["train_number"])) {
                        train_type = "回送";
                    }
                }
                
                var train_number_text = trains[cnt]["train_number"].split("__")[0];
                
                buf += "<div onclick='train_detail(\"" + trains[cnt]["line_id"] + "\", \"" + trains[cnt]["train_number"] + "\", \"" + trains[cnt]["starting_station"] + "\", \"" + trains[cnt]["direction"] + "_trains\", false, " + is_today + ");'><b style='color: " + (config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_number_text, train_type)) : get_train_color(train_number_text, train_type)) + ";'><u>";
                buf += config["simplify_operation_details"] ? train_type.substring(0, 1) + " " : train_type + "　";
                
                if (search_keyword !== null && train_number_text.toUpperCase().includes(search_keyword)) {
                    var search_keyword_index = train_number_text.toUpperCase().indexOf(search_keyword);
                    buf += escape_html(train_number_text.substring(0, search_keyword_index)) + "<mark>" + escape_html(train_number_text.substring(search_keyword_index, search_keyword_index + search_keyword.length)) + "</mark>" + escape_html(train_number_text.substring(search_keyword_index + search_keyword.length));
                } else {
                    buf += escape_html(train_number_text);
                }
                
                buf += "</u><small>(";
                if (trains[cnt]["position_forward"] !== trains[cnt]["position_rear"]) {
                    buf += trains[cnt]["position_forward"] + "-" + trains[cnt]["position_rear"];
                } else {
                    buf += trains[cnt]["position_forward"];
                }
                if (!config["simplify_operation_details"]) {
                    buf += "両目";
                }
                buf += ")</small></b>";
                
                if (is_today && trains[cnt]["final_arrival_time"] < now_str) {
                    highlight_str = "";
                }
                
                if (config["simplify_operation_details"]) {
                    for (var station of railroad_info["lines"][trains[cnt]["line_id"]]["stations"]) {
                        if (station["station_name"] === trains[cnt]["terminal_station"]) {
                            var terminal_station = station["station_initial"];
                            break;
                        }
                    }
                } else {
                    var terminal_station = trains[cnt]["terminal_station"];
                }
                
                buf += "<div" + highlight_str + "><span>" + starting_station + " " + first_departure_time + "</span><span>→</span><span>" + trains[cnt]["final_arrival_time"] + " " + terminal_station + "</span></div></div>";
                
                if (!config["simplify_operation_details"] && operations_list.length >= 1) {
                    buf += "<div class='coupling_info'>併結:";
                    for (var coupling_operation of operations_list) {
                        if (coupling_operation.startsWith("<=>")) {
                            coupling_operation = coupling_operation.substring(3);
                        }
                        
                        buf += " <u onclick='operation_detail(\"" + coupling_operation + "\", " + diagram_id_or_ts + ");'>" + coupling_operation + "運用";
                        if (operation_data !== null) {
                            buf += "<small>(" + (coupling_operation in operation_data["operations"] && operation_data["operations"][coupling_operation] !== null ? escape_html(operation_data["operations"][coupling_operation]["formations"]) : "情報なし") + ")</small>";
                        }
                        buf += "</u>";
                    }
                    buf += "</div>";
                }
                
                buf += "</div>";
                
                starting_station = null;
            }
            
            if (is_today && search_keyword === null && trains[cnt]["final_arrival_time"] < now_str) {
                highlight_str = " class='search_highlight'";
            } else {
                highlight_str = "";
            }
        }
        
        buf += "<div class='" + train_div_class_name + "'" + (mode_val === 2 && operation_table["operations"][operation_number]["terminal_track"] !== null ? "onclick=' show_next_day_operation(\"" + add_slashes(operation_table["operations"][operation_number]["terminal_location"]) + "\", \"" + add_slashes(operation_table["operations"][operation_number]["terminal_track"]) + "\");'" : "") + "><b class='train_overview_location'>" + operation_table["operations"][operation_number]["terminal_location"];
        if (operation_table["operations"][operation_number]["terminal_track"] !== null) {
            buf += "<small>(" + operation_table["operations"][operation_number]["terminal_track"] + ")</small>";
        }
        buf += " 入庫</b><time>" + operation_table["operations"][operation_number]["ending_time"] + "</time></div>";
    } else {
        buf += " 待機</b><time datetime='PT24H'>運行なし</time>";
    }
    
    document.getElementById("operation_trains_area").innerHTML = buf;
}

function change_simplify_operation_details (bool_val, operation_number, operation_table_name_or_ts, is_today, search_keyword) {
    config["simplify_operation_details"] = bool_val;
    
    save_config();
    
    draw_operation_trains(operation_number, operation_table_name_or_ts, is_today, search_keyword);
}

function previous_operation_number (operation_number_or_index, operation_data_date_ts_or_operation_name) {
    if (typeof operation_number_or_index === "string") {
        var operation_numbers = operation_table["operation_groups"][operation_table["operations"][operation_number_or_index]["operation_group_name"]]["operation_numbers"];
        var operation_number_index = operation_numbers.indexOf(operation_number_or_index);
        
        if (operation_number_index >= 1) {
            operation_detail(operation_numbers[operation_number_index - 1], operation_data_date_ts_or_operation_name);
        } else {
            var group_index = operation_table["operation_group_names"].indexOf(operation_table["operations"][operation_number_or_index]["operation_group_name"]);
            var previous_group = operation_table["operation_groups"][operation_table["operation_group_names"][group_index >= 1 ? group_index - 1 : operation_table["operation_group_names"].length - 1]];
            
            operation_detail(previous_group["operation_numbers"][previous_group["operation_numbers"].length - 1], operation_data_date_ts_or_operation_name);
        }
    } else {
        if (operation_number_or_index >= 1) {
            operation_detail(operation_number_or_index - 1, operation_data_date_ts_or_operation_name);
        } else {
            operation_detail(operation_number_order.length - 1, operation_data_date_ts_or_operation_name);
        }
    }
}

function next_operation_number (operation_number_or_index, operation_data_date_ts_or_operation_name) {
    if (typeof operation_number_or_index === "string") {
        var operation_numbers = operation_table["operation_groups"][operation_table["operations"][operation_number_or_index]["operation_group_name"]]["operation_numbers"];
        var operation_number_index = operation_numbers.indexOf(operation_number_or_index);
        
        if (operation_number_index < operation_numbers.length - 1) {
            operation_detail(operation_numbers[operation_number_index + 1], operation_data_date_ts_or_operation_name);
        } else {
            var group_index = operation_table["operation_group_names"].indexOf(operation_table["operations"][operation_number_or_index]["operation_group_name"]);
            var next_group = operation_table["operation_groups"][operation_table["operation_group_names"][group_index < operation_table["operation_group_names"].length - 1 ? group_index + 1 : 0]];
            
            operation_detail(next_group["operation_numbers"][0], operation_data_date_ts_or_operation_name);
        }
    } else {
        if (operation_number_or_index < operation_number_order.length - 1) {
            operation_detail(operation_number_or_index + 1, operation_data_date_ts_or_operation_name);
        } else {
            operation_detail(0, operation_data_date_ts_or_operation_name);
        }
    }
}

function show_previous_day_operation (starting_location, starting_track) {
    popup_close();
    
    operation_data_change_date(-1, function (succeeded) {
        if (!succeeded) {
            return;
        }
        
        for (var operation_number of Object.keys(operation_table["operations"])) {
            if (operation_table["operations"][operation_number]["terminal_location"] === starting_location && operation_table["operations"][operation_number]["terminal_track"] === starting_track) {
                var dt = new Date(operation_data["operation_date"] + " 04:00:00");
                var operation_data_date = Math.floor(dt.getTime() / 1000);
                
                operation_detail(operation_number, operation_data_date, operation_data["operation_date"] === get_date_string(get_timestamp()));
                
                return;
            }
        }
        
        mes("前日運用はありません");
    });
}

function show_next_day_operation (terminal_location, terminal_track) {
    popup_close();
    
    operation_data_change_date(1, function (succeeded) {
        if (!succeeded) {
            return;
        }
        
        for (var operation_number of Object.keys(operation_table["operations"])) {
            if (operation_table["operations"][operation_number]["starting_location"] === terminal_location && operation_table["operations"][operation_number]["starting_track"] === terminal_track) {
                var dt = new Date(operation_data["operation_date"] + " 04:00:00");
                var operation_data_date = Math.floor(dt.getTime() / 1000);
                
                operation_detail(operation_number, operation_data_date, operation_data["operation_date"] === get_date_string(get_timestamp()));
                
                return;
            }
        }
        
        mes("翌日運用はありません");
    });
}


function activate_formation_table_tab (division_name) {
    for (var area_elm of document.getElementsByClassName("formation_division_area")) {
        if (area_elm.id === "formation_division_" + division_name) {
            area_elm.style.display = "block";
            document.getElementById("formation_division_tab_" + division_name).classList.add("active_tab");
        } else {
            area_elm.style.display = "none";
            document.getElementById("formation_division_tab_" + area_elm.id.substring(19)).classList.remove("active_tab");
        }
    }
    
    formation_table_active_tab = division_name;
}

function change_colorize_formation_table (bool_val) {
    config["colorize_formation_table"] = bool_val;
    
    save_config();
    
    draw_formation_table(false);
}

function change_show_unregistered_formations (bool_val) {
    config["show_unregistered_formations_on_formation_table"] = bool_val;
    
    save_config();
    
    draw_formation_table(false);
}

function change_group_formations_by_prefix (bool_val) {
    config["group_formations_by_prefix"] = bool_val;
    
    save_config();
    
    draw_formation_table(false);
}

function update_formation_table_drop_down_status (elm) {
    formation_table_drop_down_status[elm.id] = elm.checked;
}


var show_previous_day_operation_data = false;
var show_same_day_operation_data = false;
var show_next_day_operation_data = false;

function operation_data_history (formation_name, operation_number = null) {
    var popup_inner_elm = open_popup("data_history_popup", "運用履歴", true);
    
    popup_inner_elm.className = "wait_icon";
    
    get_operation_data_history(formation_name, operation_number);
}

function get_operation_data_history (formation_name, operation_number, yyyy_mm = "") {
    var popup_inner_elm = document.getElementById("data_history_popup_inner");
    
    popup_inner_elm.innerHTML = "";
    
    if (operation_number === null) {
        var post_q = "formation_name=" + escape_form_data(formation_name);
        var h3_text = formation_name;
    } else {
        var post_q = "operation_number=" + escape_form_data(operation_number);
        var h3_text = operation_number + "運用";
    }
    
    if (yyyy_mm === "") {
        var ts = get_timestamp();
        var day_count = 30
    } else {
        var ts = Math.floor(Date.parse(yyyy_mm + "-01 12:00:00") / 1000);
        post_q += "&year_month=" + yyyy_mm;
        var day_count = new Date(Number(yyyy_mm.substring(0, 4)), Number(yyyy_mm.substring(5)), 0).getDate();
    }
    
    var operation_data_date = get_date_string(ts);
    if (operation_table === null) {
        var load_data_promise = new Promise(function (resolve, reject) {
            get_diagram_id(operation_data_date, null, function (diagram_data) {
                load_data(resolve, null, reject, diagram_data["diagram_revision"], diagram_data["diagram_id"], null, operation_data_date);
            });
        });
    } else {
        var load_data_promise = Promise.resolve();
    }
    
    load_data_promise.then(function () {
        ajax_post("operation_data_history.php", "railroad_id=" + escape_form_data(railroad_info["railroad_id"]) + "&" + post_q, function (response) {
            const YOBI_LIST = ["日", "月", "火", "水", "木", "金", "土"];
            
            if (response !== false) {
                var holiday_list = get_holiday_list(operation_data_date.substring(0, 4));
                
                var dt = new Date();
                var buf = "<h3>" + escape_html(h3_text) + "</h3>";
                buf += "<div class='popup_subtitle'>" + (yyyy_mm === "" ? "過去30日間" : yyyy_mm.substring(0, 4) + "年" + Number(yyyy_mm.substring(5)) + "月") + "の運用履歴<input type='month' class='date_button' value='" + yyyy_mm + "' min='2000-01' max='" + dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "' onchange='get_operation_data_history(" + (formation_name === null ? "null" : "\"" + add_slashes(formation_name) + "\"") + ", " + (operation_number === null ? "null" : "\"" + add_slashes(operation_number) + "\"") + ", this.value);'></div>";
                
                if (operation_number !== null) {
                    buf += "<div class='radio_area'><input type='checkbox' id='show_previous_day_operation_data' class='chip' onchange='change_show_previous_day_operation_data(this.checked);'" + (show_previous_day_operation_data ? " checked='checked'" : "") + "><label for='show_previous_day_operation_data'>前日遷移</label><input type='checkbox' id='show_same_day_operation_data' class='chip' onchange='change_show_same_day_operation_data(this.checked);'" + (show_same_day_operation_data ? " checked='checked'" : "") + "><label for='show_same_day_operation_data'>当日遷移</label><input type='checkbox' id='show_next_day_operation_data' class='chip' onchange='change_show_next_day_operation_data(this.checked);'" + (show_next_day_operation_data ? " checked='checked'" : "") + "><label for='show_next_day_operation_data'>翌日遷移</label></div>";
                }
                
                var data = JSON.parse(response);
                
                var day_value = new Date((ts - 14400) * 1000).getDay();
                for (var cnt = 0; cnt < day_count; cnt++) {
                    var yyyy_mm_dd = get_date_string(ts);
                    
                    buf += "<h4>" + Number(yyyy_mm_dd.substring(5, 7)) + "月" + Number(yyyy_mm_dd.substring(8)) + "日 (";
                    if (day_value === 0 || holiday_list.includes(yyyy_mm_dd.substring(5))) {
                        buf += "<span style='color: " + (config["dark_mode"] ? "#ff9999" : "#cc0000") + ";'>" + YOBI_LIST[day_value] + (holiday_list.includes(yyyy_mm_dd.substring(5)) ? "・祝" : "") + "</span>";
                    } else if (day_value === 6) {
                        buf += "<span style='color: " + (config["dark_mode"] ? "#99ccff" : "#0066cc") + ";'>土</span>";
                    } else {
                        buf += YOBI_LIST[day_value];
                    }
                    buf += ")</h4>";
                    
                    if (yyyy_mm_dd in data) {
                        if (data[yyyy_mm_dd].length >= 1) {
                            if ("previous_day_operation_data" in data[yyyy_mm_dd][0]) {
                                var buf_2 = "";
                                for (var previous_day_operation_data of data[yyyy_mm_dd][0]["previous_day_operation_data"]) {
                                    buf_2 += "<div class='key_and_value'><b>" + escape_html(previous_day_operation_data["operation_number"]) + "</b>" + escape_html(previous_day_operation_data["formations"]) + "</div>";
                                }
                                
                                if (buf_2.length >= 1) {
                                    buf += "<div class='previous_day_operation_data' style='display: " + (show_previous_day_operation_data ? "block" : "none") + ";'><h5>前日</h5>" + buf_2 + "</div>";
                                }
                            }
                            
                            if ("former_operation_data" in data[yyyy_mm_dd][0]) {
                                var buf_2 = "";
                                for (var former_operation_data of data[yyyy_mm_dd][0]["former_operation_data"]) {
                                    buf_2 += "<div class='key_and_value'><b>" + escape_html(former_operation_data["operation_number"]) + "</b>" + escape_html(former_operation_data["formations"]) + "</div>";
                                }
                                
                                if (buf_2.length >= 1) {
                                    buf += "<div class='former_operation_data' style='display: " + (show_same_day_operation_data ? "block" : "none") + ";'><h5>当日</h5>" + buf_2 + "</div>";
                                }
                            }
                        }
                        
                        buf += get_operation_data_html(data[yyyy_mm_dd], ts, (operation_table !== null && get_diagram_revision(yyyy_mm_dd) === operation_table["diagram_revision"]));
                        
                        if (data[yyyy_mm_dd].length >= 1) {
                            if ("latter_operation_data" in data[yyyy_mm_dd][0]) {
                                var buf_2 = "";
                                for (var latter_operation_data of data[yyyy_mm_dd][0]["latter_operation_data"]) {
                                    buf_2 += "<div class='key_and_value'><b>" + escape_html(latter_operation_data["operation_number"]) + "</b>" + escape_html(latter_operation_data["formations"]) + "</div>";
                                }
                                
                                if (buf_2.length >= 1) {
                                    buf += "<div class='latter_operation_data' style='display: " + (show_same_day_operation_data ? "block" : "none") + ";'><h5>当日</h5>" + buf_2 + "</div>";
                                }
                            }
                            
                            if ("next_day_operation_data" in data[yyyy_mm_dd][0]) {
                                var buf_2 = "";
                                for (var next_day_operation_data of data[yyyy_mm_dd][0]["next_day_operation_data"]) {
                                    buf_2 += "<div class='key_and_value'><b>" + escape_html(next_day_operation_data["operation_number"]) + "</b>" + escape_html(next_day_operation_data["formations"]) + "</div>";
                                }
                                
                                if (buf_2.length >= 1) {
                                    buf += "<div class='next_day_operation_data' style='display: " + (show_next_day_operation_data ? "block" : "none") + ";'><h5>翌日</h5>" + buf_2 + "</div>";
                                }
                            }
                        }
                    } else {
                        buf += "<div class='descriptive_text'>情報がありません</div>";
                    }
                    
                    if (yyyy_mm === "") {
                        ts -= 86400;
                        day_value = (day_value !== 0 ? day_value - 1 : 6);
                    } else {
                        ts += 86400;
                        day_value = (day_value !== 6 ? day_value + 1 : 0);
                    }
                }
                
                if (operation_number !== null) {
                    buf += "<br><div class='informational_text'>運用遷移情報は昨日以前のもののみご確認いただけます。</div>";
                }
                
                popup_inner_elm.innerHTML = buf;
            }
        });
    });
}

function change_show_previous_day_operation_data (bool_val) {
    show_previous_day_operation_data = bool_val;
    
    for (var data_area_elm of document.getElementById("data_history_popup_inner").getElementsByClassName("previous_day_operation_data")) {
        data_area_elm.style.display = bool_val ? "block" : "none";
    }
}

function change_show_same_day_operation_data (bool_val) {
    show_same_day_operation_data = bool_val;
    
    for (var data_area_elm of document.getElementById("data_history_popup_inner").getElementsByClassName("former_operation_data")) {
        data_area_elm.style.display = bool_val ? "block" : "none";
    }
    for (var data_area_elm of document.getElementById("data_history_popup_inner").getElementsByClassName("latter_operation_data")) {
        data_area_elm.style.display = bool_val ? "block" : "none";
    }
}

function change_show_next_day_operation_data (bool_val) {
    show_next_day_operation_data = bool_val;
    
    for (var data_area_elm of document.getElementById("data_history_popup_inner").getElementsByClassName("next_day_operation_data")) {
        data_area_elm.style.display = bool_val ? "block" : "none";
    }
}


function get_formation_last_operation_html (formation_name, data, now_ts) {
    var buf = "<h4 onclick='popup_close(); formation_detail(\"" + add_slashes(formation_name) + "\");'>" + escape_html(formation_name) + "</h4>";
    
    if (data != null) {
        var last_operated_date = new Date(data["last_operated_date"] + " 04:00:00");
        last_operated_date_ts = Math.floor(last_operated_date.getTime() / 1000);
        
        buf += "最終運行日: " + last_operated_date.getFullYear() + "/" + (last_operated_date.getMonth() + 1) + "/" + last_operated_date.getDate() + " ";
        
        var days_before = Math.floor((now_ts - last_operated_date_ts) / 86400);
        if (days_before === 0) {
            buf += "<span style='color: #33cc99;'>(今日)</span>";
        } else if (days_before === 1) {
            buf += "(昨日)";
        } else if (days_before === 2) {
            buf += "(一昨日)";
        } else if (days_before <= 7) {
            buf += "(" + days_before + "日前)";
        } else {
            buf += "<span style='color: " + (!config["dark_mode"] ? "#ee7700" : "#ffcc99") + ";'>(" + days_before + "日前)</span>";
        }
        
        overview = get_formation_overview(formation_name);
        
        if (overview["unavailable"]) {
            buf += " <b class='warning_sentence'>運用離脱中</b>";
        }
        
        buf += get_operation_data_html(data["operations"], last_operated_date_ts, (operation_table !== null && get_diagram_revision(data["last_operated_date"]) === operation_table["diagram_revision"]));
    } else {
        buf += "<div class='descriptive_text'>この編成の運用情報が投稿されたことはありません</div>";
    }
    
    return buf;
}

function formations_last_operated () {
    var popup_inner_elm = open_popup("formations_last_operated_popup", "全編成の最終運行情報");
    
    popup_inner_elm.className = "wait_icon";
    popup_inner_elm.innerHTML = "";
    
    var ts = get_timestamp();
    
    var operation_data_date = get_date_string(ts);
    if (operation_table === null) {
        var load_data_promise = new Promise(function (resolve, reject) {
            get_diagram_id(operation_data_date, null, function (diagram_data) {
                load_data(resolve, null, reject, diagram_data["diagram_revision"], diagram_data["diagram_id"], null, operation_data_date);
            });
        });
    } else {
        var load_data_promise = Promise.resolve();
    }
    
    load_data_promise.then(function () {
        ajax_post("formations_last_operated.php", "railroad_id=" + escape_form_data(railroad_info["railroad_id"]), function (response) {
            if (response !== false) {
                var data = JSON.parse(response);
                
                var buf = "";
                for (var series_name of formations["series_names"]) {
                    if ("unregistered" in formations["series"][series_name] && formations["series"][series_name]["unregistered"]) {
                        continue;
                    }
                    
                    var checkbox_id = "last_operated_popup_series_" + add_slashes(series_name);
                    
                    buf += "<input type='checkbox' id='" + checkbox_id + "'><label for='" + checkbox_id + "' class='formation_table_drop_down'><span><img src='" + get_icon(series_name) + "' alt='' class='train_icon'></span>" + escape_html(series_name) + "</label><div>";
                    
                    if ("subseries_names" in formations["series"][series_name]) {
                        for (var subseries_name of formations["series"][series_name]["subseries_names"]) {
                            if ("unregistered" in formations["series"][series_name]["subseries"][subseries_name] && formations["series"][series_name]["subseries"][subseries_name]["unregistered"]) {
                                continue;
                            }
                            
                            for (var formation_name of formations["series"][series_name]["subseries"][subseries_name]["formation_names"]) {
                                if (!("cars" in formations["formations"][formation_name])) {
                                    continue;
                                }
                                
                                buf += get_formation_last_operation_html(formation_name, formation_name in data ? data[formation_name] : null, ts);
                            }
                        }
                    } else {
                        for (var formation_name of formations["series"][series_name]["formation_names"]) {
                            if (!("cars" in formations["formations"][formation_name])) {
                                continue;
                            }
                            
                            buf += get_formation_last_operation_html(formation_name, formation_name in data ? data[formation_name] : null, ts);
                        }
                    }
                    
                    buf += "</div>";
                }
                
                popup_inner_elm.innerHTML = buf;
            }
        });
    });
}


function customize_operation_table () {
    const view_list = [["simple", "シンプル", "スマートフォン向けに最適化されており、狭い画面でも多くの運用を一度に表示することができます。"], ["classic", "クラシック", "各列車の列車番号と始発・終着時刻を運用ごとに表形式で順に記載した、PC・タブレット端末向けの表示方式です。"], ["timeline", "タイムライン", "各運用の列車を運転時刻を基準として横方向にプロットした、PC・タブレット端末向けの表示方式です。"]];
    const timeline_scale_titles = ["狭め", "標準", "やや広め", "広め"];
    
    var popup_inner_elm = open_square_popup("customize_operation_table_popup", true, "運用表のカスタマイズ");
    
    var buf = "<h4>ビュー</h4>";
    var buf_2 = "";
    var buf_3 = "";
    for (var view_info of view_list) {
        buf_2 += "<input type='radio' name='operation_table_view_radio' id='radio_operation_table_view_" + view_info[0] + "' value='" + view_info[0] + "'" + (view_info[0] === config["operation_table_view"] ? " checked='checked'" : "") + " onchange='change_operation_table_view(this.value);'><label for='radio_operation_table_view_" + view_info[0] + "'>" + view_info[1] + "</label>";
        buf_3 += "<div class='informational_text' id='operation_table_view_info_" + view_info[0] + "'>" + view_info[1] + "ビューは" + view_info[2] + "</div>";
    }
    buf += "<div class='radio_area'>" + buf_2 + "</div>" + buf_3;
    
    buf += "<h4>オプション</h4>";
    buf += "<input type='checkbox' id='operation_table_option_show_start_end_times' class='toggle' onchange='change_operation_table_options();'" + (config["show_start_end_times_on_operation_table"] ? " checked='checked'" : "") + "><label for='operation_table_option_show_start_end_times'>出入庫時刻を表示</label>";
    buf += "<input type='checkbox' id='operation_table_option_show_current_trains' class='toggle' onchange='change_operation_table_options();'" + (config["show_current_trains_on_operation_table"] ? " checked='checked'" : "") + "><label for='operation_table_option_show_current_trains' id='label_show_current_trains'>出入庫の代わりに現時刻の列車を表示</label>";
    buf += "<input type='checkbox' id='operation_table_option_show_comments' class='toggle' onchange='change_operation_table_options();'" + (config["show_comments_on_operation_table"] ? " checked='checked'" : "") + "><label for='operation_table_option_show_comments' id='label_show_comments'>備考を表示</label>";
    buf += "<input type='checkbox' id='operation_table_option_show_assigned_formations' class='toggle' onchange='change_operation_table_options();'" + (config["show_assigned_formations_on_operation_table"] ? " checked='checked'" : "") + "><label for='operation_table_option_show_assigned_formations'>充当編成を表示(当日の運用表のみ)</label>";
    buf += "<div id='timeline_scale_wrapper' class='select_wrapper'>時間軸の表示幅 :<select id='operation_table_option_timeline_scale' onchange='change_operation_table_options();'>";
    for (var cnt = 1; cnt <= 4; cnt++) {
        buf += "<option value='" + cnt + "'" + (cnt === config["operation_table_timeline_scale"] ? " selected='selected'" : "") + ">" + timeline_scale_titles[cnt - 1] + "</option>";
    }
    buf += "</select></div>";
    
    popup_inner_elm.innerHTML = buf;
    
    change_operation_table_view();
}

function change_operation_table_view (view_name = null) {
    if (view_name !== null) {
        config["operation_table_view"] = view_name;
        
        operation_table_list_number(false);
    } else {
        view_name = config["operation_table_view"];
    }
    
    var view_info_simple_elm = document.getElementById("operation_table_view_info_simple");
    var view_info_classic_elm = document.getElementById("operation_table_view_info_classic");
    var view_info_timeline_elm = document.getElementById("operation_table_view_info_timeline");
    var show_current_trains_label_elm = document.getElementById("label_show_current_trains");
    var show_comments_label_elm = document.getElementById("label_show_comments");
    var timeline_scale_wrapper_elm = document.getElementById("timeline_scale_wrapper");
    
    if (view_name === "simple") {
        view_info_simple_elm.style.display = "block";
        view_info_classic_elm.style.display = "none";
        view_info_timeline_elm.style.display = "none";
        
        show_current_trains_label_elm.style.display = "block";
        show_comments_label_elm.style.display = "none";
        timeline_scale_wrapper_elm.style.display = "none";
    } else {
        view_info_simple_elm.style.display = "none";
        
        if (view_name === "classic") {
            view_info_classic_elm.style.display = "block";
            view_info_timeline_elm.style.display = "none";
            
            timeline_scale_wrapper_elm.style.display = "none";
        } else {
            view_info_classic_elm.style.display = "none";
            view_info_timeline_elm.style.display = "block";
            
            timeline_scale_wrapper_elm.style.display = "block";
        }
        
        show_current_trains_label_elm.style.display = "none";
        show_comments_label_elm.style.display = "block";
    }
    
    save_config();
}

function change_operation_table_options () {
    config["show_start_end_times_on_operation_table"] = document.getElementById("operation_table_option_show_start_end_times").checked;
    config["show_current_trains_on_operation_table"] = document.getElementById("operation_table_option_show_current_trains").checked;
    config["show_comments_on_operation_table"] = document.getElementById("operation_table_option_show_comments").checked;
    config["show_assigned_formations_on_operation_table"] = document.getElementById("operation_table_option_show_assigned_formations").checked;
    config["operation_table_timeline_scale"] = Number(document.getElementById("operation_table_option_timeline_scale").value);
    
    save_config();
    
    if (document.getElementById("tips").classList.contains("tips_active")) {
        show_tips();
    }
    
    operation_table_list_number(false);
}

function update_operation_table_drop_down_status (elm) {
    operation_table_drop_down_status[elm.id] = elm.checked;
}

function operation_table_change (diagram_revision, diagram_id) {
    operation_search_area_elm.style.display = "none";
    operation_table_area_elm.innerHTML = "";
    operation_table_area_supplement_elm.innerHTML = "";
    
    document.getElementById("operation_table_name").innerText = diagram_info[diagram_revision]["diagrams"][diagram_id]["diagram_name"];
    
    var today_date_string = get_date_string(get_timestamp());
    get_diagram_id(today_date_string, null, function (diagram_data) {
        load_data(function () {
            operation_table_list_number();
        }, null, function () {
            operation_table_area_elm.innerHTML = "<div class='no_data'>表示に必要なデータが利用できません</div>";
        }, diagram_revision, diagram_id, null, (diagram_revision === diagram_data["diagram_revision"] && diagram_id === diagram_data["diagram_id"]) ? today_date_string : null);
    });
    
}

function operation_table_previous () {
    var list_index = diagram_info[operation_table["diagram_revision"]]["diagram_order"].indexOf(operation_table["diagram_id"]) - 1;
    
    if (list_index === -1) {
        get_diagram_id (get_date_string(get_timestamp()), null ,function (diagram_data) {
            if (diagram_data["diagram_revision"] === operation_table["diagram_revision"] && !diagram_info[operation_table["diagram_revision"]]["diagram_order"].includes(diagram_data["diagram_id"])) {
                operation_table_change(operation_table["diagram_revision"], diagram_data["diagram_id"]);
            } else {
                operation_table_change(operation_table["diagram_revision"], diagram_info[operation_table["diagram_revision"]]["diagram_order"][diagram_info[operation_table["diagram_revision"]]["diagram_order"].length - 1]);
            }
        });
    } else {
        if (list_index === -2) {
            list_index = diagram_info[operation_table["diagram_revision"]]["diagram_order"].length - 1;
        }
        
        operation_table_change(operation_table["diagram_revision"], diagram_info[operation_table["diagram_revision"]]["diagram_order"][list_index]);
    }
}

function operation_table_next () {
    var list_index = diagram_info[operation_table["diagram_revision"]]["diagram_order"].indexOf(operation_table["diagram_id"]) + 1;
    
    if (list_index >= diagram_info[operation_table["diagram_revision"]]["diagram_order"].length) {
        get_diagram_id (get_date_string(get_timestamp()), null ,function (diagram_data) {
            if (diagram_data["diagram_revision"] === operation_table["diagram_revision"] && !diagram_info[operation_table["diagram_revision"]]["diagram_order"].includes(diagram_data["diagram_id"])) {
                operation_table_change(operation_table["diagram_revision"], diagram_data["diagram_id"]);
            } else {
                operation_table_change(operation_table["diagram_revision"], diagram_info[operation_table["diagram_revision"]]["diagram_order"][0]);
            }
        });
    } else {
        operation_table_change(operation_table["diagram_revision"], diagram_info[operation_table["diagram_revision"]]["diagram_order"][list_index]);
    }
}

function operation_table_list_tables () {
    var popup_inner_elm = open_square_popup("diagram_list_popup", true, "ダイヤの選択");
    
    var buf = "";
    for (var diagram_id of diagram_info[operation_table["diagram_revision"]]["diagram_order"]) {
        var bg_color = config["dark_mode"] ? convert_color_dark_mode(diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["main_color"]) :diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
        buf += "<button type='button' class='wide_button' onclick='close_square_popup(); operation_table_change(\"" + operation_table["diagram_revision"] + "\", \"" + diagram_id + "\");' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>"  + escape_html(diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]) + "</button>";
    }
    
    if ("special_diagram_order" in diagram_info[operation_table["diagram_revision"]] && diagram_info[operation_table["diagram_revision"]]["special_diagram_order"].length >= 1) {
        buf += "<h4>臨時ダイヤ</h4>";
        for (var diagram_id of diagram_info[operation_table["diagram_revision"]]["special_diagram_order"]) {
            var bg_color = config["dark_mode"] ? convert_color_dark_mode(diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["main_color"]) :diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["main_color"];
            buf += "<button type='button' class='wide_button' onclick='close_square_popup(); operation_table_change(\"" + operation_table["diagram_revision"] + "\", \"" + diagram_id + "\");' style='background-color: " + bg_color + "; border-color: " + bg_color + ";'>"  + escape_html(diagram_info[operation_table["diagram_revision"]]["diagrams"][diagram_id]["diagram_name"]) + "</button>";
        }
    }
    
    buf += "<u type='button' class='execute_link' onclick='close_square_popup(); operation_table_mode(null);'>他の改正・変更版のダイヤ</u>";
    
    popup_inner_elm.innerHTML = buf;
}


function show_tips () {
    if (mode_val === -1) {
        return;
    }
    
    document.getElementById("tips").className = "tips_active";
    
    if (mode_val <= 2 || (mode_val === 4 && config["show_assigned_formations_on_operation_table"])) {
        var buf = "<h5>投稿内容による編成名の表示色等</h5>";
        buf += "<table>";
        buf += "<tr><th><b style='color: " + (!config["dark_mode"] ? "#cc0000" : "#ff9999") + ";'>●赤色</b> :</th><td>運用途中での差し替えが報告されています</td><tr>";
        if (config["colorize_corrected_posts"]) {
            buf += "<tr><th><b  style='color: " + (!config["dark_mode"] ? "#ee7700" : "#ffcc99") + ";'>●橙色</b> :</th><td>別々のユーザー様から異なる情報が寄せられています</td><tr>";
        }
        buf += "<tr><th><b  style='color: " + (!config["dark_mode"] ? "#0099cc" : "#33ccff") + ";'>●水色</b> :</th><td>前日運用からの推定または一時入庫以前の情報であり、当日/再出庫後の目撃情報がまだありません</td><tr>";
        buf += "<tr><th><b  style='color: " + (!config["dark_mode"] ? "#9966ff" : "#cc99ff") + ";'>●紫色</b> :</th><td>外部からの引用に基づく情報です</td><tr>";
        if (config["colorize_beginners_posts"]) {
            buf += "<tr><th><b  style='color: #33cc99;'>●緑色</b> :</th><td>ビギナーユーザー様、またはゲストユーザー様が投稿された情報です</td><tr>";
        }
        buf += "<tr><th><b>* 印</b> :</th><td>補足説明付きの情報です</td><tr>";
        buf += "</table>";
    } else {
        var buf = "";
    }
    
    switch (mode_val) {
        case 0:
            buf += "<h5>走行位置の機能</h5>";
            buf += "<ul>";
            buf += "<li><b>駅名</b>をタップするとその駅の時刻表が表示されます。</li>";
            buf += "<li><b>時刻</b>を上下にスワイプすると、「時」は6時間、「分」は10分単位で増減可能です。</li>";
            buf += "</ul>";
            break;
        case 1:
            buf += "<h5>時刻表の機能</h5>";
            buf += "発車済みの列車は背景がグレーで表示されます。";
            break;
        case 4:
            buf += "<h5>出入庫の表示色</h5>";
            buf += "午前入庫は<b style='color: " + (config["dark_mode"] ? "#ff99cc" : "#cc0066") + ";'>紅色</b>、午後出庫は<b style='color: " + (config["dark_mode"] ? "#99ccff" : "#0066cc") + ";'>青色</b>で出入庫情報が表示されます。";
            buf += "<h5>途中待機の表示色</h5>";
            buf += "車両の差し替えが行われる可能性のある途中待機では、待機場所名が<b class='warning_sentence'>赤色</b>で表示されます。";
            if (!config["show_assigned_formations_on_operation_table"]) {
                break;
            }
        case 2:
            buf += "<h5>充当編成情報の機能</h5>";
            buf += "<ul>";
            buf += "<li>出庫前の編成は背景が<b>斜線</b>で、入庫済みの編成は背景が<b style='color: " + (config["dark_mode"] ? "#999999" : "#808080") + ";'>グレー</b>で、一時入庫中の編成は背景が<b>ドット柄</b>で表示されます。</li>";
            buf += "<li><a href='javascript:void(0);' onclick='edit_config();'>アプリの設定</a>から「<b>運用データ等に編成の説明を表示</b>」を有効化すると、特記事項のある編成では編成名のあとに一行説明が表示されます。</li>";
            buf += "</ul>";
            break;
        case 3:
            buf += "<h5>編成表の機能</h5>";
            buf += "<ul>";
            buf += "<li><b>スクリーンショットボタン</b>(カメラのマーク)をタップすると、編成表や各編成の情報を画像として保存することができます。</li>";
            buf += "<li><a href='javascript:void(0);' onclick='edit_config();'>アプリの設定</a>から「<b>西向き先頭車を編成表左側に表示</b>」を有効化すると、編成表の左右と編成の西東を合わせて表示することが可能です。</li>";
            buf += "</ul>";
            break;
    }
    
    document.getElementById("tips_area").innerHTML = "<button type='button' class='tips_close_button' onclick='hide_tips();'></button>" + buf;
}

function hide_tips () {
    document.getElementById("tips").className = "tips_inactive";
    document.getElementById("tips_area").innerHTML = "";
}


function take_screenshot (elm_id, is_popup = false) {
    var popup_inner_elm = open_popup("screenshot_popup", "スクリーンショット");
    
    popup_inner_elm.innerHTML = "<div id='screenshot_preview'></div><button type='button' id='save_screenshot_button' class='wide_button' onclick='save_screenshot();' style='display: none;'>画像として保存</button><br><a href='#about_railroad_data_popup' class='bottom_link' onclick='event.preventDefault(); about_railroad_data();'>データのご利用条件</a>";
    
    var screenshot_area_elm = document.createElement("div");
    screenshot_area_elm.classList.add("screenshot_area");
    
    if (is_popup) {
        screenshot_area_elm.classList.add("popup_screenshot_area");
    }
    
    screenshot_area_elm.innerHTML = document.getElementById(elm_id).innerHTML;
    
    for (var input_elm of screenshot_area_elm.getElementsByTagName("input")) {
        input_elm.remove();
    }
    
    document.getElementsByTagName("body")[0].appendChild(screenshot_area_elm);
    
    var e2i = new Elem2Img();
    
    if (!config["dark_mode"]) {
        e2i.set_background_color("#ffffff");
    } else {
        e2i.set_background_color("#444444");
        screenshot_area_elm.classList.add("dark_mode");
    }
    
    e2i.get_png(function (image_data) {
        document.getElementById("screenshot_preview").innerHTML = "<img src='" + image_data + "' alt=''>";
        document.getElementById("save_screenshot_button").style.display = "block";
    }, screenshot_area_elm, 2);
    
    screenshot_area_elm.remove();
}

function save_screenshot () {
    var ts = get_timestamp();
    var dt = new Date(ts * 1000);
    
    Elem2Img.save_image(document.getElementById("screenshot_preview").getElementsByTagName("img")[0].src, UNYOHUB_APP_NAME + "_" + get_date_string(ts) + "_" + ("0" + dt.getHours()).slice(-2) + ("0" + dt.getMinutes()).slice(-2) + ("0" + dt.getSeconds()).slice(-2) + ".png");
}


function scroll_textarea_background (textarea_elm, background_elm) {
    background_elm.scrollTop = textarea_elm.scrollTop;
}

function update_textarea_background (textarea_elm, background_elm, character_limit) {
    const lf_regexp = /\n/g;
    
    var comment_text = textarea_elm.value;
    
    background_elm.innerHTML = comment_text.length >= character_limit ? escape_html(comment_text.substring(0, character_limit)).replace(lf_regexp, "<br>") + "<span class='textarea_background_highlight'>" + escape_html(comment_text.substring(character_limit)).replace(lf_regexp, "<br>") + "</span>" : escape_html(comment_text).replace(lf_regexp, "<br>");
    
    scroll_textarea_background(textarea_elm, background_elm);
}


var one_time_token = null;

function get_one_time_token () {
    ajax_post("one_time_token.php", null, function (response) {
        if (response !== false) {
            var data = JSON.parse(response);
            
            one_time_token = data["token"];
        }
    });
}

var post_railroad_id;
var post_yyyy_mm_dd;
var post_operation_number;
var post_train_number;

function write_operation_data (railroad_id, yyyy_mm_dd, operation_number, train_number = null, formation_reversed = false) {
    var popup_inner_elm = open_popup("write_operation_data_popup", "運用情報の投稿");
    
    if (!instance_info["allow_guest_user"] && user_info === null) {
        var buf = "<div class='warning_text'>情報投稿にはログインが必要です。<br>ユーザーアカウントをまだ作成されていない場合は新規登録してください。</div>";
        buf += "<div class='link_block'><a href='javascript:void(0);' onclick='show_login_form();'>ログイン</a>　<a href='/user/sign_up.php' target='_blank' rel='opener'>新規登録</a></div>";
        
        popup_inner_elm.innerHTML = buf;
        
        return;
    }
    
    var buf = "<div id='write_operation_data_announcements_area' class='loading_icon'></div>";
    
    var yyyy_mm_dd_today = get_date_string(get_timestamp());
    
    if (yyyy_mm_dd === null) {
        post_yyyy_mm_dd = yyyy_mm_dd_today;
    } else {
        post_yyyy_mm_dd = yyyy_mm_dd;
    }
    
    post_railroad_id = railroad_id === null ? railroad_info["railroad_id"] : railroad_id;
    post_operation_number = operation_number;
    
    var operation_info = post_railroad_id === railroad_info["railroad_id"] ? operation_table["operations"][operation_number] : joined_operation_tables[post_railroad_id]["operations"][operation_number];
    
    var existing_operation_data = post_railroad_id === railroad_info["railroad_id"] ? operation_data["operations"] : joined_operation_data[post_railroad_id]["operations"];
    var existing_posts_count = (operation_number in existing_operation_data && existing_operation_data[operation_number] !== null) ? existing_operation_data[operation_number]["posts_count"] : 0;
    
    var alias_of_forward_direction = escape_html(railroad_info["alias_of_forward_direction"]);
    
    buf += "<div id='write_operation_data_area'>";
    buf += "<h3>" + escape_html(operation_number) + "運用</h3>";
    
    if (post_yyyy_mm_dd > yyyy_mm_dd_today || (post_yyyy_mm_dd === yyyy_mm_dd_today && operation_info["starting_time"] > get_hh_mm())) {
        var speculative_post = true;
        
        buf += "<div class='warning_text'>【!】出庫前の運用に情報を投稿しようとしています</div>";
    } else {
        var speculative_post = false;
    }
    
    buf += "<h4>確認方法</h4>";
    buf += "<div class='radio_area'><input type='radio' name='identify_method' id='identify_method_direct' checked='checked'><label for='identify_method_direct' onclick='switch_identify_method(true);'>直接確認</label><input type='radio' name='identify_method' id='identify_method_quote'><label for='identify_method_quote' onclick='switch_identify_method(false);'>引用情報</label></div>";
    
    buf += "<h4>編成名または車両形式</h4>";
    if (!formation_reversed) {
        buf += "<div class='informational_text'><b>◀ " + alias_of_forward_direction + "</b></div>";
    } else {
        buf += "<div class='informational_text' style='text-align: right;'><b>" + alias_of_forward_direction + " ▶</b></div>";
    }
    buf += "<input type='text' id='operation_data_formation' autocomplete='off' oninput='suggest_formation(" + (post_railroad_id === railroad_info["railroad_id"] ? "null" : "\"" +  post_railroad_id + "\"") + ", this.value);' onblur='clear_formation_suggestion();'><button type='button' id='car_number_suggest_mode_button' onclick='switch_car_number_suggest_mode(!car_number_suggest_mode);'></button><div class='suggestion_area'><div id='formation_suggestion'></div></div>";
    buf += "<div id='car_number_suggest_mode_info'>車両番号から編成名をサジェストします</div>";
    buf += "<div class='informational_text'>複数の編成が連結している場合は、" + alias_of_forward_direction + "の編成から順に「+」で区切って入力してください。<br>不明な編成には「不明」、運休情報は「運休」を入力可能です。</div>";
    
    buf += "<input type='checkbox' id='operation_data_details'";
    if ((speculative_post && instance_info["require_comments_on_speculative_posts"]) || existing_posts_count >= 1) {
        buf += " checked='checked'";
    }
    buf += "><label for='operation_data_details' class='drop_down'>詳細情報</label><div>";
    
    buf += "<h4>情報の種類</h4>";
    buf += "<div class='radio_area'><input type='radio' name='operation_data_type' id='operation_data_type_normal' checked='checked'><label for='operation_data_type_normal'>通常・訂正の情報</label><input type='radio' name='operation_data_type' id='operation_data_type_reassign'><label for='operation_data_type_reassign'>新しい差し替え情報</label></div>";
    
    if (existing_posts_count >= 1) {
        buf += "<div class='warning_text'>既にこの運用に対して投稿されている情報と同じ編成を投稿する場合や、既に投稿されている運用情報が見間違いであると思われる場合に正しい編成の情報で上書きをする場合は「通常・訂正の情報」を、<br>既に投稿されている編成がダイヤ乱れや車両トラブルにより別の編成に取り替えられたことを最初に報告する場合は「新しい差し替え情報」を選択してください。</div>";
    }
    
    if (post_yyyy_mm_dd === yyyy_mm_dd_today) {
        var now_hh_mm = get_hh_mm();
    } else {
        var now_hh_mm = "99:99";
    }
    
    buf += "<h4>確認時の列車</h4>";
    buf += "<b id='operation_data_train_number'></b><button type='button' onclick='select_train_number(\"" + post_railroad_id + "\", \"" + add_slashes(operation_number) + "\", \"" + now_hh_mm + "\");'>変更</button>";
    
    buf += "<h4>運用補足情報</h4>";
    buf += "<div class='textarea_wrapper'><div id='operation_data_comment_background'></div><textarea id='operation_data_comment' onscroll='scroll_textarea_background(this, document.getElementById(\"operation_data_comment_background\"));' onkeyup='update_textarea_background(this, document.getElementById(\"operation_data_comment_background\"), " + instance_info["comment_character_limit"] + ");'></textarea></div>";
    
    if (speculative_post && instance_info["require_comments_on_speculative_posts"]) {
        buf += "<div class='warning_text' id='comment_guide'>お手数ですが、この運用に充当される編成を確認した方法を補足情報にご入力ください。</div>";
    } else {
        buf += "<div class='informational_text' id='comment_guide'>差し替え等の特記事項がない場合は省略可能です。</div>";
    }
    
    buf += "<div class='warning_text' id='quote_guide' style='display: none;'>情報の出典を補足情報にご入力ください。";
    if ("quotation_guidelines" in instance_info) {
        buf += "<br><br>" + convert_to_html(instance_info["quotation_guidelines"]);
    }
    buf += "</div>";
    
    buf += "</div>";
    
    buf += "<a href='/user/rules.php?railroad_id=" + railroad_info["railroad_id"] + "' onclick='event.preventDefault(); show_rules(\"" + railroad_info["railroad_id"] + "\");' class='bottom_link'>" + escape_html(railroad_info["railroad_name"]) + "の投稿ルール</a>";
    
    buf += "<button type='button' class='wide_button' onclick='check_post_operation_data();'>投稿する</button>";
    
    if (user_info !== null) {
        get_one_time_token();
    }
    
    popup_inner_elm.innerHTML = buf;
    
    document.getElementById("write_operation_data_popup").scrollTop = 0;
    
    if (!speculative_post) {
        for (var cnt = 0; cnt < operation_info["trains"].length; cnt++) {
            if (operation_info["trains"][cnt]["final_arrival_time"] > now_hh_mm) {
                break;
            }
        }
        
        if (train_number !== null) {
            set_train_number(train_number);
        } else {
            if (cnt === operation_info["trains"].length) {
                set_train_number("△");
            } else {
                set_train_number(operation_info["trains"][cnt]["train_number"]);
            }
        }
    } else {
        set_train_number("○");
    }
    
    switch_car_number_suggest_mode();
    
    if (railroad_rules_last_read === null) {
        show_rules(railroad_info["railroad_id"], function () { mes("ご確認ありがとうございました") });
    }
    
    var common_announcements_data = [];
    var railroad_announcements_data = [];
    
    var promise_1 = new Promise(function (resolve, reject) {
        fetch_announcements(null, false, function (announcements_data, last_read_timestamp) {
            for (var announcement of announcements_data) {
                if (announcement["show_on_post_screen"]) {
                    common_announcements_data.push(announcement);
                }
            }
            
            resolve();
        });
    });
    
    var promise_2 = new Promise(function (resolve, reject) {
        fetch_announcements(railroad_info["railroad_id"], false, function (announcements_data, last_read_timestamp) {
            for (var announcement of announcements_data) {
                if (announcement["show_on_post_screen"]) {
                    railroad_announcements_data.push(announcement);
                }
            }
            
            resolve();
        });
    });
    
    Promise.all([promise_1, promise_2]).then(function () {
        var announcements_data = common_announcements_data.concat(railroad_announcements_data);
        
        document.getElementById("write_operation_data_announcements_area").classList.remove("loading_icon");
        draw_announcements(false, announcements_data, null, "write_operation_data_announcements_area");
    });
}

function select_train_number (railroad_id, operation_number, now_hh_mm) {
    var popup_inner_elm = open_square_popup("train_number_popup", true, "列車の選択");
    
    var trains = railroad_id === railroad_info["railroad_id"] ? operation_table["operations"][operation_number]["trains"] : joined_operation_tables[post_railroad_id]["operations"][operation_number]["trains"];
    
    var buf = "<u onclick='set_train_number(\"○\")'>○ 出庫時</u>";
    
    for (var cnt = 0; cnt < trains.length; cnt++) {
        if (cnt == 0 || trains[cnt]["train_number"] !== trains[cnt - 1]["train_number"]) {
            var first_departure_time = trains[cnt]["first_departure_time"];
        }
        
        if (cnt + 1 < trains.length && trains[cnt]["train_number"] === trains[cnt + 1]["train_number"]) {
            continue;
        }
        
        var train_title = trains[cnt]["train_number"].split("__")[0];
        
        if (train_title.startsWith(".")) {
            train_title = train_title.substring(1) + "待機";
            
            var color = "inherit";
        } else {
            var color = config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_title)) : get_train_color(train_title);
        }
        
        buf += "<u onclick='set_train_number(\"" + add_slashes(trains[cnt]["train_number"]) + "\")' style='color: " + color + ";'>" + escape_html(train_title) + "<small>" + first_departure_time + " 〜 " + trains[cnt]["final_arrival_time"] + "</small></u>";
        
        if (trains[cnt]["final_arrival_time"] > now_hh_mm) {
            break;
        }
    }
    
    if (cnt === trains.length) {
        buf += "<u onclick='set_train_number(\"△\")'>△ 入庫時</u>";
    }
    
    popup_inner_elm.innerHTML = buf;
    
    document.getElementById("train_number_popup").scrollTop = 0;
}

function set_train_number (train_number) {
    if (square_popup_is_open) {
        close_square_popup();
    }
    
    post_train_number = train_number;
    
    var color = "inherit";
    if (train_number === "○") {
        var train_title = "出庫時";
    } else if (train_number === "△") {
        var train_title = "入庫時";
    } else {
        var train_title = train_number.split("__")[0];
        
        if (train_title.startsWith(".")) {
            train_title = train_title.substring(1) + "待機";
        } else {
            color = config["dark_mode"] ? convert_font_color_dark_mode(get_train_color(train_title)) : get_train_color(train_title);
        }
    }
    
    var operation_data_train_number_elm = document.getElementById("operation_data_train_number");
    operation_data_train_number_elm.innerText = train_title;
    operation_data_train_number_elm.style.color = color;
}

function switch_identify_method (direct) {
    var comment_guide_elm = document.getElementById("comment_guide");
    var quote_guide_elm = document.getElementById("quote_guide");
    
    if (direct) {
        comment_guide_elm.style.display = "block";
        quote_guide_elm.style.display = "none";
    } else {
        comment_guide_elm.style.display = "none";
        quote_guide_elm.style.display = "block";
        
        document.getElementById("operation_data_details").checked = true;
    }
}

var car_number_suggest_mode = false;
var car_list = [];

function switch_car_number_suggest_mode (enable = null) {
    if (enable !== null) {
        car_number_suggest_mode = enable;
    }
    
    car_list = [];
    
    var button_elm = document.getElementById("car_number_suggest_mode_button");
    var mode_info_elm = document.getElementById("car_number_suggest_mode_info");
    
    if (car_number_suggest_mode) {
        button_elm.classList.add("car_number_suggest_mode");
        mode_info_elm.style.display = "block";
        
        var formation_data = post_railroad_id === railroad_info["railroad_id"] ? formations["formations"] : joined_railroad_formations[post_railroad_id]["formations"];
        
        for (var formation_name of Object.keys(formation_data).toSorted()) {
            if (!("cars" in formation_data[formation_name])) {
                continue;
            }
            
            for (var car_data of formation_data[formation_name]["cars"]) {
                car_list.push({ car_number : car_data["car_number"].toUpperCase(), formation_name : formation_name });
            }
        }
    } else {
        button_elm.classList.remove("car_number_suggest_mode");
        mode_info_elm.style.display = "none";
    }
}

function suggest_formation (railroad_id, formations_text) {
    if (railroad_id === railroad_info["railroad_id"]) {
        railroad_id = null;
    }
    
    var formations_splitted = formations_text.split("+");
    var formation_text = str_to_halfwidth(formations_splitted[formations_splitted.length - 1]).toUpperCase();
    
    var buf = "";
    
    if (formation_text.length >= 1) {
        if (railroad_id === null) {
            var formation_data = formations["formations"];
            var icon_ids = series_icon_ids;
        } else {
            var formation_data = joined_railroad_formations[railroad_id]["formations"];
            var icon_ids = joined_railroad_series_icon_ids[railroad_id];
        }
        
        var formation_names = Object.keys(icon_ids).concat(Object.keys(formation_data).toSorted());
        
        if (!car_number_suggest_mode) {
            var suggestion_list = formation_names.filter(function (formation_name) {
                return formation_name.toUpperCase().startsWith(formation_text) && (formation_name in icon_ids || "cars" in formation_data[formation_name]);
            });
        } else {
            var suggestion_list = car_list.filter(function (car_data) {
                return car_data["car_number"].includes(formation_text);
            });
        }
        
        for (var suggestion of suggestion_list) {
            buf += "<button type='button' onclick='complete_formation(\"";
            
            if (!car_number_suggest_mode) {
                var overview = get_formation_overview(suggestion, railroad_id);
                
                if (!car_number_suggest_mode && overview["semifixed_formation"] !== null) {
                    buf += add_slashes(overview["semifixed_formation"]) + "\");'>";
                    
                    var suggestion_formations = overview["semifixed_formation"].split("+");
                    for (var cnt = 0; cnt < suggestion_formations.length; cnt++) {
                        buf += (cnt >= 1 ? " + " : "") + "<img src='" + get_icon(suggestion_formations[cnt], railroad_id) + "' alt='' class='train_icon'" + (overview["unavailable"] ? " style='opacity: 0.5;'" : "") + ">" + (suggestion_formations[cnt] === suggestion ? "<b>" : "") + escape_html(suggestion_formations[cnt]) + (suggestion_formations[cnt] === suggestion ? "</b>" : "");
                    }
                    
                    if (overview["unavailable"]) {
                        buf += "<small class='warning_sentence'>(離脱中)</small>";
                    } else {
                        buf += "<small>(半固定)</small>";
                    }
                } else {
                    buf += add_slashes(suggestion) + "\");'>";
                    
                    if (overview["unavailable"]) {
                        buf += "<img src='" + get_icon(suggestion, railroad_id) + "' alt='' class='train_icon' style='opacity: 0.5;'>" + escape_html(suggestion) + "<small class='warning_sentence'>(運用離脱中)</small>";
                    } else {
                        buf += "<img src='" + get_icon(suggestion, railroad_id) + "' alt='' class='train_icon'><b>" + escape_html(suggestion) + "</b>";
                        if (overview["caption"].length >= 1) {
                            buf += "<small>(" + escape_html(overview["caption"]) + ")</small>";
                        }
                    }
                }
            } else {
                buf += add_slashes(suggestion["formation_name"]) + "\");'>";
                
                var start_pos = suggestion["car_number"].indexOf(formation_text);
                var end_pos = start_pos + formation_text.length;
                
                buf += "<img src='" + get_icon(suggestion["formation_name"], railroad_id) + "' alt='' class='train_icon'>" + escape_html(suggestion["car_number"].substring(0, start_pos)) + "<b>" + escape_html(suggestion["car_number"].substring(start_pos, end_pos)) + "</b>" + escape_html(suggestion["car_number"].substring(end_pos));
                buf += "<small>(" + escape_html(suggestion["formation_name"]) + ")</small>";
            }
            
            buf += "</button>";
        }
    }
    
    document.getElementById("formation_suggestion").innerHTML = buf;
}

function complete_formation (formation_text) {
    var operation_data_formation_elm = document.getElementById("operation_data_formation");
    
    if (formation_text !== "+") {
        var formations_splitted = operation_data_formation_elm.value.split("+");
        formations_splitted[formations_splitted.length - 1] = formation_text;
        
        operation_data_formation_elm.value = formations_splitted.join("+");
        
        setTimeout(function () {
            document.getElementById("formation_suggestion").innerHTML = "<button type='button' onclick='complete_formation(\"+\");'>＋</button>";
        }, 200);
    } else {
        operation_data_formation_elm.value += "+";
    }
    
    if (window.navigator.userAgent.includes("Chrome") || !window.navigator.userAgent.includes("Safari")) {
        operation_data_formation_elm.focus();
    }
}

function clear_formation_suggestion () {
    setTimeout(function () {
        document.getElementById("formation_suggestion").innerHTML = "";
    }, 100);
}

function select_operation_to_write_data (line_id, train_number, starting_station, train_direction) {
    var train_operations = get_operations(line_id, train_number, starting_station, train_direction);
    
    if (train_operations.length === 1) {
        if (train_operations[0].startsWith("<=>")) {
            train_operations[0] = train_operations[0].substring(3);
            
            var formation_reversed = true;
        } else {
            var formation_reversed = false;
        }
        
        var at_pos = train_operations[0].indexOf("@");
        if (at_pos === -1) {
            var railroad_id = null;
        } else {
            var railroad_id = train_operations[0].substring(at_pos + 1);
            train_operations[0] = train_operations[0].substring(0, at_pos);
        }
        
        write_operation_data(railroad_id, null, train_operations[0], train_number, formation_reversed);
        
        return;
    }
    
    var popup_inner_elm = open_square_popup("select_operation_popup", train_operations.length >= 4, "情報を投稿する運用の選択");
    
    var position_operations = {};
    for (var train_operation of train_operations) {
        if (train_operation.startsWith("<=>")) {
            train_operation = train_operation.substring(3);
            
            var formation_reversed = "true";
        } else {
            var formation_reversed = "false";
        }
        
        var at_pos = train_operation.indexOf("@");
        if (at_pos === -1) {
            var railroad_id = railroad_info["railroad_id"];
            var operations = operation_table["operations"];
        } else {
            var railroad_id = train_operation.substring(at_pos + 1);
            train_operation = train_operation.substring(0, at_pos);
            var operations = joined_operation_tables[railroad_id]["operations"];
        }
        
        for (var train of (railroad_id === railroad_info["railroad_id"] ? operation_table["operations"][train_operation]["trains"] : joined_operation_tables[railroad_id]["operations"][train_operation]["trains"])) {
            if (train["train_number"] === train_number && train["starting_station"] === starting_station) {
                position_operations[("0" + train["position_forward"]).slice(-2)] = {
                    railroad_id : railroad_id,
                    operation_number : train_operation,
                    position_forward : train["position_forward"],
                    position_rear : train["position_rear"]
                };
                
                break;
            }
        }
    }
    
    var position_keys = Object.keys(position_operations).toSorted();
    
    var buf = "<table class='select_operation_";
    if (train_direction === "inbound_trains") {
        buf += "inbound";
    } else {
        buf += "outbound";
        position_keys.reverse();
    }
    buf += "'>";
    
    for (var cnt = 0; cnt < position_keys.length; cnt++) {
        buf += "<tr>";
        
        if (cnt === 0) {
            buf += "<td rowspan='" + position_keys.length + "'><span>進行方向</span></td>";
        }
        
        buf += "<td onclick='write_operation_data(\"" + position_operations[position_keys[cnt]]["railroad_id"] + "\", null, \"" + add_slashes(position_operations[position_keys[cnt]]["operation_number"]) + "\", \"" + add_slashes(train_number) + "\", " + formation_reversed + ");'><div><b>" + position_operations[position_keys[cnt]]["position_forward"];
        
        if (position_operations[position_keys[cnt]]["position_forward"] !== position_operations[position_keys[cnt]]["position_rear"]) {
            buf += "-" + position_operations[position_keys[cnt]]["position_rear"];
        }
        
        buf += "</b>両目</div>" + escape_html(position_operations[position_keys[cnt]]["operation_number"]) + "運用";
        
        if ("hidden_by_default" in operations[position_operations[position_keys[cnt]]["operation_number"]] && operations[position_operations[position_keys[cnt]]["operation_number"]]["hidden_by_default"]) {
            buf += "<small>(臨時)</small>";
        }
        
        buf += "</td></tr>";
    }
    
    buf += "</table>";
    
    popup_inner_elm.innerHTML = buf;
}

function check_post_operation_data () {
    if (user_info === null) {
        if (config["guest_id"] === null) {
            show_rules(null, function () { show_captcha(post_operation_data); });
        } else {
            show_captcha(post_operation_data);
        }
    } else {
        post_operation_data();
    }
}

function post_operation_data () {
    var comment_text = document.getElementById("operation_data_comment").value;
    if (comment_text.length > instance_info["comment_character_limit"]) {
        mes("運用補足情報が" + instance_info["comment_character_limit"] + "文字を超過しているため投稿できません", true);
        
        return;
    }
    
    if ((user_info !== null && one_time_token === null) || !(post_operation_number in assign_order_maxima)) {
        mes("内部処理が完了していないため、数秒待ってから再送信してください", true);
        
        return;
    }
    
    if (document.getElementById("operation_data_type_reassign").checked) {
        if (assign_order_maxima[post_operation_number] === 0) {
            mes("他の情報が投稿されていない運用に差し替え情報を投稿することはできません", true);
            
            return;
        }
        
        var assign_order = assign_order_maxima[post_operation_number] + 1;
    } else {
        if (assign_order_maxima[post_operation_number] >= 1) {
            var assign_order = assign_order_maxima[post_operation_number];
        } else {
            var assign_order = 1;
        }
    }
    
    open_wait_screen();
    
    var send_data = "railroad_id=" + escape_form_data(post_railroad_id) + "&date=" + escape_form_data(post_yyyy_mm_dd) + "&operation_number=" + escape_form_data(post_operation_number) + "&assign_order=" + assign_order + "&formations=" + escape_form_data(document.getElementById("operation_data_formation").value) + "&train_number=" + escape_form_data(post_train_number) + "&comment=" + escape_form_data(comment_text);
    
    if (document.getElementById("identify_method_quote").checked) {
        send_data += "&is_quotation=YES";
    }
    
    if (user_info !== null) {
        send_data += "&one_time_token=" + escape_form_data(one_time_token);
    } else {
        send_data += "&guest_id=" + escape_form_data(get_guest_id()) + "&zizai_captcha_id=" + escape_form_data(document.getElementById("zizai_captcha_id").value) + "&zizai_captcha_characters=" + escape_form_data(document.getElementById("zizai_captcha_characters").value);
    }
    
    ajax_post("post.php", send_data, function (response) {
        close_wait_screen();
        
        if (response !== false) {
            mes("情報提供ありがとうございました");
            
            if (square_popup_is_open) {
                close_square_popup();
            }
            popup_close(true);
            
            if (post_railroad_id === railroad_info["railroad_id"]) {
                Object.assign(operation_data["operations"], JSON.parse(response));
            } else {
                Object.assign(joined_operation_data[post_railroad_id]["operations"], JSON.parse(response));
            }
            
            switch (mode_val) {
                case 0:
                    position_change_time(0);
                    break;
                
                case 1:
                    timetable_select_station(timetable_selected_station);
                    break;
                
                case 2:
                    operation_data_draw();
                    break;
                
                case 4:
                    if (config["show_assigned_formations_on_operation_table"]) {
                        draw_operation_table(true, false);
                    }
                    break;
            }
        } else {
            if (user_info !== null) {
                get_one_time_token();
            } else {
                zizai_captcha_reload_image("zizai_captcha_image", "zizai_captcha_id");
            }
        }
    });
}

function edit_operation_data (railroad_id, yyyy_mm_dd, operation_number, assign_order, user_id, formation_text, ip_address = null) {
    var popup_inner_elm = open_popup("edit_operation_data_popup", "運用情報の取り消し");
    
    buf = "<h3>投稿内容</h3>";
    buf += "<div class='key_and_value'><b>運行日</b>" + yyyy_mm_dd.substring(0, 4) + "年 " + Number(yyyy_mm_dd.substring(5, 7)) + "月 " + Number(yyyy_mm_dd.substring(8)) + "日</div>";
    buf += "<div class='key_and_value'><b>運用番号</b>" + escape_html(operation_number) + "</div>";
    buf += "<div class='key_and_value'><b>編成名</b>" + escape_html(formation_text) + "</div>";
    
    if (user_id !== user_info["user_id"] && user_id !== "#") {
        buf += "<input type='checkbox' id='edit_operation_data_moderation_info'><label for='edit_operation_data_moderation_info' class='drop_down'>投稿者情報</label><div>";
        buf += "<div class='key_and_value'><b>ユーザーID</b>" + escape_html(user_id) + "<div id='edit_operation_data_is_timed_out_user'></div></div>";
        buf += "<div id='edit_operation_data_user_info' class='loading_icon'></div>";
        if (ip_address !== null) {
            buf += "<div class='key_and_value'><b>IPアドレス</b>" + escape_html(ip_address) + "<div id='edit_operation_data_is_timed_out_ip_address'></div></div>";
            buf += "<div id='edit_operation_data_ip_address_info' class='loading_icon'></div>";
        }
        buf += "<div id='edit_operation_data_user_timed_out_logs'></div>";
        if (ip_address !== null) {
            buf += "<div id='edit_operation_data_ip_address_timed_out_logs'></div>";
        }
        buf += "</div>";
    }
    
    buf += "<br><br><button type='button' class='wide_button' onclick='revoke_operation_data(\"" + railroad_id + "\", \"" + yyyy_mm_dd + "\", \"" + add_slashes(operation_number) + "\", " + assign_order + ",\"" + add_slashes(user_id) + "\");'>投稿を取り消す</button>";
    
    if (user_id !== user_info["user_id"] && user_id !== "#") {
        buf += "<button type='button' class='wide_button' onclick='revoke_users_all_operation_data(\"" + railroad_id + "\", \"" + add_slashes(user_id) + "\");'>ユーザーの投稿を全て取り消す</button>";
    }
    
    popup_inner_elm.innerHTML = buf;
    
    get_one_time_token();
    
    if (user_id !== user_info["user_id"] && user_id !== "#") {
        show_moderation_info(railroad_id, user_id, ip_address);
    }
}

function show_moderation_info (railroad_id, user_id, ip_address) {
    if (user_id === null) {
        user_id = "";
    }
    
    if (ip_address === null) {
        ip_address = "";
    }
    
    ajax_post("moderation_info.php", "railroad_id=" + escape_form_data(railroad_id) + "&user_id=" + escape_form_data(user_id) + "&ip_address=" + escape_form_data(ip_address), function (response) {
        if (response === false) {
            return;
        }
        
        var moderation_info = JSON.parse(response);
        
        var user_info_elm = document.getElementById("edit_operation_data_user_info");
        if (moderation_info["is_timed_out_user"] !== null) {
            if (moderation_info["user_name"] !== null) {
                user_info_elm.innerHTML = "<div class='key_and_value'><b>ハンドルネーム</b>" + escape_html(moderation_info["user_name"]) + "</div><div class='key_and_value'><b>登録日時</b>" + escape_html(moderation_info["user_created"]) + "</div>";
            } else {
                user_info_elm.classList.remove("loading_icon");
            }
            
            var is_timed_out_user_elm = document.getElementById("edit_operation_data_is_timed_out_user");
            if (moderation_info["is_timed_out_user"]) {
                is_timed_out_user_elm.innerHTML = "【!】タイムアウト中<button type='button' onclick='window.open(\"/admin/time_out_user.php?user_id=" + add_slashes(user_id) + "&railroad_id=" + railroad_info["railroad_id"] + "\");'>解除</button>";
                is_timed_out_user_elm.className = "warning_sentence";
            } else {
                is_timed_out_user_elm.innerHTML = "<button type='button' onclick='window.open(\"/admin/time_out_user.php?user_id=" + add_slashes(user_id) + "&railroad_id=" + railroad_info["railroad_id"] + "\");'>タイムアウトを設定</button>";
            }
            
            var buf = "";
            for (var log_data of moderation_info["user_timed_out_logs"]) {
                buf += "<div class='descriptive_text'><b>" + log_data["timed_out_datetime"] + "</b> から " + log_data["timed_out_days"] + "日間<br>";
                
                if (log_data["moderator_id"] !== "#") {
                    buf += "モデレーター: " + escape_html(log_data["moderator_name"]) + "<br>";
                } else {
                    buf += escape_html(log_data["moderator_name"]) + "<br>";
                }
                
                buf += "理由: " + (log_data["timed_out_reason"] !== null ? escape_html(log_data["timed_out_reason"]) : "(設定なし)") + "</div>";
            }
            
            document.getElementById("edit_operation_data_user_timed_out_logs").innerHTML = "<h5>ユーザーのタイムアウト履歴</h5>" + (buf.length >= 1 ? buf : "<div class='descriptive_text'>ユーザーにタイムアウトの履歴はありません</div>");
        } else {
            user_info_elm.classList.remove("loading_icon");
        }
        
        var ip_address_info_elm = document.getElementById("edit_operation_data_ip_address_info");
        if (moderation_info["is_timed_out_ip_address"] !== null) {
            ip_address_info_elm.innerHTML = "<div class='key_and_value'><b>ホスト名</b>" + escape_html(moderation_info["host_name"]) + "</div>";
            
            var is_timed_out_ip_address_elm = document.getElementById("edit_operation_data_is_timed_out_ip_address");
            if (moderation_info["is_timed_out_ip_address"]) {
                is_timed_out_ip_address_elm.innerHTML = "【!】タイムアウト中<button type='button' onclick='window.open(\"/admin/time_out_user.php?ip_address=" + add_slashes(ip_address) + "&railroad_id=" + railroad_info["railroad_id"] + "\");'>解除</button>";
                is_timed_out_ip_address_elm.className = "warning_sentence";
            } else {
                is_timed_out_ip_address_elm.innerHTML = "<button type='button' onclick='window.open(\"/admin/time_out_user.php?ip_address=" + add_slashes(ip_address) + "&railroad_id=" + railroad_info["railroad_id"] + "\");'>タイムアウトを設定</button>";
            }
            
            var buf = "";
            for (var log_data of moderation_info["ip_address_timed_out_logs"]) {
                buf += "<div class='descriptive_text'><b>" + log_data["timed_out_datetime"] + "</b> から " + log_data["timed_out_days"] + "日間<br>";
                
                if (log_data["moderator_id"] !== "#") {
                    buf += "モデレーター: " + escape_html(log_data["moderator_name"]) + "<br>";
                } else {
                    buf += escape_html(log_data["moderator_name"]) + "<br>";
                }
                
                buf += "理由: " + (log_data["timed_out_reason"] !== null ? escape_html(log_data["timed_out_reason"]) : "(設定なし)") + "</div>";
            }
            
            document.getElementById("edit_operation_data_ip_address_timed_out_logs").innerHTML = "<h5>IPアドレスのタイムアウト履歴</h5>" + (buf.length >= 1 ? buf : "<div class='descriptive_text'>IPアドレスにタイムアウトの履歴はありません</div>");
        } else {
            ip_address_info_elm.classList.remove("loading_icon");
        }
    });
}

function revoke_operation_data (railroad_id, yyyy_mm_dd, operation_number, assign_order, user_id) {
    if (user_id !== user_info["user_id"] && !confirm("この投稿を取り消しますか？")) {
        return;
    }
    
    open_wait_screen();
    
    if (one_time_token === null) {
        close_wait_screen();
        
        mes("内部処理が完了していないため、数秒待ってから再送信してください", true);
        
        return;
    }
    
    ajax_post("revoke.php", "railroad_id=" + escape_form_data(railroad_id) + "&date=" + escape_form_data(yyyy_mm_dd) + "&operation_number=" + escape_form_data(operation_number) + "&assign_order=" + assign_order + "&user_id=" + escape_form_data(user_id) + "&one_time_token=" + escape_form_data(one_time_token), function (response) {
        close_wait_screen();
        
        if (response !== false) {
            mes("運用情報を取り消しました");
            
            if (square_popup_is_open) {
                close_square_popup();
            }
            popup_close(true);
            
            if (railroad_id === railroad_info["railroad_id"]) {
                Object.assign(operation_data["operations"], JSON.parse(response));
            } else {
                Object.assign(joined_operation_data[railroad_id]["operations"], JSON.parse(response));
            }
            
            switch (mode_val) {
                case 0:
                    position_change_time(0);
                    break;
                
                case 1:
                    timetable_select_station(timetable_selected_station);
                    break;
                
                case 2:
                    operation_data_draw();
                    break;
                
                case 3:
                    if (selected_formation_name !== null) {
                        formation_detail(selected_formation_name);
                    }
                    break;
            }
        }
    });
}

function revoke_users_all_operation_data (railroad_id, user_id) {
    if (confirm("このユーザーの過去24時間の投稿を全て取り消しますか？")) {
        open_wait_screen();
        
        if (one_time_token === null) {
            close_wait_screen();
            
            mes("内部処理が完了していないため、数秒待ってから再送信してください", true);
            
            return;
        }
        
        ajax_post("revoke_users_all.php", "railroad_id=" + escape_form_data(railroad_id) + "&user_id=" + escape_form_data(user_id) + "&one_time_token=" + escape_form_data(one_time_token), function (response) {
            close_wait_screen();
            
            if (response === "SUCCESSFULLY_REVOKED") {
                mes("運用情報を取り消しました");
                
                if (square_popup_is_open) {
                    close_square_popup();
                }
                popup_close(true);
                
                update_operation_data(function () {}, function () {}, function () {
                    switch (mode_val) {
                        case 0:
                            position_change_time(0);
                            break;
                        
                        case 1:
                            timetable_select_station(timetable_selected_station);
                            break;
                        
                        case 2:
                            operation_data_draw();
                            break;
                        
                        case 3:
                            if (selected_formation_name !== null) {
                                formation_detail(selected_formation_name);
                            }
                            break;
                    }
                }, function () {}, operation_date_last, mode_val <= 1 && "joined_railroads" in railroad_info ? railroad_info["joined_railroads"] : null, true);
            }
        });
    }
}


function show_captcha (callback_func) {
    var popup_inner_elm = open_square_popup("captcha_popup", false, "画像認証");
    
    var buf = "<div id='captcha_info' class='informational_text' style='display: none;'>画像に表示されている文字を入力してください。</div>";
    buf += "<div id='captcha_area' class='wait_icon'></div>";
    buf += "<button type='button' id='captcha_submit_button' class='wide_button' style='display: none;'>送信</button>";
    
    popup_inner_elm.innerHTML = buf;
    
    zizai_captcha_get_html(function (html) {
        var captcha_submit_button_elm = document.getElementById("captcha_submit_button");
        
        document.getElementById("captcha_area").innerHTML = html;
        document.getElementById("captcha_info").style.display = "block";
        captcha_submit_button_elm.style.display = "block";
        
        captcha_submit_button_elm.onclick = callback_func;
    }, config["dark_mode"] ? "#777777 !important" : "#eeeeee");
}


function show_login_form () {
    var popup_inner_elm = open_square_popup("login_popup");
    
    var buf = "<h4>IDまたはメールアドレス</h4>";
    buf += "<input type='text' id='login_user_id' autocomplete='username'>";
    buf += "<h4>パスワード</h4>";
    buf += "<input type='password' id='login_password' autocomplete='current-password'>";
    if (instance_info["email_enabled"] !== false) {
    buf += "<div class='link_block'><a href='/user/send_password_reset_email.php' target='_blank' rel='opener'>パスワードを忘れた場合</a></div>";
    } else {
        buf += "<div class=\"informational_text\">パスワードの復旧は管理者にお問い合わせください。</div>";
    }
    buf += "<button type='button' class='wide_button' onclick='challenge_login();'>ログイン</button>";
    
    popup_inner_elm.innerHTML = buf;
}

function challenge_login () {
    open_wait_screen();
    
    var user_id = document.getElementById("login_user_id").value;
    var password = document.getElementById("login_password").value;
    
    ajax_post("login.php", "user_id=" + escape_form_data(user_id) + "&password=" + escape_form_data(password), function (response) {
        close_wait_screen();
        
        if (response !== false) {
            mes("ログインしました");
            
            update_user_info(JSON.parse(response));
            close_square_popup();
            popup_close(true);
        }
    });
}

function user_logout () {
    if (confirm("ログアウトしますか？")) {
        open_wait_screen();
        
        ajax_post("logout.php", null, function (response) {
            close_wait_screen();
            
            if (response !== false) {
                mes("ログアウトしました");
                
                update_user_info();
            }
        });
    }
}


function about_railroad_data () {
    var popup_inner_elm = open_popup("about_railroad_data_popup");
    
    var buf = "<h2 style='background-color: " + (config["dark_mode"] ? convert_color_dark_mode(railroad_info["main_color"]) : railroad_info["main_color"]) + ";'><img src='" + railroad_info["railroad_icon"] + "' alt=''>" + railroad_info["railroad_name"] + "</h2>";
    
    buf += "<div class='long_text'>" + ("description" in railroad_info ? convert_to_html(railroad_info["description"]) : "") + "<a href='/user/rules.php?railroad_id=" + railroad_info["railroad_id"] + "' onclick='event.preventDefault(); show_rules(\"" + railroad_info["railroad_id"] + "\");' class='bottom_link'>" + escape_html(railroad_info["railroad_name"]) + "の投稿ルール</a></div>";
    
    if ("editors" in railroad_info && railroad_info["editors"].length >= 1) {
        buf += "<h3>製作者</h3>";
        
        for (var editor of railroad_info["editors"]) {
            if ("editor_url" in editor && editor["editor_url"].length >= 1) {
                buf += "<h4><a href='" + editor["editor_url"] + "' target='_blank' class='external_link'>" + escape_html(editor["editor_name"]) + "</a></h4>";
            } else {
                buf += "<h4>" + escape_html(editor["editor_name"]) + "</h4>";
            }
            
            if ("introduction_text" in editor && editor["introduction_text"].length >= 1) {
                buf += "<div class='informational_text'>" + escape_html(editor["introduction_text"]).replace(/\n/g, "<br>") + "</div>";
            }
        }
    }
    
    if ("license_text" in railroad_info && railroad_info["license_text"].length >= 1) {
        buf += "<h3>ライセンス</h3><div class='long_text'>" + convert_to_html(railroad_info["license_text"]) + "</div>";
    }
    
    if ("acknowledgment" in railroad_info && railroad_info["acknowledgment"].length >= 1) {
        buf += "<h3>謝辞</h3><div class='long_text'>" + convert_to_html(railroad_info["acknowledgment"]) + "</div>";
    }
    
    if ("related_links" in railroad_info && railroad_info["related_links"].length >= 1) {
        buf += "<h3>関連リンク</h3>";
        
        for (var related_link of railroad_info["related_links"]) {
            buf += "<h4><a href='" + related_link["link_url"] + "' target='_blank' class='external_link'>" + escape_html(related_link["link_text"]) + "</a></h4>";
            
            if ("link_description" in related_link && related_link["link_description"].length >= 1) {
                buf += "<div class='informational_text'>" + escape_html(related_link["link_description"]).replace(/\n/g, "<br>") + "</div>";
            }
        }
    }
    
    buf += "<h3>データ更新日時</h3><div class='informational_text'>";
    buf += "路線系統情報: " + get_date_and_time(railroad_info["last_modified_timestamp"]) + "<br>";
    buf += "ダイヤ改正一覧情報: " + get_date_and_time(diagram_revisions["last_modified_timestamp"]);
    buf += "</div>";
    
    popup_inner_elm.innerHTML = buf;
    
    document.getElementById("about_railroad_data_popup").scrollTop = 0;
}


function edit_config () {
    var popup_inner_elm = open_popup("config_popup", "アプリの設定");
    
    var buf = "<h4>お気に入り路線系統</h4>";
    buf += "<ul id='config_favorite_railroads' class='rearrangeable_list'></ul>";
    buf += "<input type='checkbox' id='show_favorite_railroads_check' class='toggle' onchange='change_config();'" + (config["show_favorite_railroads"] ? " checked='checked'" : "") + "><label for='show_favorite_railroads_check'>お気に入り路線系統を表示</label>";
    
    buf += "<h4>お気に入り駅</h4>";
    buf += "<ul id='config_favorite_stations' class='rearrangeable_list'></ul>";
    buf += "<input type='checkbox' id='show_favorite_stations_check' class='toggle' onchange='change_config();'" + (config["show_favorite_stations"] ? " checked='checked'" : "") + "><label for='show_favorite_stations_check'>お気に入り駅を表示</label>";
    
    buf += "<h4>各種設定</h4>";
    buf += "<input type='checkbox' id='dark_mode_check' class='toggle' onchange='change_config();'" + (config["dark_mode"] ? " checked='checked'" : "") + "><label for='dark_mode_check'>ダークテーマ</label>";
    buf += "<input type='checkbox' id='enlarge_display_size_check' class='toggle' onchange='change_config();'" + (config["enlarge_display_size"] ? " checked='checked'" : "") + "><label for='enlarge_display_size_check'>各種表示サイズの拡大</label>";
    buf += "<input type='checkbox' id='colorize_corrected_posts_check' class='toggle' onchange='change_config();'" + (config["colorize_corrected_posts"] ? " checked='checked'" : "") + "><label for='colorize_corrected_posts_check'>訂正された投稿を区別する</label>";
    buf += "<input type='checkbox' id='colorize_beginners_posts_check' class='toggle' onchange='change_config();'" + (config["colorize_beginners_posts"] ? " checked='checked'" : "") + "><label for='colorize_beginners_posts_check'>ビギナーの方の投稿を区別する</label>";
    buf += "<input type='checkbox' id='retain_position_mode_last_seen_line_check' class='toggle' onchange='change_config();'" + (config["retain_position_mode_last_seen_line"] ? " checked='checked'" : "") + "><label for='retain_position_mode_last_seen_line_check'>走行位置で見ていた路線を記憶する</label>";
    buf += "<input type='checkbox' id='force_arrange_west_side_car_on_left_check' class='toggle' onchange='change_config();'" + (config["force_arrange_west_side_car_on_left"] ? " checked='checked'" : "") + "><label for='force_arrange_west_side_car_on_left_check'>西向き先頭車を編成表左側に表示</label>";
    buf += "<input type='checkbox' id='show_formation_captions_on_operation_data_check' class='toggle' onchange='change_config();'" + (config["show_formation_captions_on_operation_data"] ? " checked='checked'" : "") + "><label for='show_formation_captions_on_operation_data_check'>運用データ等に編成の説明を表示</label>";
    buf += "<h5>運用情報の自動更新間隔</h5>";
    buf += "<input type='number' id='refresh_interval' min='1' max='60' onchange='change_config();' value='" + config["refresh_interval"] + "'>分ごと";
    buf += "<h5>運用情報のキャッシュ保管日数</h5>";
    buf += "<input type='number' id='operation_data_cache_period' min='1' max='30' onchange='change_config();' value='" + config["operation_data_cache_period"] + "'>日前以降のキャッシュを保管";
    buf += "<h5>走行位置表示時刻調節ボタンの動作</h5>";
    buf += "<input type='number' id='position_mode_minute_step' min='1' max='10' onchange='change_config();' value='" + config["position_mode_minute_step"] + "'>分単位で増減";
    buf += "<a href='javascript:void(0);' class='execute_link' onclick='reset_config_value();'>デフォルト値に戻す</a>";
    buf += "<a href='/user/clear_caches.php' class='execute_link' target='_blank' rel='opener'>設定・キャッシュデータの削除</a>";
    buf += "<div class='informational_text'>変更内容は自動で保存されます</div>";
    
    popup_inner_elm.innerHTML = buf;
    
    get_railroad_list(function () {
        for (var cnt = 0; cnt < config["favorite_railroads"].length; cnt++) {
            if (!(config["favorite_railroads"][cnt] in railroads["railroads"])) {
                config["favorite_railroads"].splice(cnt, 1);
            }
        }
        
        for (var cnt = 0; cnt < config["favorite_stations"].length; cnt++) {
            if (!(config["favorite_stations"][cnt]["railroad_id"] in railroads["railroads"])) {
                config["favorite_stations"].splice(cnt, 1);
            }
        }
        
        config_draw_favorite_railroads();
        config_draw_favorite_stations();
    });
}

function change_config () {
    config["show_favorite_railroads"] = document.getElementById("show_favorite_railroads_check").checked;
    config["show_favorite_stations"] = document.getElementById("show_favorite_stations_check").checked;
    config["dark_mode"] = document.getElementById("dark_mode_check").checked;
    config["enlarge_display_size"] = document.getElementById("enlarge_display_size_check").checked;
    config["colorize_corrected_posts"] = document.getElementById("colorize_corrected_posts_check").checked;
    config["colorize_beginners_posts"] = document.getElementById("colorize_beginners_posts_check").checked;
    config["retain_position_mode_last_seen_line"] = document.getElementById("retain_position_mode_last_seen_line_check").checked;
    config["force_arrange_west_side_car_on_left"] = document.getElementById("force_arrange_west_side_car_on_left_check").checked;
    config["show_formation_captions_on_operation_data"] = document.getElementById("show_formation_captions_on_operation_data_check").checked;
    
    var refresh_interval_elm = document.getElementById("refresh_interval");
    if (Number(refresh_interval_elm.value) > 60) {
        refresh_interval_elm.value = 60;
    } else if (Number(refresh_interval_elm.value) < 1) {
        refresh_interval_elm.value = 1;
    }
    config["refresh_interval"] = Number(refresh_interval_elm.value);
    
    var operation_data_cache_period_elm = document.getElementById("operation_data_cache_period");
    if (Number(operation_data_cache_period_elm.value) > 30) {
        operation_data_cache_period_elm.value = 30;
    } else if (Number(operation_data_cache_period_elm.value) < 1) {
        operation_data_cache_period_elm.value = 1;
    }
    config["operation_data_cache_period"] = Number(operation_data_cache_period_elm.value);
    
    var position_mode_minute_step_elm = document.getElementById("position_mode_minute_step");
    if (Number(position_mode_minute_step_elm.value) > 10) {
        position_mode_minute_step_elm.value = 10;
    } else if (Number(position_mode_minute_step_elm.value) < 1) {
        position_mode_minute_step_elm.value = 1;
    }
    config["position_mode_minute_step"] = Number(position_mode_minute_step_elm.value);
    
    update_display_settings(true);
    
    save_config();
}

function railroad_icon_context_menu (railroad_id, redraw_railroad_list = true) {
    railroad_icon_touch_start_time = null;
    
    var railroad_index = config["favorite_railroads"].indexOf(railroad_id);
    if (railroad_index !== -1) {
        if (confirm(railroads["railroads"][railroad_id]["railroad_name"] + " をお気に入りから削除しますか？")) {
            config["favorite_railroads"].splice(railroad_index, 1);
            save_config();
            
            if (redraw_railroad_list) {
                update_railroad_list(railroads);
            }
            
            mes("路線系統をお気に入りから削除しました");
            
            return true;
        }
    } else if (confirm(railroads["railroads"][railroad_id]["railroad_name"] + " をお気に入りに追加しますか？")) {
        config["favorite_railroads"].push(railroad_id);
        save_config();
        
        if (redraw_railroad_list) {
            update_railroad_list(railroads);
        }
        
        mes("路線系統をお気に入りに追加しました");
        
        return true;
    }
    
    return false;
}

function config_draw_favorite_railroads () {
    var buf = "";
    for (var cnt = 0; cnt < config["favorite_railroads"].length; cnt++) {
        buf += "<li ontouchstart='rearrangeable_list_touch_start(event, \"config_favorite_railroads\", " + cnt + ");' ontouchmove='rearrangeable_list_touch_move(event, \"config_favorite_railroads\", " + cnt + ");' ontouchend='rearrange_favorite_railroads(" + cnt + ", rearrangeable_list_drag_end(\"config_favorite_railroads\"));' onmousedown='rearrangeable_list_mouse_down(event, \"config_favorite_railroads\", " + cnt + ");' onmousemove='rearrangeable_list_mouse_move(event, \"config_favorite_railroads\", " + cnt + ");' onmouseup='rearrange_favorite_railroads(" + cnt + ", rearrangeable_list_drag_end(\"config_favorite_railroads\"));'><button type='button' onclick='config_remove_favorite_railroad(\"" + config["favorite_railroads"][cnt] + "\");'></button>" + escape_html(railroads["railroads"][config["favorite_railroads"][cnt]]["railroad_name"]) + "</li>";
    }
    
    document.getElementById("config_favorite_railroads").innerHTML = buf;
}

function config_remove_favorite_railroad (railroad_id) {
    if (railroad_icon_context_menu(railroad_id, false)) {
        config_draw_favorite_railroads();
    }
}

function config_draw_favorite_stations () {
    var buf = "";
    for (var cnt = 0; cnt < config["favorite_stations"].length; cnt++) {
        buf += "<li ontouchstart='rearrangeable_list_touch_start(event, \"config_favorite_stations\", " + cnt + ");' ontouchmove='rearrangeable_list_touch_move(event, \"config_favorite_stations\", " + cnt + ");' ontouchend='rearrange_favorite_stations(" + cnt + ", rearrangeable_list_drag_end(\"config_favorite_stations\"));' onmousedown='rearrangeable_list_mouse_down(event, \"config_favorite_stations\", " + cnt + ");' onmousemove='rearrangeable_list_mouse_move(event, \"config_favorite_stations\", " + cnt + ");' onmouseup='rearrange_favorite_stations(" + cnt + ", rearrangeable_list_drag_end(\"config_favorite_stations\"));'><button type='button' onclick='config_remove_favorite_station(\"" + config["favorite_stations"][cnt]["railroad_id"] + "\", \"" + config["favorite_stations"][cnt]["line_id"] + "\", \"" + config["favorite_stations"][cnt]["station_name"] + "\");'></button>" + escape_html(config["favorite_stations"][cnt]["station_name"]) + "<small>(" + escape_html(railroads["railroads"][config["favorite_stations"][cnt]["railroad_id"]]["railroad_name"]) + ")</small></li>";
    }
    
    document.getElementById("config_favorite_stations").innerHTML = buf;
}

function config_remove_favorite_station (railroad_id, line_id, station_name) {
    if (remove_favorite_station(railroad_id, line_id, station_name)) {
        config_draw_favorite_stations();
    }
}

var rearrangeable_list_drag_start_y = null;
var rearrangeable_list_item_new_index = 0;

function rearrangeable_list_drag_start (page_y, list_id, item_index) {
    var list_elm = document.getElementById(list_id);
    
    rearrangeable_list_drag_start_y = page_y - list_elm.getBoundingClientRect().top;
    rearrangeable_list_item_new_index = item_index;
    
    var items = list_elm.getElementsByTagName("li");
    
    list_elm.style.height = items.length * 48 + "px";
    
    for (var cnt = 0; cnt < items.length; cnt++) {
        items[cnt].style.position = "absolute";
        items[cnt].style.top = cnt * 48 + "px";
        if (cnt === item_index) {
            items[cnt].style.zIndex = "2";
        } else {
            items[cnt].style.zIndex = "1";
        }
    }
}

function rearrangeable_list_touch_start (event, list_id, item_index) {
    rearrangeable_list_drag_start(event.touches[0].pageY, list_id, item_index);
}

function rearrangeable_list_mouse_down (event, list_id, item_index) {
    rearrangeable_list_drag_start(event.pageY, list_id, item_index);
}

function rearrangeable_list_drag_move (page_y, list_id, item_index) {
    var list_elm = document.getElementById(list_id);
    
    var touch_y = page_y - list_elm.getBoundingClientRect().top;
    
    var items = list_elm.getElementsByTagName("li");
    
    if (touch_y < 0) {
        touch_y = 0;
    } else if (touch_y > items.length * 48) {
        touch_y = items.length * 48;
    }
    
    var move_amount = touch_y - rearrangeable_list_drag_start_y;
    rearrangeable_list_item_new_index = item_index + Math.round(move_amount / 48);
    
    if (rearrangeable_list_item_new_index < 0) {
        rearrangeable_list_item_new_index = 0;
    } else if (rearrangeable_list_item_new_index >= items.length) {
        rearrangeable_list_item_new_index = items.length - 1;
    }
    
    for (var cnt = 0; cnt < items.length; cnt++) {
        if (cnt === item_index) {
            items[cnt].style.top = 48 * cnt + move_amount + "px";
        } else if (cnt < item_index && cnt >= rearrangeable_list_item_new_index) {
            items[cnt].style.top = 48 * (cnt + 1) + "px";
            items[cnt].classList.add("rearrangeable_list_item_moving");
        } else if (cnt > item_index && cnt <= rearrangeable_list_item_new_index) {
            items[cnt].style.top = 48 * (cnt - 1) + "px";
            items[cnt].classList.add("rearrangeable_list_item_moving");
        } else {
            items[cnt].style.top = 48 * cnt + "px";
        }
    }
}

function rearrangeable_list_touch_move (event, list_id, item_index) {
    event.preventDefault();
    
    rearrangeable_list_drag_move(event.touches[0].pageY, list_id, item_index);
}

function rearrangeable_list_mouse_move (event, list_id, item_index) {
    if (rearrangeable_list_drag_start_y !== null) {
        rearrangeable_list_drag_move(event.pageY, list_id, item_index);
    }
}

function rearrangeable_list_drag_end (list_id) {
    rearrangeable_list_drag_start_y === null;
    
    var list_elm = document.getElementById(list_id);
    
    list_elm.style.height = "fit-content";
    
    for (var list_item of list_elm.getElementsByTagName("li")) {
        list_item.style.position = "static";
        list_item.classList.remove("rearrangeable_list_item_moving");
    }
    
    return rearrangeable_list_item_new_index;
}

function rearrange_favorite_railroads (old_index, new_index) {
    if (new_index === old_index) {
        return;
    }
    
    var new_favorite_railroads = [];
    var moving_item_data = config["favorite_railroads"].splice(old_index, 1)[0];
    for (var cnt = 0; cnt <= config["favorite_railroads"].length; cnt++) {
        if (cnt === new_index) {
            new_favorite_railroads.push(moving_item_data);
        }
        
        if (cnt < config["favorite_railroads"].length) {
            new_favorite_railroads.push(config["favorite_railroads"][cnt]);
        }
    }
    
    config["favorite_railroads"] = new_favorite_railroads;
    
    save_config();
    
    config_draw_favorite_railroads();
    update_display_settings(true);
}

function rearrange_favorite_stations (old_index, new_index) {
    if (new_index === old_index) {
        return;
    }
    
    var new_favorite_stations = [];
    var moving_item_data = config["favorite_stations"].splice(old_index, 1)[0];
    for (var cnt = 0; cnt <= config["favorite_stations"].length; cnt++) {
        if (cnt === new_index) {
            new_favorite_stations.push(moving_item_data);
        }
        
        if (cnt < config["favorite_stations"].length) {
            new_favorite_stations.push(config["favorite_stations"][cnt]);
        }
    }
    
    config["favorite_stations"] = new_favorite_stations;
    
    save_config();
    
    config_draw_favorite_stations();
    update_display_settings(true);
}

function reset_config_value () {
    if (confirm("設定をリセットしますか？")) {
        var dafault_config = get_default_config();
        
        document.getElementById("show_favorite_railroads_check").checked = dafault_config["show_favorite_railroads"];
        document.getElementById("show_favorite_stations_check").checked = dafault_config["show_favorite_stations"];
        document.getElementById("dark_mode_check").checked = dafault_config["dark_mode"];
        document.getElementById("enlarge_display_size_check").checked = dafault_config["enlarge_display_size"];
        document.getElementById("colorize_corrected_posts_check").checked = dafault_config["colorize_corrected_posts"];
        document.getElementById("colorize_beginners_posts_check").checked = dafault_config["colorize_beginners_posts"];
        document.getElementById("retain_position_mode_last_seen_line_check").checked = dafault_config["retain_position_mode_last_seen_line"];
        document.getElementById("force_arrange_west_side_car_on_left_check").checked = dafault_config["force_arrange_west_side_car_on_left"];
        document.getElementById("show_formation_captions_on_operation_data_check").checked = dafault_config["show_formation_captions_on_operation_data"];
        document.getElementById("refresh_interval").value = dafault_config["refresh_interval"];
        document.getElementById("operation_data_cache_period").value = dafault_config["operation_data_cache_period"];
        document.getElementById("position_mode_minute_step").value = dafault_config["position_mode_minute_step"];
        
        change_config();
    }
}


var rules_continue_func = null;

function show_rules (railroad_id = null, continue_func = null) {
    if (!navigator.onLine) {
        mes("ルールの閲覧にはネットワーク接続が必要です", true);
        return;
    }
    
    if (railroad_id === null) {
        var get_param = "";
    } else {
        var get_param = "?railroad_id=" + railroad_id;
        
        railroad_rules_last_read = get_timestamp();
    }
    
    if (typeof continue_func === "function") {
        rules_continue_func = continue_func;
        get_param += (railroad_id === null ? "?" : "&") + "show_accept_button=yes";
    } else {
        rules_continue_func = null;
    }
    
    window.open("/user/rules.php" + get_param);
}

function accept_rules () {
    rules_continue_func();
    
    rules_continue_func = null;
}


function show_about () {
    var popup_inner_elm = open_popup("about_popup");
    
    var buf = "";
    if (instance_info["unyohub_version"] > UNYOHUB_VERSION) {
        buf += "<div id='update_info_area'><b>v" + instance_info["unyohub_version"] + "</b> が利用可能です<button type='button' class='wide_button' onclick='reload_app(true);'>アプリを再起動して更新</button></div>";
    }
    
    buf += "<img src='/apple-touch-icon.webp' alt='" + UNYOHUB_APP_NAME + "' id='unyohub_icon'>";
    buf += "<h2>" + escape_html(instance_info["instance_name"]) + "</h2>";
    
    if ("instance_introduction" in instance_info) {
        buf += "<div class='long_text'>" + convert_to_html(instance_info["instance_introduction"]) + "</div>";
    }
    
    if ("instance_explanation" in instance_info) {
        buf += "<div class='long_text'>" + convert_to_html(instance_info["instance_explanation"]) + "</div>";
    }
    
    if ("manual_url" in instance_info) {
        buf += "<div class='link_block'><a href='" + add_slashes(instance_info["manual_url"]) + "' target='_blank' class='external_link'>" + escape_html(instance_info["instance_name"]) + "の使い方</a></div>";
    }
    buf += "<div class='link_block'><a href='/user/rules.php' target='_blank'>ルールとポリシー</a></div>";
    
    buf += "<h3>運営者</h3>";
    if ("administrator_name" in instance_info) {
        if ("administrator_url" in instance_info) {
            buf += "<h4><a href='" + add_slashes(instance_info["administrator_url"]) + "' target='_blank' class='external_link'>" + escape_html(instance_info["administrator_name"]) + "</a></h4>";
        } else {
            buf += "<h4>" + escape_html(instance_info["administrator_name"]) + "</h4>";
        }
    }
    if ("administrator_introduction" in instance_info) {
        buf += "<div class='long_text'>" + convert_to_html(instance_info["administrator_introduction"]) + "</div>";
    }
    
    buf += "<h3>アプリケーション情報</h3>";
    buf += "<h4>" + UNYOHUB_PROJECT_NAME + " v" + UNYOHUB_VERSION + "</h4>";
    buf += "<div class='link_block'><a href='" + UNYOHUB_PROJECT_INFO_URL + "' target='_blank' class='external_link'>" + UNYOHUB_PROJECT_NAME + "について</a></div>";
    buf += "<h5>ライセンス</h5>";
    buf += "<div class='informational_text'>" + UNYOHUB_LICENSE_TEXT + "</div>";
    buf += "<h5>ソースコード</h5>";
    buf += "<div class='link_block'><a href='" + UNYOHUB_REPOSITORY_URL + "' target='_blank' class='external_link'>" + UNYOHUB_REPOSITORY_URL + "</a></div>";
    
    popup_inner_elm.innerHTML = buf;
}


function with_timeout (promise, timeout_ms, message) {
    var timer;
    return Promise.race([
        promise,
        new Promise(function (_, reject) {
            timer = setTimeout(function () { reject(new Error(message)); }, timeout_ms);
        })
    ]).finally(function () {
        clearTimeout(timer);
    });
}

function wait_for_state (target, event_name, is_ready, timeout_ms, message) {
    var listener;
    return with_timeout(new Promise(function (resolve, reject) {
        listener = function () {
            try {
                if (is_ready()) {
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        };
        target.addEventListener(event_name, listener);
        listener();
    }), timeout_ms, message).finally(function () {
        target.removeEventListener(event_name, listener);
    });
}

function get_worker_version (worker) {
    var channel = new MessageChannel();
    var reply = new Promise(function (resolve) {
        channel.port1.onmessage = function (evt) { resolve(evt.data); };
    });
    worker.postMessage({type: "GET_VERSION"}, [channel.port2]);
    
    return with_timeout(reply, 3000, "Service Worker version check timed out").finally(function () {
        channel.port1.close();
    });
}

async function complete_app_update () {
    if (!("serviceWorker" in navigator)) {
        return;
    }
    
    var registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
        throw new Error("Service Worker is not registered");
    }
    
    await with_timeout(registration.update(), 15000, "Service Worker update check timed out");
    
    var pending = registration.installing || registration.waiting;
    if (pending) {
        await wait_for_state(pending, "statechange", function () {
            if (pending.state === "redundant") {
                throw new Error("Service Worker installation failed");
            }
            return pending.state !== "installing";
        }, 45000, "Service Worker installation timed out");
        
        var activated = wait_for_state(navigator.serviceWorker, "controllerchange", function () {
            return navigator.serviceWorker.controller === pending;
        }, 15000, "Service Worker activation timed out");
        pending.postMessage({type: "SKIP_WAITING"});
        await activated;
    }
    
    if (!registration.active || await get_worker_version(registration.active) !== instance_info["unyohub_version"]) {
        throw new Error("Service Worker release mismatch");
    }
}

var app_update_in_progress = false;

async function reload_app (force_update = false) {
    if (app_update_in_progress) {
        return;
    }
    
    if (force_update && !navigator.onLine) {
        mes("端末をネットワークに接続してください", true);
        return;
    }
    
    open_wait_screen();
    
    if (force_update) {
        app_update_in_progress = true;
        try {
            await complete_app_update();
        } catch (error) {
            app_update_in_progress = false;
            close_wait_screen();
            console.error("App update failed", error);
            mes("更新を完了できませんでした。通信状態を確認して再度お試しください", true);
            return;
        }
        history.pushState(null, "", "/");
    } else if (location.pathname !== "/") {
        history.pushState(null, "", "/");
    }
    
    setTimeout(function () {
        location.reload();
    }, 100);
}


function show_welcome_message () {
    if (!("instance_introduction" in instance_info)) {
        return;
    }
    
    var message_box_elm = document.createElement("div");
    message_box_elm.id = "welcome_message_box";
    
    var instance_name_html = escape_html(instance_info["instance_name"]);
    message_box_elm.innerHTML = "<h3>" + instance_name_html + "</h3>" + convert_to_html(instance_info["instance_introduction"]) + "<div class='link_block'><u onclick='show_about();'>" + instance_name_html + "について</u>" + ("manual_url" in instance_info ? "　<a href='" + add_slashes(instance_info["manual_url"]) + "' target='_blank' class='external_link'>使い方</a>" : "") + "</div><button type='button' class='message_close_button' onclick='close_welcome_message();'></button>";
    
    document.getElementsByTagName("body")[0].appendChild(message_box_elm);
}

function close_welcome_message () {
    document.getElementById("welcome_message_box").remove();
}


window.onkeydown = function (event) {
    if (event.keyCode === 27) {
        if (square_popup_is_open) {
            close_square_popup(false);
        } else if (popup_history.length >= 1) {
            popup_close(false, false);
        }
    }
}


window.onblur = function () {
    if (railroad_info !== null) {
        save_railroad_user_data(railroad_info["railroad_id"]);
    }
};


var on_popstate_do_nothing = false;

window.onpopstate = function () {
    if (history_back_promise instanceof Promise) {
        history_back_resolve();
        history_back_promise = null;
        history_back_resolve = null;
    }
    
    if (on_popstate_do_nothing) {
        on_popstate_do_nothing = false;
        return;
    }
    
    if (square_popup_is_open) {
        close_square_popup(false);
    } else if (popup_history.length >= 1) {
        popup_close(false, false);
    } else {
        if (location.pathname === "/") {
            reload_app();
            return;
        }
        
        var path_info = location.pathname.split("/");
        
        var railroad_id = path_info[1].substring(9);
        var mode_name = path_info.length >= 3 && path_info[2].length >= 1 ? path_info[2] : "position";
        var mode_option_1 = path_info.length >= 4 && path_info[3].length >= 1 ? decodeURIComponent(path_info[3]) : null;
        var mode_option_2 = path_info.length >= 5 && path_info[4].length >= 1 ? decodeURIComponent(path_info[4]) : null;
        
        if (mode_name === "operation_data") {
            var url_params = new URLSearchParams(window.location.search);
            
            if (url_params.has("date")) {
                mode_option_1 = url_params.get("date");
            }
        }
        
        if (railroad_id !== railroad_info["railroad_id"]) {
            select_railroad(railroad_id, mode_name + "_mode", mode_option_1, mode_option_2);
            return;
        }
        
        switch (mode_val) {
            case 1:
                if (mode_name === "timetable") {
                    if (mode_option_2 === null) {
                        timetable_change_lines(mode_option_1, true);
                    } else {
                        timetable_select_station(mode_option_2, mode_option_1);
                    }
                    return;
                }
                
                break;
            
            case 3:
                if (mode_name === "formations") {
                    if (mode_option_1 === null) {
                        draw_formation_table();
                    } else {
                        formation_detail(mode_option_1);
                    }
                    return;
                }
                
                break;
            
            case 4:
                if (mode_name === "operation_table") {
                    operation_table_mode(mode_option_1);
                    return;
                }
                break;
        }
        
        select_mode(mode_name + "_mode", mode_option_1, mode_option_2);
    }
};

function history_popstate () {
    history_back_promise = new Promise(function (resolve, reject) {
        history_back_resolve = resolve;
        
        on_popstate_do_nothing = true;
        history.back();
    });
}


(function () {
    var non_critical_css_elm = document.getElementById("non_critical_css");
    if (non_critical_css_elm.media === "all") {
        funcs_load_resolve();
    } else {
        non_critical_css_elm.addEventListener("load", funcs_load_resolve);
    }
})();
