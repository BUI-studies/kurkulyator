import { auth } from "../../../firebase";

import { Router, ROUTES_NAMES } from "@/routes/";
import "./Header.scss";

export default function Header() {
  this.headerWrapper = document.createElement("header");
  this.logoWrapper = document.createElement("div");
  this.logo = document.createElement("h2"); // temp logo placeholder

  this.headerText = document.createElement("h1");
  this.headerText.textContent = "Куркулятор";

  this.loggedInUserSection = document.createElement("div");
  this.loggedInUserSection.classList.add("header--logged-in");
  this.menuWrapper = document.createElement("menu");
  this.homePage = document.createElement("li");
  this.homePage.textContent = "Home";
  this.categoriesPage = document.createElement("li");
  this.categoriesPage.textContent = "Categories";
  this.walletsPage = document.createElement("li");
  this.walletsPage.textContent = "Wallets";
  this.transactionsHistoryPage = document.createElement("li");
  this.transactionsHistoryPage.textContent = "Transactions history";

  this.logOut = document.createElement("button");
  this.logOut.textContent = "Log Out";

  this.user = null;
}

Header.prototype.render = function (parent) {
  this.logo.textContent = "Logo";
  this.logo.classList.add("logo");
  this.logoWrapper.append(this.logo);

  this.headerWrapper.append(
    this.logoWrapper,
    this.headerText,
    this.loggedInUserSection
  );

  this.homePage.onclick = (e) => {
    e.preventDefault();
    Router.navigate(ROUTES_NAMES.HOME);
  };

  this.categoriesPage.onclick = (e) => {
    e.preventDefault();
    Router.navigate(ROUTES_NAMES.CATEGORIES);
  };

  this.walletsPage.onclick = (e) => {
    e.preventDefault();
    Router.navigate(ROUTES_NAMES.WALLETS);
  };

  this.transactionsHistoryPage.onclick = (e) => {
    e.preventDefault();
    Router.navigate(ROUTES_NAMES.TRANSACTIONS_HISTORY);
  };

  this.menuWrapper.append(
    this.homePage,
    this.categoriesPage,
    this.walletsPage,
    this.transactionsHistoryPage
  );

  this.logOut.addEventListener("click", (e) => this.handleLogoutClick(e));

  if (this.user !== null) {
    this.loggedInUserSection.append(this.menuWrapper, this.logOut);
  }

  parent.append(this.headerWrapper);
};

Header.prototype.updateHeader = function () {
  this.user = Router.getCurrentUser();
  this.loggedInUserSection.replaceChildren();
  if (this.user !== null) {
    this.loggedInUserSection.append(this.menuWrapper, this.logOut);
  }
};

Header.prototype.handleLogoutClick = function (e) {
  e.preventDefault();
  auth.signOut();
  this.headerWrapper.replaceChildren(this.logoWrapper, this.headerText);
};

Header.prototype.navigate = function (e) {};
