import { Router } from "@/routes/"

export default function Header() {
  this.headerWrapper = document.createElement("header")
  this.headerText = document.createElement("h1")
  this.menuWrapper = document.createElement("div")
  this.menu = document.createElement("p")
  this.user = Router.getCurrentUser()
}

Header.prototype.render = function (parent) {
  this.headerText.textContent = "КУРКУЛЯТОР"

  this.headerWrapper.append(this.headerText)

  // render menu only if user logged in
  this.menu.textContent = "MENU"

  this.menuWrapper.append(this.menu)

  if (this.user) {
    this.headerWrapper.append(this.menuWrapper)
  }

  parent.append(this.headerWrapper)
}
