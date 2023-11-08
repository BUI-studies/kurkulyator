import { getDoc } from 'firebase/firestore';

import { getWallets, getTransactions } from '@/API';
import { UniversalTable, TransactionForm, ModalWindow } from '@/components';

import './Home.scss';

export default function Home() {
  this.modal = new ModalWindow();
  this.newTransactionButton = document.createElement('button');
  this.pageWrapper = document.createElement('div');
  this.balanceWrapper = document.createElement('section');
  this.balanceText = document.createElement('h2');
  this.totalBalance = document.createElement('h2');
  this.currency = document.createElement('h2');

  this.walletsWrapper = document.createElement('section');
  this.walletsHeader = document.createElement('h2');

  this.transactionsWrapper = document.createElement('section');
  this.transactionsHeader = document.createElement('h2');
  this.transactionsTable = null;
}

Home.prototype.render = async function (parent) {
  this.balanceWrapper.classList.add('balance--wrapper');
  this.balanceText.textContent = 'Total balance';
  this.balanceText.classList.add('balance--header');
  this.totalBalance.textContent = 0;
  this.totalBalance.classList.add('balance--count');
  this.currency.textContent = '$';
  this.currency.classList.add('balance--count');

  this.walletsWrapper.classList.add('wallets--wrapper');
  this.walletsHeader.textContent = 'Your wallets';

  this.pageWrapper.classList.add('page-wrapper')
  this.transactionsWrapper.classList.add('transactions--wrapper');
  this.transactionsHeader.classList.add('transactions--header');
  this.transactionsHeader.textContent = 'Transactions';

  this.newTransactionButton.innerText = 'New transaction';
  this.newTransactionButton.classList.add('new-transaction-btn');
  this.newTransactionButton.onclick = (event) => this.handleCreateForm(event);

  const wallets = await getWallets();

  const totalBalance = wallets.reduce(
    (acc, currWallet) => (acc += +currWallet.balance),
    0
  );
  this.totalBalance.textContent = totalBalance;

  const transactionsWithRefs = await getTransactions();

  const transactions = await Promise.all(
    transactionsWithRefs.map(async (t) => ({
      ...t,
      to: t.to ? (await getDoc(t.to)).data().name : null,
      from: t.from ? (await getDoc(t.from)).data().name : null,
      category: t.category ? (await getDoc(t.category)).data().name : null,
      date: t.date.toDate().toLocaleString(),
      comment: !t.comment ? 'Empty' : t.comment,
    }))
  );

  this.transactionsTable = new UniversalTable(transactions, {
    headers: [
      { name: 'category', title: 'Category' },
      { name: 'amount', title: 'Amount' },
      { name: 'from', title: 'From' },
      { name: 'to', title: 'To' },
      { name: 'comment', title: 'Comment' },
      { name: 'date', title: 'Date' },
      { name: 'type', title: 'Type' },
    ],
  });

  this.transactionsWrapper.replaceChildren();
  this.transactionsWrapper.append(this.transactionsHeader);
  this.transactionsTable.render(this.transactionsWrapper);

  this.walletsTable = new UniversalTable(wallets, {
    headers: [
      { name: 'name', title: 'Name' },
      { name: 'balance', title: 'Balance' },
    ],
  });

  this.balanceWrapper.append(
    this.balanceText,
    this.currency,
    this.totalBalance
  );
  this.walletsWrapper.replaceChildren();
  this.walletsWrapper.append(this.walletsHeader);
  this.walletsTable.render(this.walletsWrapper);
  this.pageWrapper.append(
    this.balanceWrapper,
    this.walletsWrapper,
    this.newTransactionButton,
    this.transactionsWrapper
  );
  parent.append(this.pageWrapper);
};

Home.prototype.handleCreateForm = function (event) {
  event.preventDefault();
  const newTransactionForm = new TransactionForm({
    afterSubmit: () => this.modal.close(),
  });

  this.modal.render(document.getElementById('app'), newTransactionForm);
  console.log('new transaction');
};
