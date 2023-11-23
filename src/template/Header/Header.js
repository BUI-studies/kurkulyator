import { auth } from '../../../firebase';

import { Router, ROUTES_NAMES } from '@/routes/';
import { UniversalButton } from '@/components';
import { createElement } from '@/utils';
import './Header.scss';

export default function Header() {
  this.headerWrapper = createElement({
    tagName: 'header',
  });
  this.logoWrapper = createElement({
    tagName: 'div',
  });
  this.logo = createElement({
    tagName: 'h2',
    innerText: 'Logo',
    classList: 'logo',
  }); // temp logo placeholder
  this.headerText = createElement({
    tagName: 'h1',
    innerText: 'Куркулятор',
  });
  this.loggedInUserSection = createElement({
    tagName: 'div',
    className: 'header--logged-out',
  });
  this.menuWrapper = createElement({
    tagName: 'menu',
  });
  this.homePage = createElement({
    tagName: 'li',
    innerText: 'Home',
  });
  this.categoriesPage = createElement({
    tagName: 'li',
    innerText: 'Categories',
  });
  this.walletsPage = createElement({
    tagName: 'li',
    innerText: 'Wallets',
  });
  this.transactionsHistoryPage = createElement({
    tagName: 'li',
    innerText: 'Transactions history',
  });

  this.logOut = new UniversalButton({
    text: 'Log out',
    onClick: (event) => this.handleLogoutClick(event),
  });

  this.user = null;
}

Header.prototype.render = function (parent) {
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


  if (this.user !== null) {
    this.loggedInUserSection.append(this.menuWrapper);
    this.logOut.render(this.loggedInUserSection);
  }

  parent.append(this.headerWrapper);
};

Header.prototype.update = function () {
  this.user = Router.getCurrentUser();
  this.loggedInUserSection.replaceChildren();
  if (this.user !== null) {
    this.loggedInUserSection.append(this.menuWrapper);
    this.logOut.render(this.loggedInUserSection);
  }
};

Header.prototype.handleLogoutClick = function (e) {
  e.preventDefault();
  auth.signOut();
  this.loggedInUserSection.replaceChildren();
};
