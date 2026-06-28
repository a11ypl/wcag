export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null);
}

export function focusElement(element: HTMLElement | null): void {
  window.requestAnimationFrame(() => {
    element?.focus();
  });
}
