# Hello World PWA

A Progressive Web Application built with Vue.js and Express, featuring push notifications.

## Features

- Vue 3 with Composition API
- Service Worker for offline functionality
- Push Notifications support
- Express.js backend server
- PWA-ready with manifest and icons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a .env file in the root directory with your VAPID keys (already done in this project):
```
PUBLIC_VAPID_KEY=your_public_key
PRIVATE_VAPID_KEY=your_private_key
```

## Development

1. Start the backend server:
```bash
node server.js
```

2. In a new terminal, start the Vue.js development server:
```bash
npm run dev
```

3. Open the application in your browser at `http://localhost:5173`

## Usage

1. When you first open the application, it will request notification permissions
2. Click the "Send Test Notification" button to trigger a push notification
3. Received notifications will be displayed in the notifications list
4. The application works offline once it has been loaded

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to a web server.
