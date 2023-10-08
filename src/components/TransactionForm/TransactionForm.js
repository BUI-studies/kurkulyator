export default function TransactionForm() {
  this.elements = {
    form: document.createElement("form"),
    form__input: document.createElement("input"),
    form__select: document.createElement("select"),
    button: document.createElement("button"),
  }
}

TransactionForm.prototype.render = (parent) => {} 