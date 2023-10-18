import { getWallets } from "@/API";
import "./Home.scss";

export default function Home() {
  this.pageWrapper = document.createElement("div");
  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Home page";
  this.balanceWrapper = document.createElement("section");
  this.balanceText = document.createElement("h2");
  this.totalBalance = document.createElement("h2");
  this.currency = document.createElement("h2");

  this.walletsWrapper = document.createElement("section");
  this.walletsHeader = document.createElement("h2");
}

Home.prototype.render = async function (parent) {
  this.balanceWrapper.classList.add("balance--wrapper");
  this.balanceText.textContent = "Total balance";
  this.balanceText.classList.add("balance--header");
  this.totalBalance.textContent = 0;
  this.totalBalance.classList.add("balance--count");
  this.currency.textContent = "$";
  this.currency.classList.add("balance--count");

  this.walletsWrapper.classList.add("wallets--wrapper");
  this.walletsHeader.textContent = "Your wallets";

  let wallets = await getWallets();
  let totalBalance = 1120.54;
  wallets.forEach((item) => (totalBalance += +item.balance));
  this.totalBalance.textContent = totalBalance;

  console.log(wallets);

  this.balanceWrapper.append(
    this.balanceText,
    this.currency,
    this.totalBalance
  );

  this.walletsWrapper.append(this.walletsHeader);
  this.pageWrapper.append(
    this.placeholderText,
    this.balanceWrapper,
    this.walletsWrapper
  );
  parent.append(this.pageWrapper);
};
