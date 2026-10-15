<?php
/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
 *
 *   鉄道運用Hub
 *
 * _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
 * 
 * LICENSE
 * 
 *   このソフトウェアは、無権利創作宣言に基づき著作権放棄されています。
 *   営利・非営利を問わず、自由にご利用いただくことが可能です。
 * 
 *     https://www.2pd.jp/license/
 * 
 *   異なるライセンスの下で配布する際は名称(下記、UNYOHUB_PROJECT_NAMEの値)を変更し、区別可能としてください。
 *
 */


define("UNYOHUB_PROJECT_NAME", "鉄道運用Hub");
define("UNYOHUB_PROJECT_INFO_URL", "https://create.2pd.jp/apps/unyohub/");
define("UNYOHUB_REPOSITORY_URL", "https://fossil.2pd.jp/unyohub/");
define("UNYOHUB_LICENSE_TEXT", "このアプリケーションは無権利創作宣言に準拠して著作権放棄されています。");

include "./version.php";

header("Cache-Control: no-cache");


define("MANIFEST_PATH", "config/app_manifest.json");

$manifest_modified = date("YmdHis", filemtime(MANIFEST_PATH));
$app_manifest = json_decode(file_get_contents(MANIFEST_PATH), TRUE);


if (empty($_SERVER["PATH_INFO"]) || $_SERVER["PATH_INFO"] === "/") {
    $path_info_str = "/";
    $page_title = $app_manifest["name"];
    $page_description = "鉄道ファン向けの車両運用情報データベース　鉄道各社の本日、明日、過去の各列車充当編成が運用表と時刻表から確認・投稿可能です。";
    $railroad_root = "#";
} elseif (substr($_SERVER["PATH_INFO"], 0, 10) === "/railroad_") {
    $path_info = explode("/", $_SERVER["PATH_INFO"]);
    
    $railroad_id = basename(substr($path_info[1], 9));
    $railroad_info_path = "data/".$railroad_id."/railroad_info.json";
    $path_info_str = "/railroad_".$railroad_id."/";
    $railroad_root = $path_info_str;
    
    if (file_exists($railroad_info_path)) {
        $railroad_info = json_decode(file_get_contents($railroad_info_path), TRUE);
        
        if (empty($path_info[2])) {
            $page_title = $railroad_info["railroad_name"]."の車両運用情報 | ".$app_manifest["name"];
            $line_names = array();
            foreach ($railroad_info["lines_order"] as $line_id) {
                $line_names[] = $railroad_info["lines"][$line_id]["line_name"];
            }
            $page_description = $railroad_info["railroad_name"]."の各路線(".implode("、" ,$line_names).")で本日、及び明日に運行される各列車の充当編成・推定走行位置です。";
        } else {
            switch ($path_info[2]) {
                case "timetable":
                    $path_info_str .= "timetable/";
                    
                    if (empty($path_info[3])) {
                        $page_title = $railroad_info["railroad_name"]."の駅別発着車両運用 | ".$app_manifest["name"];
                        $page_description = "本日、及び明日に".$railroad_info["railroad_name"]."の各駅を発着する列車の充当編成一覧です。";
                    } else {
                        if (!array_key_exists($path_info[3], $railroad_info["lines"])) {
                            header("Location: ".$path_info_str, TRUE, 301);
                            exit;
                        }
                        
                        if (!empty($railroad_info["lines"][$path_info[3]]["affiliated_railroad_id"])) {
                            $path_info_str = "/railroad_".$railroad_info["lines"][$path_info[3]]["affiliated_railroad_id"]."/timetable/".$path_info[3]."/";
                            
                            if (!empty($path_info[4])) {
                                foreach ($railroad_info["lines"][$path_info[3]]["stations"] as $station) {
                                    if ($station["station_name"] === $path_info[4] && empty($station["is_signal_station"])) {
                                        $path_info_str .= urlencode($station["station_name"])."/";
                                        break;
                                    }
                                }
                            }
                            
                            header("Location: ".$path_info_str, TRUE, 301);
                            
                            exit;
                        }
                        
                        $path_info_str .= $path_info[3]."/";
                        
                        if (empty($path_info[4])) {
                            $page_title = $railroad_info["lines"][$path_info[3]]["line_name"]."の駅別発着車両運用 | ".$app_manifest["name"];
                            $page_description = "本日、及び明日に".$railroad_info["lines"][$path_info[3]]["line_name"]."の各駅を発着する列車の充当編成一覧です。";
                        } else {
                            foreach ($railroad_info["lines"][$path_info[3]]["stations"] as $station) {
                                if ($station["station_name"] === $path_info[4] && empty($station["is_signal_station"])) {
                                    if (!empty($station["canonical_station_name"])) {
                                        header("Location: ".$path_info_str.urlencode($station["canonical_station_name"])."/", TRUE, 301);
                                        exit;
                                    }
                                    
                                    goto station_exists;
                                }
                            }
                            
                            header("Location: ".$path_info_str, TRUE, 301);
                            exit;
                            
                            station_exists:
                            $path_info_str .= urlencode($path_info[4])."/";
                            $page_title = $path_info[4]."駅(".$railroad_info["lines"][$path_info[3]]["line_name"].")発着列車の充当車両 | ".$app_manifest["name"];
                            $page_description = "本日、及び明日に".$railroad_info["lines"][$path_info[3]]["line_name"]."の".$path_info[4]."駅を発着する列車の充当編成一覧です。";
                        }
                    }
                    
                    break;
                
                case "operation_data":
                    $path_info_str .= "operation_data/";
                    $page_title = $railroad_info["railroad_name"]."の運用履歴データ | ".$app_manifest["name"];
                    $page_description = "本日及び過去の".$railroad_info["railroad_name"]."における各編成の運用履歴です。";
                    
                    break;
                
                case "formations":
                    $path_info_str .= "formations/";
                    
                    if (empty($path_info[3])) {
                        $page_title = $railroad_info["railroad_name"]."の編成表 | ".$app_manifest["name"];
                        $page_description = $railroad_info["railroad_name"]."で現在運用されている編成の一覧表です。";
                    } else {
                        $formations_path = "data/".$railroad_id."/formations.json";
                        
                        if (!file_exists($formations_path)) {
                            header("Location: /", TRUE, 302);
                            exit;
                        }
                        
                        $formations = json_decode(file_get_contents($formations_path), TRUE);
                        
                        if (!array_key_exists($path_info[3], $formations["formations"])) {
                            header("Location: ".$path_info_str, TRUE, 301);
                            exit;
                        }
                        
                        if (empty($formations["formations"][$path_info[3]]["new_formation_name"])) {
                            $path_info_str .= urlencode($path_info[3])."/";
                            
                            if (!empty($formations["formations"][$path_info[3]]["cars"])) {
                                $page_title = $formations["formations"][$path_info[3]]["series_name"]." ".$path_info[3]." (".$railroad_info["railroad_name"].") の編成情報・運用 | ".$app_manifest["name"];
                                
                                $car_numbers = array();
                                foreach ($formations["formations"][$path_info[3]]["cars"] as $car) {
                                    $car_numbers[] = $car["car_number"];
                                }
                                
                                $page_description = $railroad_info["railroad_name"]."で運用されている".$formations["formations"][$path_info[3]]["series_name"]."の編成 ".$path_info[3]." ( ".implode(" - ", $car_numbers)." ) の車両設備・車歴情報、及び運用状況です。";
                            } else {
                                $page_title = $path_info[3]." (".$railroad_info["railroad_name"].") の編成情報 | ".$app_manifest["name"];
                                $page_description = "過去に".$railroad_info["railroad_name"]."で運用されていた編成 ".$path_info[3]." の車両設備・車歴情報です。";
                            }
                        } else {
                            if (!empty($formations["formations"][$path_info[3]]["new_railroad_id"])) {
                                header("Location: /railroad_".$formations["formations"][$path_info[3]]["new_railroad_id"]."/formations/".urlencode($formations["formations"][$path_info[3]]["new_formation_name"])."/", TRUE, 301);
                            } else {
                                header("Location: ".$path_info_str.urlencode($formations["formations"][$path_info[3]]["new_formation_name"])."/", TRUE, 301);
                            }
                            
                            exit;
                        }
                    }
                    
                    break;
                
                case "operation_table":
                    $path_info_str .= "operation_table/";
                    
                    if (empty($path_info[3])) {
                        $page_title = $railroad_info["railroad_name"]."の運用表一覧 | ".$app_manifest["name"];
                        $page_description = $railroad_info["railroad_name"]."の現行ダイヤ、及び過去のダイヤの車両運用表です。";
                    } else {
                        $diagram_revisions_path = "data/".$railroad_id."/diagram_revisions.txt";
                        
                        if (!file_exists($diagram_revisions_path)) {
                            header("Location: /", TRUE, 302);
                            exit;
                        }
                        
                        if (!in_array($path_info[3], file($diagram_revisions_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES))) {
                            header("Location: ".$path_info_str, TRUE, 301);
                            exit;
                        }
                        
                        $path_info_str .= urlencode($path_info[3])."/";
                        
                        $diagram_revision_year_month = substr($path_info[3], 0, 4)."年".intval(substr($path_info[3], 5, 2))."月";
                        
                        $page_title = $railroad_info["railroad_name"]." ".$diagram_revision_year_month."改正・変更ダイヤ運用表 | ".$app_manifest["name"];
                        $page_description = $railroad_info["railroad_name"]." ".$diagram_revision_year_month.intval(substr($path_info[3], 8))."日改正・変更版の平日・土休日ダイヤ車両運用表です。";
                    }
                    
                    break;
                
                default:
                    header("Location: ".$path_info_str, TRUE, 301);
                    exit;
            }
        }
    } else {
        header("Location: /", TRUE, 301);
        exit;
    }
} else {
    header("Location: /", TRUE, 301);
    exit;
}
?><!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,interactive-widget=resizes-content">
<?php
print "    <title>".htmlspecialchars($page_title)."</title>\n";

$root_url = "http".(empty($_SERVER["HTTPS"]) ? "" : "s")."://".$_SERVER["HTTP_HOST"];
$page_description = addslashes($page_description);

print "    <link rel=\"stylesheet\" href=\"/assets.css?v=".UNYOHUB_VERSION."\">\n";
print "    <link rel=\"stylesheet\" href=\"/non_critical.css?v=".UNYOHUB_VERSION."\" id=\"non_critical_css\" media=\"print\" onload=\"this.media='all';\">\n";
print "    <script>\n";
print "        const UNYOHUB_PROJECT_NAME = \"".UNYOHUB_PROJECT_NAME."\";\n";
print "        const UNYOHUB_VERSION = \"".UNYOHUB_VERSION."\";\n";
print "        const UNYOHUB_PROJECT_INFO_URL = \"".UNYOHUB_PROJECT_INFO_URL."\";\n";
print "        const UNYOHUB_REPOSITORY_URL = \"".UNYOHUB_REPOSITORY_URL."\";\n";
print "        const UNYOHUB_LICENSE_TEXT = \"".UNYOHUB_LICENSE_TEXT."\";\n";
print "        const UNYOHUB_APP_NAME = \"".$app_manifest["name"]."\";\n";
print "    </script>\n";
print "    <script src=\"/main.js?v=".UNYOHUB_VERSION."\" defer=\"defer\"></script>\n";
?>
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.webp">
    <link rel="preload" href="/splash_screen_image.webp" as="image">
<?php
print "    <link rel=\"manifest\" href=\"/manifest.php?mod=".$manifest_modified."\">\n";
print "    <link rel=\"canonical\" href=\"".$root_url.$path_info_str."\">\n";
print "    <meta name=\"description\" content=\"".$page_description."\">\n";
print "    <meta property=\"og:title\" content=\"".addslashes($page_title)."\">\n";
print "    <meta property=\"og:type\" content=\"website\">\n";
print "    <meta property=\"og:image\" content=\"".$root_url."/large_image.webp\">\n";
print "    <meta property=\"og:url\" content=\"".$root_url.$path_info_str."\">\n";
print "    <meta property=\"og:description\" content=\"".$page_description."\">\n";
print "    <meta property=\"twitter:card\" content=\"summary_large_image\">\n";
?>
    <style id="formation_styles"></style>
</head>
<body>
    <header><button type="button" id="railroad_icon" onclick="about_railroad_data();" aria-label="この路線系統について"></button><span id="instance_name"></span><button type="button" id="railroad_name" onclick="show_railroad_list();"></button><button type="button" id="menu_button" onclick="menu_click();" aria-label="メニュー"></button></header>
    <nav id="menu">
        <div id="menu_logged_in">
            <b id="menu_user_name"></b>
            <button type="button" onclick="window.open('/user/user_info.php');">ユーザー情報</button>
            <button type="button" onclick="user_logout();">ログアウト</button>
        </div>
        <div id="menu_admin">
            <button type="button" onclick="window.open('/admin/index.php');">管理画面を開く</button>
        </div>
        <div id="menu_not_logged_in">
            <button type="button" onclick="show_login_form();">ログイン</button>
            <button type="button" onclick="window.open('/user/sign_up.php');">新規登録</button>
        </div>
        <div id="menu_off_line">
            <b class="off_line_message" onclick="show_off_line_message();">オフラインモード</b>
        </div>
        <hr>
        <button type="button" onclick="edit_config();">アプリの設定</button>
        <hr>
        <button type="button" id="menu_about" onclick="show_about();"><span id="menu_instance_name"><?php print $app_manifest["name"]; ?></span>について</button>
        <button type="button" id="menu_announcements" onclick="show_announcements();">お知らせ</button>
        <button type="button" onclick="show_rules();">ルールとポリシー</button>
        <a id="menu_manual_button" href="#" target="_blank">このアプリの使い方</a>
        <hr>
        <a id="menu_reload_button" href="/" onclick="event.preventDefault(); reload_app();"><?php print $app_manifest["name"]; ?></a>
    </nav>
    <div id="splash_screen" class="splash_screen_loading">
<?php
if ($path_info_str === "/") {
    $unyohub_version = UNYOHUB_VERSION;
    print <<<EOM
            <div id="splash_screen_login_status">サーバに接続しています...</div>
            <div id="splash_screen_inner" class="wait_icon"></div>
            <div id="splash_screen_bottom">
                <u id="splash_screen_update_info" onclick="show_about();">新しいバージョンが利用可能です</u>
                <u onclick="show_about();"><span id="splash_screen_instance_name">{$app_manifest["name"]}</span>について</u><a href="/user/rules.php" onclick="event.preventDefault(); show_rules();">ルールとポリシー</a>
                <span id="splash_screen_app_version">v{$unyohub_version}</span>
            </div>
    EOM."\n";
}
?>
    </div>
    <div id="blank_article" class="wait_icon"></div>
    <div id="tab_area"><a href="<?php print $railroad_root; ?>" onclick="event.preventDefault(); position_mode();" id="tab_position_mode">走行位置</a><a href="<?php print $railroad_root; ?>timetable/" onclick="event.preventDefault(); timetable_mode();" id="tab_timetable_mode">時刻表</a><a href="<?php print $railroad_root; ?>operation_data/" onclick="event.preventDefault(); operation_data_mode();" id="tab_operation_data_mode">運用データ</a><a href="<?php print $railroad_root; ?>formations/" onclick="event.preventDefault(); formations_mode();" id="tab_formations_mode">編成表</a><a href="<?php print $railroad_root; ?>operation_table/" onclick="event.preventDefault(); operation_table_mode();" id="tab_operation_table_mode">運用表</a></div>
    <article>
        <div class="line_select_wrapper"><button type="button" id="position_line_select" onclick="select_lines();"></button></div>
        <table id="position_area" class="wait_icon"></table>
        <div id="position_area_supplement" class="radio_area">
            <div><input type="radio" name="show_train_numbers_or_final_destinations" id="show_train_numbers_radio" onchange="change_show_final_destinations(!this.checked);"><label for="show_train_numbers_radio">列車番号を表示</label><input type="radio" name="show_train_numbers_or_final_destinations" id="show_final_destinations_radio" onchange="change_show_final_destinations(this.checked);"><label for="show_final_destinations_radio">行き先を表示</label></div>
            <div class="informational_text">列車の走行位置は時刻表に基づく推定であり、遅延や不定期列車の情報は反映されません</div>
            <a href="#about_railroad_data_popup" class="bottom_link" onclick="event.preventDefault(); about_railroad_data();">使用しているデータについて</a>
        </div>
    </article>
    <article onscroll="timetable_wrapper_onscroll();">
        <div class="line_select_wrapper"><button type="button" id="timetable_line_select" onclick="select_lines(timetable_selected_line, timetable_selected_station, false);"></button></div>
        <div id="direction_radio_area" class="radio_area">
            <div id="timetable_station_name" class="heading_wrapper"></div>
            <div><input type="radio" name="direction_radio" id="radio_inbound" value="inbound" checked="checked" onchange="timetable_select_station(timetable_selected_station);"><label for="radio_inbound" id="radio_inbound_label">上り</label><input type="radio" name="direction_radio" id="radio_outbound" value="outbound" onchange="timetable_select_station(timetable_selected_station);"><label for="radio_outbound" id="radio_outbound_label">下り</label></div>
            <input type="checkbox" id="show_deadhead_trains_check" class="chip" onchange="change_show_arriving_trains(this.checked);"><label for="show_deadhead_trains_check">回送・着列車</label><input type="checkbox" id="show_starting_trains_only_check" class="chip" onchange="change_show_starting_trains_only(this.checked);"><label for="show_starting_trains_only_check">当駅始発のみ</label><button type="button" class="chip_ellipsis" onclick="timetable_station_menu();">…</button>
        </div>
        <div id="timetable_area" class="wait_icon"></div>
    </article>
    <article>
        <h2 id="operation_data_heading"></h2>
        <div class="radio_area"><input type="radio" name="operation_data_radio" id="radio_operation_groups" value="operation_groups" checked="checked" onchange="operation_data_draw(true);"><label for="radio_operation_groups">系統別</label><input type="radio" name="operation_data_radio" id="radio_formations" value="formations" onchange="operation_data_draw(true);"><label for="radio_formations">編成別</label><input type="radio" name="operation_data_radio" id="radio_starting_location" value="starting_location" onchange="operation_data_draw(true);"><label for="radio_starting_location">出庫別</label><input type="radio" name="operation_data_radio" id="radio_terminal_location" value="terminal_location" onchange="operation_data_draw(true);"><label for="radio_terminal_location">入庫別</label></div>
        <div id="operation_data_area" class="wait_icon"></div>
        <div id="operation_data_area_supplement">
            <div id="whether_use_group_divisions_area" class="radio_area"><input type="radio" name="whether_use_group_divisions" id="use_group_divisions_radio" value="use_group_divisions" checked="checked" onchange="change_use_group_divisions(this.checked);"><label for="use_group_divisions_radio">系統区分別表示</label><input type="radio" name="whether_use_group_divisions" id="not_use_group_divisions_radio" value="not_use_group_divisions" onchange="change_use_group_divisions(!this.checked);"><label for="not_use_group_divisions_radio">単一ページ表示</label></div>
            <a href="#about_railroad_data_popup" class="bottom_link" onclick="event.preventDefault(); about_railroad_data();">使用しているデータについて</a>
        </div>
    </article>
    <article onscroll="formation_table_wrapper_onscroll();">
        <button type="button" id="formation_screenshot_button" class="screenshot_button" onclick="take_screenshot('formation_table_area');" aria-label="スクリーンショット"></button>
        <div id="formation_search_area">
            <div class="search_wrapper"><label for="car_number_search" class="search_icon">編成名・車両番号で検索</label><input type="search" id="car_number_search" onkeyup="draw_formation_table(false);" onsearch="draw_formation_table(false);" placeholder="編成名・車両番号で検索" autocomplete="off"></div>
            <div class="radio_area"><input type="checkbox" id="colorize_formation_table" class="chip" onchange="change_colorize_formation_table(this.checked);"><label for="colorize_formation_table" id="colorize_formation_table_label">車体色</label><input type="checkbox" id="show_unregistered_formations" class="chip" onchange="change_show_unregistered_formations(this.checked);"><label for="show_unregistered_formations">除籍済み編成</label><input type="checkbox" id="group_formations_by_prefix" class="chip" onchange="change_group_formations_by_prefix(this.checked);"><label for="group_formations_by_prefix" id="group_formations_by_prefix_label">編成記号別</label></div>
        </div>
        <div id="formation_table_area" class="wait_icon"></div>
        <div id="formation_table_area_supplement"></div>
    </article>
    <article>
        <div id="operation_search_area">
            <div class="search_wrapper"><label for="train_number_search" class="search_icon">運用・列車番号で検索</label><input type="search" id="train_number_search" onkeyup="operation_table_list_number(false);" onsearch="operation_table_list_number(false);" placeholder="運用・列車番号で検索" autocomplete="off"></div>
        <div class="radio_area"><input type="radio" name="operation_table_sorting_criteria" id="sort_by_operation_groups" value="operation_groups" checked="checked" onchange="operation_table_list_number(false);"><label for="sort_by_operation_groups">系統別</label><input type="radio" name="operation_table_sorting_criteria" id="sort_by_starting_location" value="starting_location" onchange="operation_table_list_number(false);"><label for="sort_by_starting_location">出庫別</label><input type="radio" name="operation_table_sorting_criteria" id="sort_by_terminal_location" value="terminal_location" onchange="operation_table_list_number(false);"><label for="sort_by_terminal_location">入庫別</label><button type="button" class="customize_button" onclick="customize_operation_table();">カスタム</button></div>
        </div>
        <h2 id="operation_table_heading"></h2>
        <div id="operation_table_area" class="wait_icon"></div>
        <div id="operation_table_area_supplement"></div>
    </article>
    <div id="tips"><button type="button" id="tips_button" onclick="show_tips();">Tips</button><div id="tips_area"></div></div>
    <button type="button" id="railroad_announcement" onclick="show_railroad_announcements();" aria-label="お知らせ"></button>
    <footer>
        <div>
            <button type="button" id="position_reload_button" class="reload_button" onclick="position_mode(null, '__today__');" aria-label="再読み込み"></button>
            <button type="button" id="position_diagram" class="footer_select" onclick="position_list_diagrams();" aria-label="ダイヤ選択"></button><span ontouchstart="position_time_swipe_start(event);" ontouchmove="position_time_swipe(event);" ontouchend="position_time_swipe_end(event, 360);"><button type="button" class="previous_button" onclick="position_change_time(-60);" aria-label="時を戻す"></button><span id="position_hours" class="footer_value"></span><button type="button" class="next_button" onclick="position_change_time(60);" aria-label="時を進める"></button></span><span ontouchstart="position_time_swipe_start(event);" ontouchmove="position_time_swipe(event);" ontouchend="position_time_swipe_end(event, 10);"><button type="button" class="previous_button" onclick="position_change_time(-1, true);" aria-label="分を戻す"></button><span id="position_minutes" class="footer_value"></span><button type="button" class="next_button" onclick="position_change_time(1, true);" aria-label="分を進める"></button></span>
            <input type="time" id="position_time_button" class="time_button" onchange="position_time_button_change();" aria-label="時刻選択">
        </div>
        <div>
            <button type="button" id="timetable_back_button" class="back_button" onclick="timetable_change_lines(timetable_selected_line, true);" aria-label="戻る"></button>
            <button type="button" class="previous_button" onclick="timetable_diagram_previous();" aria-label="前のダイヤ"></button><span id="timetable_operation_name" class="footer_value_wide"></span><button type="button" class="next_button" onclick="timetable_diagram_next();" aria-label="次のダイヤ"></button><button type="button" class="list_button" onclick="timetable_list_diagrams();" aria-label="ダイヤ一覧"></button>
        </div>
        <div>
            <button type="button" class="reload_button" onclick="operation_data_change_date(null);" aria-label="再読み込み"></button>
            <button type="button" class="previous_button" onclick="operation_data_change_date(-1);" aria-label="前日"></button><span id="operation_data_date" class="footer_value_wide"></span><button type="button" class="next_button" onclick="operation_data_change_date(1);" aria-label="翌日"></button>
            <input type="date" id="operation_date_button" class="date_button" onchange="operation_date_button_change();" aria-label="日付選択">
        </div>
        <div>
            <button type="button" id="formation_back_button" class="back_button" onclick="draw_formation_table();" aria-label="戻る"></button>
        </div>
        <div id="operation_table_footer_inner">
            <button type="button" class="back_button" onclick="operation_table_mode(null);" aria-label="戻る"></button>
            <button type="button" class="previous_button" onclick="operation_table_previous();" aria-label="前のダイヤ"></button><span id="operation_table_name" class="footer_value_wide"></span><button type="button" class="next_button" onclick="operation_table_next();" aria-label="次のダイヤ"></button>
            <button type="button" class="list_button" onclick="operation_table_list_tables();" aria-label="ダイヤ一覧"></button>
        </div>
    </footer>
    <div id="popup_background"></div>
    <div id="popup_screen">
        <div id="popup_screen_blank_area" onclick="close_square_popup();"></div>
    </div>
    <div id="wait_screen"></div>
    <div id="message_area"></div>
</body>
</html>
