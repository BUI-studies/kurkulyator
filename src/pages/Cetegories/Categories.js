import { getCategories } from "@/API";

export default function Categories() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");
  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Categories page";
}

Categories.prototype.render = async function (parent) {
  this.categories = await getCategories();

  this.addButton.textContent = "New category";
  this.addButton.onclick = (e) => this.handleNewCategotyClick(e);
  this.pageWrapper.append(this.placeholderText, this.addButton);

  parent.append(this.pageWrapper);
};

Categories.prototype.handleNewCategotyClick = function (e) {
  e.preventDefault();
};
