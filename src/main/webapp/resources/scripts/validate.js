function validate(value, min, max) {
    const num = Number(value)
    value = value.trim();
    let msg = ''

    if(!value) {
        msg = "Заполните поле."
    }
    if(isNaN(value)) {
        msg = "Введите число"
    }
    if(!isFinite(value)) {
        msg = "Введите конечное число"
    }
    if(num >= max || num <= min) {
        msg = "Введите число от " + min + " до " + max + ", не включительно"
    }

    return {
        status: !msg,
        msg: msg
    }
}

function checkField(inputField, min, max) {
    const checkButton = document.getElementById('check-button')

    const validStatus = validate(inputField.value, min, max)

    if(!validStatus.status){
        inputField.style.backgroundColor = "#9D0000"
        
        inputField.setCustomValidity(validStatus.msg)
    } else {
        inputField.style.backgroundColor = "#171717"
        inputField.style.border = "none"

        inputField.setCustomValidity("")
    }
}

const xInputField = document.getElementById('x-input')
const rInputField = document.getElementById('r-input')
xInputField.oninput = () => checkField(xInputField, -3, 3);
rInputField.oninput = () => checkField(rInputField, 2, 5);