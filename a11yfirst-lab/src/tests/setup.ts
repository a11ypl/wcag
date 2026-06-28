import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
}

if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
}

window.requestAnimationFrame = window.requestAnimationFrame ?? ((callback) => window.setTimeout(callback, 0));

Object.defineProperty(window.URL, 'createObjectURL', {
  configurable: true,
  value: vi.fn(() => 'blob:a11yfirst-lab-test')
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  configurable: true,
  value: vi.fn()
});
