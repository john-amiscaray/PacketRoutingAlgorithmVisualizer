import { graph } from "./graph.js";
import { stage } from "./main.js"

// Constants for node, edge, and label styling
const NODE_RADIUS = 45;
const NODE_COLOR = 'DeepSkyBlue';
const EDGE_COLOR = 'Red';
const LABEL_COLOR = 'White';
const WEIGHT_COLOR = 'Black';

stage.canvas.width = window.innerWidth * 0.85;
stage.canvas.height = window.innerHeight * 0.85;

// Function to draw a node
function drawNode(node) {
    const circle = new createjs.Shape();
    circle.graphics.beginFill(NODE_COLOR).drawCircle(0, 0, NODE_RADIUS);

    // Add a text label to the node
    const label = new createjs.Text(node.label, 'bold 25px Arial', LABEL_COLOR);
    label.textAlign = 'center';
    label.textBaseline = 'middle';

    // Create a container for the circle and label
    const container = new createjs.Container();
    container.x = (Math.random() * stage.canvas.width) - NODE_RADIUS;
    container.y = (Math.random() * stage.canvas.height) - NODE_RADIUS;
    container.addChild(circle, label);

    node.x = container.x;
    node.y = container.y;
    
    stage.addChild(container);
    stage.update();
}

// Function to draw an edge on the canvas
function drawEdge(edge) {
    // Get the starting and ending nodes
    const start = graph.nodes.find(node => node.label === edge.node1);
    const end = graph.nodes.find(node => node.label === edge.node2);

    // Create an edge to connect both nodes
    const line = new createjs.Shape();
    line.graphics.setStrokeStyle(edge.weight).beginStroke(EDGE_COLOR).moveTo(start.x, start.y).lineTo(end.x, end.y);

    // Display the weight of the edge
    const weight = new createjs.Text(edge.weight.toString(), 'bold 25px Arial', WEIGHT_COLOR);
    weight.textAlign = 'center';
    weight.textBaseline = 'middle';
    weight.x = (start.x + end.x) / 2;
    weight.y = (start.y + end.y) / 2;
    
    const container = new createjs.Container();
    container.addChild(line, weight);
    
    stage.addChild(container);
    stage.update()
}

// Function to redraw the graph on the canvas
function redraw() {
    stage.removeAllChildren();
    
    graph.nodes.forEach(node => drawNode(node));
    graph.edges.forEach(edge => drawEdge(edge));

    stage.update();
}

export { drawNode, drawEdge, redraw };