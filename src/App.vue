<script setup>
import HelloWorld from './components/HelloWorld.vue'
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
    <h1>Hello World PWA</h1>
    <p v-if="message" class="message" :class="{ error: message.startsWith('Error') || message.startsWith('Failed') }">
      {{ message }}
    </p>
    
    <button @click="sendTestNotification" class="send-button">
      Send Test Notification
    </button>

    <div class="notifications">
      <h2>Notifications</h2>
      <div v-if="notifications.length === 0" class="no-notifications">
        No notifications received yet
      </div>
      <ul v-else>
        <li v-for="(notification, index) in notifications" :key="index">
          <h3>{{ notification.title }}</h3>
          <p>{{ notification.body }}</p>
        </li>
      </ul>
    </div>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.message {
  background-color: #42b983;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.message.error {
  background-color: #e74c3c;
}

.send-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.send-button:hover {
  background-color: #2980b9;
}

.notifications {
  margin-top: 20px;
}

.no-notifications {
  color: #666;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f8f9fa;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}
</style>
