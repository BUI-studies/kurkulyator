import { getTransactions, getWallets, getTransactionsByWallet } from '@/API'
import { createElement, createSelect, makeOptions } from '@/utils'

import { UniversalButton, UniversalTable } from '@/components'

import './_TransactionsHistory.scss'

export default function TransactionsHistory() {
  this.transactionsWrapper = createElement({
    tagName: 'section',
    className: 'transactions',
  })
  this.transactionsHeader = createElement({
    tagName: 'h2',
    className: 'transactions__title',
    innerText: 'Transactions:',
  })
  this.filtersWrapper = createElement({
    tagName: 'section',
    className: 'filters',
  })
  this.filtersHeader = createElement({
    tagName: 'h2',
    className: 'filters__title',
    innerText: 'Filters:',
  })
  this.filterByWalletLabel = createElement({
    tagName: 'Label',
    name: 'filter-bw-label',
    id: 'fbwLabel',
    innerText: 'Wallets:',
    className: 'filters__label',
  })
  this.filterByWallet = createSelect({
    name: 'filter-by-wallet',
    className: 'filters__filter-by-wallet',
  })
  this.filterButton = new UniversalButton({
    text: 'Filter',
    className: 'filters__filter-btn',
    onClick: (e) => this.handleFilterByWallet(e),
  })
  this.resetButton = new UniversalButton({
    text: 'Reset',
    className: 'filters__reset-btn',
    onClick: (e) => this.handleResetFilters(e),
  })
  this.transactionsTable = null
}

TransactionsHistory.prototype.render = async function (parent) {
  this.filterByWallet.innerHTML = []
  const wallets = await getWallets()
  const walletsOptions = makeOptions(wallets, 'filter_wallets-options')
  this.filterByWallet.innerHTML = walletsOptions

  this.filterByWalletLabel.append(this.filterByWallet)

  this.filtersWrapper.append(this.filtersHeader, this.filterByWalletLabel)
  this.filterButton.render(this.filtersWrapper)
  this.resetButton.render(this.filtersWrapper)

  const transactions = await getTransactions()

  this.transactionsTable = new UniversalTable(transactions, {
    headers: [
      {
        name: 'category',
        title: 'Category',
        sortBy: false,
      },
      {
        name: 'amount',
        title: 'Amount',
        sortBy: false,
        sort: (a, b) => Number(b.amount) - Number(a.amount),
      },
      { name: 'from', title: 'From', sortBy: false },
      { name: 'to', title: 'To', sortBy: false },
      { name: 'comment', title: 'Comment', sortBy: false },
      {
        name: 'date',
        title: 'Date',
        sortBy: true,
        // TODO: make it work properly using firebase timestamp api
        sort: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      },
      { name: 'type', title: 'Type', sortBy: false },
      { name: 'delete', title: 'Delete' },
    ],
  })

  this.transactionsWrapper.replaceChildren()
  this.transactionsWrapper.append(this.transactionsHeader)
  this.transactionsTable.render(this.transactionsWrapper)

  parent.append(this.filtersWrapper, this.transactionsWrapper)
}

TransactionsHistory.prototype.handleFilterByWallet = async function (e) {
  e.preventDefault()
  const transactionsByWallet = await getTransactionsByWallet(this.filterByWallet.value)
  this.transactionsTable.updateTable(transactionsByWallet)
}

TransactionsHistory.prototype.handleResetFilters = async function (e) {
  e.preventDefault()
  const transactions = await getTransactions()
  this.transactionsTable.updateTable(transactions)
}
