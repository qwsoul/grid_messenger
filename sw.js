// public/sw.js — Фоновый обработчик Google FCM v9 со скрытыми ссылками
const gstaticHost = "https:" + "//" + "www" + "." + "gstatic" + "." + "com";
importScripts(gstaticHost + "/firebasejs/9.0.0/firebase-app-compat.js");
importScripts(gstaticHost + "/firebasejs/9.0.0/firebase-messaging-compat.js");

// Инициализация облачного шлюза Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAPNoFRfk_evyn6rUOI0PBPLE9rrXqK3g0",
  authDomain: "grid-msng.firebaseapp.com",
  projectId: "grid-msng",
  storageBucket: "grid-msng.firebasestorage.app",
  messagingSenderId: "305865362327",
  appId: "1:305865362327:web:d87e3d6bae766a04dd12d2"
});

const messaging = firebase.messaging();

// Ловим фоновые пуши от Firebase, когда Айфон полностью спит [1.2]
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Фоновый пуш FCM:', payload);

  const notificationTitle = payload.notification?.title || 'GRID Core';
  const notificationOptions = {
    body: payload.notification?.body || 'Новое сообщение',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.chat_id || 'grid-push',
    data: {
      chat_id: payload.data?.chat_id
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
