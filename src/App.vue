<script setup>
import { ref, onMounted } from 'vue';

const notifications = ref([]);
const message = ref('');
const registration = ref(null);

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

onMounted(async () => {
  try {
    if ('serviceWorker' in navigator) {
      registration.value = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await subscribeToNotifications();
        }
      }
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
});

async function subscribeToNotifications() {
  try {
    const publicVapidKey = 'BA62ui-8Wa_yRGElUVPH6rECuxERwNO3WBIRyyzffutW0ETsowCFU9RfW2HnyM70oWzB_RVh6cP3cMnUUuw8ajw';
    
    const subscription = await registration.value.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    console.log('Push Subscription:', subscription);

    await fetch('http://localhost:3000/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    message.value = 'Subscribed to push notifications';
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    message.value = `Failed to subscribe: ${error.message}`;
  }
}

async function sendTestNotification() {
  try {
    const response = await fetch('http://localhost:3000/notify', {
      method: 'POST',
    });
    if (response.ok) {
      message.value = 'Test notification sent';
    } else {
      const error = await response.json();
      throw new Error(error.details || 'Failed to send notification');
    }
  } catch (error) {
    console.error('Failed to send test notification:', error);
    message.value = `Error: ${error.message}`;
  }
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const notification = event.data ? event.data : { title: 'New Notification', body: 'No content' };
    notifications.value.unshift(notification);
  });
}
</script>

<template>
  <div class="container">
    <div class="app-header">
      <h1>Notification Center</h1>
    </div>

    <transition name="fade">
      <p v-if="message" class="message" :class="{ error: message.startsWith('Error') || message.startsWith('Failed') }">
        {{ message }}
      </p>
    </transition>
    
    <button @click="sendTestNotification" class="send-button">
      <span class="button-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
        Send Test Notification
      </span>
    </button>

    <div class="notifications">
      <transition-group name="list" tag="ul">
        <li v-for="(notification, index) in notifications" :key="index" class="notification-item">
          <div class="notification-content">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.body }}</p>
          </div>
        </li>
      </transition-group>
      <div v-if="notifications.length === 0" class="no-notifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <p>No notifications yet</p>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --error-color: #ef4444;
  --success-color: #10b981;
  --background-color: #f8fafc;
  --text-color: #1e293b;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.app-header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.message {
  background-color: var(--success-color);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}

.message.error {
  background-color: var(--error-color);
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 300px;
  margin: 1rem auto;
  display: block;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.send-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.notifications {
  margin-top: 2rem;
}

.no-notifications {
  text-align: center;
  color: #94a3b8;
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

.notification-item {
  background-color: white;
  padding: 1.25rem;
  margin: 1rem 0;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.notification-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-weight: 600;
}

.notification-content p {
  margin: 0;
  color: #64748b;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 640px) {
  .container {
    margin: 1rem auto;
    padding: 0 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
