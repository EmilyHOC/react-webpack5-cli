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
    const { left, top } = obj.getBoundingRect();

    const padLeft = (width * scaleX * zoom - width) / 2;
    const padTop = (height * scaleY * zoom - height) / 2;
    el.style.left = `${left + padLeft}px`;
    el.style.top = `${top + padTop}px`;
  };
  /**
   * 根据绝对定位设置元素
   *
   */
  public setPositionByOrigin = (
    el: HTMLElement,
    obj: fabric.Object,
    left: number,
    top: number,
  ) => {
    if (!el) {
      return;
    }
    obj.setCoords();
    const zoom = this.handler.canvas.getZoom();
    const { scaleX, scaleY, width, height } = obj;
    const padLeft = (width * scaleX * zoom - width) / 2;
    const padTop = (height * scaleY * zoom - height) / 2;
    el.style.left = `${left + padLeft}px`;
    el.style.top = `${top + padTop}px`;
  };
  /**
   * 根据ids数组移除元素
   */
  public removeByIds = (ids: string[]) => {
    ids.forEach((id) => {
      this.removeById(id);
    });
  };
  /**
   * 根据id移除元素
   */
  public removeById = (id: string, type: string) => {
    const el = this.findById(id, type);
    console.log(el, "移除的元素");
    const scriptEl = this.findById(id, "script");
    const styleEl = this.findById(id, "style");
    if (el) {
      if (el.remove) {
        el.remove();
      } else {
        this.remove(el);
      }
    }
    if (scriptEl) {
      if (scriptEl.remove) {
        scriptEl.remove();
      } else {
        document.head.removeChild(scriptEl);
      }
    }
    if (styleEl) {
      if (styleEl.remove) {
        styleEl.remove();
      } else {
        document.head.removeChild(styleEl);
      }
    }
  };
  public remove = (el: HTMLElement) => {
    if (!el) {
      return;
    }
    this.handler.container.removeChild(el);
  };
}

export default ElementHandler;
