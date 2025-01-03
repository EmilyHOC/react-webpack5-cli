import fabric, { FabricObject } from "fabric";
import { NodeObject } from "./Node";
import { PortObject } from "./Port";
export interface LinkObject extends FabricObject<fabric.Line> {
  fromNode?: NodeObject;
  toNode?: NodeObject;
  fromPort?: PortObject;
  toPort?: PortObject;
  fromPortIndex?: number;
  setPort?: (
    fromNode: NodeObject,
    fromPort: PortObject,
    toNode: NodeObject,
    toPort: PortObject,
  ) => void;
  setPortEnabled?: (
    node: NodeObject,
    port: PortObject,
    enabled: boolean,
  ) => void;
}
