function toCanvasCoords(x, y, r, canvasParameters) {
    let {width, contentPadding, height} = canvasParameters
    return {x: (width - 2 * contentPadding) * (x / r) / 2 + width / 2,
            y: height / 2 - (height - 2 * contentPadding) * (y / r) / 2};
}

function toShotCoords(x, y, r, canvasParameters) {
    let {width, height, contentPadding} = canvasParameters
    return {x: (x - contentPadding) / (width - 2 * contentPadding) * 2 * r - r,
            y: r - (y - contentPadding) / (height - 2 * contentPadding) * 2 * r}
}

function clickToShotCoords(offsetX, offsetY, r, canvasParameters) {
    let {clientWidth, clientHeight, width, height, contentPadding} = canvasParameters

    let contentPaddingWidth = (contentPadding) * (2 * r) / (width - 2 * contentPadding)
    let contentPaddingHeight = (contentPadding) * (2 * r) / (height - 2 * contentPadding)

    return {x: (offsetX) / (clientWidth) * (2 * r + 2 * contentPaddingWidth) - r - contentPaddingWidth,
            y: r + contentPaddingHeight - (offsetY) / (clientHeight) * (2 * r + 2 * contentPaddingHeight)}
}

function drawRLabel(ctx, text, coord, r, horizontal, canvasParameters) {
    let {width, height, arrowSize, labelSize} = canvasParameters

    ctx.textBaseline = "hanging"
    ctx.font = `${labelSize}px serif`

    let x = width/2 - arrowSize
    let y = height/2 - arrowSize

    if(horizontal) {
        x = toCanvasCoords(coord, 0, r, canvasParameters).x
    } else {
        y = toCanvasCoords(0, coord, r, canvasParameters).y
    }

    ctx.moveTo(x, y)
    if(horizontal) {
        y += 2 * arrowSize
    } else {
        x += 2 * arrowSize
    }
    ctx.lineTo(x, y)
    ctx.fillText(text, x, y)
    ctx.stroke()
}

function drawAxes(ctx, r, canvasParameters) {
    let {width, height, padding, labelSize, contentPadding, arrowSize} = canvasParameters
    ctx.beginPath()

    ctx.strokeStyle = "black"
    ctx.fillStyle = "black"
    ctx.lineWidth = 3

    // Axes with arrows
    ctx.moveTo(width / 2, height - padding)
    ctx.lineTo(width / 2, padding)

    ctx.lineTo(width / 2 - arrowSize, padding + arrowSize)
    ctx.moveTo(width / 2 + arrowSize, padding + arrowSize)
    ctx.lineTo(width / 2, padding)

    ctx.moveTo(padding, height / 2)
    ctx.lineTo(width - padding, height / 2)

    ctx.lineTo(width - padding - arrowSize, height / 2 - arrowSize)
    ctx.moveTo(width - padding - arrowSize, height / 2 + arrowSize)
    ctx.lineTo(width - padding, height / 2)

    // R labels
    const drawVerticalRLabel = (y) =>
        drawRLabel(ctx, Math.floor(y * 100) / 100, y, r, false, canvasParameters)

    const drawHorizontalRLabel = (x) =>
        drawRLabel(ctx, Math.floor(x * 100) / 100, x, r, true, canvasParameters)

    drawVerticalRLabel(r)
    drawVerticalRLabel(r/2)
    drawVerticalRLabel(-r/2)
    drawVerticalRLabel(-r)

    drawHorizontalRLabel(r)
    drawHorizontalRLabel(r/2)
    drawHorizontalRLabel(-r/2)
    drawHorizontalRLabel(-r)

    // Y and X and 0 labels
    ctx.textBaseline = "hanging"
    ctx.font = `${labelSize}px serif`
    ctx.fillText("Y", width / 2 - 2 * arrowSize - 10, padding)
    ctx.fillText("0", width / 2 + 4, height / 2 + 4)
    ctx.textBaseline = "bottom"
    ctx.fillText("X", width - padding - 1.5 * arrowSize, height / 2 - arrowSize - 2)
}

function drawBackground(ctx, canvasParameters) {
    let {width, height, contentPadding} = canvasParameters

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "rgba(0, 100, 0, 0.3)"
    ctx.fillRect(contentPadding, contentPadding, width - 2 * contentPadding, height - 2 * contentPadding)
}

function drawFigure(ctx, canvasParameters) {
    ctx.fillStyle = "rgba(0, 0, 100, 0.3)"

    let r = 1.0
    let convert = (x, y) => toCanvasCoords(x, y, r, canvasParameters)

    // Rectangle
    let {x: rectX, y: rectY} = convert(-r/2, 0)
    let {x: endX, y: endY} = convert(0, -r)
    ctx.fillRect(rectX, rectY, Math.abs(endX - rectX), Math.abs(endY - rectY))


    // Triangle ABC
    let {x: Ax, y: Ay} = convert(-r/2, 0)
    let {x: Bx, y: By} = convert(0, r)
    let {x: Cx, y: Cy} = convert(0, 0)

    ctx.beginPath()
    ctx.moveTo(Ax, Ay)
    ctx.lineTo(Bx, By)
    ctx.lineTo(Cx, Cy)
    ctx.fill()

    // Circle (O, R)
    let {x: Ox, y: Oy} = convert(0, 0)
    let {x: Rx} = convert(r/2, 0)

    ctx.beginPath()
    ctx.moveTo(Ox, Oy)
    ctx.arc(Ox, Oy, Math.abs(Rx - Ox), 0, Math.PI / 2, false)
    ctx.fill()
}

function parseDots(){
    const tbody = document.querySelector(".table-block tbody")
    const dots = []
    if(tbody == null) return dots;
    for (let i = 0; i < tbody.childElementCount; i++) {
        let dot = {}
        if(tbody.children[i].tagName !== "TR") continue
        if(tbody.children[i].childElementCount < 3) continue

        if(tbody.children[i].children[0].innerText === "") continue

        dot.x = Number(tbody.children[i].children[0].innerText)
        dot.y = Number(tbody.children[i].children[1].innerText)
        dot.r = Number(tbody.children[i].children[2].innerText)
        dot.hit = (tbody.children[i].children[3].innerText === 'true')
        dots.push(dot)
    }
    return dots
}

function drawDot(ctx, dot, r, canvasParameters) {
    let {x, y} = toCanvasCoords(dot.x, dot.y, r, canvasParameters)
    let {contentPadding, width, height} = canvasParameters

    if(x < contentPadding) return
    if(x > width - contentPadding) return
    if(y < contentPadding) return
    if(y > height - contentPadding) return

    if(dot.r != r) {
        ctx.fillStyle = "yellow"
    } else if(dot.hit) {
        ctx.fillStyle = "green"
    } else {
        ctx.fillStyle = "red"
    }
    ctx.strokeStyle = "black"
    ctx.strokeWidth = 0.25

    ctx.beginPath()
    ctx.moveTo(x + 5, y)
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

function drawDots(ctx, r, canvasParameters) {
    let dots = parseDots()
    dots.forEach((dot) => drawDot(ctx, dot, r, canvasParameters))
}

function drawPlot(r) {
    drawBackground(ctx, canvasParameters)
    drawAxes(ctx, r, canvasParameters)
    drawFigure(ctx, canvasParameters)
    drawDots(ctx, r, canvasParameters)
}

function updateDots(r) {
    drawDots(ctx, r, canvasParameters)
}
