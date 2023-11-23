import { addDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { transactionsCollectionRef } from "@root/firebase";

import {
  getWallets,
  getWalletRefByName,
  getCategoryRefByName,
  getCategoriesByType,
  transactionTypeActions,
} from "@/API";

import { makeOptions, createElement, createInput, createSelect } from "@/utils";
import { Router } from "@/routes";

import { TRANSACTION_TYPE } from "./TransactionForm.helper";

import "./TransactionForm.scss";

export default function TransactionForm({ afterSubmit }) {
  this.typeOptions = [
    TRANSACTION_TYPE.INCOME,
    TRANSACTION_TYPE.OUTCOME,
    TRANSACTION_TYPE.TRANSFER,
    TRANSACTION_TYPE.CORRECTION,
  ];

  this.afterSubmit = afterSubmit;

  this.elements = {
    owner: null,
    self: createElement({
      tagName: "form",
      name: "transaction-form",
      id: "t-form",
      innerText: "",
      className: "transactionForm",
    }),
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
  const categories = await getCategoriesByType();
  const categoriesOptions = categories.map((item) => item.name);

  this.elements.type.addEventListener("change", (event) => {
    this.typeListener(event);
  });

  this.elements.category.innerHTML = makeOptions(
    categoriesOptions,
    "transactionForm__category-options"
  );

  this.elements.typeLabel.append(this.elements.type);
  this.elements.categoryLabel.append(this.elements.category);
  this.elements.amountLabel.append(this.elements.amount);
  this.elements.commentLabel.append(this.elements.comment);

  this.elements.button.addEventListener("click", (event) =>
    this.handleSubmit(event)
  );

  this.elements.self.append(
    this.elements.typeLabel,
    this.elements.categoryLabel,
    this.elements.amountLabel,
    this.elements.commentLabel,
    this.elements.button
  );

  parent.append(this.elements.self);
};

TransactionForm.prototype.handleSubmit = async function (e) {
  e.preventDefault();

  const formData = new FormData(this.elements.self);

  const newTransactionData = {
    type: formData.get("type"),
    from: await getWalletRefByName(formData.get("walletFrom")),
    to: await getWalletRefByName(formData.get("walletTo")),
    category: await getCategoryRefByName(formData.get("category")),
    amount: Number(formData.get("amount")),
    comment: formData.get("comment"),
    owner: Router.getCurrentUser().uid,
    date: Timestamp.fromDate(new Date()),
  };

  await transactionTypeActions(newTransactionData);
  await addDoc(transactionsCollectionRef, newTransactionData);
  this.afterSubmit?.(e, newTransactionData);
};

TransactionForm.prototype.typeListener = async function (e) {
  this.elements.wallets.from = null;
  this.elements.wallets.to = null;
  this.elements.wallets.from?.remove();
  this.elements.wallets.to?.remove();

  const selectedType = e.target.value;

  this.elements.category.innerHTML = makeOptions(
    [],
    "transactionForm__category"
  );

  this.elements.wallets.from = await this.makeWalletsInput("walletFrom");
  this.elements.wallets.to = await this.makeWalletsInput("walletTo");
  this.elements.wallets.labelFrom.append(this.elements.wallets.from);
  this.elements.wallets.labelTo.append(this.elements.wallets.to);

  switch (selectedType) {
    case TRANSACTION_TYPE.TRANSFER:
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
    case TRANSACTION_TYPE.CORRECTION:
      this.elements.categoryLabel.remove();
    case TRANSACTION_TYPE.INCOME:
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
    case TRANSACTION_TYPE.OUTCOME:
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
