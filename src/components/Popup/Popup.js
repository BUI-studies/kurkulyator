import "./Popup.scss";

export default function Popup(position, type, message) {
  this.popupWrapper = document.createElement("div");
  this.popupWrapper.classList.add("error-popup", position, type);
  this.message = document.createElement("p");
  this.message.textContent = message;
}

Popup.prototype.render = function (parent = document.body) {
  console.log("render popup");
  console.log("this.message", this.message.textContent);
  this.popupWrapper.append(this.message);
  parent.insertAdjacentElement("afterbegin", this.popupWrapper);
  setTimeout(() => this.popupWrapper.remove(), 3000);
};
