import { getCategories } from '@/API';
import { createElement } from '@/utils';
import { UniversalButton, ModalWindow, CategoryForm } from '@/components';

export default function Categories() {
  this.pageWrapper = createElement({
    tagName: 'div',
    className: 'page-wrapper',
  });
  this.addButton = new UniversalButton({
    text: 'New category',
    className: 'add-button',
    onClick: (event) => this.handleNewCategoryClick(event),
  });

  this.placeholderText = createElement({
    tagName: 'h2',
  }); // temp placeholder
  this.placeholderText.textContent = 'Categories page';
}

Categories.prototype.render = async function (parent) {
  this.categories = await getCategories();

  this.addButton.onclick = (e) => this.handleNewCategoryClick(e);
  this.pageWrapper.append(this.placeholderText);
  this.addButton.render(this.pageWrapper);

  parent.append(this.pageWrapper);
};

Categories.prototype.handleNewCategoryClick = function (e) {
  e.preventDefault();
  const modalForm = new ModalWindow(); // !!!!!!!!!!!!!!!!!!!!!!!!! НЕ ДОМ ЕЛЕМЕНТ !!!!!!!!!!!!!!!!!!!!!!!!!
  const newCategoryForm = new CategoryForm({
    afterSubmit: () => modalForm.close(),
  }); //нова форма
  newCategoryForm.render(modalForm.content);
  modalForm.render(this.pageWrapper, newCategoryForm);

  console.log('new category');
};
