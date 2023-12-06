import { auth } from '@root/firebase'

import { Router, ROUTES_NAMES } from '@/routes/'
import { UniversalButton } from '@/components'
import { createElement } from '@/utils'

import './_Header.scss'

export default function Header() {
  this.parent = null
  this.headerWrapper = createElement({
    tagName: 'header',
    classNames: ['page-top', 'container'],
  })
  this.company = createElement({
    tagName: 'h1',
    innerText: 'Куркулятор',
    className: 'page-top__company',
  })
  this.headerContentWrapper = document.createDocumentFragment()
  this.menuWrapper = createElement({
    tagName: 'menu',
    className: 'page-top__menu',
  })
  this.homePage = createElement({
    tagName: 'li',
    innerText: 'Home',
    className: 'page-top__menu-item',
  })
  this.categoriesPage = createElement({
    tagName: 'li',
    innerText: 'Categories',
    className: 'page-top__menu-item',
  })
  this.walletsPage = createElement({
    tagName: 'li',
    innerText: 'Wallets',
    className: 'page-top__menu-item',
  })
  this.transactionsHistoryPage = createElement({
    tagName: 'li',
    innerText: 'Transactions history',
    className: 'page-top__menu-item',
  })

  this.logOut = new UniversalButton({
    text: 'Log out',
    onClick: (event) => this.handleLogoutClick(event),
  })

  this.user = null
}

Header.prototype.render = function (parent) {
  this.homePage.onclick = (e) => {
    e.preventDefault()
    Router.navigate(ROUTES_NAMES.HOME)
  }

  this.categoriesPage.onclick = (e) => {
    e.preventDefault()
    Router.navigate(ROUTES_NAMES.CATEGORIES)
  }

  this.walletsPage.onclick = (e) => {
    e.preventDefault()
    Router.navigate(ROUTES_NAMES.WALLETS)
  }

  this.transactionsHistoryPage.onclick = (e) => {
    e.preventDefault()
    Router.navigate(ROUTES_NAMES.TRANSACTIONS_HISTORY)
  }

  this.menuWrapper.append(this.homePage, this.categoriesPage, this.walletsPage, this.transactionsHistoryPage)

  if (this.user !== null) {
    this.headerContentWrapper.append(this.menuWrapper)
    this.logOut.render(this.headerContentWrapper)
  }

  this.menuWrapper.append(this.homePage, this.categoriesPage, this.walletsPage, this.transactionsHistoryPage)

  if (this.user !== null) {
    this.headerContentWrapper.append(this.menuWrapper)
    this.logOut.render(this.headerContentWrapper)
  }

  this.headerWrapper.append(this.company, this.headerContentWrapper)
  this.parent = parent
  parent.append(this.headerWrapper)
}

Header.prototype.update = function () {
  this.user = Router.getCurrentUser()
  if (this.user !== null) {
    this.headerContentWrapper.append(this.menuWrapper)
    this.logOut.render(this.headerContentWrapper)
  }
  this.headerWrapper.append(this.headerContentWrapper)
}

Header.prototype.handleLogoutClick = function (e) {
  e.preventDefault()
  auth.signOut()

  this.menuWrapper.remove()
  this.logOut.self.remove()
}
