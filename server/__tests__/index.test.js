const request = require('supertest');
const express = require('express');
const app = require('../index');

describe('Server', () => {
  test('GET / serves static files', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });

  test('POST /subscribe endpoint', async () => {
    const mockSubscription = {
      endpoint: 'https://test.com',
      keys: {
        p256dh: 'test-key',
        auth: 'test-auth'
      }
    };

    const response = await request(app)
      .post('/subscribe')
      .send(mockSubscription)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(201);
  });
});