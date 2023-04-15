import {
    addEdge,
    addNode,
    computeDijkstra,
    computeBellmanFord,
    graph,
    removeNode,
    saveGraph,
    removeEdge,
    clearGraph,
    getEdgeByAdjacentNodes,
} from "./graph.js";

import {
    redraw,
    drawConnectingEdge,
    nodeContainerMap,
    drawText,
    redrawNodes,
    fadeOut,
    edgeContainerMap,
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

function drawPathTableFromState(algoState) {

    const JAVA_MAX_INT = 2147483647;

    let textContainer = [];
    let yValMultiplier = 1;
    let xPos = stage.canvas.width - 375;

    textContainer.push(
        drawText(
            "Vertex Label ----  Distance ---- Previous Vertex Label",
            xPos,
            10 * yValMultiplier
        )
    );
    yValMultiplier++;
    if (algoState) {
        algoState.pathTable.forEach((elem) => {
            let distance =
                elem.distance !== JAVA_MAX_INT
                    ? elem.distance
                    : "∞";
            textContainer.push(
                drawText(
                    `${elem.vertexLabel}`,
                    xPos + 50,
                    14 * yValMultiplier,
                    "right"
                )
            );
            textContainer.push(
                drawText(
                    `${distance}`,
                    xPos + 150,
                    14 * yValMultiplier,
                    "right"
                )
            );
            textContainer.push(
                drawText(
                    `${elem.previousVertexLabel ?? "NULL"}`,
                    xPos + 300,
                    14 * yValMultiplier,
                    "right"
                )
            );
            yValMultiplier++;
        });
    }

    return textContainer;

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

    function drawDijkstraStates(
        states,
        previouslyAddedEdges = [],
        textContainer = []
    ) {

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
                        fadeOut(entry.line);
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
            redrawNodes();
            // Ensure all lines are deleted properly even if Tween is lost prematurely
            previouslyAddedEdges.forEach((entry) => {
                let line = entry.line
                if (line && line.alpha < 1) {
                    line.alpha = 0;
                    stage.removeChild(line);
                }
            });
            previouslyAddedEdges = previouslyAddedEdges.concat(values);
            sleep(1000).then(() => {
                textContainer.forEach((container) => {
                    stage.removeChild(container);
                });
                let newTextContainer = drawPathTableFromState(state);
                drawDijkstraStates(
                    states,
                    previouslyAddedEdges,
                    newTextContainer
                );
            });
        });
    }

    computeDijkstra(start)
        .then((res) => res.json())
        .then((res) => {
            drawDijkstraStates(res);
        });
}

function bellmanFordStart() {
    let start = $("#starting-node").val().trim();

    if (graph.nodes.filter((node) => node.label === start).length === 0) {
        alert("Please select a valid starting node");
        return;
    }

    redraw();

    function drawConnectingEdgesFromUpdates(state, previousState, previousUpdatesInfo = [], textContainer = []){

        return new Promise((resolve, reject) => {

            let updates = state.updates;

            if(updates.length === 0){
                resolve(previousUpdatesInfo);
            }
    
            let update = updates.shift();
            let edge = getEdgeByAdjacentNodes(update.previousVertexLabel, update.vertexLabel);
            let cellToUpdate = previousState.pathTable.find(cell => cell.vertexLabel === update.vertexLabel);
            cellToUpdate.previousVertexLabel = update.previousVertexLabel;
            cellToUpdate.distance = update.distance;
            textContainer.forEach(container => stage.removeChild(container));
            textContainer = drawPathTableFromState(previousState);
            for(let previousUpdate of previousUpdatesInfo){
                if(previousUpdate.update.vertexLabel === update.vertexLabel && previousUpdate.drawingInfo.line){
                    fadeOut(previousUpdate.drawingInfo.line);
                }
            }
            let shape = edgeContainerMap.get(edge);

            createjs.Tween.get(shape, { loop: true })
                .to({ alpha: 0.2 }, 500)
                .to({ alpha: 1 }, 500);

            drawConnectingEdge(edge)
                .then(info => {
                    previousUpdatesInfo.push({ drawingInfo: info, update });
                    createjs.Tween.removeTweens(shape);
                    // Look through all the previous lines and delete them. Ensures that the line is deleted even if the Tween animation is stopped prematurely
                    for(let previousUpdate of previousUpdatesInfo){
                        let line = previousUpdate.drawingInfo.line;
                        if(line && line.alpha < 1){
                            line.alpha = 0;
                            stage.removeChild(line);
                        }
                    }
                    let containerIter = edgeContainerMap.values();
                    let container = containerIter.next().value;
                    do {
                        container.alpha = 1;
                        container = containerIter.next().value;
                    } while (container);
                    redrawNodes();
                    drawConnectingEdgesFromUpdates(state, previousState, previousUpdatesInfo, textContainer).then(updatesInfo => resolve(updatesInfo));
                });

        });

    }

    function drawBellmanFordStates(states, updatesInfo = [], previousState = null){

        if(states.length === 0){
            return;
        }

        let state = states.shift();

        let textContainer = drawPathTableFromState(state);

        drawConnectingEdgesFromUpdates(state, previousState, updatesInfo, textContainer).then(updatesInfo => {
            sleep(1000).then(() => { 

                textContainer.forEach((container) => {
                    stage.removeChild(container);
                });
    
                drawBellmanFordStates(states, updatesInfo, state);

            });
        });

    }

    computeBellmanFord(start)
        .then((res) => res.json())
        .then((res) => drawBellmanFordStates(res));
}

createjs.Ticker.setFPS(60);

window.editGraphSubmit = editGraphSubmit;
window.clearGraphClick = clearGraphClick;
window.dijkstraStart = dijkstraStart;
window.bellmanFordStart = bellmanFordStart;

export { stage };
