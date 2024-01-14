import { createElement } from '@/utils'
import { mirrorSortingResults } from './UniversalTable.helper'

const ARROW_DOWN = '&#9660'
const ARROW_UP = '&#9650'

/**
 * @typedef {Object} Classes
 *
 * @property {string} cell - class name for the row. By default it is - 'table-cell'.
 * @property {string} celUnsorted - class name for the unsorted row. By default it is - 'table-cell--unsorted'.
 * @property {string} celSorted - class name for the sorted row. By default it is - 'table-cell--sorted'.
 * @property {string} row - class name for the row. By default it is - 'table-row'.
 * @property {string} table - class name for the row. By default it is - 'table-body'.
 */

/**
 * @typedef {Object} Header
 *
 * @property {string} name - the name of the object's property. Gonna be used as a variable to extract the value from the object like so - collectionItem[headerName]
 * @property {string} title - how you would like to show the property on the screen
 * @property {Boolean | undefined} sortBy - an indicator to sort the collection by this field. Should be only one per collection, if passed more than one - only the first will be used.
 */

/**
 * @typedef {Object} Options
 *
 * @property {Header[]} headers - array of table column headers that should be shown as a first row
 * @property {any} emptyCellValue - literally any value you'd like to put to represent emptiness
 * @property {Classes} classes - classes to style up the table. If some of the class names are not in your object - they will be replaced by the default class names.
 * @property {Boolean} deletable - whether the table needs to render a column with "Delete" buttons for every row in the collection
 * @property {function} onDelete - callback function called after clicking on the delete button of any row
 */

import './_UniversalTable.scss'

/**
 * @constructor UniversalTable
 *
 * @param collection {object[]} - collection to be shown as a table on the screen
 * @param options {Options} - configuration options for the UniversalTable
 */
export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick

  if ((!options.deletable && options.onDelete) || (options.deletable && !options.onDelete)) {
    throw new TypeError('Invalid argument - both "deletable" and "onDelete" should be passed')
  }
  this.deletable = options.deletable
  this.onDelete = options.onDelete
  this.sortingHeader = options.headers.find(({ sortBy, sort }) => sortBy && sort) // це просто хедер по якому буде все відсортовано на старті

  //коллекція буде відсортована по хедеру, який лежить у this.sortingHeader
  if (!this.sortingHeader) throw new TypeError('No header found matching sorting header criteria!')
  //(у цього хедера є функція сортування sort яку ми пофакту передамо аргументом нижче)
  this.collection = collection.sort(this.sortingHeader.sort)

  this.headers = this.deletable ? [...options.headers, { name: 'delete', title: 'Delete' }] : options.headers
  this.emptyCellValue = options.emptyCellValue || ''
  this.tableBody = null

  this.classes = {
    cellUnsorted: options?.classes?.cellUnsorted || 'table__cell--unsorted',
    cellSorted: options?.classes?.cellSorted || 'table__cell--sorted',
    cell: options?.classes?.cell || 'table__cell',
    row: options?.classes?.row || 'table__row',
    headerRow: options?.classes?.headerRow || 'table__row--header',
    table: options?.classes?.table || 'table__body',
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
    onClick: (e) => {
      this.sortByTableHeaderRow(e)
    },
    classNames: [this.classes.row, this.classes.headerRow],
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

  this.tableBody.onclick = (e) => {
    const closestButton = e.target.closest(`button.remove-transaction`)

    if ((e.target.tagName === 'BUTTON' && e.target.classList.contains('remove-transaction')) || closestButton) {
      const targetID = (closestButton || e.target).id
      this.onDelete(targetID)
    }

    this.rowClickHandler(e)
  }

  parent.append(tableHeader, this.tableBody)
}

UniversalTable.prototype.renderTableBody = function () {
  this.tableBody.replaceChildren()

  if (this.deletable && this.onDelete) {
    this.collection = this.collection.map((row) => ({
      ...row,
      delete: `<button id="${row.id}" class="remove-transaction"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>`,
    }))
  }

  this.collection.forEach((row, index) => {
    const tableRow = document.createElement('li')
    tableRow.classList.add(this.classes.row)
    tableRow.dataset.ind = index

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
      return null
    }

    const oldSortingHeader = this.headers.find(({ sortBy }) => sortBy)
    const headerToSortWith = this.headers.find((el) => {
      return el.name === targetElem.dataset.propName
    })

    if (headerToSortWith.sort) {
      if (targetElem.classList.contains(this.classes.cellSorted)) {
        this.collection.sort((...args) => mirrorSortingResults(headerToSortWith.sort(...args)))
        targetElem.classList.replace(this.classes.cellSorted, this.classes.cellUnsorted)
      } else {
        this.collection.sort(headerToSortWith.sort)
        targetElem.classList.replace(this.classes.cellUnsorted, this.classes.cellSorted)
      }
    } else {
      throw new TypeError(`no sorting method found: ${headerToSortWith.title}`)
    }
    this.renderTableBody()
  }
}

UniversalTable.prototype.rowClickHandler = function (e) {
  let clickedIndex = 0

  if (!e.target.classList.contains(this.classes.row)) {
    clickedIndex = e.target.closest(`.${this.classes.row}`).dataset.ind
  } else {
    clickedIndex = e.target.dataset.ind
  }

  this.rowClick?.(e, this.collection[clickedIndex])
}

UniversalTable.prototype.updateTable = function (updatedCollection) {
  this.collection = updatedCollection
  this.renderTableBody()
}
