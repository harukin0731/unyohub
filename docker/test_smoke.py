"""Integration test for an isolated, initialized Compose project (creates one user)."""
import http.cookiejar
import json
from pathlib import Path
import secrets
import sqlite3
import subprocess
import urllib.error
import urllib.parse
import urllib.request

BASE = 'http://web'
jar = http.cookiejar.CookieJar()
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def request(path, data=None, status=200):
    encoded = urllib.parse.urlencode(data).encode() if data is not None else None
    try:
        response = client.open(BASE + path, encoded, timeout=10)
    except urllib.error.HTTPError as error:
        response = error
    assert response.code == status, (path, response.code, response.read())
    return response.read()


for path in ['/config/main.ini', '/data/test/railroad.db', '/libs_data/wakarana.db',
             '/common_dbs/announcements.db', '/commands/unyohub', '/.env']:
    request(path, status=403)
for page in ['/user/change_email_address.php', '/user/send_verification_email.php',
             '/user/send_password_reset_email.php', '/user/reset_password.php']:
    request(page, status=403)
assert json.loads(request('/api/instance_info.php'))['email_enabled'] is False
assert 'verification_code' not in request('/user/sign_up.php').decode()
captcha = json.loads(request('/libs/zizai_captcha/generate_id.php'))['session_id']
image = request('/libs/zizai_captcha/image.php/' + captcha)
assert image.startswith(b'\x89PNG') or image.startswith(b'RIFF'), image[:100]
with sqlite3.connect('/var/www/unyohub/libs_data/zizai_captcha.db') as db:
    answer = db.execute('SELECT characters FROM zizai_captcha_sessions WHERE session_id=?',
                        (captcha,)).fetchone()[0]
user_id = 'smoke_' + secrets.token_hex(4)
password = secrets.token_urlsafe(24)
result = request('/user/sign_up.php', dict(user_id=user_id, password=password,
                 user_name='Docker smoke test', zizai_captcha_id=captcha,
                 zizai_captcha_characters=answer, i_accept_rules='YES')).decode()
assert 'ユーザー登録が完了しました' in result, result
assert 'change_email_address.php' not in request('/user/user_info.php').decode()
login = json.loads(request('/api/login.php', dict(user_id=user_id, password=password)))
assert login['user_id'] == user_id, login
assert any(cookie.name == 'unyohub_login_token' for cookie in jar)

config = Path('/var/www/unyohub/config/main.ini')
original = config.read_text()
try:
    config.write_text(original.replace('email_enabled = false', 'email_enabled = true'))
    assert json.loads(request('/api/instance_info.php'))['email_enabled'] is True
    assert 'change_email_address.php' in request('/user/user_info.php').decode()
    assert 'send_email_form' in request('/user/send_password_reset_email.php').decode()
finally:
    config.write_text(original)
subprocess.run(['php', '-r', 'require "email_mode.php"; '
                'if (!unyohub_email_enabled([])) exit(1); '
                'if (unyohub_email_enabled(["email_enabled" => false])) exit(1);'], check=True)
subprocess.run(['python3', '-c', 'from modules import get_gtfs_realtime'],
               cwd='/var/www/unyohub/commands', check=True)
print('PASS: private paths, email mode, CAPTCHA, signup without email, login, user settings, GTFS import')
