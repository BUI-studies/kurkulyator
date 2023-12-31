import { getCategories } from '@/API'
import { createElement } from '@/utils'

import { UniversalButton, ModalWindow, CategoryForm, UniversalTable } from '@/components'

import './_Categories.scss'

export default function Categories() {
  this.pageWrapper = createElement({
    tagName: 'div',
    className: 'page-wrapper',
  })
  this.tableWrapper = createElement({
    tagName: 'section',
    className: 'categories',
  })
  this.addButton = new UniversalButton({
    text: 'New category',
    onClick: (event) => this.handleNewCategoryClick(event),
  })

  this.placeholderText = createElement({
    tagName: 'h2',
  })
  this.placeholderText.textContent = 'Categories page'
}

Categories.prototype.render = async function (parent) {
  this.categories = await getCategories()
  this.pageWrapper.append(this.placeholderText)
  this.addButton.render(this.pageWrapper)
  this.addTable()
  this.pageWrapper.append(this.tableWrapper)
  parent.append(this.pageWrapper)
}

Categories.prototype.handleNewCategoryClick = function (e) {
  e.preventDefault()
  const modalForm = new ModalWindow()
  const newCategoryForm = new CategoryForm({
    afterSubmit: () => modalForm.close(),
  })
  newCategoryForm.render(modalForm.content)
  modalForm.render(this.pageWrapper, newCategoryForm)

  console.log('new category')
}

Categories.prototype.addTable = async function () {
  this.tableWrapper.replaceChildren()
  const table = await new UniversalTable(this.categories, {
    headers: [
      { title: 'Name', name: 'name', sortBy: true, sort: (a, b) => a.name.localeCompare(b.name)},
      { title: 'Type', name: 'type' },

    ],

  })
  table.render(this.tableWrapper)
}