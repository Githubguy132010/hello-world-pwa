const notificationButton = document.getElementById('notifications-button');
const notificationStatus = document.getElementById('notification-status');

function updateStatus(message, isError = false) {
    notificationStatus.textContent = message;
    notificationStatus.className = `notification show ${isError ? 'error' : 'success'}`;
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
    }
}

async function subscribeUserToPush(registration) {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BJs3EQTABqcFQxRssu8vzsUgJujyIzQ3CgnUZWOFKaNHexESVJOLMD46JNlIZLxKQP13gFyHI9MCTdbzvDCyyts'
        });

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        updateStatus('Push notifications enabled successfully! You should receive a test notification soon.');
        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        throw error;
    }
}

async function initializePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        updateStatus('Push notifications are not supported by your browser', true);
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            updateStatus('Permission for notifications was denied', true);
            return;
        }

        const registration = await registerServiceWorker();
        await subscribeUserToPush(registration);
        notificationButton.textContent = 'Push Notifications Enabled';
        notificationButton.disabled = true;

    } catch (error) {
        updateStatus(`Error: ${error.message}`, true);
    }
}

notificationButton.addEventListener('click', initializePushNotifications);

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
