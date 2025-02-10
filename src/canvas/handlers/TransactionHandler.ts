import Handler from "./Handler";
import { FabricObject } from "../utils";
import throttle from "lodash/throttle";
import * as fabric from "fabric";
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
   * 保存操作
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
  };
  /**
   * 撤销函数
   */
  public undo = throttle(async () => {
    const undo = this.undos.pop();
    if (!undo) return;
    this.redos.push({
      type: "redo",
      json: JSON.stringify(this.state),
    });
    await this.replay(undo);
  }, 100);
  /**
   * 拿到最新的画面数组重新渲染
   * @param transaction
   */
  public replay = async (transaction: TransactionEvent) => {
    const objects = JSON.parse(transaction.json) as FabricObject[];
    //当前画面存在的数组
    this.state = objects;
    this.handler.canvas.renderOnAddRemove = false;
    this.handler.clear();
    this.handler.canvas.discardActiveObject();

    let enlivenObjects = await fabric.util.enlivenObjects(objects);
    console.log(enlivenObjects, "当前激活的元素");
    //当前激活的元素返回的是fabric对象
    enlivenObjects.forEach((obj: any) => {
      this.handler.canvas.add(obj);
    });
  };
}

export default TransactionHandler;
