export default function Header() {
  this.headerWrapper = document.createElement("header")
  this.headerText = document.createElement("h1")
}

Header.prototype.render = function (parent) {
  this.headerText.textContent = "КУРКУЛЯТОР"

  this.headerWrapper.append(this.headerText)
  parent.append(this.headerWrapper)
}
