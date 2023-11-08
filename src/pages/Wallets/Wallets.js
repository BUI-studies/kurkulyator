import { getWallets } from "@/API";
import { throwable } from "@/utils/throwable";

export default function Wallets() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");

  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Wallets page";
}

Wallets.prototype.render = async function (parent) {
  this.wallets = await throwable(getWallets);

  this.addButton.textContent = "New wallet";
  this.addButton.onclick = (e) => this.handleNewWalletClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = function (e) {
  e.preventDefault();
};
