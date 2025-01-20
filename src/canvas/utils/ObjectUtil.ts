import fabric from "fabric";

//定义了可选的wrapperEL属性，用于指定Fabric.js Canvas应该挂在在哪个元素上面
export interface FabricCanvasOption {
  wrapperEL?: HTMLElement;
}

/**
 FabricCanvas 类型别名： 拓展了fabric.Canvas类，并添加了wrapperEL属性，
 这样可以通过此类型访问到Fabric的所有方法和属性，同时也可以访问wrapperEL
 *
 */
export type FabricCanvas<T extends any = fabric.Canvas> = T &
  FabricCanvasOption;

export type FabricObjectOption<T extends any = fabric.InteractiveFabricObject> =
  T & {
    /**
     * Object id
     * @type {string}
     */
    id?: string;
    /**
     * 父对象 ID
     * @type {string}
     */
    parentId?: string;
    /**
     * 原始不透明度
     * @type {number}
     */
    originOpacity?: number;
    /**
     * 原始顶部位置
     * @type {number}
     */
    originTop?: number;
    /**
     * Original left position
     * @type {number}
     */
    originLeft?: number;
    /**
     * Original scale X
     * @type {number}
     */
    originScaleX?: number;
    /**
     * Original scale Y
     * @type {number}
     */
    originScaleY?: number;
    /**
     * Original angle
     * @type {number}
     */
    originAngle?: number;
    /**
     * Original fill color
     *
     * @type {(string | fabric.Pattern | fabric.Gradient)}
     */
    originFill?: string | fabric.Pattern | fabric.Gradient<any>;
    /**
     * Original stroke color
     * @type {string}
     */
    originStroke?: string;
    /**
     * Original rotation
     *
     * @type {number}
     */
    originRotation?: number;
    /**
     * Object editable
     * @type {boolean}
     */
    editable?: boolean;
    /**
     * Object Super type
     * @type {string}
     */
    superType?: string;
    /**
     * @description
     * @type {string}
     */
    description?: string;
    /**
     * Animation property
     * @type {AnimationProperty}
     */
    // animation?: AnimationProperty;
    /**
     * Anime instance
     * @type {anime.AnimeInstance}
     */
    //  anime?: anime.AnimeInstance;
    /**
     * Tooltip property
     * @type {TooltipProperty}
     */
    //  tooltip?: TooltipProperty;
    /**
     * Link property
     * @type {LinkProperty}
     */
    //   link?: LinkProperty;
    /**
     * Is running animation
     * @type {boolean}
     */
    animating?: boolean;
    /**
     * Object class
     * @type {string}
     */
    class?: string;
    /**
     * Is possible delete
     * @type {boolean}
     */
    deletable?: boolean;
    /**
     * Is enable double click
     * @type {boolean}
     */
    dblclick?: boolean;
    /**
     * Is possible clone
     * @type {boolean}
     */
    cloneable?: boolean;
    /**
     * Is locked object
     * @type {boolean}
     */
    locked?: boolean;
    /**
     * This property replaces "angle"
     *
     * @type {number}
     */
    rotation?: number;
    /**
     * Whether it can be clicked
     *
     * @type {boolean}
     */
    clickable?: boolean;
    [key: string]: any;
    eleType?: string;
  };

export type FabricObject<T extends any = fabric.Object> = T &
  FabricObjectOption;
export interface GuidelineOption {
  /**
   * When have moved object, whether should show guideline
   * @type {boolean}
   */
  enabled?: boolean;
}

export type FabricObjects = {
  [key: string]: {
    create: (...args: any) => FabricObject;
  };
};

export interface CanvasOption extends fabric.CanvasOptions {
  /**
   * Unique id of Canvas
   * @type {string}
   */
  id?: string;
}
export interface GridOption {
  /**
   * Whether should be enabled
   * @type {boolean}
   */
  enabled?: boolean;
  /**
   * Grid interval
   * @type {number}
   */
  grid?: number;
  /**
   * When had moved object, whether should adjust position on grid interval
   * @type {boolean}
   */
  snapToGrid?: boolean;
  /**
   * Grid line color
   *
   * @type {string}
   */
  lineColor?: string;
  /**
   * Grid border color
   *
   * @type {string}
   */
  borderColor?: string;
}

export type InteractionMode =
  | "selection"
  | "grab"
  | "polygon"
  | "line"
  | "arrow"
  | "link"
  | "crop"
  | "polyline";
export interface WorkareaOption {
  /**
   * Image URL
   * @type {string}
   */
  src?: string;
  /**
   * Image File or Blbo
   * @type {File}
   */
  file?: File;
  /**
   * Workarea Width
   * @type {number}
   */
  width?: number;
  /**
   * Workarea Height
   * @type {number}
   */
  height?: number;
  /**
   * Workarea Background Color
   * @type {string}
   */
  backgroundColor?: string;
  /**
   * Workarea Layout Type
   * @type {WorkareaLayout}
   */
  layout?: WorkareaLayout;
}
export type WorkareaLayout = "fixed" | "responsive" | "fullscreen";
export interface FabricEvent<T extends any = Event>
  extends Omit<fabric.ObjectEvents, "e"> {
  e: T;
  target?: FabricObject;
  subTargets?: FabricObject[];
  button?: number;
  isClick?: boolean;
  pointer?: fabric.Point;
  absolutePointer?: fabric.Point;
  transform?: {
    corner: string;
    original: FabricObject;
    originX: string;
    originY: string;
    width: number;
  };
}
export type FabricImage = FabricObject &
  fabric.Image & {
    /**
     * Image URL
     * @type {string}
     */
    src?: string;
    /**
     * Image File or Blob
     * @type {File}
     */
    file?: File;
    /**
     * Image Filter
     * @type {IFilter[]}
     */
    filters?: any;
    _element?: any;
  };

export interface FabricElement extends FabricObject<fabric.Rect> {
  /**
   * 包装元素
   * @type {HTMLDivElement}
   */
  container: HTMLDivElement;
  /**
   * 目标元素
   * @type {HTMLDivElement}
   */
  element: HTMLDivElement;
  /**
   * 元素对象的源
   */
  setSource: (source: any) => void;
}

/**
 * toObject util
 * @param {*} obj
 * @param {string[]} propertiesToInclude
 * @param {{ [key: string]: any }} [properties]
 */
export const toObject = (
  obj: fabric.Object,
  propertiesToInclude: string[],
  properties?: any,
): any => {
  // 调用父类的 toObject 方法获取基本属性
  // const baseObj = obj.super("toObject");

  // 将 propertiesToInclude 中的属性添加到结果对象中
  const extendedProperties = propertiesToInclude.reduce(
    (prev, property) => ({
      ...prev,
      [property]: obj.get(property),
    }),
    {},
  );
  // 合并传入的 properties（如果有）
  const finalProperties = properties ? { ...properties } : {};

  // 合并所有对象，返回最终的结果
  return {
    // ...baseObj,
    ...extendedProperties,
    ...finalProperties,
  };
};
