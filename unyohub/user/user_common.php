<?php
include "../version.php";
include "../libs/wakarana/main.php";
include "../libs/zizai_captcha/main.php";

require_once __DIR__."/../email_mode.php";

$main_config = parse_ini_file("../config/main.ini", FALSE, INI_SCANNER_TYPED);

if (!unyohub_email_enabled($main_config)) {
    $main_config["require_email_address"] = false;
}

function print_header ($title = "", $noindex = TRUE, $load_captcha_js = FALSE, $show_close_button = TRUE) {
    global $main_config;
    
    $instance_name = htmlspecialchars($main_config["instance_name"]);
    
    if (empty($title)) {
        $title = $instance_name;
    } else {
        $title = htmlspecialchars($title)." | ".$instance_name;
    }
    
    print <<< EOM
    <html>
    <head lang="ja">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,interactive-widget=resizes-content">
    
    EOM;
    
    if ($noindex) {
        print "    <meta name=\"robots\" content=\"noindex\">\n";
    }
    
    print "    <title>{$title}</title>\n";
    print "    <link rel=\"stylesheet\" href=\"user_styles.css?v=".UNYOHUB_VERSION."\">\n";
    print "    <link rel=\"shortcut icon\" href=\"/favicon.ico\">\n";
    
    if ($load_captcha_js) {
        print "    <script src=\"/libs/zizai_captcha/captcha.js\"></script>\n";
    }
    
    print <<< EOM
    </head>
    <body>
    
    EOM;
    
    if ($show_close_button) {
        print "    <a href=\"/\" class=\"popup_close_button\" onclick=\"event.preventDefault(); ".(empty($_GET["is_child_page"]) ? "window.close();" : "window.parent.close_child_page();")."\">".$instance_name."</a>\n";
    }
}

function print_footer () {
    print <<< EOM
    </body>
    </html>
    EOM;
}