import Handler from "@/canvas/handlers/Handler";
import { FabricEvent } from "@/canvas/utils";

class EventHandler {
  handler: Handler;
  code: string;

  constructor(handler: Handler) {
    this.handler = handler;
    this.initialize();
  }
  public object = {
    /**
     * 对象上的鼠标按下事件
     * @param {FabricEvent} opt
     */
    mousedown: (opt: FabricEvent) => {
      const { target } = opt;
      if (target && target.link && target.link.enabled) {
        const { onClick } = this.handler;
        if (onClick) {
          onClick(this.handler.canvas, target);
        }
      }
    },
    /**
     * 鼠标双击对象事件
     * @param {FabricEvent} opt
     */
    mouseDblClick: (opt: FabricEvent) => {},
  };

  public initialize() {
    if (this.handler.editable) {
      // @ts-ignore
      this.handler.canvas.on({
        "object:moving": this.moving,
        "mouse:up": this.mouseup,
        "mouse:down": this.mousedown,
      });
      this.handler.canvas.wrapperEl.tabIndex = 1000;
      this.handler.canvas.wrapperEl.addEventListener(
        "keydown",
        this.keydown,
        false,
      );
      this.handler.canvas.wrapperEl.addEventListener(
        "keyup",
        this.keyup,
        false,
      );
      console.log(
        this.handler.canvas.wrapperEl,
        " this.handler.canvas.wrapperEl",
      );
      this.handler.canvas.wrapperEl.addEventListener(
        "dblclick",
        this.mousedblclick,
        false,
      );
    }
  }
  public keyup = (e: KeyboardEvent) => {
    console.log(e);
  };
  public mousedown = (opt: FabricEvent) => {
    const event = opt as FabricEvent<MouseEvent>;
    const { target } = event;
    const { editable } = this.handler;
    if (editable) {
      if (this.handler.interactionMode === "selection") {
        if (target && target.superType === "link") {
          target.set({
            stroke: target.selectedStroke || "green",
          });
        }
        // this.handler.prevTarget = target;
        return;
      }
      if (this.handler.interactionMode === "polygon") {
        console.log(target);
        //如果第一个点和最后一个点重合，认为polygon画完了

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
        if (
          target &&
          this.handler.pointArray.length &&
          target.id === this.handler.pointArray[0].id
        ) {
        } else {
          this.handler.drawingHandler.polyline.addPoint(event);
        }
      }
    }
  };

  public mousedblclick = (_e: MouseEvent) => {
    console.log(_e, "doubleclick");
    // 多边形的时候双击结束
    if (
      this.handler.interactionMode === "polyline" &&
      this.handler.pointArray.length >= 2
    ) {
      this.handler.drawingHandler.polyline.generate(this.handler.pointArray);
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
    this.handler.canvas.getObjects().forEach((obj: any) => {
      console.log(obj, "resize =");
      if (obj.id !== "workarea") {
        const left = obj.left + diffWidth;
        const top = obj.top + diffHeight;
        obj.set({
          left,
          top,
        });
        obj.setCoords();
        if (obj.superType === "element") {
          const { id, eleType } = obj;
          const el = this.handler.elementHandler.findById(id, eleType);
          console.log(el, "obj", obj);
          // update the element
          this.handler.elementHandler.setPosition(el, obj);
        }
      }
    });

    this.handler.canvas.renderAll();
  };
  public moving = (opt: FabricEvent) => {
    const { target } = opt as any;
    if (this.handler.interactionMode === "crop") {
      //  this.handler.cropHandler.moving(opt);
    } else {
      if (this.handler.editable && this.handler.guidelineOption.enabled) {
        //this.handler.guidelineHandler.movingGuidelines(target);
      }
      if (target.type === "activeSelection") {
        const activeSelection = target as fabric.ActiveSelection;
        console.log(activeSelection, "activeSelection");
        activeSelection.getObjects().forEach((obj: any) => {
          const left = target.left + obj.left + target.width / 2;
          const top = target.top + obj.top + target.height / 2;
          if (obj.superType === "node") {
            //    this.handler.portHandler.setCoords({ ...obj, left, top });
          } else if (obj.superType === "element") {
            const { id } = obj;

            const el = this.handler.elementHandler.findById(id);
            // TODO... Element object incorrect position
            this.handler.elementHandler.setPositionByOrigin(el, obj, left, top);
          }
        });
        return;
      }
      if (target.superType === "node") {
        //  this.handler.portHandler.setCoords(target);
      } else if (target.superType === "element") {
        const { id, eleType } = target;
        const el = this.handler.elementHandler.findById(id, eleType);
        //通过找到元素把内容放里面
        this.handler.elementHandler.setPosition(el, target);
      }
    }
  };
  public mouseup(opt: FabricEvent) {
    // this.handler.canvas.renderAll();
  }

  /*
   * 键盘事件的入口
   * */
  public keydown = (e: KeyboardEvent) => {
    const { keyEvent, editable } = this.handler;
    if (!Object.keys(keyEvent).length) {
      return;
    }
    const { clipboard, grab } = keyEvent;
    console.log(
      this.handler.interactionHandler.isDrawingMode(),
      this.handler.shortcutHandler.isEscape(e),
      this.handler.interactionMode,
    );
    if (this.handler.interactionHandler.isDrawingMode()) {
      if (this.handler.shortcutHandler.isEscape(e)) {
        if (this.handler.interactionMode === "polygon") {
          this.handler.drawingHandler.polygon.finish();
        } else if (this.handler.interactionMode === "line") {
          this.handler.drawingHandler.line.finish();
        } else if (this.handler.interactionMode === "arrow") {
          this.handler.drawingHandler.arrow.finish();
        } else if (this.handler.interactionMode === "link") {
          //this.handler.linkHandler.finish();
        }
      }
      return;
    }
  };
}

export default EventHandler;
