package io.johnamiscaray.packetroutingvisualizerbackend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BellmanFordState {

    private List<PathEntry> pathTable;
    private List<PathEntry> updates;

}
