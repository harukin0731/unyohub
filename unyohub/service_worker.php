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

var new_cache_name = "<?php print UNYOHUB_APP_ID."_v".UNYOHUB_VERSION."_".$manifest_modified."_sw2"; ?>";

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(new_cache_name).then(function (cache) {
            return Promise.all(files_to_cache.map(async function (url) {
                var response = await fetch(new Request(url, {cache: "no-store"}));
                if (!response.ok || response.redirected) {
                    throw new Error("Failed to precache " + url);
                }
                if (url === "/") {
                    var html = await response.clone().text();
                    if (!html.includes('const UNYOHUB_VERSION = "<?php print UNYOHUB_VERSION; ?>";')) {
                        throw new Error("HTML release does not match service worker");
                    }
                }
                return [url, response];
            })).then(function (entries) {
                return Promise.all(entries.map(function (entry) {
                    return cache.put(entry[0], entry[1]);
                }));
            });
        })
    );
});

self.addEventListener("message", function (evt) {
    if (evt.data && evt.data.type === "SKIP_WAITING") {
        evt.waitUntil(self.skipWaiting());
    } else if (evt.data && evt.data.type === "GET_VERSION" && evt.ports[0]) {
        evt.ports[0].postMessage("<?php print UNYOHUB_VERSION; ?>");
    }
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.method !== "GET" || new URL(evt.request.url).origin !== self.location.origin) {
        return;
    }
    evt.respondWith(caches.open(new_cache_name).then(async function (cache) {
        if (evt.request.mode === "navigate") {
            try {
                var response = await fetch(new Request(evt.request, {cache: "no-store"}));
                if (response.ok) return response;
                var fallback = await cache.match("/");
                return fallback || response;
            } catch (error) {
                var fallback = await cache.match("/");
                if (fallback) return fallback;
                throw error;
            }
        }
        return (await cache.match(evt.request)) || fetch(evt.request);
    }));
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(function (cache_names) {
            return Promise.all(cache_names.map(function (cache_name) {
                if (cache_name.startsWith("<?php print UNYOHUB_APP_ID; ?>_v") && cache_name !== new_cache_name) {
                    return caches.delete(cache_name);
                }
            }));
        }).then(function () { return self.clients.claim(); })
    );
});
