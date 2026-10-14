/* 鉄道運用Hub integration_funcs.js */

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
    var config_json = localStorage.getItem("unyohub_config");
    
    if (config_json !== null) {
        config = JSON.parse(config_json);
    } else {
        config = {
            "unyohub_version" : null,
            "guest_id" : null
        };
    }
    
    if (config["guest_id"] === null) {
        const BASE32_TABLE = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7"];
        
        var random_bytes = crypto.getRandomValues(new Uint8Array(8));
        var guest_id = "*"
        for (var cnt = 0; cnt < 12; cnt++) {
            guest_id += BASE32_TABLE[bin_to_int(random_bytes, cnt * 5, 5)];
        }
        
        config["guest_id"] = guest_id;
        
        localStorage.setItem("unyohub_config", JSON.stringify(config));
    }
    
    return config["guest_id"];
}


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


var message_area_elm = document.getElementById("message_area");
var message_elm_list = [];

function mes (message_text, is_error = false, display_time = 10) {
    var box_elm = document.createElement("div");
    
    box_elm.innerText = message_text;
    
    var close_button_elm = document.createElement("button");
    
    box_elm.appendChild(close_button_elm);
    close_button_elm.className = "message_close_button";
    close_button_elm.onclick = function () {
        delete_mes(box_elm);
    }
    
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


function open_child_page (url) {
    var iframe_elm = document.createElement("iframe");
    
    iframe_elm.src = url;
    
    document.getElementsByTagName("body")[0].appendChild(iframe_elm);
}

function close_child_page () {
    document.getElementsByTagName("iframe")[0].remove();
}


var screen_elm = document.getElementById("popup_screen");
var wait_screen_elm = document.getElementById("wait_screen");

var active_popup_id = null;

function open_square_popup (id, title = null) {
    screen_elm.className = "popup_screen_active";
    
    var elm = document.getElementById(id);
    
    if (elm === null) {
        elm = document.createElement("div");
        elm.id = id;
        elm.className = "square_popup";
        
        var buf = "<button type='button' class='popup_close_button' onclick='close_square_popup();'></button>";
        
        if (title !== null) {
            buf += "<h3>" + title + "</h3>";
        }
        
        buf += "<div id='" + id + "_inner'></div>";
        
        elm.innerHTML = buf;
        
        screen_elm.appendChild(elm);
    }
    
    elm.classList.add("popup_active");
    
    active_popup_id = id;
    
    return document.getElementById(id + "_inner");
}

function close_square_popup () {
    screen_elm.className = "";
    document.getElementById(active_popup_id).classList.remove("popup_active");
}

function open_wait_screen () {
    wait_screen_elm.style.display = "block";
    screen_elm.style.backgroundColor = "transparent";
}

function close_wait_screen () {
    wait_screen_elm.style.display = "none";
    screen_elm.style.backgroundColor = "";
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


function suggest_formation (formation_data, formations_text) {
    var formations_splitted = formations_text.split("+");
    var formation_text = str_to_halfwidth(formations_splitted[formations_splitted.length - 1]).toUpperCase();
    
    var buf = "";
    
    if (formation_text.length >= 1) {
        var formation_names = Object.keys(formation_data).toSorted();
        var suggestion_list = formation_names.filter(function (formation_name) {
            return formation_name.toUpperCase().startsWith(formation_text);
        });
        
        for (var suggestion of suggestion_list) {
            buf += "<button type='button' onclick='complete_formation(\"";
            
            if (formation_data[suggestion]["semifixed_formation"] !== null) {
                buf += add_slashes(formation_data[suggestion]["semifixed_formation"]) + "\");'>";
                
                var suggestion_formations = formation_data[suggestion]["semifixed_formation"].split("+");
                for (var cnt = 0; cnt < suggestion_formations.length; cnt++) {
                    buf += (cnt >= 1 ? " + " : "") + (suggestion_formations[cnt] === suggestion ? "<b>" : "") + escape_html(suggestion_formations[cnt]) + (suggestion_formations[cnt] === suggestion ? "</b>" : "");
                }
                
                if (formation_data[suggestion]["unavailable"]) {
                    buf += "<small class='warning_sentence'>(離脱中)</small>";
                } else {
                    buf += "<small>(半固定)</small>";
                }
            } else {
                buf += add_slashes(suggestion) + "\");'>";
                
                if (formation_data[suggestion]["unavailable"]) {
                    buf += escape_html(suggestion) + "<small class='warning_sentence'>(運用離脱中)</small>";
                } else {
                    buf += "<b>" + escape_html(suggestion) + "</b>";
                    if (formation_data[suggestion]["caption"] !== null && formation_data[suggestion]["caption"].length >= 1) {
                        buf += "<small>(" + escape_html(formation_data[suggestion]["caption"]) + ")</small>";
                    }
                }
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


var one_time_token = false;

function check_logged_in (logged_in_callback, not_logged_in_callback, on_error_callback) {
    ajax_post("check_logged_in.php", null, function (response) {
        if (response !== false) {
            if (response !== "NOT_LOGGED_IN") {
                one_time_token = null;
                logged_in_callback(JSON.parse(response));
            } else {
                one_time_token = false;
                not_logged_in_callback();
            }
        } else {
            one_time_token = false;
            on_error_callback();
        }
    });
}

var login_callback_func;

function show_login_form (callback_func) {
    var popup_inner_elm = open_square_popup("login_popup");
    
    var buf = "<h4>IDまたはメールアドレス</h4>";
    buf += "<input type='text' id='login_user_id' autocomplete='username'>";
    buf += "<h4>パスワード</h4>";
    buf += "<input type='password' id='login_password' autocomplete='current-password'>";
    if (window.unyohubEmailEnabled !== false) {
    buf += "<div class='link_block'><a href='javascript:void(0);' onclick='open_child_page(\"/user/send_password_reset_email.php?is_child_page=yes\");'>パスワードを忘れた場合</a></div>";
    } else {
        buf += "<div class=\"informational_text\">パスワードの復旧は管理者にお問い合わせください。</div>";
    }
    buf += "<button type='button' class='wide_button' onclick='challenge_login();'>ログイン</button>";
    
    popup_inner_elm.innerHTML = buf;
    
    login_callback_func = callback_func;
}

function challenge_login () {
    open_wait_screen();
    
    var user_id = document.getElementById("login_user_id").value;
    var password = document.getElementById("login_password").value;
    
    ajax_post("login.php", "user_id=" + escape_form_data(user_id) + "&password=" + escape_form_data(password), function (response) {
        close_wait_screen();
        
        if (response !== false) {
            mes("ログインしました");
            
            one_time_token = null;
            
            login_callback_func(JSON.parse(response));
            close_square_popup();
        }
    });
}

function user_logout (callback_func) {
    if (confirm("ログアウトしますか？")) {
        open_wait_screen();
        
        ajax_post("logout.php", null, function (response) {
            close_wait_screen();
            
            if (response !== false) {
                mes("ログアウトしました");
                
                one_time_token = false;
                
                callback_func();
            }
        });
    }
}


function fetch_announcements (railroad_id, callback_func) {
    ajax_post("announcements.php", railroad_id === null ? "" : "railroad_id=" + escape_form_data(railroad_id), function (response, last_modified) {
        if (response === "NEW_ANNOUNCEMENTS_NOT_EXIST" || response === false) {
            callback_func([]);
        } else {
            callback_func(JSON.parse(response));
        }
    });
}

function draw_announcements (railroad_id, announcements_data, area_id = "announcements_area") {
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
        
        buf += "'>" + escape_html(announcements_data[cnt]["title"]) + "</label>";
        
        var dt = new Date(announcements_data[cnt]["last_modified_timestamp"] * 1000);
        
        buf += "<div><div class='announcement'>" + convert_to_html(announcements_data[cnt]["content"]) + "<small>" + escape_html(announcements_data[cnt]["user_name"]) + "　" + dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + ("0" + dt.getMinutes()).slice(-2) + "</small></div></div>";
    }
    
    document.getElementById(area_id).innerHTML = buf;
}


function get_one_time_token () {
    if (one_time_token === false) {
        mes("ログインしていないユーザーがワンタイムトークンを要求することはできません", true);
        return false;
    }
    
    ajax_post("one_time_token.php", null, function (response) {
        if (response !== false) {
            var data = JSON.parse(response);
            
            one_time_token = data["token"];
        }
    });
}


function show_captcha (callback_func) {
    var popup_inner_elm = open_square_popup("captcha_popup", "画像認証");
    
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
    }, "#eeeeee");
}


function check_post_operation_data (railroad_id, date, operation_number, assign_order, formations, train_number, is_quotation, comment_text) {
    if (one_time_token === false) {
        show_captcha(function () {
            post_operation_data(railroad_id, date, operation_number, assign_order, formations, train_number, is_quotation, comment_text);
        });
    } else {
        post_operation_data(railroad_id, date, operation_number, assign_order, formations, train_number, is_quotation, comment_text);
    }
}

function post_operation_data (railroad_id, date, operation_number, assign_order, formations, train_number, is_quotation, comment_text) {
    if (one_time_token === null) {
        mes("内部処理が完了していないため、数秒待ってから再送信してください", true);
        
        return;
    }
    
    open_wait_screen();
    
    var send_data = "railroad_id=" + escape_form_data(railroad_id) + "&date=" + escape_form_data(date) + "&operation_number=" + escape_form_data(operation_number) + "&assign_order=" + assign_order + "&formations=" + escape_form_data(formations) + "&train_number=" + escape_form_data(train_number) + "&comment=" + escape_form_data(comment_text);
    
    if (is_quotation) {
        send_data += "&is_quotation=YES";
    }
    
    if (one_time_token !== false) {
        send_data += "&one_time_token=" + escape_form_data(one_time_token);
    } else {
        send_data += "&guest_id=" + escape_form_data(get_guest_id()) + "&zizai_captcha_id=" + escape_form_data(document.getElementById("zizai_captcha_id").value) + "&zizai_captcha_characters=" + escape_form_data(document.getElementById("zizai_captcha_characters").value);
    }
    
    ajax_post("post.php", send_data, function (response) {
        if (response !== false) {
            location.href = "/integration/succeeded.php";
        } else {
            close_wait_screen();
            
            if (one_time_token !== false) {
                get_one_time_token();
            } else {
                zizai_captcha_reload_image("zizai_captcha_image", "zizai_captcha_id");
            }
        }
    });
}
