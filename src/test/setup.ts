import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  window.location.hash = '';
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
