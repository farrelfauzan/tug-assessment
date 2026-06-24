'use client';

export function showToast(message: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.alert(message);
}
