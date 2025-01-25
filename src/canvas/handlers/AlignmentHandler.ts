import { Handler } from "@/canvas/handlers/index";
import * as fabric from "fabric";
class AlignmentHandler {
  handler: Handler;
  constructor(handler: Handler) {
    this.handler = handler;
  }

  /**
   * 选中元素向左对齐
   */
  public left() {
    //首先要有选中元素
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject && activeObject.type == "activeselection") {
      const activeSelection = activeObject as fabric.ActiveSelection;

      // 获取所有对象并计算最左边的位置
      let objects = activeSelection.getObjects();
      if (objects.length <= 1) return; // 如果只有一个或没有对象，则无需对齐

      // 找到最左边的对象
      let minX = Math.min(
        ...objects.map((obj) => {
          return obj.left;
        }),
      );

      // 对每个对象进行左对齐
      objects.forEach((obj) => {
        let leftOffset = minX - obj.left;
        obj.set({
          left: obj.left + leftOffset,
        });
        obj.setCoords();
      });

      // 更新组合的选择框和控制点
      activeSelection.setCoords();

      // 刷新画布以应用更改
      this.handler.canvas.requestRenderAll();
    }
  }

  /**
   * 右对齐
   */
  public right = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject && activeObject.type === "activeselection") {
      const activeSelection = activeObject as fabric.ActiveSelection;
      // 获取所有对象并计算最左边的位置
      let objects = activeSelection.getObjects();
      if (objects.length <= 1) return; // 如果只有一个或没有对象，则无需对齐
      // 找到最右边的对象（相对于画布）
      let maxX = Math.max(
        ...objects.map((obj) => {
          return obj.left + obj.width;
        }),
      );

      // 对每个对象进行右对齐
      objects.forEach((obj) => {
        // 计算新的left值，使得对象的右边缘与最右边的对象对齐
        let newLeft = maxX - obj.width;
        let leftOffset = newLeft - obj.left;

        obj.set({
          left: obj.left + leftOffset, // 移动对象
        });
        obj.setCoords(); // 更新对象坐标
      });
      // 更新组合的选择框和控制点
      activeSelection.setCoords();
      // 刷新画布以应用更改
      this.handler.canvas.requestRenderAll();
    }
  };
  //水平居中
  public center = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject && activeObject.type === "activeselection") {
      const activeSelection = activeObject as fabric.ActiveSelection;
      activeSelection.forEachObject((obj) => {
        //居中的元素让每个子元素挪到选中元素的一半就可以了
        obj.set({
          left: 0 - (obj.width * obj.scaleX) / 2,
        });
        obj.setCoords();
        // 更新组合的选择框和控制点
        activeSelection.setCoords();
        this.handler.canvas.requestRenderAll();
      });
    }
  };
  //垂直居中
  public middle = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject && activeObject.type === "activeselection") {
      const activeSelection = activeObject as fabric.ActiveSelection;
      activeSelection.forEachObject((obj) => {
        obj.set({
          top: 0 - (obj.width * obj.scaleX) / 2,
        });
        obj.setCoords();
        this.handler.canvas.requestRenderAll();
      });
    }
  };
}

export default AlignmentHandler;
