import { getWallets, getCategories, saveTransaction } from '@/api'
import { makeOptions, createElement, createInput, createSelect } from '@/utils'
import { UniversalButton } from '@/components'
import { Router } from '@/routes'
import { TRANSACTION_TYPE } from '@/types/index.js'

import './_TransactionForm.scss'

export default function TransactionForm({ afterSubmit }) {
  this.typeOptions = [
    TRANSACTION_TYPE.INCOME,
    TRANSACTION_TYPE.OUTCOME,
    TRANSACTION_TYPE.TRANSFER,
    TRANSACTION_TYPE.CORRECTION,
  ]

  this.categories = null
  this.afterSubmit = afterSubmit

  this.elements = {
    owner: null,
    self: createElement({
      tagName: 'form',
      name: 'transaction-form',
      id: 't-form',
      innerText: '',
      className: 'transactionForm',
    }),
    typeLabel: createElement({
      tagName: 'label',
      name: 'transaction-type-label',
      id: 'ttLabel',
      innerText: 'Transaction type:',
      className: 'transactionForm__label',
    }),
    type: createSelect({
      options: this.typeOptions,
      name: 'type',
      className: 'transactionForm__type',
      optionsClassName: 'transactionForm__type-option',
    }),
    wallets: {
      labelFrom: createElement({
        tagName: 'label',
        name: 'wallet-from-label',
        id: 'wfLabel',
        innerText: 'From:',
        className: 'transactionForm__label',
      }),
      from: null,
      labelTo: createElement({
        tagName: 'label',
        name: 'wallet-to-label',
        id: 'wtLabel',
        innerText: 'To:',
        className: 'transactionForm__label',
      }),
      to: null,
    },
    categoryLabel: createElement({
      tagName: 'label',
      name: 'category-label',
      id: 'catLabel',
      innerText: 'Category:',
      className: 'transactionForm__label',
    }),
    category: createSelect({
      name: 'category',
      className: 'transactionForm__category',
    }),
    amountLabel: createElement({
      tagName: 'label',
      name: 'amount-label',
      id: 'amoLabel',
      innerText: 'Amount:',
      className: 'transactionForm__label',
    }),
    amount: createInput({
      name: 'amount',
      id: 'tFormAmount',
      className: 'transactionForm__amount',
      value: '',
    }),
    commentLabel: createElement({
      tagName: 'label',
      name: 'comment-label',
      id: 'comLabel',
      innerText: "Comment (не обов'язково):",
      className: 'transactionForm__label',
    }),
    comment: createInput({
      name: 'comment',
      id: 'tFormComment',
      className: 'transactionForm__comment',
      value: '',
    }),
    button: new UniversalButton({
      text: 'Save',
      type: 'submit',
      className: 'transactionForm__button',
      onClick: (event) => this.handleSubmit(event),
    }),
  }
}

/**
 * Renders transaction form into passed parent
 * @param {HTMLElement} parent
 */
TransactionForm.prototype.render = async function (parent) {
  this.elements.type.required = true
  this.elements.amount.required = true
  this.elements.category.required = true
  this.elements.type.addEventListener('change', (event) => {
    this.typeListener(event)
    this.validateForm()
  })

  this.categories = await getCategories()

  this.elements.wallets.from = await this.makeWalletsInput('walletFrom')
  this.elements.wallets.to = await this.makeWalletsInput('walletTo')

  this.elements.typeLabel.append(this.elements.type)
  this.elements.categoryLabel.append(this.elements.category)
  this.elements.amountLabel.append(this.elements.amount)
  this.elements.commentLabel.append(this.elements.comment)
  this.elements.wallets.labelFrom.append(this.elements.wallets.from)
  this.elements.wallets.labelTo.append(this.elements.wallets.to)

  this.elements.self.append(this.elements.typeLabel, this.elements.amountLabel, this.elements.commentLabel)
  this.elements.button.render(this.elements.self)

  parent.append(this.elements.self)
}

/**
 * /f description/
 * @param {Event} e
 */
TransactionForm.prototype.handleSubmit = async function (e) {
  e.preventDefault()

  const formData = new FormData(this.elements.self)

  const newTransactionData = await saveTransaction({
    type: formData.get('type'),
    from: formData.get('walletFrom'),
    to: formData.get('walletTo'),
    category: formData.get('category'),
    amount: formData.get('amount'),
    comment: formData.get('comment'),
    owner: Router.getCurrentUser().uid,
    date: new Date(),
  })

  this.validateForm()

  await this.afterSubmit?.(e, newTransactionData)
}

/**
 *
 * @param {Event} e
 */
TransactionForm.prototype.typeListener = function (e) {
  e.preventDefault()

  this.elements.wallets.labelFrom?.remove()
  this.elements.wallets.labelTo?.remove()
  this.elements.categoryLabel?.remove()

  this.elements.category.innerHTML = makeOptions([], 'transactionForm__category')

  const selectedType = e.target.value

  switch (selectedType) {
    case TRANSACTION_TYPE.INCOME:
      this.elements.typeLabel.insertAdjacentElement('afterend', this.elements.wallets.labelTo)
      this.elements.category.innerHTML = makeOptions(
        this.categories.filter(({ type }) => type === TRANSACTION_TYPE.INCOME).map(({ name }) => name),
        'transactionForm__category-options'
      )
      this.elements.wallets.to.required = true
      this.elements.wallets.from.required = false
      this.elements.wallets.labelTo.insertAdjacentElement('afterend', this.elements.categoryLabel)
      break
    case TRANSACTION_TYPE.OUTCOME:
      this.elements.typeLabel.insertAdjacentElement('afterend', this.elements.wallets.labelFrom)

      this.elements.category.innerHTML = makeOptions(
        this.categories.filter(({ type }) => type === TRANSACTION_TYPE.OUTCOME).map(({ name }) => name),
        'transactionForm__category-options'
      )

      this.elements.wallets.to.required = false
      this.elements.wallets.from.required = true

      this.elements.wallets.labelFrom.insertAdjacentElement('afterend', this.elements.categoryLabel)
      break
    case TRANSACTION_TYPE.TRANSFER:
      this.elements.typeLabel.insertAdjacentElement('afterend', this.elements.wallets.labelFrom)

      this.elements.wallets.labelFrom.insertAdjacentElement('afterend', this.elements.wallets.labelTo)
      this.elements.wallets.to.required = true
      this.elements.wallets.from.required = true
      break
    case TRANSACTION_TYPE.CORRECTION:
      this.elements.typeLabel.insertAdjacentElement('afterend', this.elements.wallets.labelTo)
      this.elements.wallets.to.required = true
      this.elements.wallets.from.required = false
      break
  }
}

TransactionForm.prototype.makeWalletsInput = async function (inputName) {
  const wallets = await getWallets()
  const walletsOptions = wallets.map((item) => item.name)
  const walletsInput = document.createElement('select')
  walletsInput.name = inputName
  walletsInput.classList.add('transactionForm__wallet')
  walletsInput.innerHTML = makeOptions(walletsOptions, 'transactionForm__wallet-option')
  return walletsInput
}

TransactionForm.prototype.validateForm = function () {
  const errors = []
  if (this.elements.type.required && this.elements.type.value === 'null') {
    this.elements.type.style.border = '1px solid red'
    errors.push('No type selected')
  } else {
    this.elements.type.style.border = null
  }
  if (this.elements.wallets.from.required && this.elements.wallets.from.value === 'null') {
    this.elements.wallets.from.style.border = '1px solid red'
    errors.push('No wallet found')
  } else {
    this.elements.wallets.from.style.border = null
  }
  if (this.elements.wallets.to.required && this.elements.wallets.to.value === 'null') {
    this.elements.wallets.to.style.border = '1px solid red'
    errors.push('No wallet found')
  } else {
    this.elements.wallets.to.style.border = null
  }

  if (this.elements.category.required && this.elements.category.value === 'null') {
    this.elements.category.style.border = '1px solid red'
    errors.push('No category found')
  } else {
    this.elements.category.style.border = null
  }
  if (this.elements.amount.required && this.elements.amount.value === '') {
    this.elements.amount.style.border = '1px solid red'
    errors.push('No amount specified')
  } else {
    this.elements.amount.style.border = null
  }
  if (errors.length) {
    throw new Error(errors.join(';\n'))
  }
}
