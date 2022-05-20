export const addGlobalEventListener = (
  type,
  selector,
  callback,
  options,
  parent = document
) => {
  parent.addEventListener(
    type,
    e => {
      if (e.target.matches(selector)) callback(e)
    },
    options
  )
}

export const qs = (selector, parent = document) => {
  try {
    return parent.querySelector(selector);
  } catch (ex) {
    return undefined;
  }
}

export const qsa = (selector, parent = document) => {
  return [...parent.querySelectorAll(selector)]
}

export const createElement = (type, options = {}) => {
  const element = document.createElement(type)
  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      element.classList.add(value)
      return
    }

    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue
      })
      return
    }

    if (key === "text") {
      element.textContent = value
      return
    }

    element.setAttribute(key, value)
  })
  return element
}