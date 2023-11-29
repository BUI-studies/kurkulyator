import { getTransactions } from '@/API';
import { createElement } from '@/utils';

import { UniversalButton } from '@/components';

export default function TransactionsHistory() {
  this.pageWrapper = createElement({
    tagName: 'div',
  });
  this.addButton = new UniversalButton({
    text: 'New transaction',
    onClick: (event) => this.handleNewTransactionClick(event),
  });
  this.placeholderText = document.createElement('h2'); // temp placeholder
  this.placeholderText.textContent = 'Transactions History page';
}

TransactionsHistory.prototype.render = async function (parent) {
  this.transactions = await getTransactions();
  this.pageWrapper.append(this.placeholderText);
  this.addButton.render(this.pageWrapper);

  parent.append(this.pageWrapper);
};

TransactionsHistory.prototype.handleNewTransactionClick = function (e) {
  e.preventDefault();
  console.log('new transaction history');
};
