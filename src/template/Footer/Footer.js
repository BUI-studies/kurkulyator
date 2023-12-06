import { createElement } from '@/utils'

import './_Footer.scss'

export default function Footer() {
  this.footerWrapper = createElement({ tagName: 'footer' })
  this.copyright = createElement({
    tagName: 'p',
    innerText: '© BUOY studies, 2023',
  })
}

Footer.prototype.render = function (parent) {
  this.footerWrapper.append(this.copyright)
  parent.append(this.footerWrapper)
}
