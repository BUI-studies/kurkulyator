import { getTransactions, getWallets, getTransactionsByWallet, getCategories } from '@/API'
import { createElement, createSelect, makeOptions } from '@/utils'
import { UniversalButton, UniversalTable } from '@/components'
import { TRANSACTION_TYPE } from '@/types'
import { transactionsCollectionRef, walletsCollectionRef } from '../../../firebase'
import { doc, query, and, where, or, getDocs, getDoc } from 'firebase/firestore'
import { Router } from '@/routes'
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
  this.filtersForm = createElement({
    tagName: 'form',
    name: 'filters-form',
    className: 'filters',
  })
  this.filtersHeader = createElement({
    tagName: 'h2',
    className: 'filters__title',
    innerText: 'Filters:',
  })
  this.filterByWalletLabel = createElement({
    tagName: 'label',
    name: 'filter-bw-label',
    id: 'fbwLabel',
    innerText: 'Wallets:',
    className: 'filters__label',
  })
  this.filterByWallet = createSelect({
    name: 'filter-by-wallet',
    className: 'filters__filter-by-wallet',
  })
  this.filterByTransactionTypeLabel = createElement({
    tagName: 'label',
    name: 'filter-bt-label',
    id: 'fbtLabel',
    innerText: 'Type:',
    className: 'filters__label',
  })
  this.filterByTransactionType = createSelect({
    name: 'filter-by-type',
    className: 'filters__filter-by-type',
  })
  this.filterButton = new UniversalButton({
    text: 'Filter',
    className: 'filters__filter-btn',
    onClick: (e) => this.handleFilter(e),
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
  const walletsOptions = makeOptions(wallets, 'filters__wallets-options')
  this.filterByWallet.innerHTML = walletsOptions

  this.filterByWalletLabel.append(this.filterByWallet)

  this.filterByTransactionType.innerHTML = []
  const types = [...Object.values(TRANSACTION_TYPE)]
  const typesOptions = makeOptions(types, 'filters__type-options')
  this.filterByTransactionType.innerHTML = typesOptions

  this.filterByTransactionTypeLabel.append(this.filterByTransactionType)

  this.filtersForm.append(this.filtersHeader, this.filterByWalletLabel, this.filterByTransactionTypeLabel)
  this.filterButton.render(this.filtersForm)
  this.resetButton.render(this.filtersForm)

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

  parent.append(this.filtersForm, this.transactionsWrapper)
}
//TODO: refactor
TransactionsHistory.prototype.handleFilter = async function (e) {
  e.preventDefault()
  const query = this.buildQuery()
  const responseSnapShot = await getDocs(query)
  const res = []
  responseSnapShot.forEach((p) => res.push({ id: p.id, ...p.data() }))
  const upd = await Promise.all(
    res.map(async (t) => {
      return {
        ...t,
        to: t.to ? (await getDoc(t.to)).data().name : null,
        from: t.from ? (await getDoc(t.from)).data().name : null,
        category: t.category ? (await getDoc(t.category)).data().name : null,
        date: t.date.toDate().toLocaleString(),
        comment: !t.comment ? 'Empty' : t.comment,
        delete: `<button id="${t.id}" class="remove-transaction"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>`,
      }
    })
  )

  this.transactionsTable.updateTable(upd)
}
//TODO: refactor
TransactionsHistory.prototype.handleResetFilters = async function (e) {
  e.preventDefault()
  const transactions = await getTransactions()
  this.transactionsTable.updateTable(transactions)
  this.filtersForm.reset()
}

TransactionsHistory.prototype.buildQuery = function () {
  let getQuery = null
  const fData = new FormData(this.filtersForm)

  const data = {
    wallet: fData.get('filter-by-wallet'),
    type: fData.get('filter-by-type'),
  }

  const getWalletWhere = () => {
    if (!data.wallet) return null
    const walletRef = doc(walletsCollectionRef, data.wallet)
    const walletQry = or(where('to', '==', walletRef), where('from', '==', walletRef))
    return walletQry
  }

  const getTypeWhere = () => {
    if (!data.type) return null
    const typeRef = where('type', '==', data.type)
    return typeRef
  }

  getQuery = query(
    transactionsCollectionRef,
    and(where('owner', '==', Router.getCurrentUser().uid), and(...[getWalletWhere(), getTypeWhere()].filter(Boolean)))
  )
  return getQuery
}
