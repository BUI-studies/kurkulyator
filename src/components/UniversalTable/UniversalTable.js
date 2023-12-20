import { createElement } from '@/utils'

<<<<<<< HEAD
const ARROW_DOWN = '&#9660'
const ARROW_UP = '&#9650'

/**
 * @type Classes
 *
 * @property {string} cell - class name for the row. By default it is - 'table-cell'.
 * @property {string} celUnsorted - class name for the unsorted row. By default it is - 'table-cell--unsorted'.
 * @property {string} celSorted - class name for the sorted row. By default it is - 'table-cell--sorted'.
 * @property {string} row - class name for the row. By default it is - 'table-row'.
 * @property {string} table - class name for the row. By default it is - 'table-body'.
 */

/**
 * @type Header
 *
 * @property {string} name - the name of the object's property. Gonna be used as a variable to extract the value from the object like so - collectionItem[headerName]
 * @property {string} title - how you would like to show the property on the screen
 * @property {Boolean | undefined} sortBy - an indicator to sort the collection by this field. Should be only one per collection, if passed more than one - only the first will be used.
 */

/**
 * @type Options
 *
 * @property {Header[]} headers - array of table column headers that should be shown as a first row
 * @property {any} emptyCellValue - literally any value you'd like to put to represent emptiness
 * @property {Classes} classes - classes to style up the table. If some of the class names are not in your object - they will be replaced by the default class names.
 */

/**
 * @constructor UniversalTable
 *
 * @param {object[]} collection - collection to be shown as a table on the screen
 * @param {Options} config - configuration options for the UniversalTable
 */
=======
import './_UniversalTable.scss'

>>>>>>> master
export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick

  this.sortingHeader = options.headers.find(({ sortBy, sort }) => sortBy && sort)
  console.log(this.sortingHeader)

  if (!this.sortingHeader) throw new TypeError('No header found matching sorting header criteria!')

  this.collection = collection.sort(this.sortingHeader.sort)

  this.headers = options.headers
  this.emptyCellValue = options.emptyCellValue || ''
  this.tableBody = null

  this.classes = {
<<<<<<< HEAD
    cell: options?.classes?.cell || 'table-cell',
    cellUnsorted: options?.classes?.cellUnsorted || 'table-cell--unsorted',
    cellSorted: options?.classes?.cellSorted || 'table-cell--sorted',
    row: options?.classes?.row || 'table-row',
    table: options?.classes?.table || 'table-body',
=======
    cell: options?.classes?.cell || 'table__cell',
    row: options?.classes?.row || 'table__row',
    headerRow: options?.classes?.headerRow || 'table__row--header',
    table: options?.classes?.table || 'table__body',
>>>>>>> master
  }
  this.generateDataset = options.generateDataset
}

UniversalTable.prototype.render = function (parent) {
  const tableHeader = createElement({
    tagName: 'ul',
    className: this.classes.table,
  })

  const tableHeaderRow = createElement({
    tagName: 'li',
<<<<<<< HEAD
    className: this.classes.row,

    onClick: (e) => {
      this.sortByTableHeaderRow(e)
    },
=======
    classNames: [this.classes.row, this.classes.headerRow],
>>>>>>> master
  })

  this.headers.forEach((cell) => {
    tableHeaderRow.innerHTML += `<span data-prop-name="${cell.name}" class="${this.classes.cell} ${
      cell.sort ? this.classes.cellUnsorted : ''
    }">${cell.title}</span>`
  })

  tableHeader.append(tableHeaderRow)

  this.tableBody = createElement({
    tagName: 'ul',
    className: this.classes.table,
  })

  this.renderTableBody()

  if (this.rowClick) {
    this.tableBody.onclick = (e) => {
      this.rowClickHandler(e)
    }
  }
  parent.append(tableHeader, this.tableBody)
}

UniversalTable.prototype.renderTableBody = function () {
  this.tableBody.replaceChildren()
  this.collection.forEach((row, index) => {
    const tableRow = document.createElement('li')
    tableRow.classList.add(this.classes.row)

    tableRow.dataset.ind = index
    tableRow.classList.add(this.classes.row)

    tableRow.innerHTML = this.headers
      .map(({ name }) => `<span class="${this.classes.cell}">${row[name] || this.emptyCellValue}</span>`)
      .join('')

    this.tableBody.append(tableRow)
  })
}

UniversalTable.prototype.sortByTableHeaderRow = function (e) {
  const targetElem = e.target

  if (e.target.tagName === 'SPAN') {
    if (
      !targetElem.classList.contains(this.classes.cellUnsorted) &&
      !targetElem.classList.contains(this.classes.cellSorted)
    ) {
      return
    }

    if (targetElem.classList.contains(this.classes.cellUnsorted)) {
      targetElem.classList.remove(this.classes.cellUnsorted)
      targetElem.classList.add(this.classes.cellSorted)
    } else if (targetElem.classList.contains(this.classes.cellSorted)) {
      targetElem.classList.remove(this.classes.cellSorted)
      targetElem.classList.add(this.classes.cellUnsorted)
    }

    const oldSortingHeader = this.headers.find(({ sortBy }) => sortBy)
    const headerToSortWith = this.headers.find((el) => {
      return el.name === targetElem.dataset.propName
    })

    if (headerToSortWith.sort) {
      this.collection = this.collection.sort(headerToSortWith.sort)

      //TODO: toggle the sortBy property in the old sorting header
      //TODO:  toggle the sortBy property in the new sorting header

      this.renderTableBody()
    }
  }
}

UniversalTable.prototype.rowClickHandler = function (e) {
  let clickedIndex = 0

  if (!e.target.classList.contains(this.classes.row)) {
    clickedIndex = e.target.closest(`.${this.classes.row}`).dataset
  } else {
    clickedIndex = e.target.dataset
  }
  this.rowClick(this.collection[clickedIndex])
}
