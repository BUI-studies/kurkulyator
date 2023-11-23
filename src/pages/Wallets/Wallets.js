import { getWallets } from '@/API';
import { createElement } from '@/utils';
import { UniversalTable, ModalWindow, WalletsForm } from '@/components';

export default function Wallets() {
  this.pageWrapper = createElement({
    tagName: 'div',
  });
  this.addButton = createElement({
    tagName: 'button',
    innerText: 'New wallet',
  });
  const handleModalClose = () => {
    this.modal.close();
    this.handleWalletsUpdate();
  };
  this.modal = new ModalWindow();
  this.walletForm = new WalletsForm({
    onClose: handleModalClose,
  });
}

Wallets.prototype.render = async function (parent) {
  if (parent) {
    this.parent = parent; //saves the parent fro the first render and allows us to further render this page without render
  }

  this.pageWrapper.replaceChildren();

  this.wallets = await getWallets();

  this.walletTable = new UniversalTable(this.wallets, {
    headers: [
      { name: 'name', title: 'Title' },
      { name: 'balance', title: 'Balance' },
    ],
  });

  this.addButton.onclick = (e) => this.handleNewWalletClick(e);
  this.walletTable.render(this.pageWrapper);
  this.pageWrapper.append(this.addButton);
  this.parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = async function (e) {
  e.preventDefault();
  this.modal.render(this.pageWrapper, this.walletForm);
};
Wallets.prototype.handleWalletsUpdate = async function () {
  this.wallets = await getWallets();
  this.walletTable.updateTable(this.wallets);
};
