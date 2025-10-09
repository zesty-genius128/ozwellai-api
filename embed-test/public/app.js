/**
 * app.js - State management for Ozwell embed demo using iframe-sync
 *
 * This file uses the iframe-sync library to synchronize state between
 * the parent page and the chat widget iframe.
 */

(function() {
  'use strict';

  console.log('[app.js] Initializing Ozwell state management with iframe-sync...');

  function initializeApp() {
    // Check if IframeSyncBroker is available
    if (typeof IframeSyncBroker === 'undefined') {
      console.error('[app.js] IframeSyncBroker not loaded! Make sure iframe-sync.js is loaded before app.js');
      return;
    }

    console.log('[app.js] IframeSyncBroker available, initializing...');

    // Get form elements
    const nameInput = document.getElementById('input-name');
    const addressInput = document.getElementById('input-address');
    const zipInput = document.getElementById('input-zip');

    if (!nameInput || !addressInput || !zipInput) {
      console.error('[app.js] Form elements not found');
      return;
    }

    // Initialize IframeSyncBroker
    const broker = new IframeSyncBroker();
    broker.setDebugMode(true); // Enable console logging

    console.log('[app.js] IframeSyncBroker initialized');

    // Expose a method to update state from parent page
    // iframe-sync is designed for iframe->broker->iframe communication
    // We need parent->broker->iframe, so we simulate an iframe message
    window.updateBrokerState = function(update) {
      // Simulate a postMessage from a fake iframe
      const fakeEvent = {
        data: {
          channel: 'IframeSync',  // Must match iframe-sync library channel name
          type: 'stateChange',
          sourceClientName: 'parent-page',
          payload: update
        },
        source: window // Use window as fake iframe source
      };

      // Trigger broker's message handler
      window.postMessage(fakeEvent.data, '*');
    };

    // Function to get current form state
    function getFormState() {
      return {
        formData: {
          name: nameInput.value,
          address: addressInput.value,
          zipCode: zipInput.value
        }
      };
    }

    // Function to update dashboard cards
    function updateDashboard() {
      document.getElementById('dashboard-name').textContent = nameInput.value;
      document.getElementById('dashboard-address').textContent = addressInput.value;
      document.getElementById('dashboard-zip').textContent = zipInput.value;
    }

    // Function to update state when form changes
    function updateFormState() {
      const state = getFormState();
      console.log('[app.js] Updating broker state:', state);
      updateDashboard();
      window.updateBrokerState(state);
    }

    // Set initial state
    updateFormState();

    // Add input event listeners
    nameInput.addEventListener('input', function() {
      console.log('[app.js] Name input changed:', nameInput.value);
      updateFormState();
    });

    addressInput.addEventListener('input', function() {
      console.log('[app.js] Address input changed:', addressInput.value);
      updateFormState();
    });

    zipInput.addEventListener('input', function() {
      console.log('[app.js] Zip code input changed:', zipInput.value);
      updateFormState();
    });

    // Handle form submission
    const userForm = document.getElementById('user-form');
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('[app.js] Form submitted');
      updateFormState();
    });

    console.log('[app.js] Event listeners attached to form inputs');
    console.log('[app.js] Initialization complete! IframeSyncBroker is managing state.');
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
