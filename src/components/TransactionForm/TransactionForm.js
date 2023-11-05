import { addDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { transactionsCollectionRef } from '@root/firebase';

import {
  getWallets,
  getWalletRefByName,
  getCategoryRefByName,
  getCategoriesByType,
} from '@/API';

import { makeOptions, createElement, createInput, createSelect } from '@/utils';
import { Router } from '@/routes';

import './TransactionForm.scss';

export default function TransactionForm({ afterSubmit }) {
  this.typeOptions = ['income', 'outcome', 'transfer', 'correction'];
  this.categoryOptions = [];
  this.afterSubmit = afterSubmit;
  this.elements = {
    self: document.createElement('form'),
    owner: null,
    date: new Date(),
    typeLabel: createElement({
      tagName: 'label',
      name: 'transaction-type-label',
      id: 'ttLabel',
      innerText: 'Transaction type:',
      className: 'transactionForm__label',
    }),
    type: document.createElement('select'),
    wallets: {
      from: null,
      to: null,
    },
    categoryLabel: createElement({
      tagName: 'label',
      name: 'category-label',
      id: 'catLabel',
      innerText: 'Category:',
      className: 'transactionForm__label',
    }),
    category: document.createElement('select'),
    amountLabel: createElement({
      tagName: 'label',
      name: 'amount-label',
      id: 'amoLabel',
      innerText: 'Amount:',
      className: 'transactionForm__label',
    }),
    amount: document.createElement('input'),
    commentLabel: createElement({
      tagName: 'label',
      name: 'comment-label',
      id: 'comLabel',
      innerText: "Comment (не обов'язково):",
      className: 'transactionForm__label',
    }),
    comment: document.createElement('input'),
    button: document.createElement('button'),
  };
}

TransactionForm.prototype.render = async function (parent) {
  this.elements.self.classList.add('transactionForm');
  this.elements.type.classList.add('transactionForm__type');
  this.elements.category.classList.add('transactionForm__category');
  this.elements.amount.classList.add('transactionForm__amount');
  this.elements.comment.classList.add('transactionForm__comment');
  this.elements.button.classList.add('transactionForm__button');

  this.elements.type.name = 'type';
  this.elements.category.name = 'category';
  this.elements.amount.name = 'amount';
  this.elements.comment.name = 'comment';
  this.elements.date.name = 'date';

  this.elements.amountLabel.append(this.elements.amount);

  this.elements.commentLabel.append(this.elements.comment);

  this.elements.owner = Router.getCurrentUser().uid;
  this.elements.type.innerHTML = makeOptions(this.typeOptions);
 
  this.elements.typeLabel.append(this.elements.type);

  this.categories = await getCategoriesByType();
  this.categoriesOptions = this.categories.map((item) => item.name);

  this.elements.category.innerHTML = makeOptions(this.categoriesOptions);
  this.elements.categoryLabel.append(this.elements.category);

  this.elements.comment.setAttribute('type', 'textarea');
  this.elements.button.innerText = 'Save';

  this.elements.button.addEventListener('click', (event) =>
    this.handleSubmit(event)
  );

  this.elements.type.addEventListener('change', (event) => {
    this.typeListener(event);
  });

  this.elements.self.append(
    this.elements.typeLabel,
    this.elements.categoryLabel,
    this.elements.amountLabel,
    this.elements.commentLabel,
    this.elements.button
  );

  parent.append(this.elements.self);
  console.log(Router.getCurrentUser().uid);
};

TransactionForm.prototype.handleSubmit = async function (event) {
  event.preventDefault();

  const currentDate = new Date();

  const formData = new FormData(this.elements.self);

  const newTransactionData = {
    type: formData.get('type'),
    from: await getWalletRefByName(formData.get('walletFrom')),
    to: await getWalletRefByName(formData.get('walletTo')),
    category: await getCategoryRefByName(formData.get('category')),
    amount: Number(formData.get('amount')),
    comment: formData.get('comment'),
    owner: Router.getCurrentUser().uid,
    date: Timestamp.fromDate(currentDate),
  };

  console.log('newTransactionData', newTransactionData);

  const transactionType = newTransactionData.type;

  //прибрати весь хардкод
  switch (transactionType) {
    case 'correction':
      if (newTransactionData.comment === '') {
        newTransactionData.comment = 'Корекція балансу гаманцю';
      }
    case 'income':
      const walletToData = (await getDoc(newTransactionData.to)).data();
      await updateDoc(newTransactionData.to, {
        balance: walletToData.balance + newTransactionData.amount,
      });

      break;
    case 'outcome':
      const walletFromData = (await getDoc(newTransactionData.from)).data();

      await updateDoc(newTransactionData.from, {
        balance: walletFromData.balance - newTransactionData.amount,
      });

      break;
    case 'transfer':
      const walletFromDataTransfer = (
        await getDoc(newTransactionData.from)
      ).data();

      const walletToDataTransfer = (await getDoc(newTransactionData.to)).data();

      await updateDoc(newTransactionData.from, {
        balance: walletFromDataTransfer.balance - newTransactionData.amount,
      });

      await updateDoc(newTransactionData.to, {
        balance: walletToDataTransfer.balance + newTransactionData.amount,
      });

      break;
  }
  await addDoc(transactionsCollectionRef, newTransactionData);
  this.afterSubmit?.(event, newTransactionData);
};

TransactionForm.prototype.typeListener = async function (event) {
  this.elements.wallets.from?.remove();
  this.elements.wallets.to?.remove();
  this.elements.wallets.from = null;
  this.elements.wallets.to = null;
  this.elements.category.innerHTML = makeOptions(
    [],
    'transactionForm__category'
  );

  const selectedType = event.target.value;

  this.elements.wallets.from = await this.makeWalletsInput('walletFrom');
  this.elements.wallets.to = await this.makeWalletsInput('walletTo');

  switch (selectedType) {
    case 'transfer':
      this.elements.category.remove();
      this.elements.type.insertAdjacentElement(
        'afterend',
        this.elements.wallets.from
      );
      this.elements.wallets.from.insertAdjacentElement(
        'afterend',
        this.elements.wallets.to
      );
      break;
    case 'correction':
      this.elements.category.remove();
    case 'income':
      const getCategoriesNamesIncome = [];
      (await getCategoriesByType('income')).forEach((item) =>
        getCategoriesNamesIncome.push(item.name)
      );
      this.elements.category.innerHTML = makeOptions(
        getCategoriesNamesIncome,
        'transactionForm__category'
      );

      this.elements.type.insertAdjacentElement(
        'afterend',
        this.elements.wallets.to
      );
      break;
    case 'outcome':
      const getCategoriesNamesOutcome = [];
      (await getCategoriesByType('outcome')).forEach((item) =>
        getCategoriesNamesOutcome.push(item.name)
      );
      this.elements.category.innerHTML = makeOptions(
        getCategoriesNamesOutcome,
        'transactionForm__category'
      );
      this.elements.type.insertAdjacentElement(
        'afterend',
        this.elements.wallets.from
      );
      break;
  }
};

TransactionForm.prototype.makeWalletsInput = async function (inputName) {
  const wallets = await getWallets();
  const walletsOptions = wallets.map((item) => item.name);
  const walletsInput = document.createElement('select');
  walletsInput.name = inputName;
  walletsInput.classList.add('transactionForm__wallets');
  walletsInput.innerHTML = makeOptions(
    walletsOptions,
    'transactionForm__wallets'
  );
  return walletsInput;
};
