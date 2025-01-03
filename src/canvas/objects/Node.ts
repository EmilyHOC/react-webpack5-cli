import { FabricObject } from "../utils";
import fabric from "fabric";
import { PortObject } from "./Port";
export interface NodeObject extends FabricObject<fabric.Group> {
  errorFlag?: fabric.IText;
  label?: fabric.Text;
  toPort?: PortObject;
  errors?: any;
  fromPort?: PortObject[];
  descriptor?: Record<string, any>;
  nodeClazz?: string;
  configuration?: Record<string, any>;
  defaultPortOption?: () => Partial<PortObject>;
  toPortOption?: () => Partial<PortObject>;
  fromPortOption?: () => Partial<PortObject>;
  createToPort?: (left: number, top: number) => PortObject;
  createFromPort?: (left: number, top: number) => PortObject[];
  singlePort?: (portOption: Partial<PortObject>) => PortObject[];
  staticPort?: (portOption: Partial<PortObject>) => PortObject[];
  dynamicPort?: (portOption: Partial<PortObject>) => PortObject[];
  broadcastPort?: (portOption: Partial<PortObject>) => PortObject[];
  setErrors?: (errors: any) => void;
  duplicate?: () => NodeObject;
}
