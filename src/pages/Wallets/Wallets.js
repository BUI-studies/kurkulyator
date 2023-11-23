import { getWallets } from '@/API';
import { createElement } from '@/utils';
import {
  UniversalTable,
  ModalWindow,
  WalletsForm,
  UniversalButton,
} from '@/components';

export default function Wallets() {
  this.pageWrapper = createElement({
    tagName: 'div',
  });

  this.addButton = new UniversalButton({
    text: 'New wallet',
    onClick: (event) => this.handleNewWalletClick(event),
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
    this.parent = parent;
  }

  this.pageWrapper.replaceChildren();

  this.wallets = await getWallets();

  this.walletTable = new UniversalTable(this.wallets, {
    headers: [
      { name: 'name', title: 'Title' },
      { name: 'balance', title: 'Balance' },
    ],
    generateDataset(rowObj) {
      return `wallets__${rowObj.name}`;
    },
  });

  this.walletTable.render(this.pageWrapper);
  this.addButton.render(this.pageWrapper);
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
