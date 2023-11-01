import { getWallets, getWallet, saveWallet } from '@/API';
import { UniversalTable, ModalWindow, WalletsForm } from '@/components';
import { Router } from '@/routes';

export default function Wallets() {
  this.pageWrapper = document.createElement('div');
  this.addButton = document.createElement('button');
  const handleModalClose = () => this.modal.close();
  this.modal = new ModalWindow();
  this.walletForm = new WalletsForm({
    onClose: handleModalClose,
  });
}

Wallets.prototype.render = async function (parent) {
  this.pageWrapper.replaceChildren();

  this.wallets = await getWallets();

  this.walletTable = new UniversalTable(this.wallets, {
    headers: [
      { name: 'name', title: 'Title' },
      { name: 'balance', title: 'Balance' },
    ],
  });

  this.addButton.textContent = 'New wallet';
  this.addButton.onclick = (e) => this.handleNewWalletClick(e);
  this.walletTable.render(this.pageWrapper);
  this.pageWrapper.append(this.addButton);
  parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = async function (e) {
  e.preventDefault();
  this.modal.render(this.pageWrapper, this.walletForm);
};




