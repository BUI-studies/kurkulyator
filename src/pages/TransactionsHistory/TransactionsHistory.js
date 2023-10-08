import { getTransactions } from "@/API";

export default function TransactionsHistory() {
  this.pageWrapper = document.createElement("div");

  this.addButton = document.createElement("button");
}

TransactionsHistory.prototype.render = async function (parent) {
  console.log("TransactionsHistory page");

  this.transactions = await getTransactions();
  console.log(this.transactions);

  this.addButton.textContent = "New transaction";
  this.addButton.addEventListener("click", (e) =>
    this.handleNewTransactionClick(e)
  );
  this.pageWrapper.append(this.addButton);

  parent.append(this.pageWrapper);
};

TransactionsHistory.prototype.handleNewTransactionClick = function (e) {
  e.preventDefault();
  console.log("New transaction clicked");
};
