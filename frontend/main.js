import {
    addEdge,
    addNode,
    computeDijkstra,
    graph,
    removeNode,
    removeEdge,
    saveGraph,
} from "./graph.js";

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

        case "removeEdge":
            let delEdgeStart = $("node-from-delete").val().trim();
            let delEdgeEnd = $("node-to-delete").val().trim();
            let delEdgeWeight = $("weight-delete").val().trim();

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
}

function dijkstraStart() {
    let start = $("#starting-node").val().trim();

    if (graph.nodes.filter((node) => node.label === start).length === 0) {
        alert("Please select a valid starting node");
        return;
    }

    computeDijkstra(start)
        .then((res) => res.json())
        // res in the following line is the array of DijkstraState objects from the backend. TODO: use them for the animation
        .then((res) => console.log(res));
}

window.editGraphSubmit = editGraphSubmit;
window.dijkstraStart = dijkstraStart;
