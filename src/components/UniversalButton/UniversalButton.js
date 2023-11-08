export default function UniversalButton({ text, children, className = 'customButton', onClick }) {
  this.self = document.createElement('button');
  this.text = text;
  this.children = children;
  this.className = className;
  this.onClick = onClick;
}

UniversalButton.prototype.render = function (parent) {
  this.self.innerText = this.text || '';

  if (this.children) {
    if (typeof this.children === 'string') {
      this.self.innerHTML += this.children;
    } else {
      this.self.append(this.children);
    }
  }

  if (this.className) this.self.classList.add(this.className);

  this.self.onclick = (e) => {
    if (this.onClick) {
      this.onClick(e);
    }
  };
  parent.append(this.self);
};
