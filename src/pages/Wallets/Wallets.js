import { getWallets } from "@/API";

export default function Wallets() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");
}

Wallets.prototype.render = async function (parent) {
  console.log("Wallets page");

  this.wallets = await getWallets();
  console.log(this.wallets);

  this.addButton.textContent = "New wallet";
  this.addButton.addEventListener("click", (e) => this.handleNewWalletClick(e));
  this.pageWrapper.append(this.addButton);

  parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = function (e) {
  e.preventDefault();
  console.log("New wallet clicked");
};
