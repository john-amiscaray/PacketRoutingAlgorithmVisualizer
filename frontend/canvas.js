import { graph } from "./graph.js";
import { stage } from "./main.js"

// Constants for node, edge, and label styling
const NODE_RADIUS = 20;
const NODE_COLOR = '#5AE873';
const EDGE_COLOR = '#000000';
const LABEL_COLOR = '#FFF';

// Function to draw a node
function drawNode(node) {
    const circle = new createjs.Shape();
    circle.graphics.beginFill(NODE_COLOR).drawCircle(0, 0, NODE_RADIUS);
    circle.x = Math.random() * stage.canvas.width;
    circle.y = Math.random() * stage.canvas.height;

    // Add a text label to the node
    const label = new createjs.Text(node.label, 'bold 16px Arial', LABEL_COLOR);
    label.textAlign = 'center';
    label.textBaseline = 'middle';

    const container = new createjs.Container();
    container.addChild(circle, label);
    container.x = circle.x;
    container.y = circle.y;

    stage.addChild(container);
    stage.update();
}

// Function to draw an edge on the canvas
function drawEdge(edge) {
    const start = graph.nodes.find(node => node.label === edge.node1);
    const end = graph.nodes.find(node => node.label === edge.node2);

    const line = new createjs.Shape();
    line.graphics.setStrokeStyle(2).beginStroke(EDGE_COLOR).moveTo(start.x, start.y).lineTo(end.x, end.y);

    const weight = new createjs.Text(edge.weight.toString(), '16px Arial', 'White');
    weight.textAlign = 'center';
    weight.textBaseline = 'middle';
    weight.x = (start.x + end.x) / 2;
    weight.y = (start.y + end.y) / 2;

    const container = new createjs.Container();
    container.addChild(line, weight);

    stage.addChild(container);
    stage.update();
}

// Function to redraw the graph on the canvas
function redraw() {
    stage.removeAllChildren();
    
    graph.nodes.forEach(node => drawNode(node));
    graph.edges.forEach(edge => drawEdge(edge));

    stage.update();
}

export { drawNode, drawEdge, redraw };