import { createContext } from "react";
import { NodeObject } from "../canvas/objects/Node";
export interface IFlowContext {
  selectedFlowNode: NodeObject;
  setSelectedFlowNode: (selectedFlowNode: NodeObject) => void;
}
const FlowContext = createContext<IFlowContext>(undefined);
export default FlowContext;
