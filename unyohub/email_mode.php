<?php
// Missing setting keeps compatibility with existing installations.
function unyohub_email_enabled($config) {
    return !isset($config["email_enabled"]) || (bool)$config["email_enabled"];
}
function unyohub_require_email_enabled($config) {
    if (!unyohub_email_enabled($config)) {
        http_response_code(403);
        print "メール機能は無効です。パスワードの復旧は管理者にお問い合わせください。";
        exit;
    }
}
