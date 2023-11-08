import { getTransactions } from "@/API";
import { throwable } from "@/utils/throwable";

export default function TransactionsHistory() {
  this.pageWrapper = document.createElement("div");

  this.addButton = document.createElement("button");

  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Transactions History page";
}

TransactionsHistory.prototype.render = async function (parent) {
  this.transactions = await throwable(getTransactions);

  this.addButton.textContent = "New transaction";
  this.addButton.onclick = (e) => this.handleNewTransactionClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

TransactionsHistory.prototype.handleNewTransactionClick = function (e) {
  e.preventDefault();
};
