import { Router } from '@/routes';
import './TransactionForm.scss';

export default function TransactionForm() {
  this.typeOptions = ['income', 'outcome', 'transfer', 'correction'];
  this.elements = {
    form: document.createElement('form'),
    formOwner: null,
    formDate: new Date(),
    formType: document.createElement('select'),
    formWallets: {
      from: null,
      to: null,
    },
    formCategory: document.createElement('select'),
    formAmount: document.createElement('input'),
    formComment: document.createElement('input'),
    formButton: document.createElement('button'),
  };
}

TransactionForm.prototype.render = function (parent) {
  this.elements.form.classList.add('transactionForm');
  this.elements.formType.classList.add('transactionForm__type');
  // this.elements.formWallets.classList.add('transactionForm__wallets');
  this.elements.formCategory.classList.add('transactionForm__category');
  this.elements.formAmount.classList.add('transactionForm__amount');
  this.elements.formComment.classList.add('transactionForm__comment');
  this.elements.formButton.classList.add('transactionForm__button');

  this.elements.formAmount.placeholder = 'Що по бабкам? Скільки хочеш скинути?';
  this.elements.formComment.placeholder =
    'Розкажи, що тебе довело до цієї ситуації...';

  this.elements.formOwner = Router.getCurrentUser().uid;
  this.elements.formType.innerHTML = this.categoryOptions(this.typeOptions);
  this.elements.formComment.setAttribute('type', 'textarea');
  this.elements.formButton.innerText = 'Save';
  this.elements.formButton.addEventListener('click', (event) =>
    this.handleCreateForm(event)
  );

  this.elements.form.append(
    this.elements.formType,
    this.elements.formCategory,
    this.elements.formAmount,
    this.elements.formComment,
    this.elements.formButton
  );
  parent.append(this.elements.form);
};

TransactionForm.prototype.handleCreateForm = function (event) {
  event.preventDefault();

  //необхідно звіритись з тим, як буде виглядати транзакція в базі даних, але станом на зараз підготую шаблон строврення обєкта транзакції:
  this.elements.formType.name = 'type';
  this.elements.formWallets.name = 'wallets';
  this.elements.formCategory.name = 'category';
  this.elements.formAmount.name = 'amount';
  this.elements.formComment.name = 'comment';
  this.elements.formDate.name = 'date';

  const formData = new FormData(this.elements.form);

  const newTransactionData = {
    type: formData.get('type'),
    wallets: formData.get('wallets'),
    category: formData.get('category'),
    amount: formData.get('amount'),
    comment: formData.get('comment'),
    owner: Router.getCurrentUser().uid,
    date: formData.get('date'),
  };

  // await addDoc(тут вставити аргументом посилання на колекцію транзакцій, newTransactionData);

  //тут буде викликатись рендер форми нової транзакції хто створює форму, якщо я , то що у формі повинно бути?
  const newTransactionForm = new TransactionForm();

  console.log('new transaction');
};

TransactionForm.prototype.categoryOptions = function (optionsSet) {
  const options = optionsSet;
  return [
    ...new Set(
      options.map(
        (item) =>
          `<option value="${item}" data-filter="${item}">${item}</option>`
      )
    ),
  ].join();
};
