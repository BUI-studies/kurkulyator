import { addDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { transactionsCollectionRef } from "@root/firebase";

import {
  getWallets,
  getWalletRefByName,
  getCategoryRefByName,
  getCategoriesByType,
} from "@/API";

import { makeOptions, createElement, createInput, createSelect } from "@/utils";
import { Router } from "@/routes";

import "./TransactionForm.scss";

export default function TransactionForm({ afterSubmit }) {
  this.typeOptions = ["income", "outcome", "transfer", "correction"];

  this.afterSubmit = afterSubmit;
  this.elements = {
    self: createElement({
      tagName: "form",
      name: "transaction-form",
      id: "t-form",
      innerText: "",
      className: "transactionForm",
    }),
    owner: null,
    date: new Date(),
    typeLabel: createElement({
      tagName: "label",
      name: "transaction-type-label",
      id: "ttLabel",
      innerText: "Transaction type:",
      className: "transactionForm__label",
    }),

    type: createSelect({
      options: this.typeOptions,
      name: "type",
      className: "transactionForm__type",
      optionsClassName: "transactionForm__type-option",
    }),
    wallets: {
      labelFrom: createElement({
        tagName: "label",
        name: "wallet-from-label",
        id: "wfLabel",
        innerText: "From:",
        className: "transactionForm__label",
      }),
      from: null,
      labelTo: createElement({
        tagName: "label",
        name: "wallet-to-label",
        id: "wtLabel",
        innerText: "To:",
        className: "transactionForm__label",
      }),
      to: null,
    },
    categoryLabel: createElement({
      tagName: "label",
      name: "category-label",
      id: "catLabel",
      innerText: "Category:",
      className: "transactionForm__label",
    }),

    category: createSelect({
      name: "category",
      className: "transactionForm__category",
    }),

    amountLabel: createElement({
      tagName: "label",
      name: "amount-label",
      id: "amoLabel",
      innerText: "Amount:",
      className: "transactionForm__label",
    }),

    amount: createInput({
      name: "amount",
      id: "tFormAmount",
      className: "transactionForm__amount",
      value: "",
    }),
    commentLabel: createElement({
      tagName: "label",
      name: "comment-label",
      id: "comLabel",
      innerText: "Comment (не обов'язково):",
      className: "transactionForm__label",
    }),

    comment: createInput({
      name: "comment",
      id: "tFormComment",
      className: "transactionForm__comment",
      value: "",
    }),
    button: createElement({
      tagName: "button",
      name: "form-submit",
      id: "tFormSubmit",
      innerText: "Save",
      className: "transactionForm__button",
    }),
  };
}

TransactionForm.prototype.render = async function (parent) {
  this.elements.date.name = "date";

  this.categories = await getCategoriesByType();
  this.categoriesOptions = this.categories.map((item) => item.name);

  this.elements.category.innerHTML = makeOptions(
    this.categoriesOptions,
    "transactionForm__category-options"
  );

  this.elements.amountLabel.append(this.elements.amount);

  this.elements.commentLabel.append(this.elements.comment);

  this.elements.owner = Router.getCurrentUser().uid;

  this.elements.typeLabel.append(this.elements.type);

  this.elements.categoryLabel.append(this.elements.category);

  this.elements.button.addEventListener("click", (event) =>
    this.handleSubmit(event)
  );

  this.elements.type.addEventListener("change", (event) => {
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
};

TransactionForm.prototype.handleSubmit = async function (event) {
  event.preventDefault();

  const currentDate = new Date();

  const formData = new FormData(this.elements.self);

  const newTransactionData = {
    type: formData.get("type"),
    from: await getWalletRefByName(formData.get("walletFrom")),
    to: await getWalletRefByName(formData.get("walletTo")),
    category: await getCategoryRefByName(formData.get("category")),
    amount: Number(formData.get("amount")),
    comment: formData.get("comment"),
    owner: Router.getCurrentUser().uid,
    date: Timestamp.fromDate(currentDate),
  };

  console.log("newTransactionData", newTransactionData);

  const transactionType = newTransactionData.type;

  //прибрати весь хардкод
  switch (transactionType) {
    case "correction":
      if (newTransactionData.comment === "") {
        newTransactionData.comment = "Корекція балансу гаманцю";
      }
    case "income":
      const walletToData = await getDoc(newTransactionData.to).data();

      await updateDoc(newTransactionData.to, {
        balance: walletToData.balance + newTransactionData.amount,
      });

      break;
    case "outcome":
      const walletFromData = await getDoc(newTransactionData.from).data();

      await updateDoc(newTransactionData.from, {
        balance: walletFromData.balance - newTransactionData.amount,
      });

      break;
    case "transfer":
      const walletFromDataTransfer = await getDoc(
        newTransactionData.from
      ).data();

      const walletToDataTransfer = await getDoc(newTransactionData.to).data();

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
    "transactionForm__category"
  );

  const selectedType = event.target.value;

  this.elements.wallets.from = await this.makeWalletsInput("walletFrom");
  this.elements.wallets.to = await this.makeWalletsInput("walletTo");

  this.elements.wallets.labelFrom.append(this.elements.wallets.from);
  this.elements.wallets.labelTo.append(this.elements.wallets.to);

  switch (selectedType) {
    case "transfer":
      this.elements.categoryLabel.remove();
      this.elements.type.insertAdjacentElement(
        "afterend",
        this.elements.wallets.labelFrom
      );
      this.elements.wallets.from.insertAdjacentElement(
        "afterend",
        this.elements.wallets.labelTo
      );
      break;
    case "correction":
      this.elements.categoryLabel.remove();
    case "income":
      const getCategoriesNamesIncome = [];
      (await getCategoriesByType("income")).forEach((item) =>
        getCategoriesNamesIncome.push(item.name)
      );
      this.elements.category.innerHTML = makeOptions(
        getCategoriesNamesIncome,
        "transactionForm__category"
      );

      this.elements.type.insertAdjacentElement(
        "afterend",
        this.elements.wallets.labelTo
      );

      if (!this.elements.categoryLabel.parentElement) {
        this.elements.wallets.to.insertAdjacentElement(
          "afterend",
          this.elements.categoryLabel
        );
      }
      break;
    case "outcome":
      const getCategoriesNamesOutcome = [];
      (await getCategoriesByType("outcome")).forEach((item) =>
        getCategoriesNamesOutcome.push(item.name)
      );
      this.elements.category.innerHTML = makeOptions(
        getCategoriesNamesOutcome,
        "transactionForm__category"
      );
      this.elements.type.insertAdjacentElement(
        "afterend",
        this.elements.wallets.labelFrom
      );
      break;
  }
};

TransactionForm.prototype.makeWalletsInput = async function (inputName) {
  const wallets = await getWallets();
  const walletsOptions = wallets.map((item) => item.name);
  const walletsInput = document.createElement("select");
  walletsInput.name = inputName;
  walletsInput.classList.add("transactionForm__wallet");
  walletsInput.innerHTML = makeOptions(
    walletsOptions,
    "transactionForm__wallet-option"
  );
  return walletsInput;
};
