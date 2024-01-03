/**
 * @function makeOptions
 * @param {{title: string, value: string}[]} optionsSet
 * @param {string} optionClass
 */
export const makeOptions = (optionsSet, optionClass) => {
  return optionsSet.reduce(
    (accumulator, currentItem) =>
      accumulator +
      `<option value="${currentItem}" data-filter="${currentItem}" class="${optionClass}">${currentItem}</option>`,

    `<option default selected disabled value="null" class="${optionClass}">--none--</option>`
  )
}

/**
 * @function createElement
 *
 * @param {{tagName: string, name: string, id: string, className:string, classNames: string[]}} config
 */
export const createElement = ({ tagName, name, id, innerText, className, classNames, onClick }) => {
  const newElement = document.createElement(tagName)

  if (name) newElement.name = name
  if (id) newElement.id = id
  if (innerText) newElement.innerText = innerText
  if (onClick) newElement.onclick = onClick
  if (className && !classNames) newElement.classList.add(className)
  if (classNames) newElement.classList.add(...classNames)

  return newElement
}

/**
 * @function createInput
 *
 * @param {type:string, name:string, id: string, className: string, value; string} config
 */
export const createInput = ({ type = 'text', name, id, className, value = '' }) => {
  if (type === 'select') return createSelect()
  if (!name) throw TypeError('name attribute is required')

  const newInput = document.createElement('input')
  newInput.type = type
  newInput.name = name
  newInput.id = id
  newInput.classList.add(className)
  newInput.value = value
  return newInput
}

/**
 * @function createSelect
 *
 * @param {options:string[], name:string, className: string, optionsClassName; string} config
 */
export const createSelect = ({ options = [], name, className, optionsClassName }) => {
  if (!name) throw TypeError('name attribute is required')

  const newSelect = document.createElement('select')
  newSelect.classList.add(className)
  newSelect.name = name

  if (options) {
    newSelect.innerHTML = makeOptions(options, optionsClassName)
  }

  return newSelect
}
