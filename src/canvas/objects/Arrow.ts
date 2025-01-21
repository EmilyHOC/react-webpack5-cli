import * as fabric from "fabric";
import { nanoid } from "nanoid";

class Arrow extends fabric.Line {
  private readonly points: any[];
  constructor(points: any, options: any) {
    super(points, options);
    this.set({
      id: nanoid(),
      eleType: "arrow",
      superType: "drawing",
    });
    this.points = points;
  }
  _render(ctx: CanvasRenderingContext2D) {
    //先吧fabric的line画出来，用继承原来的方式
    super._render(ctx);
    ctx.save();
    //两个点再做渲染
    const [x1, y1, x2, y2] = this.points;
    if (x1 != x2) {
      const xDiff = x2 - x1;
      const yDiff = y2 - y1;
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate((x2 - x1) / 2, (y2 - y1) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-5, 5);
      ctx.lineTo(-5, -5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
}

export default Arrow;
