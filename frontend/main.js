import {
    addEdge,
    addNode,
    getEdgeWeight,
    computeDijkstra,
    graph,
    removeNode,
    saveGraph,
    removeEdge,
    clearGraph,
    computeBellmanFord
} from "./graph.js";

import {
    drawEdge,
    redraw,
    drawConnectingEdge,
    drawNode,
    nodeContainerMap,
    drawText,
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

    function drawDijkstraStates(
        states,
        previouslyAddedEdges = [],
        textContainer = []
    ) {
        const JAVA_MAX_INT = 2147483647;

        if (states.length === 0) {
            return;
        }

        console.log(states);
        // Pops out the first element similar to a stack
        let state = states.shift();
        console.log(state);
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
                            .to({ alpha: 0 }, 5000)
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

        let yValMultiplier = 1;
        let xPos = stage.canvas.width - 375;
        let tempTextContainer = [];
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
                textContainer.forEach((container) => {
                    stage.removeChild(container);
                });
                tempTextContainer.push(
                    drawText(
                        "Vertex Label ----  Distance ---- Previous Vertex Label",
                        xPos,
                        10 * yValMultiplier
                    )
                );
                yValMultiplier++;
                if (state) {
                    state.pathTable.forEach((elem) => {
                        let distance =
                            elem.distance !== JAVA_MAX_INT
                                ? elem.distance
                                : "∞";
                        tempTextContainer.push(
                            drawText(
                                `${elem.vertexLabel}`,
                                xPos + 50,
                                14 * yValMultiplier,
                                "right"
                            )
                        );
                        tempTextContainer.push(
                            drawText(
                                `${distance}`,
                                xPos + 150,
                                14 * yValMultiplier,
                                "right"
                            )
                        );
                        tempTextContainer.push(
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
                drawDijkstraStates(
                    states,
                    previouslyAddedEdges,
                    tempTextContainer
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

    function drawBellmanFordStates(states, previouslyAddedEdges = [], textContainer = []) {
        const JAVA_MAX_INT = 2147483647;

        if (states.length === 0) {
            return;
        }

        // Pops out the first path table of the states list.
        const currentPathTable = states.shift().pathTable;
        let updates = [];

        for (let i = 0; i < currentPathTable.length; i++) {
            const currentNodeLabel = currentPathTable[i].vertexLabel;
            const currentDistance = currentPathTable[i].distance;
            const previousNodeLabel = currentPathTable[i].previousVertexLabel;

            if (previousNodeLabel !== null) {
                const previousNodeContainer = nodeContainerMap.get(previousNodeLabel);
                const currentNodeContainer = nodeContainerMap.get(currentNodeLabel);
                const edgeWeight = graph.getEdgeWeight(previousNodeLabel, currentNodeLabel);

                // Draw the path from the previous node to the current node.
                const pathColor = "#0000FF";
                const connectingEdge = drawConnectingEdge(
                    stage,
                    previousNodeContainer.x + 25,
                    previousNodeContainer.y + 25,
                    currentNodeContainer.x + 25,
                    currentNodeContainer.y + 25,
                    pathColor,
                    1
                );

                previouslyAddedEdges.push(connectingEdge);
                updates.push(currentNodeLabel);
            }

            const nodeContainer = nodeContainerMap.get(currentNodeLabel);

            // Draw the node with its updated distance value.
            const nodeColor = updates.includes(currentNodeLabel) ? "#00FF00" : "#FFFFFF";
            drawNode(stage, nodeContainer.x, nodeContainer.y, 30, nodeColor);

            // Draw the distance text.
            const distanceText = currentDistance === JAVA_MAX_INT ? "INF" : currentDistance;
            const previousDistanceText = textContainer[i] || null;
            const textX = nodeContainer.x + 25;
            const textY = nodeContainer.y + 35;
            const distanceColor =
                updates.includes(currentNodeLabel) || previousDistanceText === null
                    ? "#FFFFFF"
                    : "#000000";
            textContainer[i] = drawText(stage, distanceText, textX, textY, distanceColor);

            // Remove the previous distance text from the stage.
            if (previousDistanceText !== null) {
                stage.removeChild(previousDistanceText);
            }
        }

        sleep(1000).then(() => {
            // Remove the connecting edges from the stage.
            for (let edge of previouslyAddedEdges) {
                stage.removeChild(edge);
            }

            drawBellmanFordStates(states, previouslyAddedEdges, textContainer);
        });
    }
    //old one
    // computeBellmanFord(start, drawBellmanFordStates);

    computeBellmanFord(start)
    .then((res) => res.json())
    .then((res) => {
        drawBellmanFordStates(res);
    });
}






createjs.Ticker.setFPS(60);

window.editGraphSubmit = editGraphSubmit;
window.clearGraphClick = clearGraphClick;
window.dijkstraStart = dijkstraStart;
window.bellmanFordStart = bellmanFordStart;

export { stage };
