import { getTransactions } from '@/API';
import { createElement } from '@/utils';

export default function TransactionsHistory() {
  this.pageWrapper = createElement({
    tagName: 'div',
  });
  this.addButton = createElement({
    tagName: 'button',
    innerText: 'New transaction',
  });
  this.placeholderText = document.createElement('h2'); // temp placeholder
  this.placeholderText.textContent = 'Transactions History page';
}

TransactionsHistory.prototype.render = async function (parent) {
  this.transactions = await getTransactions();
  this.addButton.onclick = (e) => this.handleNewTransactionClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

TransactionsHistory.prototype.handleNewTransactionClick = function (e) {
  e.preventDefault();
};
