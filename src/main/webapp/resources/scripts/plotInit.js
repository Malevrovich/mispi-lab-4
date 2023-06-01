const canvas = document.getElementById("plot")
const ctx = canvas.getContext("2d")

const canvasParameters = {
    width: canvas.width,
    height: canvas.height,
    padding: 10,
    arrowSize: 10,
    labelSize: 25
}
canvasParameters.contentPadding = canvasParameters.padding + canvasParameters.arrowSize + 10

window.onload = () => {
    canvasParameters.clientWidth = canvas.clientWidth
    canvasParameters.clientHeight = canvas.clientHeight

    drawPlot(choosenR)

    canvas.onclick = (ev) => {
        const r = choosenR
        let {x, y} = clickToShotCoords(ev.offsetX, ev.offsetY, r, canvasParameters)
        if(x > -r && x < r && y > -r && y < r) {
            shot(x, y, r)
        }
    }
}
