import dotenv from 'dotenv';
import path from 'path';
import '@jest/globals';
import fetchMock from 'jest-fetch-mock';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.test')
});

console.log('🔑 Environment variables:');
console.log(JSON.stringify({
  USER_ID: process.env.USER_ID,
  PUBLIC_API_KEY: process.env.PUBLIC_API_KEY,
  JWT: process.env.JWT,
  TENANT_ID: process.env.TENANT_ID
}, null, 2));

// Polyfill fetch for Jest but don't mock it.
fetchMock.enableMocks();
fetchMock.dontMock();
