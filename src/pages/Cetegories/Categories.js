import { getCategories } from "@/API";

export default function Categories() {
  this.pageWrapper = document.createElement("div");
  this.addButton = document.createElement("button");
}

Categories.prototype.render = async function (parent) {
  console.log("Categories page");

  this.categories = await getCategories();
  console.log(this.categories);

  this.addButton.textContent = "New category";
  this.addButton.addEventListener("click", (e) =>
    this.handleNewCategotyClick(e)
  );
  this.pageWrapper.append(this.addButton);

  parent.append(this.pageWrapper);
};

Categories.prototype.handleNewCategotyClick = function (e) {
  e.preventDefault();
  console.log("New category clicked");
};
