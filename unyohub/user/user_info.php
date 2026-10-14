<?php
include "user_common.php";

print_header("ユーザー情報");

?>
    <script>
        function update_email_address (email_address) {
            document.getElementById("email_address").innerText = email_address;
        }
    </script>
<?php

print "    <h2>ユーザー情報</h2>\n";

$wakarana = new wakarana("../config");

$user = $wakarana->check();
if (is_object($user)) {
    $user_name = $user->get_name();
    $website_url = $user->get_value("website_url");
    
    if (isset($_POST["user_name"], $_POST["website_url"])) {
        $user_name = $_POST["user_name"];
        $website_url = $_POST["website_url"];
        
        if (!isset($_POST["one_time_token"]) || !$user->check_one_time_token($_POST["one_time_token"])) {
            print "    <div class=\"warning_text\">ワンタイムトークンの認証に失敗しました。再度ご送信ください</div>\n";
        } elseif ($_POST["website_url"] !== "" && filter_var($_POST["website_url"], FILTER_VALIDATE_URL) === FALSE) {
            print "    <div class=\"warning_text\">URLの書式に誤りがあります</div>\n";
        } else {
            $user->set_name($_POST["user_name"]);
            
            if (!empty($_POST["website_url"])) {
                $user->set_value("website_url", $_POST["website_url"]);
            } else {
                $user->delete_value("website_url");
                $website_url = NULL;
            }
            
            $data = array();
            
            $data["user_id"] = $user->get_id();
            $data["user_name"] = $user_name;
            $data["created"] = $user->get_created();
            if ($user->check_permission("control_panel_user")) {
                $data["is_control_panel_user"] = TRUE;
                
                if ($user->check_permission("management_member")) {
                    $data["is_management_member"] = TRUE;
                } else {
                    $data["is_management_member"] = FALSE;
                }
            } else {
                $data["is_control_panel_user"] = FALSE;
                $data["is_management_member"] = FALSE;
            }
            $days_posted = intval($user->get_value("days_posted"));
            $data["is_beginner"] = ($days_posted < 20 && ($days_posted < 10 || intval($user->get_value("post_count")) < 50));
            $data["website_url"] = $website_url;
            
            print "    <script>\n";
            print "        var user_data = ".json_encode($data, JSON_UNESCAPED_UNICODE).";\n";
            print "        window.opener.update_user_data(user_data);\n";
            print "        alert('ユーザー情報を保存しました');\n";
            print "    </script>\n";
        }
    }
    
    if (empty($website_url)) {
        $website_url = "";
    }
    
    print "    <form action=\"user_info.php\" method=\"post\" id=\"user_info_form\">\n";
    print "        <input type=\"hidden\" name=\"one_time_token\" value=\"".$user->create_one_time_token()."\">\n";
    
    print "        <div class=\"key_and_value\"><b>ユーザーID</b>".$user->get_id()."</div>\n";
    print "        <div class=\"key_and_value\"><b>登録日時</b>".$user->get_created()."</div>\n";
    print "        <div class=\"key_and_value\"><b>通算投稿日数</b>".intval($user->get_value("days_posted"))."</div>\n";
    
    print "        <h3>パスワード</h3>\n";
    print "        <div class=\"value_and_button\"><b>＊＊＊＊＊＊</b><button type=\"button\" onclick=\"window.open('change_password.php');\">変更</button></div>\n";
    
    print "        <h3>ハンドルネーム</h3>\n";
    print "        <input type=\"text\" name=\"user_name\" value=\"".addslashes($user_name)."\" autocomplete=\"nickname\">\n";
    
    if (unyohub_email_enabled($main_config)) {
        print "        <h3>メールアドレス</h3>\n";
        $email_address = $user->get_primary_email_address();
        if (!empty($email_address)) {
            $email_address = htmlspecialchars($email_address);
        } else {
            $email_address = "(未登録)";
        }
        print "        <div class=\"value_and_button\"><b id=\"email_address\">".$email_address."</b><button type=\"button\" onclick=\"window.open('change_email_address.php');\">変更</button></div>\n";
        print "        <div class=\"informational_text\">メールアドレスは他のユーザーには公開されません。</div>\n";
    
    }

    print "        <h3>webサイトのURL(省略可能)</h3>\n";
    print "        <input type=\"text\" name=\"website_url\" value=\"".addslashes($website_url)."\" autocomplete=\"url\">\n";
    print "        <div class=\"informational_text\">ブログやSNSのURLを登録することができます。</div>\n";
    
    print "        <br>\n";
    print "        <button type=\"button\" class=\"wide_button\" onclick=\"this.disabled = true; document.getElementById('user_info_form').submit();\">上書き保存</button>\n";
    print "    </form>\n";
} else {
    print "    <div class=\"warning_text\">ログイン情報の有効期限が切れています。再ログインしてください</div>\n";
}

print_footer();
