import { googleAuthProvider, auth } from '../../../firebase'
import { signInWithPopup } from 'firebase/auth'
import { createElement } from '@/utils'
import { UniversalButton } from '@/components'

export default function Login() {
  this.googleButton = new UniversalButton({
    text: 'Log in with Google',
    onClick: (event) => this.handleSignInButtonClick(event),
  })

  this.pageWrapper = createElement({
    tagName: 'div',
  })

  this.placeholderText = createElement({
    tagName: 'h2',
    innerText: 'Login page',
  })
}

Login.prototype.render = function (parent) {
  this.parent = parent
  this.pageWrapper.append(this.placeholderText)
  this.googleButton.render(this.pageWrapper)
  this.parent.append(this.pageWrapper)
}

Login.prototype.handleSignInButtonClick = function (e) {
  e.preventDefault()
  signInWithPopup(auth, googleAuthProvider)
}
