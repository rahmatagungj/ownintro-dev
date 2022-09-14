import './ownintro.css';
import Modal from './lib/modal.js';

/**
 * @param {Array} steps
 * @param {Object} options
 */
class Ownintro {
  #modal
  #highlightContainer
  #bodyClick

  constructor(steps, options = {
    buttonBackText: "Back",
    buttonNextText: "Next",
    hideOnClickOutside: true,
    smoothMove: true,
    buttonFinishText: "Finish",
  }) {
    this.steps = steps
    this.options = options
    this.#bodyClick = e => {
      if (
        e.target === this.#currentStep.element ||
        this.#currentStep.element?.contains(e.target) ||
        e.target.closest(".ownintro__highlight-container") != null ||
        e.target.matches(".ownintro__modal") ||
        e.target.closest(".ownintro__modal") != null
      ) {
        return
      }

      if (options.hideOnClickOutside) this.finish()
    }
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
    document.addEventListener("click", this.#bodyClick)
    window.addEventListener('resize', () => {
      this.repositionHighlightContainer()
    })
    this.#highlightContainer = this.#createHighlightContainer()
    this.#showCurrentStep()
  }

  finish() {
    document.removeEventListener("click", this.#bodyClick)
    this.#modal.remove()
    this.#highlightContainer.remove()
  }

  repositionHighlightContainer() {
    if (this.#currentStep.element == null) return

    const rect = this.#currentStep.element.getBoundingClientRect()
    this.highlightContainerSmooth(false)
    this.modalSmooth(false)
    this.#positionHighlightContainer(rect)
    this.repositionModal(rect)
    this.highlightContainerSmooth()
    this.modalSmooth()
  }

  repositionModal(rect) {
    // element to close to the bottom
    if (rect.y > document.documentElement.scrollHeight - 100) {
      const bottomOffset = rect.bottom - (rect.height) - this.#modal.element.offsetHeight - 25
      this.#modal.position({
        bottom: bottomOffset,
        left: rect.left,
      })
    // element to close to the right
    } else if (rect.x > document.documentElement.scrollWidth - 200) {
      const rightOffset = rect.right - (rect.width) - this.#modal.element.offsetWidth + (rect.width / 2) + 25
      this.#modal.position({
        bottom: rect.bottom,
        left: rightOffset,
      })
    // element to close to the top
    } else {
      this.#modal.position(rect)
    }
  }

  get #currentStep() {
    return this.steps[this.currentStepIndex]
  }

  #showCurrentStep() {
    this.#modal.content = this.#currentStep.content ?? ""
    if (this.#currentStep.element == null) {
      this.#highlightContainer.classList.add("hide")
      this.#positionHighlightContainer({ x: 0, y: 0, width: 0, height: 0 })
      this.#modal.center()
    } else {
      this.#modal.center(false)
      const rect = this.#currentStep.element.getBoundingClientRect()
      this.repositionModal(rect)

      this.#highlightContainer.classList.remove("hide")
      this.#positionHighlightContainer(rect)
      this.#currentStep.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    }
    this.#modal.enableBackButton(this.currentStepIndex !== 0)
    this.#modal.show()
    let willDoSmoothMove = setTimeout(() => {
      this.#modal.smoothMove(this.options.smoothMove)
      this.highlightContainerSmooth()
      if (willDoSmoothMove) clearTimeout(willDoSmoothMove)
    }, 100)
  }

  highlightContainerSmooth(value) {
    this.#highlightContainer.classList.toggle("smooth-move", value ?? this.options.smoothMove)
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