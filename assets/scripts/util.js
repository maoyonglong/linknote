import _ from 'lodash'

export const restHeight = (selector) => {
  if (_.isArray(selector)) {
    selector.forEach(s => {
      setHeight(document.querySelector(s))
    })
  } else {
    setHeight(document.querySelector(selector))
  }

  function setHeight (el) {
    el.style.height = window.innerHeight - el.getBoundingClientRect().top + 'px'
  }
}

export const fullPage = (selector = '#page') => {
  if (_.isArray(selector)) {
    selector.forEach(s => {
      setHeight(document.querySelector(s))
    })
  } else {
    setHeight(document.querySelector(selector))
  }

  function setHeight (el) {
    if (el) {
      el.style.height = window.innerHeight + 'px'
    }
  }
}
