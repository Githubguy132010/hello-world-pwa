const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const publicVapidKey = 'BJs3EQTABqcFQxRssu8vzsUgJujyIzQ3CgnUZWOFKaNHexESVJOLMD46JNlIZLxKQP13gFyHI9MCTdbzvDCyyts';
const privateVapidKey = 'ZYgLByAxOrdtxPxo77Xw4xNAIc77BcNMsITQMEMc9M8';

webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Hello World', body: 'This is a push notification from the server.' });

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
