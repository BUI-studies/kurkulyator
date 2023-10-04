import Footer from "./Footer";
import Header from "./Header";

export default function Page() {}

Page.prototype.render = function () {
  this.footer = new Footer();
  this.header = new Header();
};
