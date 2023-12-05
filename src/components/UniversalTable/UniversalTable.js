import { createElement } from '@/utils'

import './_UniversalTable.scss'

export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick
  this.collection = collection
  this.headers = options.headers
  this.emptyCellValue = options.emptyCellValue || ''
  this.classes = {
    cell: options?.classes?.cell || 'table-cell',
    row: options?.classes?.row || 'table-row',
    table: options?.classes?.table || 'table-body',
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
    className: this.classes.row,
  })

  this.headers.forEach((cell) => {
    tableHeaderRow.innerHTML += `<span class="${this.classes.cell}">${cell.title}</span>`
  })
  tableHeader.append(tableHeaderRow)

  this.tableBody = createElement({
    tagName: 'ul',
    className: this.classes.table,
  })

  if (this.rowClick) {
    this.tableBody.onclick = (e) => {
      this.rowClickHandler(e)
    }
  }

  this.collection.forEach((row, index) => this.createSingleRow(row, index))
  parent.append(tableHeader, this.tableBody)
}

UniversalTable.prototype.createSingleRow = function (row, index) {
  const tableRow = document.createElement('li')
  tableRow.classList.add(this.classes.row)

  tableRow.dataset.uniqueMarker = this.generateDataset?.(row) || index
  tableRow.dataset.collectionInd = index
  tableRow.classList.add('t-row')

  tableRow.innerHTML = this.headers
    .map(({ name }) => `<span class="${this.classes.cell}">${row[name] || this.emptyCellValue}</span>`)
    .join('')

  this.tableBody.append(tableRow)
}

UniversalTable.prototype.rowClickHandler = function (e) {
  let clickedIndex = 0
  const somePropertyName = this.headers[0].name
  this.collection.find((item) => item[somePropertyName])
  if (!e.target.classList.contains(this.classes.row)) {
    clickedIndex = e.target.closest(`.${this.classes.row}`).dataset.collectionInd
  } else {
    clickedIndex = e.target.dataset.collectionInd
  }
  this.rowClick(this.collection[clickedIndex])
}

UniversalTable.prototype.updateTable = function (updatedCollection) {
  this.tableBody.replaceChildren()
  updatedCollection.forEach((row, index) => this.createSingleRow(row, index))

  this.collection = updatedCollection
}
