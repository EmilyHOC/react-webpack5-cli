import {
  CanvasOption,
  FabricCanvas,
  FabricImage,
  FabricObject,
  FabricObjectOption,
  FabricObjects,
  GridOption,
  GuidelineOption,
  InteractionMode,
  WorkareaOption,
} from "../utils";
import {
  DrawingHandler,
  EventHandler,
  ChartHandler,
  ElementHandler,
  TransactionHandler,
  ShortCutHandler,
} from ".";
import React from "react";
import * as fabric from "fabric";
import { defaults } from "@/canvas/constants";
import CanvasObject from "@/canvas/CanvasObject";
import warning from "antd/es/_util/warning";
import InteractionHandler from "@/canvas/handlers/InteractionHandler";
import AlignmentHandler from "@/canvas/handlers/AlignmentHandler";
import { nanoid } from "nanoid";
export interface HandlerCallback {
  /**
   * 当 Canvas 中已添加对象时，调用函数
   *
   */
  onAdd?: (object: FabricObject) => void;
  /**
   * 返回 contextmenu 元素
   *
   */
  onContext?: (
    el: HTMLDivElement,
    e: React.MouseEvent,
    target?: FabricObject,
  ) => Promise<any> | any;
  /**
   * 返回工具提示元素
   *
   */
  onTooltip?: (el: HTMLDivElement, target?: FabricObject) => Promise<any> | any;
  /**
   * 缩放时，调用函数
   */
  onZoom?: (zoomRatio: number) => void;
  /**
   * 单击对象时，调用函数
   *
   */
  onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
  /**
   * 双击对象时，调用函数
   *
   */
  onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;
  /**
   * 修改对象时，调用函数
   */
  onModified?: (target: FabricObject) => void;
  /**
   * 当 select object 时，调用函数
   *
   */
  onSelect?: (target: FabricObject) => void;
  /**
   *当 Canvas 中的对象已被删除时，调用函数
   *
   */
  onRemove?: (target: FabricObject) => void;
  /**
   * 当交互模式已更改时，调用函数
   *
   */
  onInteraction?: (interactionMode: InteractionMode) => void;
  /**
   * 加载 canvas 后
   *
   */
  onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;
}

export interface HandlerOption {
  /**
   * 画布 ID
   * @type {string}
   */
  id?: string;
  /**
   * Canvas 对象
   * @type {FabricCanvas}
   */
  canvas?: FabricCanvas;
  /**
   * Canvas 父元素
   * @type {HTMLDivElement}
   */
  container?: HTMLDivElement;
  /**
   * 画布可编辑
   * @type {boolean}
   */
  editable?: boolean;
  /**
   * Canvas 交互模式
   * @type {InteractionMode}
   */
  interactionMode?: InteractionMode;
  /**
   * 保留对象的属性
   * @type {string[]}
   */
  propertiesToInclude?: string[];
  /**
   * 最小缩放比
   * @type {number}
   */
  minZoom?: number;
  /**
   * 最大缩放比
   * @type {number}
   */
  maxZoom?: number;
  /**
   * 缩放比例步骤
   * @type {number}
   */
  zoomStep?: number;
  /**
   * Workarea 选项
   * @type {WorkareaOption}
   */
  workareaOption?: WorkareaOption;
  /**
   * Canvas 选项
   * @type {CanvasOption}
   */
  canvasOption?: CanvasOption;
  /**
   * 网格选项
   * @type {GridOption}
   */
  gridOption?: GridOption;
  /**
   * Fabric Object 的默认选项
   * @type {FabricObjectOption}
   */
  objectOption?: FabricObjectOption;
  /**
   * 参考线选项
   * @type {GuidelineOption}
   */
  guidelineOption?: GuidelineOption;
  /**
   * 是否使用 zoom
   * @type {boolean}
   */
  zoomEnabled?: boolean;
  /**
   * ActiveSelection 选项
   * @type {Partial<FabricObjectOption<fabric.ActiveSelection>>}
   */
  activeSelectionOption?: Partial<FabricObjectOption<fabric.ActiveSelection>>;
  /**
   * 画布宽度
   * @type {number}
   */
  width?: number;
  /**
   * 画布高度
   * @type {number}
   */
  height?: number;
  /**
   * Canvas 中的 Keyboard 事件
   * @type {KeyEvent}
   */
  keyEvent?: KeyEvent;
  /**
   * 追加自定义对象
   * @type {{ [key: string]: any }}
   */
  fabricObjects?: FabricObjects;
  // handlers?: { [key: string]: CustomHandler };
  [key: string]: any;
}
export interface KeyEvent {
  /**
   * 箭头键
   * @type {boolean}
   */
  move?: boolean;
  /**
   * Ctrl + A
   * @type {boolean}
   */
  all?: boolean;
  /**
   * Ctrl + C
   * @type {boolean}
   */
  copy?: boolean;
  /**
   * Ctrl + P
   * @type {boolean}
   */
  paste?: boolean;
  /**
   * Escape
   * @type {boolean}
   */
  esc?: boolean;
  /**
   * Delete 或 Backspace
   * @type {boolean}
   */
  del?: boolean;
  /**
   * 当已复制对象时，是否应在剪贴板上选择复制对象
   * @type {boolean}
   */
  clipboard?: boolean;
  /**
   * Ctrl + Z, Ctrl + Y
   * @type {boolean}
   */
  transaction?: boolean;
  /**
   * Plus, Minus
   *
   * @type {boolean}
   */
  zoom?: boolean;
  /**
   * Ctrl + X
   *
   * @type {boolean}
   */
  cut?: boolean;
  grab?: boolean;
}

export type HandlerOptions = HandlerOption & HandlerCallback;

class Handler implements HandlerOptions {
  public id: string;
  public canvas: FabricCanvas;
  // public workarea: WorkareaObject;
  public container: HTMLDivElement;
  public editable: boolean;
  public interactionMode: InteractionMode;
  public interactionHandler: InteractionHandler;
  public minZoom: number;
  public maxZoom: number;
  public zoomStep: number = 0.05;
  public propertiesToInclude?: string[] = defaults.propertiesToInclude;
  public workareaOption?: WorkareaOption = defaults.workareaOption;
  public canvasOption?: CanvasOption = defaults.canvasOption;
  public gridOption?: GridOption = defaults.gridOption;
  public objectOption?: FabricObjectOption = defaults.objectOption;
  public guidelineOption?: GuidelineOption = defaults.guidelineOption;
  public keyEvent?: KeyEvent = defaults.keyEvent;
  public activeSelectionOption?: Partial<
    FabricObjectOption<fabric.ActiveSelection>
  > = defaults.activeSelectionOption;
  public fabricObjects?: FabricObjects = CanvasObject;
  public zoomEnabled?: boolean;
  public width?: number;
  public height?: number;
  public objects: FabricObject[];
  public objectMap: Record<string, FabricObject> = {};
  public drawingHandler: DrawingHandler;
  public elementHandler: ElementHandler;
  public transactionHandler: TransactionHandler;
  public shortcutHandler: ShortCutHandler;
  public activeShape?: any;
  public activeLine?: any;
  public lineArray?: any[];
  public pointArray?: any[];
  public handlers: { [key: string]: any } = {};

  public eventHandler: EventHandler;

  public chartHandler: ChartHandler;
  public onInteraction?: (interactionMode: InteractionMode) => void;

  public onAdd?: (object: FabricObject) => void;
  public handler: any;
  public alignmentHandler: AlignmentHandler;
  constructor(options: HandlerOptions) {
    this.initialize(options);
  }
  public initialize(options: HandlerOptions) {
    this.initOption(options);
    this.initHandler(options);
    this.initCallback(options);
  }
  public initCallback = (options: HandlerOptions) => {
    this.onAdd = options.onAdd;
    this.onInteraction = options.onInteraction;
  };
  public initHandler(options: HandlerOptions) {
    this.drawingHandler = new DrawingHandler(this);
    this.eventHandler = new EventHandler(this);
    this.chartHandler = new ChartHandler(this);
    this.elementHandler = new ElementHandler(this);
    this.alignmentHandler = new AlignmentHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.transactionHandler = new TransactionHandler(this);
    this.shortcutHandler = new ShortCutHandler(this);
  }
  public initOption = (options: HandlerOptions) => {
    this.id = options.id;
    this.canvas = options.canvas;
    this.container = options.container;
    this.editable = options.editable;
    this.interactionMode = options.interactionMode;
    this.minZoom = options.minZoom;
    this.maxZoom = options.maxZoom;
    this.zoomStep = options.zoomStep || 0.05;
    this.zoomEnabled = options.zoomEnabled;
    this.width = options.width;
    this.height = options.height;
    this.setCanvasOption(options.canvasOption);
  };

  /**
   * 添加对象
   * @param obj
   * @param centered 是否在画布中心
   * @param loaded
   * @param group
   */
  public add = (
    obj: FabricObjectOption,
    centered = true,
    loaded = false,
    group = false,
  ) => {
    const { editable, onAdd, objectOption } = this;
    const option: any = {
      hasControls: editable,
      hasBorders: editable,
      selectable: editable,
      lockMovementX: !editable,
      lockMovementY: !editable,
      hoverCursor: !editable ? "pointer" : "move",
    };
    if (obj.eleType === "i-text") {
      option.editable = false;
    } else {
      option.editable = editable;
    }
    const newOption = Object.assign(
      {},
      objectOption,
      obj,
      {
        container: this.container.id,
        editable,
      },
      option,
    );
    let createdObj;
    if (obj.eleType === "image") {
      createdObj = this.addImage(newOption);
    } else if (obj.eleType === "group") {
      //   createdObj = this.addGroup(newOption);
    } else {
      console.log(obj);
      console.log(newOption, this.fabricObjects[obj.eleType]);
      createdObj = this.fabricObjects[obj.eleType].create(newOption);
    }
    if (group) {
      return createdObj;
    }
    if (!editable && !(obj.superType === "element")) {
      createdObj.on("mousedown", this.eventHandler.object.mousedown);
    }

    //往FabricCanvas对象添加组织好的数据
    this.canvas.add(createdObj);
    //把所有画布对象放到数组里面
    this.objects = this.getObjects();

    if (
      obj.superType !== "drawing" &&
      obj.superType !== "link" &&
      editable &&
      !loaded
    ) {
      this.centerObject(createdObj, centered);
    }
    this.centerObject(createdObj, centered);

    if (!this.transactionHandler.active && !loaded) {
      this.transactionHandler.save("add");
    }
    //触发Canvas.tsx画布中的回调函数
    if (onAdd && editable && !loaded) {
      onAdd(createdObj);
    }
    return createdObj;
  };

  /**
   * 编组
   * @param target
   */
  public toGroup = (target?: FabricObject) => {
    const activeObject =
      target || (this.canvas.getActiveObject() as fabric.ActiveSelection);
    if (!activeObject) {
      return null;
    }
    if (activeObject.type !== "activeselection") {
      return null;
    }
    const objectsToGroup = this.canvas
      .getObjects()
      .filter((obj) => obj.selectable);

    // 移除原始对象从画布上
    this.canvas.remove(...objectsToGroup);

    // 创建 Group
    const group = new fabric.Group(objectsToGroup, {
      // 可以在这里添加更多配置选项
      left: this.canvas.getWidth() / 2,
      top: this.canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
    });

    // 将新创建的 Group 添加到 canvas 上
    this.canvas.add(group);
    // 如果需要设置这个 Group 为当前活动对象
    this.canvas.setActiveObject(group);
    this.canvas.requestRenderAll();
    return group;
  };

  /**
   * 取消编组 到activeSelection
   * @returns
   */
  public toActiveSelection = (target?: FabricObject) => {
    const activeObject =
      target || (this.canvas.getActiveObject() as fabric.Group);
    if (!activeObject) {
      return;
    }
    if (activeObject.type !== "group") {
      return;
    }
    if (activeObject && activeObject.type == "group") {
      // 获取 ActiveSelection 中的所有对象
      const objects = activeObject.getObjects();

      // 将 ActiveSelection 从画布中移除
      this.canvas.remove(activeObject);

      // 将每个对象重新添加到画布中
      objects.forEach((obj: any) => {
        this.canvas.add(obj);
      });

      // 重新渲染画布
      this.canvas.requestRenderAll();
      return objects;
    }
  };
  /**
   * 上一层
   */

  public bringForward = () => {
    console.log("bringForward");
    const activeObject = this.canvas.getActiveObject() as FabricObject;
    if (activeObject) {
      console.log(this.canvas, "canvas", activeObject);
      this.canvas.bringObjectForward(activeObject);
      if (!this.transactionHandler.active) {
        this.transactionHandler.save("bringForward");
      }
      // const { onModified } = this;
      // if (onModified) {
      //   onModified(activeObject);
      // }
    }
  };
  /**
   * 置于最上层
   */
  public bringToFront = () => {
    console.log("bringToFront");
    const activeObject = this.canvas.getActiveObject() as FabricObject;
    if (activeObject) {
      this.canvas.bringObjectToFront(activeObject);
      if (!this.transactionHandler.active) {
        this.transactionHandler.save("bringToFront");
      }
      // const { onModified } = this;
      // if (onModified) {
      //   onModified(activeObject);
      // }
    }
  };
  public sendBackwards = () => {
    console.log("sendBackwards");
    const activeObject = this.canvas.getActiveObject() as FabricObject;
    if (activeObject) {
      const firstObject = this.canvas.getObjects()[1] as FabricObject;
      if (firstObject.id === activeObject.id) {
        return;
      }
      if (!this.transactionHandler.active) {
        this.transactionHandler.save("sendBackwards");
      }
      this.canvas.sendObjectBackwards(activeObject);
      // const { onModified } = this;
      // if (onModified) {
      //   onModified(activeObject);
      // }
    }
  };

  /**
   * Send to back
   */
  public sendToBack = () => {
    console.log("sendToBack");
    const activeObject = this.canvas.getActiveObject() as FabricObject;
    if (activeObject) {
      this.canvas.sendObjectToBack(activeObject);
      this.canvas.sendObjectToBack(this.canvas.getObjects()[1]);
      if (!this.transactionHandler.active) {
        this.transactionHandler.save("sendToBack");
      }
      // const { onModified } = this;
      // if (onModified) {
      //   onModified(activeObject);
      // }
    }
  };

  /**
   * duplicate复制对象
   */
  public duplicate = async () => {
    const {
      onAdd,
      gridOption: { grid = 10 },
    } = this;
    const activeObject = this.canvas.getActiveObject() as FabricObject;
    if (!activeObject) {
      return;
    }
    if (
      typeof activeObject.cloneable !== "undefined" &&
      !activeObject.cloneable
    ) {
      return;
    }
    let clonedObj = await activeObject.clone();

    this.canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + grid,
      top: clonedObj.top + grid,
      evented: true,
    });

    if (activeObject.id === clonedObj.id) {
      clonedObj.set("id", nanoid());
    }
    if (clonedObj.superType === "node") {
      clonedObj.set("shadow", {
        color: clonedObj.stroke,
      } as fabric.Shadow);
    }
    this.canvas.add(clonedObj);
    this.objects = this.getObjects();
    if (clonedObj.dblclick) {
      // clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
    }
    if (onAdd) {
      onAdd(clonedObj);
    }

    this.canvas.setActiveObject(clonedObj);
    // this.portHandler.create(clonedObj as NodeObject);
    this.canvas.requestRenderAll();
  };

  /**
   * 在对象上设置位置
   *
   * @param {FabricObject} obj
   * @param {boolean} [centered]
   */

  public centerObject = (obj: FabricObject, centered?: boolean) => {
    if (centered) {
      //canvas画布上直接居中元素
      this.canvas.centerObject(obj);
      obj.setCoords();
    } else {
    }
  };

  public addImage = (obj: FabricImage) => {
    const { objectOption } = this;
    const { filters = [], src, file, ...otherOption } = obj;
    const image = new Image();

    const createdObj = new fabric.FabricImage(image, {
      ...objectOption,
      ...otherOption,
    }) as FabricImage;
    // createdObj.set({
    //   filters: this.imageHandler.createFilters(filters),
    // });
    this.setImage(createdObj, src || file);
    return createdObj;
  };
  public setImage = (
    obj: FabricImage,
    source?: File | string,
    keepSize?: boolean,
    options?: fabric.ImageProps,
  ) => {
    obj
      .setSrc("http://fabricjs.com/assets/honey_im_subtle.png", () => {
        this.canvas.add(obj);
        this.canvas.setActiveObject(obj);
      })
      .then(() => {
        this.canvas.requestRenderAll();
      });
  };
  public find = (obj: FabricObject) => this.findById(obj.id);
  public findById = (id: string): FabricObject | null => {
    let findObject;
    const exist = this.objects.some((obj) => {
      if (obj.id === id) {
        findObject = obj;
        return true;
      }
      return false;
    });
    if (!exist) {
      warning(true, "Not found object by id.");
      return null;
    }
    return findObject;
  };

  /**
   * 选中元素
   * @param {FabricObject} obj
   * @param {boolean} [find]
   */
  public select = (obj: FabricObject, find?: boolean) => {
    console.log(obj, "select==object", this.objects);
    let findObject = obj;
    if (find) {
      findObject = this.find(obj);
    }
    if (findObject) {
      console.log(findObject, "find");
      this.canvas.discardActiveObject();
      this.canvas.setActiveObject(findObject);
      this.canvas.requestRenderAll();
    }
  };

  public getObjects = (): FabricObject[] => {
    const objects = this.canvas.getObjects().filter((obj: FabricObject) => {
      if (obj.id === "workarea") {
        return false;
      } else if (obj.id === "grid") {
        return false;
      } else if (obj.superType === "port") {
        return false;
      } else if (!obj.id) {
        return false;
      }
      return true;
    }) as FabricObject[];
    if (objects.length) {
      objects.forEach((obj) => (this.objectMap[obj.id] = obj));
    } else {
      this.objectMap = {};
    }
    return objects;
  };
  public setCanvasOption = (canvasOption: CanvasOption) => {
    this.canvasOption = Object.assign({}, this.canvasOption, canvasOption);
    if (
      typeof canvasOption.width !== "undefined" &&
      typeof canvasOption.height !== "undefined"
    ) {
      if (this.eventHandler) {
        this.eventHandler.resize(canvasOption.width, canvasOption.height);
      } else {
        // this.canvas.setWidth(canvasOption.width, {});
        // this.canvas.setHeight(canvasOption.height, {});
      }
    }
    if (typeof canvasOption.selection !== "undefined") {
      this.canvas.selection = canvasOption.selection;
    }
    if (typeof canvasOption.hoverCursor !== "undefined") {
      this.canvas.hoverCursor = canvasOption.hoverCursor;
    }
    if (typeof canvasOption.defaultCursor !== "undefined") {
      this.canvas.defaultCursor = canvasOption.defaultCursor;
    }
    if (typeof canvasOption.preserveObjectStacking !== "undefined") {
      this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
    }
  };
  /**
   * 销毁画布
   *
   */
  public destroy = () => {};

  public clear = (includeWorkarea = false) => {
    const ids = this.canvas.getObjects().reduce((prev, curr: any) => {
      if (curr.superType === "element") {
        console.log(curr, "curr");
        this.elementHandler.removeById(curr.id, curr.eleType);
        prev.push(curr.id);
        return prev;
      }
      return prev;
    }, []);

    if (includeWorkarea) {
      // this.canvas.clear();
      // this.workarea = null;
    } else {
      this.canvas.discardActiveObject();
      this.canvas.getObjects().forEach((obj: any) => {
        if (obj.id === "grid" || obj.id === "workarea") {
          return;
        }
        this.canvas.remove(obj);
      });
    }
    this.objects = this.getObjects();
    this.canvas.requestRenderAll();
  };
}
export default Handler;
