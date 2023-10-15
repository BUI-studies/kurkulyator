import "./UniversalTable.scss";

export default function UniversalTable(collection, options) {
  this.rowClick = options.onClick;
  this.collection = collection;
  this.parent = options.parent;
  this.headerCells = options.headers;
}

UniversalTable.prototype.render = function () {
  //############################### tableHeader START####################################

  const tableHeader = document.createElement("ul");
  const tableHeaderRow = document.createElement("li");

  // tableHeaderRow.innerHTML = this.headerCells.reduce((acc, currentValue) => {
  //   return acc + `<span>${currentValue}</span>`;
  // }, "");

  // tableHeader.append(tableHeaderRow);
  this.headerCells.forEach((row, index) => {
    tableHeaderRow.innerHTML = Object.values(row).reduce(
      (acc, propertyValue) => {
        return acc + `<span>${propertyValue}</span>`;
      },
      ""
    );

    tableHeader.append(tableHeaderRow);
  });
  //############################### tableHeader END####################################

  //############################### tableBody START####################################
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

    tableRow.innerHTML = Object.values(row).reduce((acc, propertyValue) => {
      return acc + `<span>${propertyValue}</span>`;
    }, "");

    tableBody.append(tableRow);
  });
  //############################### tableBody END####################################
  this.parent.append(tableHeader, tableBody);
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
