// register-service-worker.js
export default function registerServiceWorker(route) {
  console.log(
    '🚀 ~ file: register-service-worker.js:3 ~ registerServiceWorker ~ route:',
    route
  )
  if ('serviceWorker' in navigator && route.params && route.params.id) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/pages/sw.js', { scope: '/:id' })
        .then((reg) => {
          console.log('Service worker registered.', reg)
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err)
        })
    })
  }
}
