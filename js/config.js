let context = document.getElementById("canvas").getContext('2d');

let circleSize = 40;
let circleMargin = 10;
let screenPaddingPercentage = 1;
let verticalOffset = 3;


let tagColor = "gold"
let leafColor = "#aaaaaa"
let textColor = "#dddddd"


const nodeStyles = {
    regular: "#FFE900",
    hover: "#FEF47C",
    click: "#F9BE00",
}


const textStyles = {
    regular: "#58B8B6",
    hover: "#8FD0CC",
    click: "#21A0A0",
}

const leafStyles = {
    regular: "#EC6800",
    hover: "#F29300",
    click: "#E53D00",
}

const expansionStyle = {
    regular: "#ECD388",
    hover: "#F6E27F",
    click: "#E7CB8D",
}

const attributesStyle = {
    regular: "#9BBEC7",
    hover: "#A4C4CC",
    click: "#A2BBB9",
}

const tagNames = [
    "a",
    "abbr",
    "acronym",
    "abbr",
    "address",
    "applet",
    "embed",
    "object",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "ul",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h",
    "head",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strike",
    "del",
    "s",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
]