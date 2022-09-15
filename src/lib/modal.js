/**
 * @param {Function} onBack
 * @param {Function} onNext
 * @param {Function} onClose
 * @param {Object} options
 */
export default class Modal {
  #modal
  #closeBtn
  #title
  #content
  #backButton
  #nextButton

  constructor(onBack, onNext, onClose, options) {
    this.#modal = document.createElement("div")
    this.#modal.classList.add("ownintro__modal")

    this.#closeBtn = document.createElement("button")
    this.#closeBtn.innerHTML = "&times;"
    this.#closeBtn.classList.add("close-btn")
    this.#closeBtn.addEventListener("click", onClose)
    this.#modal.append(this.#closeBtn)

    this.#title = document.createElement("header")
    this.#title.classList.add("ownintro__modal-title")
    this.#modal.append(this.#title)

    this.#content = document.createElement("div")
    this.#content.classList.add("ownintro__modal-content")
    this.#modal.append(this.#content)

    const footer = document.createElement("footer")
    footer.classList.add("ownintro__modal-footer")
    this.#modal.append(footer)

    this.#backButton = document.createElement("button")
    this.#backButton.textContent = options.buttonBackText
    this.#backButton.addEventListener("click", onBack)
    footer.append(this.#backButton)

    this.#nextButton = document.createElement("button")
    this.#nextButton.textContent = options.buttonNextText
    this.#nextButton.addEventListener("click", onNext)
    footer.append(this.#nextButton)

    document.body.append(this.#modal)
  }

  set content(value) {
    this.#content.innerHTML = value
  }

  set nextButtonText(text) {
    this.#nextButton.textContent = text
  }

  show(value = true) {
    this.#modal.classList.toggle("show", value)
  }

  center(value = true) {
    this.#modal.classList.toggle("center", value)
  }

  smoothMove(value = true) {
    this.#modal.classList.toggle("smooth-move", value)
  }

  position({ bottom, left }) {
    const offset = ".5rem"
    this.#modal.style.setProperty(
      "--x",
      `calc(${left + window.scrollX}px + ${offset})`
    )
    this.#modal.style.setProperty(
      "--y",
      `calc(${bottom + window.scrollY}px + ${offset} + .25rem)`
    )
  }

  remove() {
    this.#modal.remove()
  }

  enableBackButton(enabled) {
    this.#backButton.disabled = !enabled
  }

  get element() {
    return this.#modal
  }
}
