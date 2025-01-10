import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  Component,
} from "react";
import { nanoid } from "nanoid";
import * as fabric from "fabric";
import { defaults } from "./constants";

import Handler, { HandlerOptions } from "@/canvas/handlers/Handler";
import { FabricCanvas } from "@/canvas/utils";
// 定义 CanvasInstance 接口，定义你想暴露的方法或属性
// interface CanvasInstance {
//   canvas: fabric.Canvas | null;
//   container: HTMLDivElement;
//   handler: Handler;
// }
//
// // 定义 CanvasProps 类型
// export type CanvasProps = {
//   responsive?: boolean;
//   style?: React.CSSProperties;
//   canvasOption?: fabric.CanvasOptions | null;
//   width?: number;
//   height?: number;
//   editable?: boolean;
//   objectOption?: object | null;
// };
//
// // 创建带有 forwardRef 的 Canvas 组件
// const FabricCanvasComponent = forwardRef<CanvasInstance, CanvasProps>(
//   (props, ref) => {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const { canvasOption, objectOption, width, height, editable } = props;
//     let [handler, setHandler] = useState({});
//     let [prevCanvasOptions, setPrevCanvasOptions] = useState({});
//     const onlyNo = nanoid();
//     // 初始化 Fabric.js Canvas 实例
//     useEffect(() => {
//       // const onlyNo = nanoid();
//       const mergedCanvasOption = Object.assign(
//         {},
//         defaults.canvasOption,
//         canvasOption,
//         {
//           width,
//           height,
//           selection: true,
//           editable,
//         },
//       );
//
//       fabricCanvasRef.current = new fabric.Canvas(`canvas_${onlyNo}`);
//       console.log(fabricCanvasRef.current, " fabricCanvasRef.current");
//       //  setPrevCanvasOptions(canvasOption);
//
//       // const rect = new fabric.Rect({
//       //   width: 50,
//       //   height: 50,
//       //   left: 100,
//       //   top: 100,
//       //   stroke: "#aaf",
//       //   strokeWidth: 5,
//       //   fill: "#faa",
//       //   selectable: false,
//       // });
//       // fabricCanvasRef.current.add(rect);
//
//       handler = new Handler({
//         id: onlyNo ? onlyNo : nanoid(),
//         width,
//         height,
//         editable,
//         canvas: fabricCanvasRef.current,
//         container: containerRef.current,
//         canvasOption: mergedCanvasOption,
//       });
//
//       if (JSON.stringify(canvasOption) !== JSON.stringify(prevCanvasOptions)) {
//         handler.setCanvasOption(canvasOption);
//       }
//       setHandler(handler);
//       // 更新 ref 中存储的值以反映最新的 props
//       prevCanvasOptions = canvasOption;
//       //原来是renderAll
//       // fabricCanvasRef.current.requestRenderAll();
//       return () => {};
//     }, [canvasOption]);
//
//     // 使用 useImperativeHandle 自定义暴露给父组件的内容
//     useImperativeHandle(ref, () => ({
//       canvas: fabricCanvasRef.current,
//       container: containerRef.current,
//       handler: handler,
//     }));
//
//     return (
//       <div
//         className="rde-canvas"
//         style={{ width: "100%", height: "100%" }}
//         ref={containerRef}
//         id={`${onlyNo}`}
//       >
//         <canvas ref={canvasRef} id={`canvas_${onlyNo}`}></canvas>
//       </div>
//     );
//   },
// );
//
// // 类型断言，确保类型安全
// const ForwardedFabricCanvasComponent =
//   FabricCanvasComponent as React.ForwardRefExoticComponent<
//     React.PropsWithoutRef<CanvasProps> & React.RefAttributes<CanvasInstance>
//   >;
//
// export default ForwardedFabricCanvasComponent;

export interface CanvasInstance {
  handler: Handler;
  canvas: FabricCanvas;
  container: HTMLDivElement;
}

export type CanvasProps = HandlerOptions & {
  responsive?: boolean;
  style?: React.CSSProperties;
};

interface IState {
  id: string;
  loaded: boolean;
}

class InternalCanvas
  extends Component<CanvasProps, IState>
  implements CanvasInstance
{
  public handler: Handler;
  public canvas: FabricCanvas;
  public container: HTMLDivElement;
  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: ResizeObserver;

  static defaultProps: CanvasProps = {
    id: nanoid(),
    editable: true,
    zoomEnabled: true,
    minZoom: 30,
    maxZoom: 300,
    responsive: true,
    width: 0,
    height: 0,
  };

  state: IState = {
    id: nanoid(),
    loaded: false,
  };

  componentDidMount() {
    const { editable, canvasOption, width, height, responsive, ...other } =
      this.props;
    const { id } = this.state;
    const mergedCanvasOption = Object.assign(
      {},
      defaults.canvasOption,
      canvasOption,
      {
        width,
        height,
        selection:
          (typeof canvasOption?.selection !== "undefined" &&
            canvasOption?.selection) ||
          editable,
      },
    );
    this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
    fabric.InteractiveFabricObject.ownDefaults = {
      ...fabric.InteractiveFabricObject.ownDefaults,
      /**
       * 对象控制点的大小 (单位：像素)
       * @type Number
       * @default 13
       */
      cornerSize: 6,
      /**
       * 当触摸时对象控制点的大小
       * @type Number
       * @default 24
       */
      touchCornerSize: 6,
      cornerStyle: "round",
      cornerStrokeColor: "blue",
      cornerColor: "lightblue",
      cornerStyle: "rect",
      padding: 5,
      transparentCorners: false,
      cornerDashArray: [1, 1],
      borderColor: "blue",
      borderDashArray: [3, 1, 3],
      borderScaleFactor: 1,
    };

    this.canvas.renderAll();
    this.container = this.containerRef.current;
    this.handler = new Handler({
      id: id ? id : nanoid(),
      width,
      height,
      editable,
      canvas: this.canvas,
      container: this.containerRef.current,
      canvasOption: mergedCanvasOption,
      ...other,
    });
    if (this.props.responsive) {
      this.createObserver();
    } else {
      this.handleLoad();
    }
  }

  componentDidUpdate(prevProps: CanvasProps) {
    // if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
    //     this.handler.eventHandler.resize(this.props.width, this.props.height);
    // }
    // if (this.props.editable !== prevProps.editable) {
    //     this.handler.editable = this.props.editable;
    // }
    // if (this.props.responsive !== prevProps.responsive) {
    //     if (!this.props.responsive) {
    //         this.destroyObserver();
    //     } else {
    //         this.destroyObserver();
    //         this.createObserver();
    //     }
    // }
    // if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
    //     this.handler.setCanvasOption(this.props.canvasOption);
    // }
    // if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
    //     this.handler.setKeyEvent(this.props.keyEvent);
    // }
    // if (JSON.stringify(this.props.fabricObjects) !== JSON.stringify(prevProps.fabricObjects)) {
    //     this.handler.setFabricObjects(this.props.fabricObjects);
    // }
    // if (JSON.stringify(this.props.workareaOption) !== JSON.stringify(prevProps.workareaOption)) {
    //     this.handler.setWorkareaOption(this.props.workareaOption);
    // }
    // if (JSON.stringify(this.props.guidelineOption) !== JSON.stringify(prevProps.guidelineOption)) {
    //     this.handler.setGuidelineOption(this.props.guidelineOption);
    // }
    // if (JSON.stringify(this.props.objectOption) !== JSON.stringify(prevProps.objectOption)) {
    //     this.handler.setObjectOption(this.props.objectOption);
    // }
    // if (JSON.stringify(this.props.gridOption) !== JSON.stringify(prevProps.gridOption)) {
    //     this.handler.setGridOption(this.props.gridOption);
    // }
    // if (JSON.stringify(this.props.propertiesToInclude) !== JSON.stringify(prevProps.propertiesToInclude)) {
    //     this.handler.setPropertiesToInclude(this.props.propertiesToInclude);
    // }
    // if (JSON.stringify(this.props.activeSelectionOption) !== JSON.stringify(prevProps.activeSelectionOption)) {
    //     this.handler.setActiveSelectionOption(this.props.activeSelectionOption);
    // }
  }

  componentWillUnmount() {
    this.destroyObserver();
    this.handler.destroy();
  }

  createObserver = () => {
    this.resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        const { width = 0, height = 0 } =
          (entries[0] && entries[0].contentRect) || {};
        console.log(entries, "entries");
        //这里控制画布大小
        this.handler.eventHandler.resize(width, height);
        if (!this.state.loaded) {
          this.handleLoad();
        }
      },
    );
    this.resizeObserver.observe(this.containerRef.current);
  };

  destroyObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  handleLoad = () => {
    this.setState(
      {
        loaded: true,
      },
      () => {
        if (this.props.onLoad) {
          this.props.onLoad(this.handler, this.canvas);
        }
      },
    );
  };

  render() {
    const { style } = this.props;
    const { id } = this.state;
    return (
      <div
        ref={this.containerRef}
        id={id}
        className="rde-canvas"
        style={{ width: "100%", height: "100%", ...style }}
      >
        <canvas id={`canvas_${id}`} />
      </div>
    );
  }
}

const Canvas: React.FC<CanvasProps> = React.forwardRef<
  CanvasInstance,
  CanvasProps
>((props, ref) => {
  const canvasRef = useRef<InternalCanvas>();
  React.useImperativeHandle(ref, () => ({
    handler: canvasRef.current.handler,
    canvas: canvasRef.current.canvas,
    container: canvasRef.current.container,
  }));
  return <InternalCanvas ref={canvasRef} {...props} />;
});

export default Canvas;
