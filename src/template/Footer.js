export default function Footer() {
  this.footerWrapper = document.createElement("footer");
  this.copyright = document.createElement("p");
}

Footer.prototype.render = function (parent) {
  this.copyright.textContent = "BUOY studies, 2023 ©";

  this.footerWrapper.append(this.copyright);
  parent.append(this.footerWrapper);
};
