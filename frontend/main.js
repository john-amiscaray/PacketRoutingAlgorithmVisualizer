import {
    addEdge,
    addNode,
    computeDijkstra,
    graph,
    removeNode,
    saveGraph,
    removeEdge,
    clearGraph,
} from "./graph.js";

import {
    drawEdge,
    redraw,
    drawConnectingEdge,
    drawNode,
    nodeContainerMap,
} from "./canvas.js";

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

function clearGraphClick() {
    if (confirm("Are you sure you want to clear this graph?")) {
        clearGraph();
    }
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

    function isUpdatedByAttachedEdge(pathTableCell, attachedEdges) {
        let result = false;

        for (let edge of attachedEdges) {
            if (
                pathTableCell.vertexLabel === edge.node1 &&
                pathTableCell.previousVertexLabel === edge.node2
            ) {
                return true;
            } else if (
                pathTableCell.vertexLabel === edge.node2 &&
                pathTableCell.previousVertexLabel === edge.node1
            ) {
                return true;
            }
        }

        return result;
    }

    function drawStates(states, previouslyAddedEdges = []) {
        if (states.length === 0) {
            return;
        }

        // Pops out the first element similar to a stack
        let state = states.shift();
        let activeAnimations = [];
        let container = nodeContainerMap.get(state.currentNode);
        createjs.Tween.get(container, { loop: true })
            .to({ scale: 0.7 }, 500)
            .to({ scale: 1 }, 500);

        stage.setChildIndex(container, stage.children.length - 1);

        state.pathTable.forEach((cell) => {
            if (
                cell.vertexLabel &&
                cell.previousVertexLabel &&
                isUpdatedByAttachedEdge(cell, state.attachedEdges)
            ) {
                // Remove previously added edge from path if we found a better one
                previouslyAddedEdges.forEach((entry) => {
                    if (
                        entry.line &&
                        (entry.node1 === cell.vertexLabel ||
                            entry.node2 === cell.vertexLabel)
                    ) {
                        createjs.Tween.get(entry.line)
                            .to({ alpha: -100 }, 5000)
                            .call(() => stage.removeChild(entry.line));
                    }
                });
                activeAnimations.push(
                    drawConnectingEdge({
                        node1: cell.previousVertexLabel,
                        node2: cell.vertexLabel,
                        weight: cell.distance,
                    })
                );
            }
        });

        Promise.all(activeAnimations).then((values) => {
            createjs.Tween.removeAllTweens();
            let containerIter = nodeContainerMap.values();
            let container = containerIter.next().value;
            do {
                stage.removeChild(container);
                container = containerIter.next().value;
            } while (container);
            graph.nodes.forEach((node) => drawNode(node));
            previouslyAddedEdges = previouslyAddedEdges.concat(values);
            sleep(1000).then(() => {
                drawStates(states, previouslyAddedEdges);
            });
        });
    }

    computeDijkstra(start)
        .then((res) => res.json())
        .then((res) => {
            drawStates(res);
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

createjs.Ticker.setFPS(120);

window.editGraphSubmit = editGraphSubmit;
window.clearGraphClick = clearGraphClick;
window.dijkstraStart = dijkstraStart;
window.bellmanFordStart = bellmanFordStart;

export { stage };
