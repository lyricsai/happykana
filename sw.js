
let cacheName = "happy-kana";
let filesToCache = ["/", "./index.html", "./style.css", "./script.js", "./kana.js"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (event) => {
    console.log("Service Worker : Installed!");

    event.waitUntil(

        (async () => {
            try {
                cache_obj = await caches.open(cacheName);
                cache_obj.addAll(filesToCache);
            }
            catch(err) {
                console.log("error occured while caching...", err);
            }
        })()
    );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});