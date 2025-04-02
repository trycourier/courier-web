import dotenv from 'dotenv';
import path from 'path';
import '@jest/globals';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env.test')
});

console.log('🔑 Environment variables:');
console.log(JSON.stringify({
  USER_ID: process.env.USER_ID,
  JWT: process.env.JWT,
  CLIENT_KEY: process.env.CLIENT_KEY,
  TENANT_ID: process.env.TENANT_ID
}, null, 2));
