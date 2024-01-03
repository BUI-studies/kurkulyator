import { getDoc } from 'firebase/firestore'
import { Router, ROUTES_NAMES } from '@/routes'
import { getWallets, getTransactions, deleteTransaction } from '@/api'
import { UniversalTable, TransactionForm, ModalWindow, UniversalButton } from '@/components'
import { createElement } from '@/utils'
import { CURRENCY } from '@/types'

import './_Home.scss'

const trashSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'

export default function Home() {
  this.modal = new ModalWindow()
  this.currency = CURRENCY.UAH

  this.newTransactionButton = new UniversalButton({
    text: 'New transaction',
    onClick: (event) => this.handleCreateForm(event),
  })

  this.pageWrapper = document.createDocumentFragment()

  this.topPannel = createElement({
    tagName: 'section',
    className: 'top-panel',
  })

  this.balanceWrapper = createElement({
    tagName: 'section',
    className: 'balance',
  })
  this.balanceText = createElement({
    tagName: 'h2',
    className: 'balance__text',
    innerText: 'Total balance:',
  })
  this.totalBalance = createElement({
    tagName: 'h2',
    innerText: `${this.currency}0`,
    className: 'balance__count',
  })

  this.walletsWrapper = createElement({
    tagName: 'section',
    className: 'wallets',
  })
  this.walletsHeader = createElement({
    tagName: 'h2',
    innerText: 'Wallets:',
    className: 'wallets__title',
  })
  this.transactionsWrapper = createElement({
    tagName: 'section',
    className: 'transactions',
  })
  this.transactionsHeader = createElement({
    tagName: 'h2',
    className: 'transactions__title',
    innerText: 'Transactions:',
  })

  this.transactionsTable = null
}

Home.prototype.render = async function (parent) {
  const wallets = await getWallets()
  const totalBalance = wallets.reduce((acc, currWallet) => (acc += +currWallet.balance), 0)
  this.totalBalance.textContent = `${this.currency}${totalBalance}`

  const transactions = await this.pullAllTransaction()

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
    onClick: async (event, clickedTransaction) => {
      if (
        (event.target.tagName === 'BUTTON' && event.target.classList.contains('remove-transaction')) ||
        event.target.closest(`button.remove-transaction`)
      ) {
        if (confirm('Are you sure you want to delete this transaction?')) {
          await deleteTransaction(clickedTransaction.id)
          const transactions = await this.pullAllTransaction()
          this.transactionsTable.updateTable(transactions)
          const wallets = await getWallets()
          this.walletsTable.updateTable(wallets)
          const totalBalance = wallets.reduce((acc, currWallet) => (acc += +currWallet.balance), 0)
          this.totalBalance.textContent = `${this.currency}${totalBalance}`
        } else return null
      } else return null
    },
  })

  this.transactionsWrapper.replaceChildren()
  this.transactionsWrapper.append(this.transactionsHeader)
  this.transactionsTable.render(this.transactionsWrapper)

  this.walletsTable = new UniversalTable(wallets, {
    headers: [
      {
        name: 'name',
        title: 'Name',
        sortBy: true,
        sort: (a, b) => a.date - b.date,
      },
      { name: 'balance', title: 'Balance', sortBy: false, sort: (a, b) => a.date - b.date },
    ],
  })

  this.balanceWrapper.append(this.balanceText, this.totalBalance)
  this.walletsWrapper.replaceChildren()
  this.walletsWrapper.append(this.walletsHeader)

  this.newTransactionButton.render(this.topPannel)
  this.topPannel.append(this.balanceWrapper, this.walletsWrapper)

  this.walletsTable.render(this.walletsWrapper)
  this.pageWrapper.append(this.topPannel, this.transactionsWrapper)
  parent.append(this.pageWrapper)
}

Home.prototype.handleCreateForm = function (event) {
  event.preventDefault()
  const newTransactionForm = new TransactionForm({
    afterSubmit: async () => {
      this.modal.close()
      const transactions = await this.pullAllTransaction()
      this.transactionsTable.updateTable(transactions)
      const wallets = await getWallets()
      const totalBalance = wallets.reduce((acc, currWallet) => (acc += +currWallet.balance), 0)
      this.totalBalance.textContent = `${this.currency}${totalBalance}`
      this.walletsTable.updateTable(wallets)
    },
  })

  this.modal.render(document.getElementById('app'), newTransactionForm)
}

Home.prototype.pullAllTransaction = async function () {
  const transactionsWithRefs = await getTransactions()

  return Promise.all(
    transactionsWithRefs.map(async (t) => {
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
}
