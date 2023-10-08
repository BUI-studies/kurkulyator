import { TransactionForm } from '@/components';
export default function Home() {
  this.elements = {
    self: document.createElement('div'),
    button: document.createElement('button'),
  };
}

Home.prototype.render = function (parent) {
  this.elements.button.innerText = 'New transaction';

  this.elements.self.classList.add('home');
  this.elements.button.classList.add('home__button__newTransaction');
  this.elements.button.addEventListener('click', (event) =>
    this.handleCreateForm(event)
  );

  this.elements.self.append(this.elements.button);

  console.log('Home.prototype.render');
};

Home.prototype.handleCreateForm = function (event) {
  event.preventDefault();
  //тут буде викликатись рендер форми нової транзакції хто створює форму, якщо я , то що у формі повинно бути?
  const newTransactionForm = new TransactionForm();

  newTransactionForm.render(this.elements.self);
  console.log('new transaction');
};
