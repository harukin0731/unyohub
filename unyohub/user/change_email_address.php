<?php
include "user_common.php";
unyohub_require_email_enabled($main_config);

print_header("メールアドレスの変更");

?>
    <script>
        function send_verification_email () {
            var send_email_button = document.getElementById("send_email_button");
            send_email_button.disabled = true;
            
            setTimeout(function () {
                send_email_button.disabled = false;
            }, 5000);
            
            var ajax_request = new XMLHttpRequest();
            
            ajax_request.onloadend = function () {
                if (ajax_request.responseText === "SUCCEEDED") {
                    alert("入力されたメールアドレスに確認メールを送信しました。メールをご確認のうえ、本文に記載の確認コードをフォームにご入力ください");
                } else {
                    alert(ajax_request.responseText);
                }
            };
            
            ajax_request.open("POST", "send_verification_email.php", true);
            ajax_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            ajax_request.timeout = 5000;
            ajax_request.send("email_address=" + encodeURIComponent(document.getElementById("email_address").value).replace(/%20/g, "+"));
        }
    </script>
<?php

$wakarana = new wakarana("../config");

$user = $wakarana->check();
if (is_object($user)) {
    $email_address = "";
    
    if (isset($_POST["email_address"], $_POST["verification_code"], $_POST["password"], $_POST["one_time_token"])) {
        $email_address = addslashes($_POST["email_address"]);
        
        if (!$user->check_one_time_token($_POST["one_time_token"])) {
            print "    <div class=\"warning_text\">ワンタイムトークンの認証に失敗しました。再度ご送信ください</div>\n";
        } elseif (!$user->check_password($_POST["password"])) {
            print "    <div class=\"warning_text\">パスワードが一致しません。パスワードを確認して再度お試しください</div>\n";
        } elseif (!$user->verify_and_replace_primary_email_address($_POST["email_address"], $_POST["verification_code"], TRUE)) {
            switch ($user->get_rejection_reason()) {
                case "currently_locked_out":
                    print "    <div class=\"warning_text\">数十秒待ってから再度お試しください</div>\n";
                    break;
                case "invalid_email_address":
                    print "    <div class=\"warning_text\">正しいメールアドレスが入力されていません</div>\n";
                    break;
                case "blacklisted_email_domain":
                    print "    <div class=\"warning_text\">使用できないメールアドレスです</div>\n";
                    break;
                case "email_address_already_exists":
                    print "    <div class=\"warning_text\">既に使用されているメールアドレスです</div>\n";
                    break;
                case "parameters_not_matched":
                    print "    <div class=\"warning_text\">正しいメールアドレス確認コードを入力してください</div>\n";
                    break;
                default:
                    print "    <div class=\"warning_text\">メースアドレス確認コードの照合に失敗しました</div>\n";
            }
        } else {
            print "    <script>\n";
            print "        window.opener.update_email_address(\"".$email_address."\");\n";
            print "        alert('メールアドレスを変更しました');\n";
            print "        window.close();\n";
            print "    </script>\n";
        }
    }
    
    print "    <form action=\"change_email_address.php\" method=\"post\" id=\"change_email_address_form\">\n";
    print "        <input type=\"hidden\" name=\"one_time_token\" value=\"".$user->create_one_time_token()."\">\n";
    print "        <h4>新しいメールアドレス</h4>\n";
    print "        <div class=\"informational_text\">メールアドレスの変更には確認メールの送信が必要です。新しいメールアドレスを入力後、確認メール送信ボタンを押して確認コードを発行してください。</div>\n";
    print "        <input type=\"text\" name=\"email_address\" id=\"email_address\" value=\"".$email_address."\" autocomplete=\"email\">\n";
    print "        <button type=\"button\" id=\"send_email_button\" class=\"execute_button\" onclick=\"send_verification_email();\">確認メール送信</button>\n";
    print "        <h4>確認コード</h4>\n";
    print "        <div class=\"informational_text\">確認メールに記載された8桁の確認コード(大文字小文字区別なし)を入力してください。</div>\n";
    print "        <input type=\"text\" name=\"verification_code\" autocomplete=\"off\">\n";
    print "        <h4>パスワード</h4>\n";
    print "        <div class=\"informational_text\">メールアドレスの変更にはパスワードの再入力が必要です。</div>\n";
    print "        <input type=\"password\" name=\"password\" autocomplete=\"current-password\">\n";
    print "        <br>\n";
    print "        <button type=\"button\" class=\"wide_button\" onclick=\"this.disabled = true; document.getElementById('change_email_address_form').submit();\">メールアドレスを変更</button>\n";
    print "    </form>\n";
} else {
    print "    <div class=\"warning_text\">ログイン情報の有効期限が切れています。アプリを再起動してください</div>\n";
}

print_footer();
