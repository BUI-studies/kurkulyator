import {
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  transactionsCollectionRef,
  categoriesCollectionRef,
  walletsCollectionRef,
} from '@root/firebase';

import {
  getWallets,
  getWalletRefByName,
  getCategoryRefByName,
  getCategoriesByType,
} from '@/API';
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
    typeLabel: document.createElement('label'),
    type: document.createElement('select'),
    wallets: {
      from: null,
      to: null,
    },
    categoryLabel: document.createElement('label'),
    category: document.createElement('select'),
    amountLabel: document.createElement('label'),
    amount: document.createElement('input'),
    commentLabel: document.createElement('label'),
    comment: document.createElement('input'),
    button: document.createElement('button'),
  };
}

TransactionForm.prototype.render = async function (parent) {
  this.elements.self.classList.add('transactionForm');
  this.elements.type.classList.add('transactionForm__type');
  // this.elements.formWallets.classList.add('transactionForm__wallets');
  this.elements.category.classList.add('transactionForm__category');
  this.elements.amount.classList.add('transactionForm__amount');
  this.elements.comment.classList.add('transactionForm__comment');
  this.elements.button.classList.add('transactionForm__button');

  //необхідно звіритись з тим, як буде виглядати транзакція в базі даних, але станом на зараз підготую шаблон строврення обєкта транзакції:
  this.elements.type.name = 'type';
  this.elements.category.name = 'category';
  this.elements.amount.name = 'amount';
  this.elements.comment.name = 'comment';
  this.elements.date.name = 'date';

  this.elements.amountLabel.innerText = 'Amount:';
  this.elements.amountLabel.classList.add('transactionForm__label');
  this.elements.amountLabel.append(this.elements.amount);

  this.elements.commentLabel.innerText = "Comment (не обов'язково):";
  this.elements.commentLabel.classList.add('transactionForm__label');
  this.elements.commentLabel.append(this.elements.comment);

  this.elements.owner = Router.getCurrentUser().uid;
  this.elements.type.innerHTML = this.makeOptions(this.typeOptions);

  this.elements.typeLabel.classList.add('transactionForm__label');
  this.elements.typeLabel.innerText = 'Transaction type:';
  this.elements.typeLabel.append(this.elements.type);

  this.categories = await getCategoriesByType();
  this.categoriesOptions = this.categories.map((item) => item.name);

  this.elements.categoryLabel.innerText = 'Category:';
  this.elements.categoryLabel.classList.add('transactionForm__label');
  this.elements.category.innerHTML = this.makeOptions(this.categoriesOptions);
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
    from: await getWalletRefByName(formData.get('walletFrom')), //returns DocumentRef or null
    to: await getWalletRefByName(formData.get('walletTo')), //returns DocumentRef or null
    category: await getCategoryRefByName(formData.get('category')),
    amount: Number(formData.get('amount')),
    comment: formData.get('comment'),
    owner: Router.getCurrentUser().uid,
    date: Timestamp.fromDate(currentDate),
  };

  console.log('newTransactionData', newTransactionData);

  const transactionType = newTransactionData.type;

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
  this.afterSubmit?.(event, newTransactionData); //calls the function only if it exists
};

TransactionForm.prototype.makeOptions = function (optionsSet) {
  const options = optionsSet;
  return (
    `<option default selected value="null">--none--</option>` +
    options
      .map(
        (item) =>
          `<option value="${item}" data-filter="${item}">${item}</option>`
      )
      .join()
  );
};

TransactionForm.prototype.typeListener = async function (event) {
  this.elements.wallets.from?.remove();
  this.elements.wallets.to?.remove();
  this.elements.wallets.from = null;
  this.elements.wallets.to = null;
  this.elements.category.innerHTML = this.makeOptions([]);

  const selectedType = event.target.value;

  switch (selectedType) {
    case 'transfer':
      this.elements.wallets.from = await this.makeWalletsInput('walletFrom');
      this.elements.wallets.to = await this.makeWalletsInput('walletTo');
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
      this.elements.wallets.to = await this.makeWalletsInput('walletTo');
      const getCategoriesNamesIncome = [];
      (await getCategoriesByType('income')).forEach((item) =>
        getCategoriesNamesIncome.push(item.name)
      );
      this.elements.category.innerHTML = this.makeOptions(
        getCategoriesNamesIncome
      );

      this.elements.type.insertAdjacentElement(
        'afterend',
        this.elements.wallets.to
      );
      break;

    case 'outcome':
      this.elements.wallets.from = await this.makeWalletsInput('walletFrom');

      const getCategoriesNamesOutcome = [];
      (await getCategoriesByType('outcome')).forEach((item) =>
        getCategoriesNamesOutcome.push(item.name)
      );
      this.elements.category.innerHTML = this.makeOptions(
        getCategoriesNamesOutcome
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

  const walletsOptions = wallets.map((item) => item.name); //['car','salary','cash',...]
  const walletsInput = document.createElement('select');

  walletsInput.name = inputName;

  walletsInput.classList.add('transactionForm__wallets');
  walletsInput.innerHTML = this.makeOptions(walletsOptions);

  return walletsInput;
};
