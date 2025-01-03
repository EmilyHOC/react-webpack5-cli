import { LinkObject } from "./Link";
import fabric, { FabricObject } from "fabric";
export interface PortObject extends FabricObject<fabric.Rect> {
  links?: LinkObject[];
  nodeId?: string;
  enabled?: boolean;
  hoverFill?: string;
  selectFill?: string;
}
