import express from 'express';
import webPush from 'web-push';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
);

const subscriptions = new Map();

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('New subscription received:', subscription);
  subscriptions.set(JSON.stringify(subscription), subscription);
  console.log('Total subscriptions:', subscriptions.size);
  res.status(201).json({});
});

app.post('/notify', async (req, res) => {
  try {
    console.log('Sending notifications to', subscriptions.size, 'subscribers');
    const payload = JSON.stringify({ title: 'Hello World', body: 'This is a push notification!' });
    const promises = Array.from(subscriptions.values()).map(subscription => 
      webPush.sendNotification(subscription, payload)
        .catch(error => {
          console.error('Error sending to a subscription:', error);
          if (error.statusCode === 410) {
            // Subscription has expired or is invalid
            subscriptions.delete(JSON.stringify(subscription));
          }
          throw error;
        })
    );
    
    await Promise.all(promises);
    console.log('Notifications sent successfully');
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});