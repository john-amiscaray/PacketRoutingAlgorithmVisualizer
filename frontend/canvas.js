import { graph, saveGraph } from "./graph.js";
import { stage } from "./main.js";

// Constants for node, edge, and label styling
const NODE_RADIUS = 45;
const NODE_COLOR = "DeepSkyBlue";
const EDGE_COLOR = "Green";
const LABEL_COLOR = "White";
const WEIGHT_COLOR = "White";
const FINAL_EDGE_COLOR = "Red";

stage.canvas.width = window.innerWidth * 0.85;
stage.canvas.height = window.innerHeight * 0.85;

const nodeContainerMap = new Map();
const edgeContainerMap = new Map();

function randomPositionX() {
    return Math.random() * (stage.canvas.width - NODE_RADIUS) + NODE_RADIUS;
}

function randomPositionY() {
    return Math.random() * (stage.canvas.height - NODE_RADIUS) + NODE_RADIUS;
}

function fadeOut(shape, duration = 5000) {

    createjs.Tween.get(shape)
        .to({ alpha: 0 }, duration)
        .call(() => stage.removeChild(shape));

}

// Function to draw a node
function drawNode(node) {
    const circle = new createjs.Shape();
    circle.graphics.beginFill(NODE_COLOR).drawCircle(0, 0, NODE_RADIUS);

    // Add a text label to the node
    const label = new createjs.Text(node.label, "bold 25px Arial", LABEL_COLOR);
    label.textAlign = "center";
    label.textBaseline = "middle";

    // Create a container for the circle and label
    const container = new createjs.Container();
    container.x = node.x || randomPositionX();
    container.y = node.y || randomPositionY();
    container.addChild(circle, label);

    container.on("mousedown", function (e) {
        var posX = e.stageX;
        var posY = e.stageY;
        this.offset = { x: this.x - posX, y: this.y - posY };
    });

    container.on("pressmove", function (e) {
        var posX = e.stageX;
        var posY = e.stageY;
        this.x = posX + this.offset.x;
        this.y = posY + this.offset.y;
        node.x = this.x;
        node.y = this.y;
        stage.update();
    });

    container.on("pressup", function (e) {
        saveGraph();
        redraw();
    });

    node.x = container.x;
    node.y = container.y;
    nodeContainerMap.set(node.label, container);

    stage.addChild(container);
    stage.update();
}

// Function to draw an edge on the canvas
function drawEdge(edge) {
    // Get the starting and ending nodes
    const start = graph.nodes.find((node) => node.label === edge.node1);
    const end = graph.nodes.find((node) => node.label === edge.node2);

    // Create an edge to connect both nodes
    const line = new createjs.Shape();
    line.graphics
        .setStrokeStyle(edge.weight)
        .beginStroke(EDGE_COLOR)
        .moveTo(start.x, start.y)
        .lineTo(end.x, end.y);

    // Display the weight of the edge
    const weight = new createjs.Text(
        edge.weight.toString(),
        "bold 25px Arial",
        WEIGHT_COLOR
    );
    weight.textAlign = "center";
    weight.textBaseline = "middle";
    weight.x = (start.x + end.x) / 2;
    weight.y = (start.y + end.y) / 2;

    const container = new createjs.Container();
    container.addChild(line, weight);

    edgeContainerMap.set(edge, container);

    stage.addChild(container);
    stage.update();
}

function drawText(text, x, y, alignment = "left") {
    const tempText = new createjs.Text(text, "bold 14px Arial", "White");
    tempText.textAlign = alignment;
    tempText.textBaseline = "middle";

    tempText.x = x;
    tempText.y = y;
    const container = new createjs.Container();
    container.addChild(tempText);
    stage.addChild(container);
    stage.update();
    return container;
}

function drawConnectingEdge(edge) {
    // Get the starting and ending nodes
    const start = graph.nodes.find((node) => node.label === edge.node1);
    const end = graph.nodes.find((node) => node.label === edge.node2);
    const dist = 1.75;

    return new Promise((resolve, reject) => {
        var anim = createjs.Ticker.on("tick", tick);
        let x = start.x;
        let y = start.y;
        let tempc;
        //graph.nodes.forEach((node) => drawNode(node));
        function tick(event) {
            stage.removeChild(tempc);
            let line = new createjs.Shape();
            line.graphics
                .setStrokeStyle(edge.weight)
                .beginStroke(FINAL_EDGE_COLOR)
                .moveTo(start.x, start.y)
                .lineTo(x, y);

            if (x < end.x) {
                x += dist;
            }
            if (x > end.x) {
                x -= dist;
            }
            if (y < end.y) {
                y += dist;
            }
            if (y > end.y) {
                y -= dist;
            }
            if (Math.abs(x - end.x) < dist && Math.abs(y - end.y) < dist) {
                createjs.Ticker.off("tick", anim);
                stage.update();
                resolve({ line, node1: edge.node1, node2: edge.node2 });
            }
            let container = new createjs.Container();
            // container.addChild(line, weight);
            container.addChild(line);
            container.alpha = 0.8;
            stage.addChild(container);
            stage.setChildIndex(container, stage.children.length - 2);

            stage.update(event); // important!!
            tempc = container;
        }
        stage.update();
    });
}
// Function to redraw the graph on the canvas
function redraw() {
    stage.removeAllChildren();

    graph.edges.forEach((edge) => drawEdge(edge));
    graph.nodes.forEach((node) => drawNode(node));

    stage.update();
}

function redrawNodes() {

    let containerIter = nodeContainerMap.values();
    let container = containerIter.next().value;
    do {
        stage.removeChild(container);
        container = containerIter.next().value;
    } while (container);
    graph.nodes.forEach((node) => drawNode(node));

}

export {
    drawNode,
    drawEdge,
    redraw,
    drawConnectingEdge,
    nodeContainerMap,
    edgeContainerMap,
    drawText,
    redrawNodes,
    fadeOut
};
