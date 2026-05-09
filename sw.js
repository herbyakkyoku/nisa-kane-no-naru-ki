// sw.js - みんなのNISA Service Worker
// GitHub Pages対応版（サブパス: /nisa-kane-no-naru-ki/）

const CACHE_NAME = 'minna-no-nisa-v1';
const BASE_PATH  = '/nisa-kane-no-naru-ki';

// ===== インストール =====
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    // キャッシュは使わずすぐ起動
    self.skipWaiting();
});

// ===== アクティベート =====
self.addEventListener('activate', (event) => {
    console.log('[SW] Activated');
    // 古いキャッシュを全削除
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

// ===== フェッチ：外部リソースはすべてネットワーク直通 =====
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 外部APIは常にネットワーク（キャッシュしない）
    const isExternal =
        url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis') ||
        url.hostname.includes('gstatic')   ||
        url.hostname.includes('jsdelivr')  ||
        url.hostname.includes('twitter');

    if (isExternal) {
        // そのままネットワークへ
        return;
    }

    // 自ドメインの静的ファイル：ネットワーク優先
    event.respondWith(
        fetch(event.request).catch(() => {
            // オフライン時だけキャッシュから返す
            return caches.match(event.request);
        })
    );
});

// ===== 通知クリック =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                for (const client of clientList) {
                    if ('focus' in client) return client.focus();
                }
                return clients.openWindow(BASE_PATH + '/');
            })
    );
});