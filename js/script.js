let canvas = document.getElementById("canvas")
canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight * 2;

context.textAlign = "center"
context.font = `${circleSize * 0.5}px monospace`;

let saveImg = document.getElementById("save-img")
let maxWidth = canvas.clientWidth;
let levelCurrentPosition = []
let nodesPerLevel = []
let pad = maxWidth * (screenPaddingPercentage / 100)
let root;
let tree = []

function createTree(node, level) {
    if (!canDraw(node, level)) return;
    let cellSpace = (maxWidth - (2 * pad)) / nodesPerLevel[level]
    node.x = pad + (cellSpace / 2) + levelCurrentPosition[level] * cellSpace
    node.y = (node.parent == null ? 0 : node.parent.y) + (nodesPerLevel[level] * 0.1 + verticalOffset) * circleSize
    levelCurrentPosition[level]++
    for (let i = 0; i < node.element.childNodes.length; i++) {
        if (node.element.childNodes[i].nodeType == Node.TEXT_NODE && node.element.childNodes[i].data.trim() == "") continue;
        var child = new CanvasNode(node.element.childNodes[i], node, 0, 0)
        node.children.push(child)
        createTree(child, level + 1)
    }
}

function redraw() {
    if (tree.length == 0) {
        tree = []
        levelCurrentPosition = []
        nodesPerLevel = []
        root = new CanvasNode(document.childNodes[1]);
        createTree(root, 0)
    }
    context.clearRect(0, 0, maxWidth, canvas.height)
    root.recursiveDraw(context)
    tree = root.toArray()

    // Save button
    context.drawImage(saveImg, canvas.width - circleSize * 2, 0, circleSize * 2, circleSize * 2);
    context.fill()
}

function getNodesPerLevel(level) {
    return level <= 0 ? 1 : _getNodesPerLevel(document, level)
}

function _getNodesPerLevel(e, level) {
    if (level == 0)
        if ("childNodes" in e)
            return nonEmptyNodes(e)
        else
            return 0;
    else if (!("childNodes" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.childNodes.length; i++)
        total += _getNodesPerLevel(e.childNodes[i], level - 1)
    return total;
}

function nonEmptyNodes(e) {
    let total = 0
    for (let i = 0; i < e.childNodes.length; i++) {
        if (e.childNodes[i].nodeType == Node.TEXT_NODE && e.childNodes[i].data.trim() == "") continue;
        else total++;
    }
    return total;
}

function getGradientColor(x, y, s) {
    var g = context.createLinearGradient(x - s, y - s, x + s, y + s);
    g.addColorStop(0, '#56B9E5');
    g.addColorStop(.35, '#A2D7EE');
    g.addColorStop(1, '#59BFEB');
    return g
}

function canDraw(node, level) {
    if (nodesPerLevel[level] === undefined)
        nodesPerLevel[level] = getNodesPerLevel(level);
    if (levelCurrentPosition[level] === undefined)
        levelCurrentPosition[level] = 0;
    if (node.element.nodeType == Node.TEXT_NODE && node.element.data.trim() == "")
        return false
    return true;
}

function mouseMove(e) {
    if (inSaveImage(e.offsetX, e.offsetY)) {
        canvas.style.cursor = "pointer"
        return
    } else {
        canvas.style.cursor = "default"
    }
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].attributesButtonContains(e.offsetX, e.offsetY)) {
            tree[i].onAttributesButtonMouseHover()
            redraw(root)
            return;
        } else if (tree[i].expansionToggleContains(e.offsetX, e.offsetY)) {
            tree[i].onExpansionToggleMouseHover()
            redraw(root)
            return;
        } else if (tree[i].contains(e.offsetX, e.offsetY)) {
            if (tree[i].mouseDown) {
                canvas.style.cursor = "grabbing"
                tree[i].updateX(e.offsetX)
                tree[i].updateY(e.offsetY)
            } else {
                tree[i].onMouseHover()
                redraw(root)
                tree[i].drawOuterHTML(context)
                return;
            }
        }
    }
    redraw(root)
}

function mouseClick(e) {
    if (inSaveImage(e.offsetX, e.offsetY)) {
        var anchor = document.createElement("a")
        anchor.setAttribute('download', 'MintyPaper.png');
        anchor.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        document.getElementsByTagName("body")[0].appendChild(anchor)
        anchor.click()

        // var dataURL = canvas.toDataURL("image/png");
        // var newTab = window.open('about:blank', 'image from canvas');
        // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>")
        return
    } else {
        canvas.style.cursor = "default"
    }
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].attributesButtonContains(e.offsetX, e.offsetY)) {
            redraw(root)
            tree[i].onAttributesButtonMouseClick(context)
            return;
        } else if (tree[i].expansionToggleContains(e.offsetX, e.offsetY)) {
            tree[i].onExpansionToggleMouseClick()
            redraw(root)
            return;
        } else if (tree[i].contains(e.offsetX, e.offsetY)) {
            tree[i].onMouseClick()
            redraw(root)
            return;
        }
    }
    redraw(root)
}

function mouseDown(e) {
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].contains(e.offsetX, e.offsetY)) {
            tree[i].onMouseDown()
            return;
        } else {
            tree[i].onMouseUp();
        }
    }
}

function mouseUp(e) {
    for (let i = 0; i < tree.length; i++)
        tree[i].onMouseUp();
}

function inSaveImage(x, y) {
    return (
        x >= canvas.width - circleSize * 2 &&
        y <= circleSize * 2
    );
}

redraw();
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("click", mouseClick);