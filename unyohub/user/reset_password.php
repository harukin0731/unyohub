<?php
include "user_common.php";
unyohub_require_email_enabled($main_config);

print_header("パスワードのリセット", TRUE, FALSE, FALSE);

print "    <h2>パスワードのリセット</h2>\n";

if (isset($_GET["reset_token"])) {
    $wakarana = new wakarana("../config");
    
    $new_password = wakarana::generate_random_password();
    
    $user = $wakarana->reset_password($_GET["reset_token"], $new_password);
    
    if (!is_object($user)) {
        print "    <div class=\"warning_text\">ERROR: 有効なパスワードリセットメールではありません。</div>\n";
    } else {
        print "    <div class=\"informational_text\">".htmlspecialchars($user->get_name())."さんのパスワードを <b>".$new_password."</b> に変更しました。</div>\n";
    }
} else {
    print "    <div class=\"warning_text\">ERROR: パスワードリセットトークンがありません。</div>\n";
}

print_footer();
