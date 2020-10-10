const VueGeolocation = {
  install (Vue) {
    // define the main instance function
    Vue.prototype.$getLocation = VueGeolocation.getLocation
    Vue.prototype.$watchLocation = VueGeolocation.watchLocation
    Vue.prototype.$clearLocationWatch = VueGeolocation.clearLocation
    Vue.prototype.$locationErrors = {
      UNKNOWN_ERROR: 0,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMED_OUT: 3,
      NO_BROWSER_SUPPORT: 10,
      NO_WATCH_ID: 11,
    }
  },
  getLocation (options = {}, forceReject = false) {
    return new Promise((resolve, reject) => {
      if(forceReject) {
        reject({code: 0, message: 'reject forced for testing purposes'})
        return
      }
      if (!VueGeolocation._isAvailable()) {
        reject({code: 10, message: 'no browser support'})
      } else {
        window.navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            reject(error)
          },
          options
        )
      }
    })
  },
  watchLocation (options = {}, forceReject = false) {
    return new Promise((resolve, reject) => {
      if(forceReject) {
        reject({code: 0, message: 'reject forced for testing purposes'})
        return
      }
      if (!VueGeolocation._isAvailable()) {
        reject({code: 10, message: 'no browser support'})
      } else {
        window.navigator.geolocation.watchPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            })
          },
          (error) => {
            reject(error)
          },
          options
        )
      }
    })
  },
  clearLocation (watchID) {
    return new Promise((resolve, reject) => {
      if (!VueGeolocation._isAvailable()) {
        reject({code: 10, message: 'no browser support'})
      }
      else if (!watchID) {
        reject({code: 11, message: 'no watchID'})
      } else {
        resolve(window.navigator.geolocation.clearWatch(watchID))
      }
    })
  },
  _isAvailable () {
    return 'geolocation' in window.navigator
  }
}

export default VueGeolocation

// in-browser load
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueGeolocation)
}
