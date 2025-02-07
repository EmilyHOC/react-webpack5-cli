import Handler from "@/canvas/handlers/Handler";
import { FabricObject, InteractionMode } from "@/canvas/utils";
type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

class InteractionHandler {
  handler: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
    if (this.handler.editable) {
      this.selection();
    }
  }
  /**
   * 更改选择模式
   * @param {(obj: FabricObject) => IReturnType} [callback]
   */
  public selection = (callback?: (obj: FabricObject) => IReturnType) => {
    if (this.handler.interactionMode === "selection") {
      return;
    }
    this.handler.interactionMode = "selection";
    if (typeof this.handler.canvasOption.selection === "undefined") {
      this.handler.canvas.selection = true;
    } else {
      this.handler.canvas.selection = this.handler.canvasOption.selection;
    }
    this.handler.canvas.defaultCursor = "default";
    //this.handler.workarea.hoverCursor = "default";
    this.handler.getObjects().forEach((obj) => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        // 当 typeof selection 为 ActiveSelection 时，忽略 selectable，因为链接位置 left： 0， top： 0
        if (obj.superType === "link" || obj.superType === "port") {
          obj.selectable = false;
          obj.evented = true;
          obj.hoverCursor = "pointer";
          return;
        }
        if (this.handler.editable) {
          obj.hoverCursor = "move";
        } else {
          obj.hoverCursor = "pointer";
        }
        obj.selectable = true;
        obj.evented = true;
      }
    });
    this.handler.canvas.renderAll();
    this.handler.onInteraction?.("selection");
  };

  /**
   * 更改绘图模式
   * @param callback
   */
  public drawing = (
    type?: InteractionMode,
    callback?: (obj: FabricObject) => IReturnType,
  ) => {
    if (this.isDrawingMode()) {
      return;
    }
    this.handler.interactionMode = type;
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = "pointer";
    // this.handler.workarea.hoverCursor = "pointer";
    this.handler.getObjects().forEach((obj) => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        obj.selectable = false;
        obj.evented = this.handler.editable ? false : true;
      }
    });
    this.handler.canvas.renderAll();
    this.handler.onInteraction?.(type);
  };
  /**
   * 是否为绘图模式
   * @returns
   */
  public isDrawingMode = () => {
    return (
      this.handler.interactionMode === "link" ||
      this.handler.interactionMode === "arrow" ||
      this.handler.interactionMode === "line" ||
      this.handler.interactionMode === "polygon"
    );
  };

  private interactionCallback = (
    obj: FabricObject,
    callback?: (obj: FabricObject) => void,
  ) => {
    callback(obj);
  };
}

export default InteractionHandler;
