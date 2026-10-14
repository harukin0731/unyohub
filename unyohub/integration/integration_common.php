<?php
include "../version.php";
require_once __DIR__."/../email_mode.php";

$main_config = parse_ini_file("../config/main.ini", FALSE, INI_SCANNER_TYPED);

function print_header ($title = "", $load_captcha_js = FALSE) {
    global $main_config;
    
    $instance_name = htmlspecialchars($main_config["instance_name"]);
    
    if (empty($title)) {
        $title = $instance_name;
    } else {
        $title = htmlspecialchars($title)." | ".$instance_name;
    }
    
    $version = UNYOHUB_VERSION;
    $email_enabled = unyohub_email_enabled($main_config) ? "true" : "false";
    print <<< EOM
    <html>
    <head lang="ja">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,interactive-widget=resizes-content">
        <meta name="robots" content="noindex">
        <title>{$title}</title>
        <link rel="stylesheet" href="/integration/integration_styles.css?v={$version}">
        <link rel="shortcut icon" href="/favicon.ico">
        <script>window.unyohubEmailEnabled = {$email_enabled};</script>
        <script src="/integration/integration_funcs.js?v={$version}" defer="defer"></script>
    
    EOM;
    
    if ($load_captcha_js) {
        print "    <script src=\"/libs/zizai_captcha/captcha.js\" async=\"async\"></script>\n";
    }
    
    print <<< EOM
    </head>
    <body>
    
    EOM;
}

function print_footer () {
    global $main_config;
    
    print "    <footer><b>".htmlspecialchars($main_config["instance_name"])."</b> v".UNYOHUB_VERSION."</footer>\n";
    print <<< EOM
        <div id="popup_screen">
            <div id="popup_screen_blank_area" onclick="close_square_popup();"></div>
        </div>
        <div id="wait_screen"></div>
        <div id="message_area"></div>
    </body>
    </html>
    EOM;
}
