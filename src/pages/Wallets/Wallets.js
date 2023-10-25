import { getWallets } from '@/API';
import { UniversalTable } from '@/components';

export default function Wallets() {
  this.pageWrapper = document.createElement('div');
  this.addButton = document.createElement('button');

  this.placeholderText = document.createElement('h2'); // temp placeholder
  this.placeholderText.textContent = 'Wallets page';
}

Wallets.prototype.render = async function (parent) {
  this.wallets = await getWallets();

  this.walletTable = new UniversalTable(wallets, {
    headers: [
      { name: 'title', title: 'Title' },
      { name: 'balance', title: 'Balance' },
    ],
  });

  this.addButton.textContent = 'New wallet';
  this.addButton.onclick = (e) => this.handleNewWalletClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

Wallets.prototype.handleNewWalletClick = function (e) {
  e.preventDefault();
};
