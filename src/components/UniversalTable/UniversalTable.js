import "./UniversalTable.scss";

export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick;
  this.collection = collection;
  this.headers = options.headers;
  this.emptyCellValue = options.emptyCellValue || "";
  this.classes = {
    cell: options?.classes?.cell || "table-cell",
    row: options?.classes?.row || "table-row",
    table: options?.classes?.table || "table-body",
  };
}

UniversalTable.prototype.render = function (parent) {
  const tableHeader = document.createElement("ul");
  tableHeader.classList.add(this.classes.table);

  const tableHeaderRow = document.createElement("li");
  tableHeaderRow.classList.add(this.classes.row);

  this.headers.forEach((cell) => {
    tableHeaderRow.innerHTML += `<span class="${this.classes.cell}">${cell.title}</span>`;
  });
  tableHeader.append(tableHeaderRow);

  this.tableBody = document.createElement("ul");
  this.tableBody.classList.add(this.classes.table);

  if (this.rowClick) {
    this.tableBody.onclick = (e) => {
      this.rowClickHandler(e);
    };
  }

  this.collection.forEach((row, index) => {
    const tableRow = document.createElement("li");
    tableRow.classList.add(this.classes.row);

    tableRow.dataset.ind = index;
    tableRow.classList.add("t-row");

    tableRow.innerHTML = this.headers
      .map(
        ({ name }) =>
          `<span class="${this.classes.cell}">${
            row[name] || this.emptyCellValue
          }</span>`
      )
      .join("");

    this.tableBody.append(tableRow);
  });
  parent.append(tableHeader, this.tableBody);
  console.log(this.collection);
};

UniversalTable.prototype.rowClickHandler = function (e) {
  let clickedIndex = 0;

  if (!e.target.classList.contains(this.classes.row)) {
    clickedIndex = e.target.closest(`.${this.classes.row}`).dataset;
  } else {
    clickedIndex = e.target.dataset;
  }
  this.rowClick(this.collection[clickedIndex]);
};

UniversalTable.prototype.updateTable = function (updatedCollection) {
  // ця частина працює. Нічого складного
  const rowsToAdd = this.collection.filter(
    (item, index) => !updatedCollection[index]?.name.includes(item.name)
  );
  const rowsToRemove = updatedCollection.filter(
    (item, index) => !this.collection[index]?.name.includes(item.name)
  );

  // Ця виглядає складно. Щоб видалити, збираю усі клітинки...
  const walletRows = document.querySelectorAll(".table-cell");
  /*   ...проходжусь по усіх і порівнюю Назви волетів з назвами, які треба видалити.
  Якщо знайшов - шукаю елемент з таким же дата ід та видаляю. 
  Але якщо на сторінці є кілька таблиць - буде проблема. 
  Треба інший дата-атрибут або якось робити його унікальним  //TODO: вирішити */
  walletRows.forEach((row) => {
    rowsToRemove.forEach((item) => {
      if (item.name === row.innerText) {
        document
          .querySelector(`'[data-ind="${row.parentElement.dataset.ind}"]'`)
          .remove();
      }
    });
  });

  /* Та ж потенційна проблема з додаванням нових рядків.
  Їм треба генерувати унікальні дата-атрибути і хз як краще якщо кілька таблиць.
  */
};
