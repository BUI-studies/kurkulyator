import { createElement } from '@/utils'

import './_UniversalButton.scss'

export default function UniversalButton({ text, children, name, className = 'universal-button', onClick }) {
  this.self = createElement({
    tagName: 'button',
    name,
    innerText: text || '',
    className,
  })
  this.children = children
  this.onClick = onClick
}

UniversalButton.prototype.render = function (parent) {
  if (this.children) {
    if (typeof this.children === 'string') {
      this.self.innerHTML += this.children
    } else {
      this.self.append(this.children)
    }
  }

  this.self.onclick = this.onClick ? (e) => this.onClick(e) : undefined

  parent.append(this.self)
}
