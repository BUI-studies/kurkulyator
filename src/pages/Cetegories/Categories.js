import { getCategories } from '@/API';
import { createElement } from '@/utils';

export default function Categories() {
  this.pageWrapper = createElement({
    tagName: 'div',
    className: 'page-wrapper',
  });
  this.addButton = createElement({
    tagName: 'button',
    className: 'add-button',
    innerText: 'New category',
  });
  this.placeholderText = createElement({
    tagName: 'h2',
  }); // temp placeholder
  this.placeholderText.textContent = 'Categories page';
}

Categories.prototype.render = async function (parent) {
  this.categories = await getCategories();

  this.addButton.onclick = (e) => this.handleNewCategotyClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

Categories.prototype.handleNewCategotyClick = function (e) {
  e.preventDefault();
};
