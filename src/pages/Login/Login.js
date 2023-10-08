import { googleAuthProvider, auth } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  this.header = document.createElement("h2");
  this.googleButton = document.createElement("button");
  this.pageWrapper = document.createElement("div");
}

Login.prototype.render = (parent) => {
  this.parent = parent;
  this.header.textContent = "Please log in with:";
  this.googleButton.textContent = "Google";
  this.googleButton.addEventListener("click", (e) =>
    this.handleSignInButtonClick(e)
  );

  this.pageWrapper.append(this.header, this.googleButton);
  this.parent.append(this.pageWrapper);
};

Login.prototype.handleSignInButtonClick = (e) => {
  e.preventDefault();
  signInWithPopup(auth, googleAuthProvider);
};
