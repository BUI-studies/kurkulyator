import { googleAuthProvider, auth } from '../../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { createElement } from '@/utils';

export default function Login() {
  this.googleButton = createElement({
    tagName: 'button',
    innerText: 'Log in with Google',
  });

  this.pageWrapper = createElement({
    tagName: 'div',
  });

  this.placeholderText = createElement({
    tagName: 'h2',
    innerText: 'Login page',
  }); // temp placeholder
}

Login.prototype.render = function (parent) {
  this.parent = parent;
  this.googleButton.onclick = (e) => this.handleSignInButtonClick(e);

  this.pageWrapper.append(this.placeholderText, this.googleButton);
  this.parent.append(this.pageWrapper);
};

Login.prototype.handleSignInButtonClick = function (e) {
  e.preventDefault();
  signInWithPopup(auth, googleAuthProvider);
};
