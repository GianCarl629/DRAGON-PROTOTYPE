/**
 * Dragon Treasure Reusable Cursor System
 * Persists and applies visitor cursor preferences across customer pages.
 */
(function () {
  if (typeof window === 'undefined') return;

  var STORAGE_KEY = 'cursorPreference';

  function getPreference() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'system') return 'system';
      return 'dragon'; // Default to dragon on first visit
    } catch (e) {
      return 'dragon';
    }
  }

  function applyPreference(pref) {
    if (pref === 'dragon') {
      document.documentElement.classList.add('cursor-dragon');
    } else {
      document.documentElement.classList.remove('cursor-dragon');
      document.documentElement.classList.remove('cursor-active');
    }
  }

  // Apply immediately to prevent any cursor flicker on initial load
  var pref = getPreference();
  applyPreference(pref);

  // Click state listeners
  window.addEventListener('mousedown', function () {
    if (getPreference() === 'dragon') {
      document.documentElement.classList.add('cursor-active');
    }
  }, { passive: true });

  window.addEventListener('mouseup', function () {
    document.documentElement.classList.remove('cursor-active');
  }, { passive: true });

  window.addEventListener('blur', function () {
    document.documentElement.classList.remove('cursor-active');
  }, { passive: true });

  // Expose global controller
  window.DragonCursor = {
    get: getPreference,
    set: function (newPref) {
      try {
        localStorage.setItem(STORAGE_KEY, newPref);
      } catch (e) {}
      applyPreference(newPref);
      window.dispatchEvent(new CustomEvent('cursorPreferenceChanged', { detail: newPref }));
    }
  };
})();
