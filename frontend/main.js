import {
    addEdge,
    addNode,
    computeDijkstra,
    graph,
    removeNode,
    saveGraph,
    removeEdge,
} from "./graph.js";

import { drawEdge, redraw, drawConnectingEdge, drawNode } from "./canvas.js";

let stage = new createjs.Stage("graphics-pane");

function editGraphSubmit(action) {
    let result;
    let errorMessage = "Failed to apply changes for the following reasons:\n";
    let failed = false;

    switch (String(action)) {
        case "addNode":
            let newNodeLabel = $("#add-node").val().trim();

            if (newNodeLabel) {
                result = addNode(newNodeLabel);
            }
            break;

        case "addEdge":
            let newEdgeStart = $("#node-from").val().trim();
            let newEdgeEnd = $("#node-to").val().trim();
            let newEdgeWeight = $("#weight").val();

            if (newEdgeStart && newEdgeEnd && newEdgeWeight) {
                result = addEdge(newEdgeStart, newEdgeEnd, newEdgeWeight);
            }
            break;

        case "deleteNode":
            let nodeToDelete = $("#delete-node").val().trim();
            if (nodeToDelete) {
                result = removeNode(nodeToDelete);
            }
            break;

        case "deleteEdge":
            let delEdgeStart = $("#node-from-delete").val().trim();
            let delEdgeEnd = $("#node-to-delete").val().trim();
            let delEdgeWeight = $("#weight-delete").val().trim();
            console.log(delEdgeStart);
            if (delEdgeStart && delEdgeEnd && delEdgeWeight) {
                result = removeEdge(delEdgeStart, delEdgeEnd, delEdgeWeight);
            }
            break;
    }

    if (result && result.success === false) {
        failed = true;
        errorMessage += `${result.error}\n`;
    }

    if (failed) {
        alert(errorMessage);
    } else {
        switch (String(action)) {
            case "addNode":
                $("#add-node").val("");
                break;

            case "addEdge":
                $("#node-from").val("");
                $("#node-to").val("");
                $("#weight").val("");
                break;

            case "deleteNode":
                $("#delete-node").val("");
                break;

            case "deleteEdge":
                $("#node-from-delete").val("");
                $("#node-to-delete").val("");
                $("#weight-delete").val("");
                break;
        }
    }

    saveGraph();
    redraw();
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function dijkstraStart() {
    let start = $("#starting-node").val().trim();

    if (graph.nodes.filter((node) => node.label === start).length === 0) {
        alert("Please select a valid starting node");
        return;
    }

    redraw();

    computeDijkstra(start)
        .then((res) => res.json())
        // res in the following line is the array of DijkstraState objects from the backend. TODO: use them for the animation
        .then((res) => {
            res.forEach((element) => {
                /*element["pathTable"].forEach((elem) => {
                    if (elem.vertexLabel && elem.previousVertexLabel) {
                        /*drawConnectingEdge({
                            node1: elem.vertexLabel,
                            node2: elem.previousVertexLabel,
                            weight: elem.distance,
                        });
                    }
                });

                element["pathTable"].forEach((elem) => {
                    if (elem.vertexLabel && elem.previousVertexLabel) {
                        drawEdge({
                            node1: elem.vertexLabel,
                            node2: elem.previousVertexLabel,
                            weight: elem.distance,
                        });
                    }
                });*/
            });

            stage.removeAllChildren();
            console.log(res[res.length - 1]["pathTable"]);
            res[res.length - 1]["pathTable"].forEach((element) => {
                if (element.vertexLabel && element.previousVertexLabel) {
                    drawConnectingEdge({
                        node1: element.vertexLabel,
                        node2: element.previousVertexLabel,
                        weight: element.distance,
                    });
                }
                graph.nodes.forEach((node) => drawNode(node));
            });
            stage.update();
        });
}

function bellmanFordStart() {
    let start = $("#starting-node").val().trim();

    if (graph.nodes.filter((node) => node.label === start).length === 0) {
        alert("Please select a valid starting node");
        return;
    }

    computeBellmanFord(start)
        .then((res) => res.json())
        // res in the following line is the array of DijkstraState objects from the backend. TODO: use them for the animation
        .then((res) => console.log(res));
}

window.editGraphSubmit = editGraphSubmit;
window.dijkstraStart = dijkstraStart;
window.bellmanFordStart = bellmanFordStart;

export { stage };
