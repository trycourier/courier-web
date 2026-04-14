// Jest's jsdom environment does not provide fetch; courier-js uses it for HTTP.
import 'cross-fetch/polyfill';

// Simple polyfill for matchMedia
global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
