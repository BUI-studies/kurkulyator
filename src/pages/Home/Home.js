export default function Home() {
  this.pageWrapper = document.createElement("div");
  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Home page";
}

Home.prototype.render = function (parent) {
  this.pageWrapper.append(this.placeholderText);
  table.render();
  parent.append(this.pageWrapper);
};
