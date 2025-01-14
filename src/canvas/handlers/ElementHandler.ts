import Handler from "@/canvas/handlers/Handler";
export type ElementType = "container" | "script" | "style";
import * as fabric from "fabric";
class ElementHandler {
  handler?: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
  }

  /**
   * 通过id和type找到元素
   * @param id
   * @param type
   */
  public findById = (id: string, type: ElementType = "container") => {
    return document.getElementById(`${id}_${type}`);
  };
  /**
   * 设置位置
   * @param el
   * @param obj
   */

  public setPosition = (el: HTMLElement, obj: fabric.Object) => {
    if (!el) {
      return;
    }
    obj.setCoords();
    const zoom = this.handler.canvas.getZoom();
    const { scaleX, scaleY, width, height } = obj;
    const { left, top } = obj.getBoundingRect(false);
    const padLeft = (width * scaleX * zoom - width) / 2;
    const padTop = (height * scaleY * zoom - height) / 2;
    el.style.left = `${left + padLeft}px`;
    el.style.top = `${top + padTop}px`;
  };
}

export default ElementHandler;
