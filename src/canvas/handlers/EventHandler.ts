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
    mousedown: (opt: FabricEvent) => {
      const { target } = opt;
      console.log(target, "target", opt);
      if (target && target.link && target.link.enabled) {
        const { onClick } = this.handler;
        if (onClick) {
          onClick(this.handler.canvas, target);
        }
      }
    },
    /**
     * Mouse double click event on object
     * @param {FabricEvent} opt
     */
    mousedblclick: (opt: FabricEvent) => {
      const { target } = opt;
      console.log("opt:mousedblclick", opt);
      if (target) {
        const { onDblClick } = this.handler;
        console.log(onDblClick, "onDbCLick");
        if (onDblClick) {
          onDblClick(this.handler.canvas, target);
        }
      }
    },
  };

  initialize() {
    if (this.handler.editable) {
      // @ts-ignore
      this.handler.canvas.on({
        // 'object:modified': this.modified,
        // 'object:scaling': this.scaling,
        // 'object:moving': this.moving,
        // 'object:rotating': this.rotating,
        // 'object:rotated': this.rotated,
        // 'mouse:wheel': this.mousewheel,
        "mouse:down": this.mousedown,
      });
    } else {
      // @ts-ignore
      this.handler.canvas.on({
        "mouse:down": this.mousedown,
        // 'mouse:move': this.mousemove,
        // 'mouse:out': this.mouseout,
        // 'mouse:up': this.mouseup,
        // 'mouse:wheel': this.mousewheel,
      });
    }
  }
  public mousedown = (opt: FabricEvent) => {
    const event = opt as FabricEvent<MouseEvent>;
    const { editable } = this.handler;
    console.log("mousedown", event);
    const { target } = event;
    if (this.handler.interactionMode === "polygon") {
      console.log(target.id);
      if (
        target &&
        this.handler.pointArray.length &&
        target.id === this.handler.pointArray[0].id
      ) {
        this.handler.drawingHandler.polygon.generate(this.handler.pointArray);
      } else {
        this.handler.drawingHandler.polygon.addPoint(event);
      }
    } else if (this.handler.interactionMode === "line") {
      if (this.handler.pointArray.length && this.handler.activeLine) {
        this.handler.drawingHandler.line.generate(event);
      } else {
        this.handler.drawingHandler.line.addPoint(event);
      }
    } else if (this.handler.interactionMode === "arrow") {
      if (this.handler.pointArray.length && this.handler.activeLine) {
        this.handler.drawingHandler.arrow.generate(event);
      } else {
        this.handler.drawingHandler.arrow.addPoint(event);
      }
    } else if (this.handler.interactionMode === "polyline") {
      console.log(this.handler, "this.handler", target.id);
      if (
        target &&
        this.handler.pointArray.length &&
        target.id === this.handler.pointArray[0].id
      ) {
      } else {
        this.handler.drawingHandler.polyline.addPoint(event);
      }
    }
  };
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
