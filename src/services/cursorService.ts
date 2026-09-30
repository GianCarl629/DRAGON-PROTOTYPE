export type CursorPreference = 'dragon' | 'system';

export const CURSOR_STORAGE_KEY = 'cursorPreference';

/**
 * Get current saved cursor preference.
 * Defaults to 'dragon' on first visit.
 */
export const getCursorPreference = (): CursorPreference => {
  if (typeof window === 'undefined') return 'dragon';
  try {
    const saved = localStorage.getItem(CURSOR_STORAGE_KEY);
    if (saved === 'system') return 'system';
    return 'dragon';
  } catch {
    return 'dragon';
  }
};

/**
 * Apply cursor CSS class to <html> element
 */
export const applyCursorPreference = (pref: CursorPreference): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (pref === 'dragon') {
    root.classList.add('cursor-dragon');
  } else {
    root.classList.remove('cursor-dragon');
    root.classList.remove('cursor-active');
  }
};

/**
 * Save user preference to localStorage and apply immediately
 */
export const setCursorPreference = (pref: CursorPreference): void => {
  try {
    localStorage.setItem(CURSOR_STORAGE_KEY, pref);
  } catch (e) {
    console.error('Failed to save cursor preference', e);
  }
  applyCursorPreference(pref);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cursorPreferenceChanged', { detail: pref }));
  }
};

/**
 * Initialize cursor listeners for click state (mousedown / mouseup / blur)
 */
export const initCursorSystem = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  // Apply preference on startup
  const initialPref = getCursorPreference();
  applyCursorPreference(initialPref);

  const handleMouseDown = () => {
    if (getCursorPreference() === 'dragon') {
      document.documentElement.classList.add('cursor-active');
    }
  };

  const handleMouseUp = () => {
    document.documentElement.classList.remove('cursor-active');
  };

  window.addEventListener('mousedown', handleMouseDown, { passive: true });
  window.addEventListener('mouseup', handleMouseUp, { passive: true });
  window.addEventListener('blur', handleMouseUp, { passive: true });

  return () => {
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('blur', handleMouseUp);
  };
};
