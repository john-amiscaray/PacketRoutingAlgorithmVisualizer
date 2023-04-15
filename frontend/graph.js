import { redraw } from "./canvas.js";


let storedGraph = localStorage.getItem('graph');

let graph = storedGraph ? JSON.parse(storedGraph) : { nodes: [], edges: [] };

redraw();

function addNode(label) {
    if (graph.nodes.filter((node) => node.label === label).length !== 0) {
        return {
            success: false,
            error: "A node with that label already exists",
        };
    }
    let node = { label };
    graph.nodes.push(node);
    // drawNode(node); 
    return {
        success: true,
    };
}

function addEdge(node1, node2, weight) {
    const edgeIndex = graph.edges.findIndex((edge) => {
        return (
            (edge.node1 === node1 &&
                edge.node2 === node2 &&
                edge.weight === weight) ||
            (edge.node1 === node2 &&
                edge.node2 === node1 &&
                edge.weight === weight)
        );
    });

    if (
        graph.nodes.filter((node) => node.label === node1).length === 0 ||
        graph.nodes.filter((node) => node.label === node2).length === 0
    ) {
        return {
            success: false,
            error: "The new edge contains non-existent nodes",
        };
    } else if (node1 === node2) {
        return {
            success: false,
            error: "The graph cannot contain loops",
        };
    } else if (edgeIndex !== -1) {
        return {
            success: false,
            error: "Edge already exists",
        };
    }
    graph.edges.push({ node1, node2, weight });
    // drawEdge({ node1, node2, weight });
    return {
        success: true,
    };
}

function removeNode(label) {
    graph.nodes = graph.nodes.filter((node) => node.label !== label);
    graph.edges = graph.edges.filter(
        (edge) => edge.node1 !== label && edge.node2 !== label
    );
    return {
        success: true,
    };
}

function removeEdge(node1, node2, weight) {
    // Find the index of the edge in the graph.edges array
    const edgeIndex = graph.edges.findIndex((edge) => {
        return (
            (edge.node1 === node1 &&
                edge.node2 === node2 &&
                edge.weight === weight) ||
            (edge.node1 === node2 &&
                edge.node2 === node1 &&
                edge.weight === weight)
        );
    });

    if (edgeIndex === -1) {
        return {
            success: false,
            error: `The edge does not exist between nodes ${node1} and ${node2} with a weight of ${weight}`,
        };
    } else {
        graph.edges.splice(edgeIndex, 1);
        return {
            success: true,
        };
    }
}

function getEdgeByAdjacentNodes(node1, node2) {

    return graph.edges.find((edge => edge.node1 === node1 && edge.node2 === node2) || (edge => edge.node1 === node2 && edge.node2 === node1));

}

function saveGraph() {

    localStorage.setItem("graph", JSON.stringify(graph));

}

function clearGraph() {
    localStorage.removeItem("graph");
    graph = { nodes: [], edges: [] };
    redraw();
}

async function computeDijkstra(start) {

    return await fetch("http://localhost:8080/graph/dijkstra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            graph,
            start,
        }),
    });
}

async function computeBellmanFord(start) {
    return await fetch("http://localhost:8080/graph/bellmanFord", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            graph,
            start,
        }),
    });
}

export {
    graph,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    saveGraph,
    clearGraph,
    computeDijkstra,
    computeBellmanFord,
    getEdgeByAdjacentNodes
};
