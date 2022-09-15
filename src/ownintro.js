import "./ownintro.css"
import Modal from "./lib/modal.js"

/**
 * @param {Array} steps
 * @param {Object} options
 */
class Ownintro {
  #modal
  #highlightContainer
  #bodyClick
  #windowResize

  constructor(steps, options) {
    this.steps = steps
    this.options = Object.assign(
      {},
      {
        buttonBackText: "Back",
        buttonNextText: "Next",
        hideOnClickOutside: true,
        smoothMove: true,
        buttonFinishText: "Finish",
      },
      options
    )
    this.#bodyClick = (e) => this.bodyClick(e)
    this.#windowResize = () => this.repositionHighlightContainer()
  }

  start() {
    this.currentStepIndex = 0
    this.#modal = new Modal(
      () => {
        this.currentStepIndex--
        this.#modal.nextButtonText = this.options.buttonNextText
        this.#showCurrentStep()
      },
      () => {
        this.currentStepIndex++
        if (this.currentStepIndex >= this.steps.length) {
          this.finish()
        } else {
          if (this.currentStepIndex === this.steps.length - 1) {
            this.#modal.nextButtonText = this.options.buttonFinishText
          }
          this.#showCurrentStep()
        }
      },
      () => this.finish(),
      {
        buttonBackText: this.options.buttonBackText,
        buttonNextText: this.options.buttonNextText,
      }
    )
    this.#highlightContainer = this.#createHighlightContainer()
    this.#showCurrentStep()
    const timerEvent = setTimeout(() => {
      document.addEventListener("click", this.#bodyClick)
      window.addEventListener("resize", this.#windowResize)
      if (timerEvent) clearTimeout(timerEvent)
    }, 250)
  }

  finish() {
    document.removeEventListener("click", this.#bodyClick)
    document.removeEventListener("resize", this.#windowResize)
    this.#modal.remove()
    this.#highlightContainer.remove()
  }

  currentStepRect() {
    return this.#currentStep.element.getBoundingClientRect()
  }

  bodyClick(e) {
    if (
      e.target === this.#currentStep.element ||
      this.#currentStep.element?.contains(e.target) ||
      e.target.closest(".ownintro__highlight-container") != null ||
      e.target.matches(".ownintro__modal") ||
      e.target.closest(".ownintro__modal") != null
    ) {
      return
    }

    if (this.options.hideOnClickOutside) this.finish()
  }

  repositionHighlightContainer() {
    if (this.#currentStep.element == null) return

    const rect = this.currentStepRect()
    this.highlightContainerSmooth(false)
    this.modalSmooth(false)
    this.#positionHighlightContainer(rect)
    this.repositionModal(rect)
    this.highlightContainerSmooth()
    this.modalSmooth()
  }

  repositionModal(rect) {
    // element to close to the bottom
    if (
      rect.y >
      document.documentElement.scrollHeight - this.#modal.element.offsetHeight
    ) {
      const bottomOffset =
        rect.bottom - rect.height - this.#modal.element.offsetHeight - 25
      this.#modal.position({
        bottom: bottomOffset,
        left: rect.left,
      })
      return
    }

    // element to close to the right
    if (
      rect.x >
      document.documentElement.scrollWidth - this.#modal.element.offsetWidth
    ) {
      const rightOffset =
        rect.right -
        rect.width -
        this.#modal.element.offsetWidth +
        rect.width / 2 +
        this.#modal.element.offsetWidth / 2
      this.#modal.position({
        bottom: rect.bottom,
        left: rightOffset,
      })
      return
    }

    // element to close to the top
    this.#modal.position(rect)
  }

  get #currentStep() {
    return this.steps[this.currentStepIndex]
  }

  #showCurrentStep() {
    if (this.#currentStep.element == null) {
      this.#highlightContainer.classList.add("hide")
      this.#positionHighlightContainer({ x: 0, y: 0, width: 0, height: 0 })
      this.#modal.center()
    } else {
      const rect = this.currentStepRect()
      this.#modal.center(false)
      this.repositionModal(rect)
      this.#highlightContainer.classList.remove("hide")
      this.#positionHighlightContainer(rect)
      this.#currentStep.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    }
    this.#modal.content = this.#currentStep.content ?? ""
    this.#modal.enableBackButton(this.currentStepIndex !== 0)
    this.#modal.show()
    const willDoSmoothMove = setTimeout(() => {
      this.#modal.smoothMove(this.options.smoothMove)
      this.highlightContainerSmooth()
      if (willDoSmoothMove) clearTimeout(willDoSmoothMove)
    }, 100)
  }

  highlightContainerSmooth(value) {
    this.#highlightContainer.classList.toggle(
      "smooth-move",
      value ?? this.options.smoothMove
    )
  }

  modalSmooth(value) {
    this.#modal.smoothMove(value ?? this.options.smoothMove)
  }

  #createHighlightContainer() {
    const highlightContainer = document.createElement("div")
    highlightContainer.classList.add("ownintro__highlight-container")
    document.body.append(highlightContainer)
    return highlightContainer
  }

  #positionHighlightContainer(rect) {
    this.#highlightContainer.style.top = `${rect.top + window.scrollY}px`
    this.#highlightContainer.style.left = `${rect.left + window.scrollX}px`
    this.#highlightContainer.style.width = `${rect.width}px`
    this.#highlightContainer.style.height = `${rect.height}px`
  }
}

window.Ownintro = Ownintro
export default Ownintro
