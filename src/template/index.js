import Footer from "./Footer/Footer";
import Header from "./Header/Header";

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
  this.header.updateHeader();
  currentPage.render(this.childrenWrapper);
};
