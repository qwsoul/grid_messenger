// public/sw.js — Системный Service Worker мессенджера GRID
self.addEventListener('install', (event) => {
  // Принудительно активируем воркер сразу после установки
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Слушаем фоновые пуш-сигналы от бэкенда, когда GRID полностью закрыт [1.2]
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    // Бэкенд присылает нам JSON с заголовком и текстом пуша
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Новое сообщение в сети',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.chat_id || 'grid-push',
      renotify: true,
      data: {
        chat_id: data.chat_id
      }
    };

    event.waitUntil(
      self.reflection.showNotification(data.title || 'GRID Messenger', options)
    );
  } catch (err) {
    // Если бэкенд прислал обычный текст вместо JSON, выводим как есть
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('GRID Messenger', {
        body: text,
        icon: '/favicon.ico'
      })
    );
  }
});

// Слушаем клик по вылетевшему пуш-баннеру на экране телефона
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Автоматически открываем GRID или разворачиваем уже открытую вкладку
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(location.host) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
