<?php
include "user_common.php";
unyohub_require_email_enabled($main_config);

if (empty($_POST["email_address"])) {
    print "ERROR: メールアドレスが未入力です";
    exit();
}

$wakarana = new wakarana("../config");

$user = $wakarana->check();

$rejection_reason = NULL;
if (is_object($user)) {
    $verification_code = $user->create_email_address_verification_code($_POST["email_address"], FALSE);
    
    if (empty($verification_code)) {
        $rejection_reason = $user->get_rejection_reason();
    }
} else {
    $verification_code = $wakarana->create_email_address_verification_code($_POST["email_address"]);
    
    if (empty($verification_code)) {
        $rejection_reason = $wakarana->get_rejection_reason();
    }
}

if (empty($verification_code)) {
    switch ($rejection_reason) {
        case "currently_locked_out":
            print "ERROR: 数十秒待ってから再度お試しください";
            break;
        case "invalid_email_address":
            print "ERROR: 正しいメールアドレスが入力されていません";
            break;
        case "blacklisted_email_domain":
            print "ERROR: 使用できないメールアドレスです";
            break;
        case "email_address_already_exists":
            print "ERROR: 既に使用されているメールアドレスです";
            break;
        case "currently_locked_out":
            print "ERROR: しばらく待ってから再度お試しください";
            break;
        default:
            print "ERROR: メースアドレス確認コードの発行に失敗しました";
    }
    
    exit();
}

if (!mb_send_mail($_POST["email_address"], "メールアドレスの確認 - ".$main_config["instance_name"], $main_config["instance_name"]."にご利用のメールアドレスを登録するための確認メールです。\nメールアドレスの登録を完了するには、以下の確認コードを".$main_config["instance_name"]."の登録フォームにご入力ください\n\n確認コード: ".$verification_code, "From: ".$main_config["sender_email_address"])) {
    http_response_code(503);
    print "ERROR: メールの送信に失敗しました";
    exit;
}

print "SUCCEEDED";
