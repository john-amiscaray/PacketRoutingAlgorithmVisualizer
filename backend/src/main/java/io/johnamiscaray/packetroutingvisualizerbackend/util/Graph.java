package io.johnamiscaray.packetroutingvisualizerbackend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Singular;
import org.javatuples.Pair;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Graph {

    @Singular
    private List<Node> nodes;
    @Singular
    private List<Edge> edges;

    public List<Node> getNodes() {
        return Collections.unmodifiableList(nodes);
    }

    public List<Edge> getEdges() {
        return Collections.unmodifiableList(edges);
    }

    public List<Pair<Node, Edge>> connectedNodesOf(Node node) {
        List<Edge> connectedEdges = edges.stream()
                .filter(edge -> edge.getNode1().equals(node.getLabel()) || edge.getNode2().equals(node.getLabel()))
                .collect(Collectors.toList());
        List<Pair<Node, Edge>> result = new ArrayList<>();
        for (Edge e : connectedEdges) {
            Optional<Node> other = node.getLabel().equals(e.getNode1()) ? getNode(e.getNode2()) : getNode(e.getNode1());
            result.add(new Pair<>(other.orElseThrow(), e));
        }
        return result;
    }

    public List<Pair<Node, Edge>> connectedNodesOf(String label) {

        Node node = getNode(label).orElseThrow();
        return connectedNodesOf(node);

    }

    public Optional<Node> getNode(String label) {

        return nodes.stream()
                .filter(node -> node.getLabel().equals(label))
                .findFirst();

    }

}
