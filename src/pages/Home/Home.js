import { getDoc } from "firebase/firestore";
import { getWallets, getTransactions } from "@/API";
import {
  UniversalTable,
  TransactionForm,
  ModalWindow,
  UniversalButton,
} from "@/components";
import { createElement } from "@/utils";

import "./Home.scss";

export default function Home() {
  this.modal = new ModalWindow();

  (this.newTransactionButton = createElement({
    tagName: "button",
    innerText: "New transaction",
    className: "new-transaction-btn",
  })),
    (this.newTransactionButton = new UniversalButton({
      text: "New transaction",
      className: "new-transaction-btn",
      onClick: (event) => this.handleCreateForm(event),
    }));
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
  const wallets = await getWallets();
  const totalBalance = wallets.reduce(
    (acc, currWallet) => (acc += +currWallet.balance),
    0
  );
  this.totalBalance.textContent = totalBalance;

  const transactions = await this.pullAllTransaction();

  this.transactionsTable = new UniversalTable(transactions, {
    headers: [
      { name: "category", title: "Category" },
      { name: "amount", title: "Amount" },
      { name: "from", title: "From" },
      { name: "to", title: "To" },
      { name: "comment", title: "Comment" },
      { name: "date", title: "Date" },
      { name: "type", title: "Type" },
    ],
  });

  this.transactionsWrapper.replaceChildren();
  this.transactionsWrapper.append(this.transactionsHeader);
  this.transactionsTable.render(this.transactionsWrapper);

  this.walletsTable = new UniversalTable(wallets, {
    headers: [
      { name: "name", title: "Name" },
      { name: "balance", title: "Balance" },
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
        comment: !t.comment ? "Empty" : t.comment,
      };
    })
  );
};
