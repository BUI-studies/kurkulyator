import "./UniversalTable.scss";

export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick;
  this.collection = collection;
  this.headers = options.headers;
}

UniversalTable.prototype.render = function (parent) {
  const tableHeader = document.createElement("ul");
  const tableHeaderRow = document.createElement("li");

  this.headers.forEach((cell) => {
    tableHeaderRow.innerHTML += `<span>${cell.title}</span>`;
  });
  tableHeader.append(tableHeaderRow);

  const tableBody = document.createElement("ul");

  if (!this.rowClick) {
    console.log("No row click callback attached");
  } else {
    tableBody.onclick = (e) => {
      this.rowClickHandler(e);
    };
  }

  this.collection.forEach((row, index) => {
    const tableRow = document.createElement("li");
    tableRow.dataset.ind = index;
    tableRow.classList.add("t-row");

    tableRow.innerHTML = this.headers
      .map(({ name }) => `<span>${row[name]}</span>`)
      .join("");

    tableBody.append(tableRow);
  });

  parent.append(tableHeader, tableBody);
};

UniversalTable.prototype.rowClickHandler = function (e) {
  let clickedIndex = 0;

  if (!e.target.classList.contains("t-row")) {
    clickedIndex = e.target.closest(".t-row").dataset;
  } else {
    clickedIndex = e.target.dataset;
  }
  this.rowClick(this.collection[clickedIndex]);
};
