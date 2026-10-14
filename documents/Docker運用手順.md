# Docker運用手順

Docker EngineとDocker Composeを用意してください。同梱ライブラリの構文に合わせてPHP 8.4を使用します。PHP、Python、nginx、定期処理はコンテナ内で実行されます。SQLiteを利用するため、別のDBサーバは不要です。GUIデータ編集ツールはPCで利用します。

## 初回構築

```sh
cp .env.example .env
mkdir -p backups imports
docker compose build
docker compose run --rm tools python3 /opt/unyohub/manage.py init administrator
```

`administrator` は管理者IDに変更できます。表示された初期パスワードを保管し、初回ログイン後に変更してください。初期化はサービス起動前に実行します。既存ユーザーDBがある場合は管理者を再作成しません。設定の配布値は初回のみコピーし、以降は既存設定を保持します。

`config`、`data`、`libs_data`、`common_dbs` は名前付きvolumeに保存されます。通常の `docker compose down` では保持されます。`down -v` は全データを削除するため、運用中は使用しないでください。

## ローカルで確認

```sh
docker compose -f compose.yaml -f compose.local.yaml up -d
docker compose ps
```

`http://localhost:8080` にアクセスします。`.env` の `HTTP_PORT` でポートを変更できます。ポートはlocalhostにのみ公開します。ブラウザーが別PCにある場合はSSHポート転送などを利用してください。

基準のComposeはホストにポートを公開しません。ローカル公開を止めてTunnelに切り替えるときは、いったん `docker compose -f compose.yaml -f compose.local.yaml down` でコンテナを削除してください（volumeは残ります）。

## Cloudflare Tunnelで公開

Cloudflare側でトンネルを作成し、公開ホスト名の転送先を **`http://web:80`** に設定します。トンネルトークンを `.env` の `CLOUDFLARE_TUNNEL_TOKEN` に記入してください。

```sh
docker compose --profile tunnel up -d
docker compose logs --tail 50 cloudflared
```

`cloudflared` は専用の `ingress` ネットワークからnginxに接続します。ホストへのポート公開・証明書のコンテナ配置は不要です。固定IP `172.30.77.2` のTunnelコンテナからだけ、利用者IPとHTTPSの転送ヘッダーを信頼します。Wakaranaの `proxy_count` は初期値の `0` を維持してください。Cloudflare側でHTTPSへのリダイレクトを有効にしてください。

既存ネットワークと `172.30.77.0/24` が重複する場合はComposeのsubnet・webとcloudflaredのIPと `docker/nginx.conf` の信頼IPを合わせて変更し、webイメージを再ビルドします。

[CloudflareのTunnelセットアップ手順](https://developers.cloudflare.com/tunnel/get-started/)も参照してください。トークンをリポジトリへコミットしないでください。

### 別の公開方法

別のComposeプロジェクトのリバースプロキシを `unyohub_ingress` ネットワークに接続し、`web:80` を転送先にできます。そのプロキシの固定IPだけを `docker/nginx.conf` の `geo` と `set_real_ip_from` に追加してください。信頼するプロキシで転送ヘッダーを上書きする必要があります。TLS終端時は `X-Forwarded-Proto: https` を設定します。単にHTTPで動かす場合は `compose.local.yaml` のポート公開が使えます。

## 路線データを投入

PC上で作成・変換した路線系統フォルダを `imports/路線系統名/` に置きます。フォルダには `railroad_info.json`、編成表CSV、時刻表・運用表JSON、アイコンなどが必要です。

```sh
docker compose run --rm tools python3 /opt/unyohub/manage.py import 路線系統名
docker compose run --rm tools unyohub update-operations 路線系統名 ダイヤ改正日名 ダイヤ識別名
```

投入コマンドは既存の路線系統フォルダを上書きしません。各ダイヤの運用表を反映後、管理画面で路線系統を有効化し、グループに追加してください。その他のCLIも `docker compose run --rm tools unyohub ...` で実行できます。

## メールなし運用（初期値）

Dockerの初期設定は `email_enabled = false`、`require_email_address = false` です。メールアドレスなしで登録でき、メール登録・確認・メールによるパスワード復旧は無効になります。ユーザー情報画面とログイン画面もメールなし運用に合わせて表示します。

パスワードを忘れたユーザーには、管理者が次のコマンドで新しいパスワードを発行します。

```sh
docker compose run --rm tools unyohub modify-user-info ユーザーID --reset-password
```

初期化前から存在する設定ファイルにはメール機能の無効化を自動適用しません。既存環境を移行する場合は、管理画面でメール機能を無効にしてください。Docker以外の既存環境では、`email_enabled` が未指定なら従来どおり有効です。

### メールを有効にする

外部SMTPを利用します。`.env` の `SMTP_HOST`、`SMTP_PORT`、`SMTP_FROM` と必要に応じて `SMTP_USER`・`SMTP_PASSWORD` を設定し、app・schedulerを再作成してください。STARTTLS（587）を初期値とし、TLS接続（465）は `SMTP_PORT=465`、`SMTP_STARTTLS=off` にします。

```sh
docker compose up -d --force-recreate app scheduler
```

管理画面で「メール機能を有効にする」を有効化し、送信元メールアドレスをSMTPの送信元に合わせます。必要なら「ユーザー登録時にメールアドレス入力を強制する」も有効化してください。確認メールの送信を試してから運用してください。

## 定期処理

`scheduler` は毎日03:51（Asia/Tokyo）に運用遷移キャッシュを生成します。当日の時刻を過ぎて起動した場合も実行し、実行日をvolumeに保存します。ログは `docker compose logs scheduler` で確認できます。GTFS realtime取得はAPI設定・実行頻度が路線ごとに異なるため自動実行には含めません。必要時は `unyohub get-gtfs-realtime` をtoolsで実行できます。

## バックアップ・復元

SQLiteと設定・アップロードファイルの整合性を保つため、書き込みを行うサービスを停止してから取得します。Tunnelも停止し、バックアップの間は公開を止めます。

```sh
docker compose --profile tunnel stop cloudflared web scheduler app
docker compose run --rm tools python3 /opt/unyohub/manage.py backup
docker compose --profile tunnel up -d
```

ローカル公開の場合は停止・再起動に `-f compose.yaml -f compose.local.yaml` を付け、`--profile tunnel` を外してください。アーカイブは `backups/` に保存されます。コンテナ内の実行ユーザー（UID 33）が保存するため、初回にこのディレクトリの所有者が変更されます。アーカイブにはユーザー情報が含まれ、権限は600です。ホストから読み出す場合は管理者権限を使ってください。

復元は全設定・路線データ・DBを置き換えます。事前に現在のバックアップを取得してください。

```sh
docker compose --profile tunnel stop cloudflared web scheduler app
docker compose run --rm tools python3 /opt/unyohub/manage.py restore unyohub-日時.tar.gz --replace
docker compose --profile tunnel up -d
```

## 更新

```sh
docker compose build --pull
docker compose --profile tunnel up -d
```

設定・データはvolumeに残ります。更新で設定項目やDB構造が変わる場合は、アプリの移行手順を適用してください。更新前にバックアップを取得します。

## 開発時の動作確認

テスト専用のComposeプロジェクトで次を実行すると、内部ファイルの保護、メールなし登録、CAPTCHA画像生成、ログインとメール切り替えを確認できます。テストユーザーを作成し、設定を一時的に変更するため、運用中のプロジェクトでは実行しないでください。固定subnetを使用するため、同じ構成の別プロジェクトのネットワークが存在する場合は、先にそのプロジェクトを `down` してください。

```sh
docker compose -p unyohub-test build
docker compose -p unyohub-test run --rm tools python3 /opt/unyohub/manage.py init test_admin
docker compose -p unyohub-test -f compose.yaml -f compose.local.yaml up -d --wait
docker compose -p unyohub-test run --rm tools python3 /opt/unyohub/test_smoke.py
docker compose -p unyohub-test -f compose.yaml -f compose.local.yaml down -v
```

最後の `down -v` はテスト用volumeのみを削除します。
