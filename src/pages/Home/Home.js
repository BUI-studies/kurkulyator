import { getDoc } from 'firebase/firestore'
import { getWallets, getTransactions } from '@/API'
import { UniversalTable, TransactionForm, ModalWindow, UniversalButton } from '@/components'
import { createElement } from '@/utils'
import { CURRENCY } from '@/types'

import './_Home.scss'

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
      { name: 'category', title: 'Category' },
      { name: 'amount', title: 'Amount' },
      { name: 'from', title: 'From' },
      { name: 'to', title: 'To' },
      { name: 'comment', title: 'Comment' },
      { name: 'date', title: 'Date' },
      { name: 'type', title: 'Type' },
    ],
  })

  this.transactionsWrapper.replaceChildren()
  this.transactionsWrapper.append(this.transactionsHeader)
  this.transactionsTable.render(this.transactionsWrapper)

  this.walletsTable = new UniversalTable(wallets, {
    headers: [
      { name: 'name', title: 'Name' },
      { name: 'balance', title: 'Balance' },
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
      }
    })
  )
}
