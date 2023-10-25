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

  const tableBody = document.createElement("ul");
  tableBody.classList.add(this.classes.table);

  if (!this.rowClick) {
    console.log("No row click callback attached");
  } else {
    tableBody.onclick = (e) => {
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

    tableBody.append(tableRow);
  });

  parent.append(tableHeader, tableBody);
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
