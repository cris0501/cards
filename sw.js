const staticCache = "APP_SHELL_v1";
const dynamicCache = "Dynamic_v1";

self.addEventListener('install', e => {
    const installShell = caches.open(staticCache)
        .then( cache => {
            return cache.addAll([
                '/',
                'index.html',
                'img/astronauta.webp',
                'css/app.c22f0e7f',
                'ccs/home.9c9334fe.css',
                'js/app.a88add4b.js',
                'js/chunk-vendors.a43fb1c6.js',
                'js/home.9442b756.js',
                'js/info.2de258ad.js',
            ]);
        });
    caches.open(dynamicCache);
    e.waitUntil(installShell);
});

self.addEventListener('activate', () => {
});

self.addEventListener('fetch', (e) => {
    if (e.request.url.startsWith('chrome-extension') || e.request.url.includes('extension') ) return;

    let resp = null;
    if (/\.(jpg|png|jpeg)$/i.test(e.request.url)){
        resp = caches.match( e.request )
            .then( resp1 => {
                return resp1 || fetch( e.request ).then( resp2 => {
                        caches.open( dynamicCache )
                          .then( cache => {
                            cache.put( e.request, resp2 );
                          });
                        return resp2.clone();
                }).catch(() => {
                    return caches.match( 'img/astronauta.webp' );
                });
            }).catch(() => {
                return caches.match( 'img/astronauta.webp' );
            });
    }
    else {
        resp = fetch( e.request ).then( resp1 => {
            if (resp1.ok) return resp1;
            return caches.match( e.request );
        });
    }
    e.respondWith(resp);
});
