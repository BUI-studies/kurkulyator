import { addDoc, getDocs, query, where } from 'firebase/firestore';
import {
  transactionsCollectionRef,
  categoriesCollectionRef,
} from '@root/firebase';

import { getWallets, getWalletRefByName, getCategoriesByType } from '@/API';
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
    type: document.createElement('select'),
    wallets: {
      from: null,
      to: null,
    },
    category: document.createElement('select'),
    amount: document.createElement('input'),
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

  this.elements.amount.placeholder = 'Що по бабкам? Скільки хочеш скинути?';
  this.elements.comment.placeholder =
    'Розкажи, що тебе довело до цієї ситуації...';

  this.elements.owner = Router.getCurrentUser().uid;
  this.elements.type.innerHTML = this.makeOptions(this.typeOptions);

  this.categories = await getCategoriesByType();
  this.categoriesOptions = this.categories.map((item) => item.name);
  this.elements.category.innerHTML = this.makeOptions(this.categoriesOptions);
  this.elements.comment.setAttribute('type', 'textarea');
  this.elements.button.innerText = 'Save';

  this.elements.button.addEventListener('click', (event) =>
    this.handleSubmit(event)
  );

  this.elements.type.addEventListener('change', (event) => {
    this.typeListener(event);
  });

  this.elements.self.append(
    this.elements.type,
    this.elements.category,
    this.elements.amount,
    this.elements.comment,
    this.elements.button
  );

  parent.append(this.elements.self);
  console.log(Router.getCurrentUser().uid);
};

TransactionForm.prototype.handleSubmit = async function (event) {
  event.preventDefault();

  const formData = new FormData(this.elements.self);

  const newTransactionData = {
    type: formData.get('type'),
    from: await getWalletRefByName(formData.get('walletFrom')),
    to: await getWalletRefByName(formData.get('walletTo')),
    category: formData.get('category'),
    amount: formData.get('amount'),
    comment: formData.get('comment'),
    owner: Router.getCurrentUser().uid,
    date: formData.get('date'),
  };

  console.log(newTransactionData);

  await addDoc(transactionsCollectionRef, newTransactionData);

  this.afterSubmit(event, newTransactionData);
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
