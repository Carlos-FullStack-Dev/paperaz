import $ from 'jquery'

export let allInputs = []
export let initialInputIndex = null

export function moveToNextInput(ind) {
  if (ind + 1 >= allInputs.length) ind = 0
  const inputField = allInputs[ind + 1]
  inputField.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // inputField.type != 'radio' &&  inputField.classList.add('appendInput')
  inputField.focus()
}

export function keyupfFunc(event) {
  initialInputIndex = allInputs.findIndex((v) => v == event.target)
  event.key === 'Enter' && !event.shiftKey && moveToNextInput(initialInputIndex)
}

export function changeFunc(event) {
  event.preventDefault()
  if (event.target.type == 'text' || event.target.type == 'textarea') return

  initialInputIndex = allInputs.findIndex((v) => v == event.target)
  moveToNextInput(initialInputIndex)
}

export function clickFunc(e) {
  if (e.target.type == 'text' || e.target.type == 'textarea')
    (e) => e.preventDefault()
}


export function AppendKeypressActionOnInput() {
  setTimeout(() => {
    let inputs = $('.pdf-editor-view').find(':input')
    allInputs = Array.from(inputs)

    if (inputs.length < 1) return

    Array.from(inputs).forEach((element) => {
      element.type == 'text' ||
      element.type == 'textarea' ||
      element.type.includes('select')
        ? element.classList.add('pdf_annot_input')
        : null
      element.classList.add('preventZoom')
      element.addEventListener('keyup', keyupfFunc)
      element.addEventListener('input', changeFunc)
      element.addEventListener('click', clickFunc)
      element.addEventListener('blur', blurFunc)
    })
  }, 200)
}
