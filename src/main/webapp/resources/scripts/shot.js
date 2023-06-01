function shot(x, y, r) {
	url = window.location.href.substr(0, window.location.href.lastIndexOf('\/'))
	url += `/shot.xhtml?x=${x}&y=${y}&r=${r}`
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type" : "text/html"
        }
    }).then(
        (response) => {
            console.log(response.status)
            console.log(response.ok)
            if(!response.ok) return response.text().then(text => { throw Error(text) })
            return response.text()
        }
    ).then(
        (data) => {
            const table = document.getElementsByClassName("table-block")[0]
            table.innerHTML = /<table>[.\s\S]*<\/table>/gm.exec(data)[0]
            updateDots(r)
        }
    ).catch(
        (err) => {
            const checkButton = document.getElementsByClassName("check-button-box")[0]
            const msg = /(?<=<p>[.\S\s]*Message:)[.\S\s]*?(?=<br>|<\/p>)/gm.exec(err)
            if(msg == null) checkButton.setCustomValidity(err)
            else checkButton.setCustomValidity(msg[0])
            checkButton.reportValidity()

            setTimeout(() => checkButton.setCustomValidity(""), 1000)
        })
}

// const form = document.getElementById("main-form")
// form.onsubmit = (ev) => {
//     ev.preventDefault()
//     if(form.reportValidity()) {
//         x = document.getElementById("x-input").value
//         y = document.querySelector('input[name="y"]:checked').value;
//         r = document.getElementById("r-input").value
//         shot(x, y, r)
//     }
// }