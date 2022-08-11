function throttle (fn, delay) {
  let timer = null
  return function () {
    if (!timer) {
      fn.apply(this, arguments)
      timer = setTimeout(function () {
        timer = null
      }, delay)
    } else {
      console.log('节流')
    }
  }
}

module.exports = {
  throttle
}
