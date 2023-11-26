import { getCategoryRefByName, addNewCategory } from '@/API';
import { Router } from '@/routes';
import { categoriesCollectionRef } from '../../../firebase';
import { createElement, createInput, createSelect } from '@/utils';
import { TRANSACTION_TYPE } from '@/types';
import { UniversalButton } from '@/components';

import './CategoryForm.scss';

export default function CategoryForm({ afterSubmit }) {
  this.afterSubmit = afterSubmit;
  this.elements = {
    self: createElement({
      tagName: 'form',
      name: 'category-form',
      className: 'categoryForm',
    }),
    nameLabel: createElement({
      tagName: 'label',
      className: 'categoryForm__label',
      innerText: 'Введіть назву категорії:',
    }),
    name: createInput({
      type: 'text',
      name: 'categoryName',
      placeholder: 'Category name',
      className: 'categoryForm__name',
    }),
    typeLabel: createElement({
      tagName: 'label',
      className: 'categoryForm__label',
      innerText: 'Оберіть тип категорії:',
    }),
    type: createSelect({
      options: Object.values(TRANSACTION_TYPE), // ['income', 'outcome', ...]
      name: 'createType',
      className: 'categoryForm__type',
    }),
    submitButton: new UniversalButton({
      text: 'Add category',
      className: 'add-button',
      onClick: (event) => this.handleSubmit(event),
    }),
  };
}

CategoryForm.prototype.render = function (parent) {
  this.elements.self.append(
    this.elements.nameLabel,
    this.elements.name,
    this.elements.typeLabel,
    this.elements.type
  );
  this.elements.submitButton.render(this.elements.self);
  parent.append(this.elements.self);
};

CategoryForm.prototype.handleSubmit = async function (event) {
  event.preventDefault();
  const categoryData = new FormData(this.elements.self);

  const checkCategoryName = await getCategoryRefByName(
    categoryData.get('categoryName')
  );

  if (checkCategoryName) {
    console.log('Category already exists');
    return;
  } else {
    const newCategoryToAdd = {
      name: categoryData.get('categoryName'),
      type: categoryData.get('createType'),
      owner: Router.getCurrentUser().uid,
    };
    addNewCategory(categoriesCollectionRef, newCategoryToAdd);
    console.log('Category is new and created');
  }

  console.log('submit');
  this.afterSubmit();
};
