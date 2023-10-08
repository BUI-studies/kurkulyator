import Footer from "./Footer";
import Header from "./Header";

export default function Page() {
  this.parent = document.querySelector("#app");
  this.childrenWrapper = document.createElement("section");
  this.footer = new Footer();
  this.header = new Header();
}

Page.prototype.render = function () {
  this.header.render(this.parent);
  this.parent.append(this.childrenWrapper);
  this.footer.render(this.parent);
};

Page.prototype.updateChildren = function (currentPage) {
  this.childrenWrapper.replaceChildren();
  currentPage.render(this.childrenWrapper);
};

//some changes to create a pull request
