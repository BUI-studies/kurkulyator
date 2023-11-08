import './ModalWindow.scss';

export default function ModalWindow() {
  this.modal = document.createElement('div');
  this.content = document.createElement('div');
}

ModalWindow.prototype.render = function (parent, content) {
  this.content.replaceChildren();
  this.modal.classList.add('modal');
  this.content.classList.add('modal__content');

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
