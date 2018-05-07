
const updateReady = worker => {
  console.log('update ready', worker);
};

const trackInstalling = worker => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  });
};

export default () => {
  if (!('serviceWorker' in navigator)) {
    console.info('SW is not supported');
    return;
  }

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      if (!navigator.serviceWorker.controller) {
        return;
      }

      if (registration.waiting) {
        return updateReady(registration.installing);
      }

      if (registration.installing) {
        return trackInstalling(registration.installing);
      }

      registration.addEventListener('updatefound', () => trackInstalling(registration.installing));
    }).catch(err => {
      console.error('Error during service worker registration:', err);
    });
};
