import { addEdge, addNode, graph, removeNode } from "./graph.js";

let stage = new createjs.Stage("graphics-pane");

function editGraphSubmit() {

    let newNodeLabel = $("#add-node").val().trim();
    let newEdgeStart = $("#node-from").val().trim();
    let newEdgeEnd = $("#node-to").val().trim();
    let newEdgeWeight = $("#weight").val();
    let nodeToDelete = $("#delete-node").val().trim();
    let results = [];
    let errorMessage = "Failed to apply changes for the following reasons:\n";
    let failed = false;

    if(newNodeLabel){

        results.push(addNode(newNodeLabel));

    }

    if(nodeToDelete){

        results.push(removeNode(nodeToDelete));

    }

    if(newEdgeStart && newEdgeEnd && newEdgeWeight){

        results.push(addEdge(newEdgeStart, newEdgeEnd, newEdgeWeight));

    }

    $('input').val("");

    for(let result of results){

        if(result.success === false){
            failed = true;
            errorMessage += `${result.error}\n`;
        }

    }
    if(failed){
        alert(errorMessage);
    }
    console.log(graph);

}

window.editGraphSubmit = editGraphSubmit;