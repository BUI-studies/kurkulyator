import './WalletsForm.scss';
import { Router } from '@/routes';
import { UniversalButton } from '@/components';
import { getWallet, saveWallet } from '@/API';

export default function WalletsForm({ onClose }) {
  this.onClose = onClose;
  this.elements = {
    form: document.createElement('form'),
    titleInput: document.createElement('input'),
    balanceInput: document.createElement('input'),
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
  this.elements.titleInput.type = 'text';
  this.elements.balanceInput.type = 'number';

  this.elements.form.append(this.elements.titleInput, this.elements.balanceInput);

  this.elements.addButton.render(this.elements.form);
  this.elements.cancelUniversalButton.render(this.elements.form);

  parent?.append(this.elements.form);
};

WalletsForm.prototype.submitForm = async function (e) {
  e.preventDefault();

  const walletObj = {
    title: this.elements.titleInput.value,
    balance: this.elements.balanceInput.value,
    owner: Router.getCurrentUser().uid,
  };

  const existingWallet = await getWallet(walletObj.title);

  if (existingWallet !== null) {
    throw new Error('The wallet with same name has already exist');
  } else if ((walletObj.title === '') | (walletObj.balance === '')) {
    throw new Error('The fields shouldn`t be empty');
  } else {
    this.elements.addButton.disabled = true;
    await saveWallet(walletObj);
    this.elements.titleInput.value = '';
    this.elements.balanceInput.value = '';
    this.onClose();
  }
};

WalletsForm.prototype.closeForm = function (e) {
  e.preventDefault();
  this.elements.titleInput.value = '';
  this.elements.balanceInput.value = '';
  this.onClose();
};
