// Service Worker本体 (sw.js)

// インストール時（キャッシュの設定など）
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    self.skipWaiting();
});

// アクティブ時
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

// 通知クリック時の挙動
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // 通知をクリックしたらアプリを開く
    );
});
