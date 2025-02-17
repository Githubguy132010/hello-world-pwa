if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

function requestNotificationPermission() {
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });
}

function handleIncomingPushNotification(event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
}

navigator.serviceWorker.addEventListener('message', handleIncomingPushNotification);

requestNotificationPermission();
