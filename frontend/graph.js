let storedGraph = localStorage.getItem("graph");

let graph = storedGraph ? JSON.parse(storedGraph) : { nodes: [], edges: [] };

function addNode(label) {
    if (graph.nodes.filter((node) => node.label === label).length !== 0) {
        return {
            success: false,
            error: "A node with that label already exists",
        };
    }
    graph.nodes.push({ label });
    return {
        success: true,
    };
}

function addEdge(node1, node2, weight) {
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
    }
    graph.edges.push({ node1, node2, weight });
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

function saveGraph() {
    localStorage.setItem("graph", JSON.stringify(graph));
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

export { graph, addNode, addEdge, removeNode, saveGraph, computeDijkstra };
