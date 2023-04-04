package io.johnamiscaray.packetroutingvisualizerbackend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.javatuples.Pair;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Graph {

    private List<Node> nodes;
    private List<Edge> edges;

    public List<Node> getNodes() {
        return Collections.unmodifiableList(nodes);
    }

    public List<Edge> getEdges() {
        return Collections.unmodifiableList(edges);
    }

    public Pair<Node, Edge> connectedNodesOf(Node node) {
        return new Pair<>(null, null);
    }

    public Pair<Node, Edge> connectedNodesOf(String label) {

        Node node = getNode(label).orElseThrow(() -> new NoSuchElementException("The node: " + label + " does not exist."));
        return connectedNodesOf(node);

    }

    public Optional<Node> getNode(String label) {

        return nodes.stream()
                .filter(node -> node.getLabel().equals(label))
                .findFirst();

    }

}
