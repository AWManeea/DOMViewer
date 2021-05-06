class CanvasNode {
    x;
    y;
    radius;
    element;
    parent;
    children;
    mouseDown
    visible;
    style
    expansionButtonStyle
    attributesButtonStyle
    currentColor
    expansionButtonCurrentColor
    attributesButtonCurrentColor
    mouseWasInExpandableButton
    mouseWasInAttributesButton
    mouseWasInNode
    showPrompt

    constructor(element, parent = null, x = 0, y = 0, radius = circleSize) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.children = [];
        this.parent = parent;
        this.visible = true;
        this.mouseWasInExpandableButton = false;
        this.mouseWasInAttributesButton = false;
        this.mouseDown = false;
        this.mouseWasInNode = false;
        this.showPrompt = false;
        this.expansionButtonStyle = expansionStyle
        this.attributesButtonStyle = attributesStyle
        this.expansionButtonCurrentColor = this.expansionButtonStyle["regular"]
        this.attributesButtonCurrentColor = this.attributesButtonStyle["regular"]
        if (this.element.nodeType == Node.TEXT_NODE)
            this.style = textStyles;
        else if ("childNodes" in this.element && this.element.childNodes.length == 0)
            this.style = leafStyles;
        else
            this.style = nodeStyles;
        this.currentColor = this.style["regular"]
    }

    draw(context) {
        this.drawLineToParent(context)
        this.drawElement(context)
    }

    recursiveDraw(context) {
        this.draw(context)
        if (this.visible)
            this.children.forEach(node => node.recursiveDraw(context))
    }

    hide() {
        this.visible = false;
        this.children.forEach(node => node.hide());
    }

    show() {
        this.visible = true;
        this.children.forEach(node => { node.visible = true; node.show(); });
    }

    drawLineToParent(context) {
        if (this.parent == null) return
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "#999999";
        context.moveTo(this.parent.x, this.parent.y + this.radius);
        context.lineTo(this.x, this.y);
        context.stroke()
    }

    drawElement(context) {
        context.fillStyle = this.currentColor
        context.beginPath();
        if (this.element.nodeType == Node.TEXT_NODE) {
            context.rect(this.x - circleSize, this.y - circleSize / 2, circleSize * 2, circleSize);
            context.fill();
        } else {
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.fill();
        }

        context.beginPath();
        context.fillStyle = "black";
        var nodeName = this.element.nodeName.replace(/#/g, '')
        if (nodeName == "text") {
            var d = this.element.data.trim()
            nodeName = d.length > 10 ? d.substring(0, 4) + "..." : d
        }
        context.fillText(nodeName.toLowerCase(), this.x, this.y);
        context.fill();

        this.drawExpansionToggle(context)
        this.drawAttributesButton(context)
    }

    drawInnerHTML(context) {
        if (this.element.outerHTML == null || this.element.outerHTML.length == 0) return
        let maxWidth = canvas.clientWidth;
        let pad = maxWidth * (screenPaddingPercentage / 100)
        let y = this.y;
        let arr = this.element.outerHTML.split("\n");
        let longestLine = arr.reduce((r, e) => r.length < e.length ? e : r, "");
        let width = context.measureText(longestLine).width + pad * 3
        context.textAlign = "left"
        context.beginPath();
        context.rect(pad, y - pad, width, arr.length * this.radius / 1.5 + pad * 2);
        context.fillStyle = "rgba(0,0,0,0.5)"
        context.fill();
        context.beginPath();

        context.fillStyle = "white"
        for (let i = 0; i < arr.length; i++) {
            context.fillText(arr[i], pad * 2, y, width);
            y += this.radius / 1.5
        }
        context.fill();
        context.textAlign = "center"
    }

    drawAttributes(context) {
        let maxWidth = canvas.clientWidth;
        let pad = maxWidth * (screenPaddingPercentage / 100)
        let x = this.x > maxWidth / 2 ? pad : maxWidth / 2 - pad * 3;
        let y = this.y;
        let width = maxWidth / 2 + pad * 2
        let height = this.element.attributes.length * this.radius / 1.5 + pad * 2

        context.beginPath();
        context.rect(x, y - pad, width, this.element.attributes.length * this.radius / 1.5 + pad * 2);
        context.fillStyle = "rgba(255,255,255,0.75)"
        context.fill();

        context.beginPath();
        context.textAlign = "left"
        context.fillStyle = "black"

        for (let i = 0; i < this.element.attributes.length; i++) {
            context.fillText(`${this.element.attributes[i].name}: ${this.element.attributes[i].value}`, x + pad, y, width);
            y += this.radius / 1.5
        }
        context.fill();
        context.textAlign = "center"
    }

    drawExpansionToggle(context) {
        if (this.children.length == 0) return
        context.beginPath();
        context.fillStyle = this.expansionButtonCurrentColor
        context.arc(this.x - this.radius * 1.25, this.y, this.radius / 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.fillStyle = "black";
        context.fillText(this.visible ? "-" : "+", this.x - this.radius * 1.25, this.y);
        context.fill()
    }

    drawAttributesButton(context) {
        if (this.element.attributes == undefined || this.element.attributes.length == undefined || this.element.attributes.length == 0) return
        context.beginPath();
        context.fillStyle = this.attributesButtonCurrentColor
        context.rect(this.x - this.radius * 1.5, this.y + this.radius / 2, this.radius, this.radius / 2);
        context.fill();
        context.beginPath();
        context.fillStyle = "black";
        context.textBaseline = 'top';
        context.textAlign = "left"
        context.fillText("...", this.x - this.radius * 1.5, this.y + this.radius / 2);
        context.fill()
        context.textAlign = "center"
    }

    attributesButtonContains(x, y) {
        if (this.element.attributes == undefined || this.element.attributes.length == undefined || this.element.attributes.length == 0)
            return false;
        var res = (
            x >= this.x - this.radius * 1.5 &&
            y >= this.y + this.radius / 2 &&
            x <= this.x - this.radius * 1.5 + this.radius &&
            y <= this.y + this.radius / 2 + this.radius / 2
        );

        if (!res && this.mouseWasInAttributesButton)
            this.onAttributesButtonMouseLeave()
        this.mouseWasInAttributesButton = res;
        return res;
    }

    expansionToggleContains(x, y) {
        if (this.children.length == 0 || (!this.visible && this.parent != null && this.parent.visible == false))
            return false;
        var res = (
            Math.abs(x - (this.x - this.radius * 1.25)) <= this.radius / 2 &&
            Math.abs(y - this.y) <= this.radius / 2
        );
        if (!res && this.mouseWasInExpandableButton)
            this.onExpansionToggleMouseLeave()
        this.mouseWasInExpandableButton = res;
        return res;
    }

    contains(x, y) {
        if (!this.visible && this.parent != null && this.parent.visible == false) return false;
        var res = (
            Math.abs(x - this.x) <= this.radius &&
            Math.abs(y - this.y) <= this.radius
        );
        if (!res && this.mouseWasInNode)
            this.onMouseLeave()
        this.mouseWasInNode = res;
        return res;
    }

    onMouseHover() {
        canvas.style.cursor = "pointer";
        this.currentColor = this.style["hover"]
    }

    onExpansionToggleMouseHover() {
        canvas.style.cursor = "pointer";
        this.expansionButtonCurrentColor = this.expansionButtonStyle["hover"]
    }

    onAttributesButtonMouseHover() {
        canvas.style.cursor = "pointer";
        this.attributesButtonCurrentColor = this.attributesButtonStyle["hover"]
    }

    onMouseLeave() {
        canvas.style.cursor = "default";
        this.currentColor = this.style["regular"];
    }

    onExpansionToggleMouseLeave() {
        canvas.style.cursor = "default";
        this.expansionButtonCurrentColor = this.expansionButtonStyle["regular"]
    }

    onAttributesButtonMouseLeave() {
        canvas.style.cursor = "default";
        this.attributesButtonCurrentColor = this.attributesButtonStyle["regular"]
    }

    onAttributesButtonMouseClick(context) {
        this.drawAttributes(context)
    }

    onExpansionToggleMouseClick() {
        if (this.visible) this.hide()
        else this.show()
    }

    onMouseClick() {
        if(!this.showPrompt) {this.showPrompt = true; retrn}
        let tag = prompt("What tag would you like to add?")
        tag = tag.trim().toLowerCase()
        let node;
        console.log(tag)
        if (tagNames.includes(tag)) {
            node = document.createElement(tag)
        } else {
            node = document.createTextNode(tag);
        }
        try {
            this.element.appendChild(node)
        } catch (e) {
            let p = document.createElement("p")
            p.appendChild(node)
            this.element.appendChild(p)
        }
        tree = []
    }

    onMouseDown(){
        canvas.style.cursor = "grabbing"
        this.mouseDown = true;
    }

    onMouseUp(){
        canvas.style.cursor = "default"
        this.mouseDown = false;
    }

    updateX(x){
        this.x = x;
        this.showPrompt = false;
    }

    toString() {
        return `${this.parent == null ? "root" : this.parent.toString()} -> ${this.element.nodeName}`
    }

    toArray() {
        let ret = []
        this.children.forEach(child => {
            ret = ret.concat(child.toArray())
        });
        return [this].concat(ret);
    }
}