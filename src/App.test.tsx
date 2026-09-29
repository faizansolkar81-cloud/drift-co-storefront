import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';

const storage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => { storage.set(key, value); },
  removeItem: (key: string) => { storage.delete(key); },
  clear: () => { storage.clear(); },
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

afterEach(() => {
  cleanup();
  storage.clear();
});

describe('storefront app', () => {
  it('renders the home page shell', () => {
    window.location.hash = '#/';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Discover Your Style' })).toBeTruthy();
  });
});
