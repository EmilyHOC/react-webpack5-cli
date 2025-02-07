import Handler from "./Handler";
import { FabricObject } from "../utils";

export type TransactionType =
  | "add"
  | "remove"
  | "modified"
  | "moved"
  | "scaled"
  | "rotated"
  | "skewed"
  | "group"
  | "ungroup"
  | "paste"
  | "bringForward"
  | "bringToFront"
  | "sendBackwards"
  | "sendToBack"
  | "redo"
  | "undo";

export interface TransactionEvent {
  json: string;
  type: TransactionType;
}
class TransactionHandler {
  handler: Handler;
  redos: TransactionEvent[];
  undos: TransactionEvent[];
  active: boolean = false;
  state: FabricObject[] = [];

  constructor(handler: Handler) {
    this.handler = handler;
    this.initialize();
  }

  /**
   * 初始化
   */
  public initialize() {
    this.redos = [];
    this.undos = [];
    this.state = [];
    this.active = false;
  }
  /**
   * Save transaction
   *
   * @param {TransactionType} type
   * @param {*} [canvasJSON]
   * @param {boolean} [isWorkarea=true]
   */
  public save = (
    type: TransactionType,
    canvasJSON?: any,
    _isWorkarea: boolean = true,
  ) => {
    if (!this.handler.keyEvent.transaction) {
      return;
    }
    try {
      if (this.state) {
        const json = JSON.stringify(this.state);
        this.redos = [];
        this.undos.push({
          type,
          json,
        });
      }
      const { objects }: { objects: FabricObject[] } =
        canvasJSON || this.handler.canvas.toJSON();
      console.log(objects, "objects", this.handler.canvas.toJSON());
      this.state = objects.filter((obj) => {
        if (obj.id === "workarea") {
          return false;
        } else if (obj.id === "grid") {
          return false;
        } else if (obj.superType === "port") {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error(error);
    }
    console.log(this.state, "this.state");
  };
}

export default TransactionHandler;
