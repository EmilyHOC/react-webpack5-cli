import { Handler } from "@/canvas/handlers/index";
import { FabricEvent } from "@/canvas/utils";
import { FabricObject } from "fabric";

class EventHandler {
  handler: Handler;
  code: string;

  constructor(handler: Handler) {
    this.handler = handler;
    this.initialize();
  }
  public object = {
    /**
     * Mouse down event on object
     * @param {FabricEvent} opt
     */
    mousedown: (opt: FabricEvent) => {},
    /**
     * Mouse double click event on object
     * @param {FabricEvent} opt
     */
    mouseDblClick: (opt: FabricEvent) => {},
  };

  initialize() {}
  public mousedown = (opt: FabricEvent) => {};
  /**
   * 在画布上调用 resize 事件
   *
   * @param {number} nextWidth
   * @param {number} nextHeight
   * @returns
   */
  public resize = (nextWidth: number, nextHeight: number) => {
    this.handler.canvas.setWidth(nextWidth);
    this.handler.canvas.setHeight(nextHeight);
    const diffWidth = nextWidth / 2 - this.handler.width / 2;
    const diffHeight = nextHeight / 2 - this.handler.height / 2;
    console.log(nextWidth, nextHeight, "nextWidth", diffWidth, diffHeight);
    this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
      console.log(obj, "obj");
      // if (obj.id !== "workarea") {
      //   const left = obj.left + diffWidth;
      //   const top = obj.top + diffHeight;
      //   obj.set({
      //     left,
      //     top,
      //   });
      //   obj.setCoords();
      //   if (obj.superType === "element") {
      //     const { id } = obj;
      //     const el = this.handler.elementHandler.findById(id);
      //     // update the element
      //     this.handler.elementHandler.setPosition(el, obj);
      //   }
      // }
    });

    this.handler.canvas.renderAll();
  };
}

export default EventHandler;
