# Hello World PWA

This project is a simple "Hello World" Progressive Web App (PWA) with push notifications.

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/githubnext/workspace-blank.git
cd workspace-blank
```

2. Install dependencies:

```bash
npm install
```

3. Generate VAPID keys for push notifications:

```bash
npx web-push generate-vapid-keys
```

4. Replace `YOUR_PUBLIC_VAPID_KEY` and `YOUR_PRIVATE_VAPID_KEY` in `server/index.js` with the generated keys.

## Running the Project

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `public/`: Contains the front-end files (HTML, CSS, JavaScript, Service Worker).
- `server/`: Contains the back-end server code (Node.js, Express).

## Front-end

The front-end is a basic PWA with push notifications. It includes the following files:

- `index.html`: The main HTML file.
- `style.css`: Basic styling for the PWA.
- `app.js`: JavaScript code to register the service worker, request push notification permission, and handle incoming push notifications.
- `service-worker.js`: Service worker to handle caching, offline capabilities, and push notifications.

## Back-end

The back-end is a simple Node.js and Express server that sends push notifications to the front-end. It includes the following files:

- `index.js`: The main server file. It sets up the server, handles push notification subscriptions, and sends push notifications using the `web-push` library.

## License

This project is licensed under the MIT License.
