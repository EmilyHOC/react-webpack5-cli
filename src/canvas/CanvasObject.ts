import * as fabric from "fabric";

import { LineChart, PieChart } from "./objects";
import { FabricObject } from "./utils";
import Arrow from "@/canvas/objects/Arrow";

export interface ObjectSchema {
  create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
  [key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) =>
  objectSchema;

const CanvasObject: CanvasObjectSchema = {
  group: {
    create: ({ objects, ...option }: { objects: FabricObject[] }) =>
      new fabric.Group(objects, option),
  },
  "i-text": {
    create: ({ text, ...option }: { text: string }) =>
      new fabric.IText(text, option),
  },
  textbox: {
    create: ({ text, ...option }: { text: string }) =>
      new fabric.Textbox(text ? text : "文本", option),
  },
  triangle: {
    create: (option: any) => new fabric.Triangle(option),
  },
  circle: {
    create: (option: any) => new fabric.Circle(option),
  },
  rect: {
    create: (option: any) => new fabric.Rect(option),
  },
  cube: {
    // create: (option: any) => new Cube(option),
  },
  image: {
    create: ({ element = new Image(), ...option }) =>
      new fabric.FabricImage(element, {
        ...option,
        crossOrigin: "anonymous",
      }),
  },
  polygon: {
    create: ({ points, ...option }: { points: any }) => {
      console.log(points, option);
      return new fabric.Polygon(points, {
        ...option,
        perPixelTargetFind: true,
      });
    },
  },
  polyline: {
    create: ({ points, ...option }: { points: any }) =>
      new fabric.Polyline(points, {
        ...option,
        perPixelTargetFind: true,
      }),
  },
  line: {
    create: ({ points, ...option }: { points: any }) =>
      new fabric.Line(points, option),
  },
  arrow: {
    create: ({ points, ...option }: { points: any }) =>
      new Arrow(points, option),
  },
  chart: {
    create: (option: any) =>
      new LineChart(
        {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: "line",
            },
          ],
        },
        option,
      ),
  },
  pieChart: {
    create: (option: any) => {
      return new PieChart(
        {
          title: {
            text: "饼图",
            subtext: "Fake Data",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "0",
            textStyle: {
              fontSize: 8,
            },
            itemGap: 1,
          },

          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "50%",
              data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
        option,
      );
    },
  },
  element: {
    create: ({ code, ...option }: { code: Code }) => new Element(code, option),
  },
  iframe: {
    // create: ({ src, ...option }: { src: string }) => new Iframe(src, option),
  },
  video: {
    // create: ({ src, file, ...option }: { src: string; file: File }) =>
    //   new Video(src || file, option),
  },
  gif: {
    // create: (option: any) => new Gif(option),
  },
  node: {
    // create: (option: any) => new Node(option),
  },
  link: {
    // create: (fromNode, fromPort, toNode, toPort, option) =>
    //   new Link(fromNode, fromPort, toNode, toPort, option),
  },
  curvedLink: {
    // create: (fromNode, fromPort, toNode, toPort, option) =>
    //   new CurvedLink(fromNode, fromPort, toNode, toPort, option),
  },
  orthogonalLink: {
    // create: (fromNode, fromPort, toNode, toPort, option) =>
    //   new OrthogonalLink(fromNode, fromPort, toNode, toPort, option),
  },
  svg: {
    // create: (option: SvgOption) => new Svg(option),
  },
};

export default CanvasObject;
