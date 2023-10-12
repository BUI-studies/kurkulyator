import { googleAuthProvider, auth } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  this.googleButton = document.createElement("button");
  this.pageWrapper = document.createElement("div");

  this.placeholderText = document.createElement("h2"); // temp placeholder
  this.placeholderText.textContent = "Login page";
}

Login.prototype.render = function (parent) {
  this.parent = parent;
  this.googleButton.textContent = "Log in with Google";
  this.googleButton.onclick = (e) => this.handleSignInButtonClick(e);

  this.pageWrapper.append(this.placeholderText, this.googleButton);
  this.parent.append(this.pageWrapper);
};

Login.prototype.handleSignInButtonClick = function (e) {
  e.preventDefault();
  signInWithPopup(auth, googleAuthProvider);
};
