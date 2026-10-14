# iOS PWA更新後の旧版再表示の調査

調査日: 2026-10-15。対象: 現在のリポジトリ実装。利用者からは「iOSの特定バージョンに限定されず、アプリ内の『再起動して更新』後にも発生」との情報あり。

## 結論と確度

最有力は、画面の再取得だけで更新完了としており、Service Workerの更新・切り替えを保証していないこと。旧Workerが引き続きページを制御する状態では、更新用URLでは新版が表示され、通常URLでは旧版が再表示される経路が存在する。

生成済みService Workerの実コードをNodeの隔離環境で実行し、この応答選択を確認した。Cache APIとネットワーク応答、Workerのイベントはモック。実際のブラウザーの更新ライフサイクルやiOS端末での再現確認は未実施。そのため、報告された全事例の原因を確定したものではない。

## コード上の根拠

- `unyohub/on_demand_funcs.js:3922` の `reload_app(true)` は、`/?ts=現在時刻` にURLを変更し、100ms後に `location.reload()` するだけ。registration.update、waiting Workerへの切り替え要求、controllerchangeの待機はない。
- `unyohub/service_worker.php:14` は通常の `/` を事前キャッシュする。クエリー付きURLは別のキーなので、更新ボタンのURLはそのキャッシュに一致せず、ネットワークへ進む。
- `unyohub/service_worker.php:43` は `caches.match(evt.request)` でキャッシュ全体を探索する。自分のバージョンのキャッシュに限定していない。旧・新キャッシュ共存時は、先に作られた旧キャッシュの `/` が選ばれ得る。
- 同ファイルの旧キャッシュ削除はactivate時のみ。新Workerのinstallが成功しても、既存Workerがページを制御している間は通常waitingとなる。単なる再読み込みでは切り替えを保証できない。
- `unyohub/main.js:5734` はregisterのみで、更新状態の検知・切り替え完了の確認をしない。
- `unyohub/index.php:231` がHTML内に版番号を埋め込む。旧HTMLを再表示すると、表示上の版番号も旧版になり、そのHTMLが指定する旧JS/CSSを読み込む。
- `unyohub/main.js:156` はHTML側の版番号が保存設定と異なると設定の版番号を書き換える。旧HTMLが取得された場合に旧番号へ戻る副作用であり、旧HTMLを取得する原因ではない。

## 症状を説明する流れ

1. 旧版のWorkerと `/` のキャッシュがある。
2. サーバーを新版に更新する。
3. 新Workerがwaiting、未インストール、またはinstall失敗の状態で更新ボタンを押す。
4. `/?ts=...` は旧キャッシュにないためネットワークから新版HTMLを表示できる。これだけではWorker更新は完了していない。
5. その後、旧Workerが有効なまま通常の `/` を開くと、旧HTML・旧版番号・旧版資産が返る。

ホーム画面PWAがバックグラウンドに移ったことと、制御中の全クライアントが終了したことは区別して確認する必要がある。新版Workerがactivateを正常に完了し、旧キャッシュも削除済みであるなら、この経路だけでは旧版への復帰を説明できない。その場合はHTTPキャッシュ、配信元の版の不一致、新キャッシュの中に保存された旧HTMLなどを次に調べる。

## 隔離検証の結果

修正前（コミット `706f767`）の生成済みWorkerを読み込み、旧版応答を保存したキャッシュと新版応答を保存したキャッシュを共存させた。

```text
update /?ts=... -> new, subsequent / -> old
Even new fetch handler matches old cache while both caches coexist.
After activation removes old cache: / -> new.
```

新fetchハンドラーでも旧キャッシュに一致するという結果は、全キャッシュ探索の性質を示すもの。実際に新Workerのfetchイベントがactivateより前に発生するという意味ではない。

調査用の再現スクリプトはリポジトリから削除した。修正後のWorkerには `tests/pwa-update.cjs` の回帰テストを使用する。

現行オリジンの事前キャッシュ対象13件はすべてHTTP 200だった。現在の配信で恒常的な欠損ファイルがあることは確認されなかった。更新時の一時的な失敗や、実際の公開経路でのAccess認証・CDNの影響までは除外できない。

## 関連する問題

- 「設定・キャッシュデータの削除」はlocalStorageとIndexedDBのみを消し、Service WorkerとCache Storageを消さない。この症状への解消手段としては不十分。
- cache.addAllが1件でも取得に失敗すると新Workerのinstallは失敗し得る。更新ボタンはその成否を確認せず新版画面を表示できてしまう。
- 現行オリジンの `/` と `/service_worker.php` に明示的なCache-Controlはない。ただしHTTPキャッシュの使用と、プログラムがCache Storageに保存する処理は別で、ヘッダー変更だけで後者は解消しない。
- キャッシュ削除が自アプリの接頭辞に限定されておらず、同じオリジンの別アプリのキャッシュも削除し得る。
- 版番号は文字列比較で、版番号を上げずに資産を更新するとWorkerの生成内容とキャッシュキーが変わらない場合がある。資産の更新とリリース識別子を一致させる必要がある。

## 修正の方向

1. 更新ボタンでregistration.updateを実行し、新Workerのinstall完了を待つ。waitingがあれば更新操作に応じてskipWaitingを要求する。
2. Workerのactivateでclients.claimを使う設計を検討し、ページはcontrollerchangeで切り替え完了後に再読み込みする。失敗・タイムアウトを表示し、成功していない更新を成功扱いしない。無条件の即時切り替えは、開いている旧版ページとの資産混在を招くため避ける。
3. fetchのキャッシュ探索を自バージョンに限定する。HTMLナビゲーションはネットワーク優先＋オフライン時の自バージョンfallbackを検討する。
4. 事前キャッシュのHTMLとJS/CSSが同じリリースであることを検証する。手動コピーの途中でinstallが走る場合や、旧版ページが別のWorkerに制御される場合も考慮し、skipWaiting追加だけで完了としない。
5. WorkerスクリプトとHTMLのHTTPキャッシュ方針を明示し、Cache Storageのクリア手段をデータキャッシュと区別して整える。

## 実端末で確定するための観測

旧版表示時に、ページのUNYOHUB_VERSION、registration.active/waiting/installingの状態、各キャッシュの `/` に埋め込まれたUNYOHUB_VERSION、ネットワークで取得したHTMLの版を同時に記録する。加えてcontrollerchangeの発生有無とinstall失敗を記録する。WorkerのURLは全版で同じなので、scriptURLだけでは版を区別できない。Worker自身の版を返すメッセージがあると診断しやすい。

## 参照

- [W3C Service Workerのライフサイクル説明](https://github.com/w3c/ServiceWorker/blob/main/explainer.md)
- [Service Worker仕様: CacheStorage.match](https://w3c.github.io/ServiceWorker/#cache-storage-match)
- [WebKit過去報告: iOSホーム画面PWAで旧資産が残る](https://bugs.webkit.org/show_bug.cgi?id=199110)

WebKitの報告は2019年の事例であり、現行iOS全般の不具合を証明する資料としては扱わない。現段階ではアプリ側の更新処理を優先して調べる。

## 試験修正

試験版 `26.09-1-pwa.1` を作成した。版番号を変えることで旧Workerの資産URLと区別し、既存利用者の更新ボタンにも新版を知らせる。レビュー後の修正（ナビゲーションfallbackの限定など）は `26.09-1-pwa.2` とし、`pwa.1` を導入済みの端末にも更新を知らせる。読み込み時のWorker同期を加えた版を `26.09-1-pwa.3` とした。

更新ボタンはインストール成功・controllerchange・Workerの版番号を確認した後に再読み込みする。加えて、ページ読み込み時に制御中Workerの版を表示HTMLの版と比較し、不一致（版番号に応答しない26.09-1以前のWorkerを含む）なら同じ版のWorkerのinstall・切り替えを待つ。ネットワーク優先のナビゲーションで画面だけ新版になり、旧Workerが制御を続けてオフライン時に旧HTMLを返す状態を防ぐ。旧版ボタンが生成する `?ts=` 経由の場合もこの処理で移行する。期待する版は、読み込み時は表示HTMLの版、更新ボタンではサーバーから取得した版とし、localStorageに残った古いinstance_infoの影響を受けない。タイムアウト・失敗時は完了扱いにしない。

Workerはオンラインナビゲーションをネットワーク優先にし、オフライン時は自キャッシュのHTMLへ戻す。通信に成功した応答（リダイレクト・エラーを含む）はそのまま返し、キャッシュのHTMLへ置き換えない。HTML（`index.php`）には `Cache-Control: no-cache` を明示し、以後の応答が再検証なしで使われないようにした。変更前の応答には有効期限・Last-Modified・ETagがなく、主要ブラウザーの実装上は新鮮と扱われる旧エントリーは残らないと考えるが、仕様上はheuristic freshnessを完全には否定できない。事前取得したHTMLの版を確認し、別版HTMLや認証リダイレクトを事前キャッシュに保存しない。資産探索と古いキャッシュ削除は自アプリに限定する。

隔離テストで、別版HTMLのinstall拒否、旧キャッシュへのfallback防止、オフライン起動、別アプリキャッシュの保持、切り替え完了後の再読み込み、失敗時に再読み込みしないこと、読み込み時に旧Workerを表示版へ切り替えることを確認した。iOS実機では `pwa.1` から `pwa.2` への移行（更新ボタンを介さずネットワーク優先で新版表示）を確認済み。`pwa.3` での機内モード起動は未確認。

テスト例:

```sh
(cd unyohub && php service_worker.php) > /tmp/unyohub-service-worker.js
node tests/pwa-update.cjs /tmp/unyohub-service-worker.js
```
