import './ModalWindow.scss';
import { createElement } from '@/utils';

export default function ModalWindow() {
  this.modal = createElement({
    tagMName: 'div',
    name: 'modal',
    id: '',
    innerText: '',
    className: 'modal',
  });
  this.content = createElement({
    tagMName: 'div',
    name: 'modal__content',
    id: '',
    innerText: '',
    className: 'modal__content',
  });
}

ModalWindow.prototype.render = function (parent, content) {
  this.content.replaceChildren();

  content.render(this.content);
  this.modal.append(this.content);

  this.modal.onclick = (event) => {
    if (event.target === this.modal) {
      this.close();
    }
  };

  parent.append(this.modal);
};

ModalWindow.prototype.close = function () {
  this.modal.remove();
};
