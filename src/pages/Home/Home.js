import { getDoc } from "firebase/firestore";
import { getWallets, getTransactions } from "@/API";
import {
  UniversalTable,
  TransactionForm,
  ModalWindow,
  UniversalButton,
} from "@/components";
import { createElement } from "@/utils";


import './Home.scss';

export default function Home() {
  this.modal = new ModalWindow();

  this.newTransactionButton = createElement({
    tagName: "button",
    innerText: "New transaction",
    className: "new-transaction-btn",
  });
  this.newTransactionButton = new UniversalButton({
    text: "New transaction",
    className: "new-transaction-btn",
    onClick: (event) => this.handleCreateForm(event),
  });
  this.pageWrapper = createElement({
    tagName: "div",
    className: "page-wrapper",
  });
  this.balanceWrapper = createElement({
    tagName: "section",
    className: "balance--wrapper",
  });
  this.balanceText = createElement({
    tagName: "h2",
    className: "balance--header",
    innerText: "Total balance",
  });
  this.totalBalance = createElement({
    tagName: "h2",
    innerText: 0,
    className: "balance--count",
  });
  this.currency = createElement({
    tagName: "h2",
    innerText: "$",
    className: "balance--count",
  });
  this.walletsWrapper = createElement({
    tagName: "section",
    className: "wallets--wrapper",
  });
  this.walletsHeader = createElement({
    tagName: "h2",
    innerText: "Your wallets",
  });
  this.transactionsWrapper = createElement({
    tagName: "section",
    className: "transactions--wrapper",
  });
  this.transactionsHeader = createElement({
    tagName: "h2",
    className: "transactions--header",
    innerText: "Transactions",
  });

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

  this.pageWrapper.classList.add('page-wrapper');
  this.transactionsWrapper.classList.add('transactions--wrapper');
  this.transactionsHeader.classList.add('transactions--header');
  this.transactionsHeader.textContent = 'Transactions';

  this.newTransactionButton.innerText = 'New transaction';
  this.newTransactionButton.classList.add('new-transaction-btn');
  this.newTransactionButton.onclick = (event) => this.handleCreateForm(event);

  const wallets = await getWallets();

  const totalBalance = wallets.reduce((acc, currWallet) => (acc += +currWallet.balance), 0);

  this.totalBalance.textContent = totalBalance;

  const transactions = await this.pullAllTransaction();

  this.transactionsTable = new UniversalTable(transactions, {
    headers: [
      {
        name: 'category',
        title: 'Category',
        sortBy: false,
      },
      {
        name: 'amount',
        title: 'Amount',
        sortBy: false,
        sort: (a, b) => Number(b.amount) - Number(a.amount),
      },
      { name: 'from', title: 'From', sortBy: false },
      { name: 'to', title: 'To', sortBy: false },
      { name: 'comment', title: 'Comment', sortBy: false },
      {
        name: 'date',
        title: 'Date',
        sortBy: true,
        sort: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      },
      { name: 'type', title: 'Type', sortBy: false },
    ],
  });

  this.transactionsWrapper.replaceChildren();
  this.transactionsWrapper.append(this.transactionsHeader);
  this.transactionsTable.render(this.transactionsWrapper);

  this.walletsTable = new UniversalTable(wallets, {
    headers: [
      {
        name: 'name',
        title: 'Name',
        sortBy: true,
        sort: (a, b) => a.date - b.date,
      },
      { name: 'balance', title: 'Balance', sortBy: false, sort: (a, b) => a.date - b.date },
    ],
  });

  this.balanceWrapper.append(this.balanceText, this.currency, this.totalBalance);
  this.walletsWrapper.replaceChildren();
  this.walletsWrapper.append(this.walletsHeader);
  this.walletsTable.render(this.walletsWrapper);

  this.pageWrapper.append(this.balanceWrapper, this.walletsWrapper);
  this.newTransactionButton.render(this.pageWrapper);
  this.pageWrapper.append(this.transactionsWrapper);
  
  parent.append(this.pageWrapper);
};

Home.prototype.handleCreateForm = function (event) {
  event.preventDefault();
  const newTransactionForm = new TransactionForm({
    afterSubmit: async () => {
      this.modal.close();
      const transactions = await this.pullAllTransaction();
      this.transactionsTable.updateTable(transactions);
    },
  });

  this.modal.render(document.getElementById("app"), newTransactionForm);
};

Home.prototype.pullAllTransaction = async function () {
  const transactionsWithRefs = await getTransactions();

  return Promise.all(
    transactionsWithRefs.map(async (t) => {
      return {
        ...t,
        to: t.to ? (await getDoc(t.to)).data().name : null,
        from: t.from ? (await getDoc(t.from)).data().name : null,
        category: t.category ? (await getDoc(t.category)).data().name : null,
        date: t.date.toDate().toLocaleString(),
        comment: !t.comment ? 'Empty' : t.comment,
      };
    }),
  );
};
