let canvas = document.getElementById("canvas")
canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight * 10;

let context = canvas.getContext('2d');
context.textAlign = "center"
context.font = `${circleSize*0.5}px monospace`;


let maxWidth = canvas.clientWidth;
let levelCurrentPosition = []
let nodesPerLevel = []
let pad = maxWidth * (screenPaddingPercentage / 100)

draw(document.childNodes[1], 0, 0, 0)

function draw(element, level, parent_x, parent_y) {
    if (nodesPerLevel[level] === undefined) nodesPerLevel[level] = getNodesPerLevel(level);
    if (nodesPerLevel[level + 1] === undefined) nodesPerLevel[level + 1] = getNodesPerLevel(level + 1);
    if (levelCurrentPosition[level] === undefined) levelCurrentPosition[level] = 0;
    if (element.nodeName == "#text" && element.data.trim() == "") return
    let cellSpace = (maxWidth - (2 * pad)) / nodesPerLevel[level]


    let x = pad + (cellSpace / 2) + (levelCurrentPosition[level] * cellSpace)
    let y = parent_y + (nodesPerLevel[level] * 0.1 + verticalOffset) * circleSize

    if (parent_x > 0 && parent_y > 0) {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "#999999";
        context.moveTo(parent_x, parent_y + circleSize);
        context.lineTo(x, y);
        context.stroke()
    }

    context.beginPath();
    context.lineWidth = 3;

    if (element.nodeName == "#text") {
        context.fillStyle = "#dddddd";
        context.rect(x - circleSize, y - circleSize / 2, circleSize * 2, circleSize);
        context.fill();
    } else {
        context.fillStyle = element.childNodes.length == 0 ? "#778899" : "#FFD700";
        context.arc(x, y, circleSize, 0, 2 * Math.PI);
        context.fill();
    }

    context.beginPath();
    context.fillStyle = "black";
    var nodeName = element.nodeName.replace(/#/g, '')
    context.fillText(nodeName.toLowerCase(), x, y);
    context.fill();

    levelCurrentPosition[level]++
    for (let i = 0; i < element.childNodes.length; i++) {
        draw(element.childNodes[i], level + 1, x, y)
    }
}

function getNodesPerLevel(row) {
    return row <= 0 ? 1 : _getNodesPerLevel(document, row)
}

function _getNodesPerLevel(e, row) {
    if (row == 0)
        return "childNodes" in e ? nonEmptyNodes(e) : 0;
    else if (!("childNodes" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.childNodes.length; i++)
        total += _getNodesPerLevel(e.childNodes[i], row - 1)
    return total;
}

function nonEmptyNodes(e) {
    let total = 0
    for (let i = 0; i < e.childNodes.length; i++) {
        if (e.childNodes[i].nodeName == "#text" && e.childNodes[i].data.trim() == "") continue;
        else total++;
    }
    return total;
}
