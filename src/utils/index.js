// export const makeOptions = (optionsSet, optionClass) =>
//   `<option default selected value="null">--none--</option>` +
//   optionsSet
//     .map(
//       (item) =>
//         `<option value="${item}" data-filter="${item}" class="${optionClass}">${item}</option>`
//     )
//     .join();

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
    `<option default selected disabled value="null">--none--</option>`
  );
};

/**
 * @function createElement
 *
 * @param {{tagName: string, name: string, id: string, className:string}} config
 */
export const createElement = ({ tagName, name, id, innerText, className }) => {
  const newElement = document.createElement(tagName);
  newElement.name = name;
  newElement.id = id;
  newElement.innerText = innerText;
  newElement.classList.add(className);
  return newElement;
};

/**
 * @function createInput
 *
 * @param {type:string, name:string, id: string, className: string, value; string} config
 */
export const createInput = ({
  type = 'text',
  name,
  id,
  className,
  value = '',
}) => {
  if (type === 'select') return createSelect();
  if (!name) throw TypeError('name attribute is required');

  const newInput = document.createElement('input');
  newInput.type = type;
  newInput.name = name;
  newInput.id = id;
  newInput.classList.add(className);
  newInput.value = value;
  return newInput;
};

/**
 * @function createSelect
 *
 * @param {options:string[], name:string, className: string, optionsClassName; string} config
 */
export const createSelect = ({
  options = [],
  name,
  options,
  className,
  optionsClassName,
}) => {
  if (!name) throw TypeError('name attribute is required');

  const newSelect = document.createElement('select');
  newSelect.classList.add(className);
  newSelect.name = name;

  if (options) {
    newSelect.innerHTML = makeOptions(options, optionsClassName);
  }

  return newSelect;
};
