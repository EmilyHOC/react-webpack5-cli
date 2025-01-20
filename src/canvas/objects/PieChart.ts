import * as echarts from "echarts";
import * as fabric from "fabric";

class PieChart extends fabric.Rect {
  superType = "element" as const;
  private readonly _chartOption: echarts.EChartOption;
  private instance?: echarts.ECharts;
  private element?: HTMLDivElement;
  private _options: any;

  constructor(chartOption: echarts.EChartOption, options: any) {
    super(options);
    this._chartOption = chartOption;
    this.set({
      superType: "element",
      id: options.id,
      fill: "rgba(255, 255, 255, 0)",
      stroke: "rgba(255, 255, 255, 0)",
    });
    this._options = options;
    this.createChart();
  }

  createChart() {
    if (!this.element) {
      //这个containerId和elementHandler里面的id对应
      const containerId = `${this._options.id}_${this._options.eleType}`;
      this.element = document.createElement("div");
      this.element.id = containerId;

      // 设置初始样式
      this.updateElementStyle();
      document.querySelector(`.rde-canvas`).appendChild(this.element);
    }

    if (this.instance) {
      this.instance.dispose();
    }

    this.instance = echarts.init(this.element);
    this.instance.setOption(this._chartOption);
  }

  destroyChart() {
    if (this.instance) {
      this.instance.dispose();
      this.instance = undefined;
    }
  }

  updateElementStyle() {
    if (!this.element) return;
    const { scaleX, scaleY, angle } = this;
    const zoom = 1;
    const style = `
            transform: rotate(${angle}deg) scale(${scaleX * zoom}, ${
              scaleY * zoom
            });
            width: ${this.width}px;
            height: ${this.height}px;
            left: ${this.left}px;
            top:${this.top}px;
            position: absolute;
            user-select: none;
            pointer-events: none;
        `;
    this.element.setAttribute("style", style);
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    this.updateElementStyle();
  }
}

export default PieChart;
