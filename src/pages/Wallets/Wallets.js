import { getWallets } from "@/API";

export default function Wallets() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");

  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Wallets page";
}

Wallets.prototype.render = function (parent) {
  // this.wallets = await getWallets();
  // console.log(this.wallets);

  this.addButton.textContent = "New wallet";
  this.addButton.addEventListener("click", (e) => this.handleNewWalletClick(e));
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = function (e) {
  e.preventDefault();
  console.log("New wallet clicked");
};
