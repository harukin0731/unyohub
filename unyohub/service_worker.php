<?php
include "./version.php";

define("UNYOHUB_APP_ID", "unyohub");
define("MANIFEST_PATH", "config/app_manifest.json");

header("Content-Type: text/javascript");
header("Cache-Control: no-store");

$manifest_modified = date("YmdHis", filemtime(MANIFEST_PATH));
$app_manifest = json_decode(file_get_contents(MANIFEST_PATH), TRUE);

?>
var files_to_cache = [
    "/",
    "/main.js?v=<?php print UNYOHUB_VERSION; ?>",
    "/assets.css?v=<?php print UNYOHUB_VERSION; ?>",
    "/on_demand_funcs.js?v=<?php print UNYOHUB_VERSION; ?>",
    "/non_critical.css?v=<?php print UNYOHUB_VERSION; ?>",
    "/libs/zizai_captcha/captcha.js",
    "/libs/elem2img.js",
<?php
foreach ($app_manifest["icons"] as $icon_info) {
    print "    \"/".$icon_info["src"]."\",\n";
}
?>
    "/favicon.ico",
    "/splash_screen_image.webp",
    "/manifest.php?mod=<?php print $manifest_modified; ?>"
];

var new_cache_name = "<?php print UNYOHUB_APP_ID."_v".UNYOHUB_VERSION."_".$manifest_modified; ?>";

self.addEventListener("install", function (evt) {
    evt.waitUntil((async function () {
        // 全ファイルの取得・検証が済んでから保存し、別版のHTMLや認証リダイレクトをキャッシュしない
        var responses = await Promise.all(files_to_cache.map(async function (url) {
            var response = await fetch(url, {cache: "no-store"});
            if (!response.ok || response.redirected) {
                throw new Error("Failed to precache " + url);
            }
            // index.php が埋め込む版番号と一致するか確認する
            if (url === "/" && !(await response.clone().text()).includes('const UNYOHUB_VERSION = "<?php print UNYOHUB_VERSION; ?>";')) {
                throw new Error("HTML release does not match service worker");
            }
            return response;
        }));
        
        var cache = await caches.open(new_cache_name);
        await Promise.all(files_to_cache.map(function (url, i) {
            return cache.put(url, responses[i]);
        }));
    })());
});

self.addEventListener("message", function (evt) {
    if (!evt.data) {
        return;
    }
    
    if (evt.data.type === "SKIP_WAITING") {
        evt.waitUntil(self.skipWaiting());
    } else if (evt.data.type === "GET_VERSION" && evt.ports[0]) {
        evt.ports[0].postMessage("<?php print UNYOHUB_VERSION; ?>");
    }
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.method !== "GET" || new URL(evt.request.url).origin !== self.location.origin) {
        return;
    }
    
    evt.respondWith((async function () {
        var cache = await caches.open(new_cache_name);
        
        // 自版のキャッシュのみを参照し、旧版のキャッシュに残ったファイルを返さない
        var cached_response = await cache.match(evt.request);
        if (cached_response) {
            return cached_response;
        }
        
        try {
            return await fetch(evt.request);
        } catch (error) {
            // キャッシュにない画面もオフライン時は自版のHTMLで起動する
            var fallback = evt.request.mode === "navigate" ? await cache.match("/") : undefined;
            if (fallback) {
                return fallback;
            }
            throw error;
        }
    })());
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(function (cache_names) {
            return Promise.all(cache_names.map(function (cache_name) {
                if (cache_name.startsWith("<?php print UNYOHUB_APP_ID; ?>_v") && cache_name !== new_cache_name) {
                    return caches.delete(cache_name);
                }
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});
