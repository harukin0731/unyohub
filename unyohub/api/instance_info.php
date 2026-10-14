<?php
include "../version.php";
require_once __DIR__."/../email_mode.php";

header("Access-Control-Allow-Origin: *");

define("MAIN_CONFIG_PATH", "../config/main.ini");

$last_modified = @filemtime(MAIN_CONFIG_PATH);
if ($last_modified === FALSE) {
    print "ERROR: main.iniにアクセスできません";
    exit;
}

if ((empty($_POST["client_unyohub_version"]) || $_POST["client_unyohub_version"] === UNYOHUB_VERSION) && isset($_POST["last_modified_timestamp"]) && $last_modified <= intval($_POST["last_modified_timestamp"])) {
    print "NO_UPDATES_AVAILABLE";
    exit;
}

header("Last-Modified: ".gmdate("D, d M Y H:i:s", $last_modified)." GMT");

$main_config = parse_ini_file(MAIN_CONFIG_PATH, FALSE, INI_SCANNER_TYPED);

$instance_info = array(
    "unyohub_version" => UNYOHUB_VERSION,
    "email_enabled" => unyohub_email_enabled($main_config),
    "instance_name" => $main_config["instance_name"],
    "available_days_ahead" => $main_config["available_days_ahead"],
    "allow_guest_user" => $main_config["allow_guest_user"],
    "comment_character_limit" => $main_config["comment_character_limit"],
    "require_comments_on_speculative_posts" => $main_config["require_comments_on_speculative_posts"]
);

if (!empty($main_config["instance_introduction"])) {
    $instance_info["instance_introduction"] = stripcslashes($main_config["instance_introduction"]);
}

if (!empty($main_config["instance_explanation"])) {
    $instance_info["instance_explanation"] = stripcslashes($main_config["instance_explanation"]);
}

if (!empty($main_config["manual_url"])) {
    $instance_info["manual_url"] = $main_config["manual_url"];
}

if (!empty($main_config["administrator_name"])) {
    $instance_info["administrator_name"] = $main_config["administrator_name"];
    
    if (!empty($main_config["administrator_url"])) {
        $instance_info["administrator_url"] = $main_config["administrator_url"];
    }
}

if (!empty($main_config["administrator_introduction"])) {
    $instance_info["administrator_introduction"] = stripcslashes($main_config["administrator_introduction"]);
}

if (!empty($main_config["quotation_guidelines"])) {
    $instance_info["quotation_guidelines"] = stripcslashes($main_config["quotation_guidelines"]);
}

if (!empty($_SERVER["HTTP_ACCEPT_ENCODING"]) && str_contains($_SERVER["HTTP_ACCEPT_ENCODING"], "gzip")) {
    header("Content-Encoding: gzip");
    print gzencode(json_encode($instance_info, JSON_UNESCAPED_UNICODE));
} else {
    print json_encode($instance_info, JSON_UNESCAPED_UNICODE);
}
