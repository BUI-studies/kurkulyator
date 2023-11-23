import { addDoc, Timestamp } from 'firebase/firestore';

import { transactionsCollectionRef } from '../../../firebase';

import { Router } from '@/routes';
import { UniversalButton } from '@/components';
import { getWallet, saveWallet } from '@/API';
import { createElement, createInput } from '@/utils';

import './WalletsForm.scss';

export default function WalletsForm({ onClose }) {
  this.onClose = onClose;
  this.elements = {
    form: createElement({
      tagName: 'form',
    }),
    titleLabel: createElement({
      tagName: 'label',
      innerText: 'Title',
    }),
    titleInput: createInput({
      type: 'text',
      name: 'titleInput',
    }),

    balanceLabel: createElement({
      tagName: 'label',
      innerText: 'Balance',
    }),
    balanceInput: createInput({
      type: 'number',
      name: 'balanceInput',
      value: 0,
    }),

    addButton: new UniversalButton({
      text: 'Add new wallet',
      className: 'addNewWalletBtn',
      onClick: (e) => {
        this.submitForm(e);
      },
    }),
    cancelUniversalButton: new UniversalButton({
      text: 'Cancel',
      className: 'cancelBtn',
      onClick: (e) => {
        this.closeForm(e);
      },
    }),
  };
}

WalletsForm.prototype.render = function (parent) {
  this.elements.titleLabel.append(this.elements.titleInput);
  this.elements.balanceLabel.append(this.elements.balanceInput);

  this.elements.form.append(
    this.elements.titleLabel,
    this.elements.balanceLabel
  );

  this.elements.addButton.render(this.elements.form);
  this.elements.cancelUniversalButton.render(this.elements.form);

  parent?.append(this.elements.form);
};

WalletsForm.prototype.submitForm = async function (e) {
  e.preventDefault();
  const walletObj = {
    name: this.elements.titleInput.value,
    balance: this.elements.balanceInput.value,
    owner: Router.getCurrentUser().uid,
  };

  const existingWallet = await getWallet(walletObj.name);

  if (existingWallet !== null) {
    throw new Error('The wallet with same name has already exist');
  } else if ((walletObj.name === '') | (walletObj.balance === '')) {
    throw new Error('The fields shouldn`t be empty');
  } else {
    this.elements.addButton.disabled = true;
    this.createdWallet = await saveWallet(walletObj);
    await this.addTransaction(Number(walletObj.balance));
  }

  this.closeForm(e);
};

WalletsForm.prototype.closeForm = function (e) {
  e.preventDefault();
  this.elements.form.reset();
  this.onClose?.(); //conditional function call
};

WalletsForm.prototype.addTransaction = async function (amount) {
  const obj = {
    date: Timestamp.fromDate(new Date()),
    type: 'income',
    amount: amount,
    category: null,
    comment: 'initial balance',
    to: this.createdWallet,
    owner: Router.getCurrentUser().uid,
  };
  await addDoc(transactionsCollectionRef, obj);
};
