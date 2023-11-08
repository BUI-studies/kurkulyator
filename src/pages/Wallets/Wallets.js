import { getWallets } from "@/API";
import { UniversalTable, ModalWindow, WalletsForm } from "@/components";

export default function Wallets() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");
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
      { name: "name", title: "Title" },
      { name: "balance", title: "Balance" },
    ],
    generateDataset(rowObj) {
      return `wallets__${rowObj.name}`;
    },
    // onClick(row) {
    //   console.log(row);
    // },
  });

  this.addButton.textContent = "New wallet";
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
