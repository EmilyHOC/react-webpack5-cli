import React, { useEffect, useRef, useState } from "react";
import { Content } from "@/components/layout";
import title from "../../components/layout/Title";
import i18n from "i18next";
import ImageMapTitle from "./ImageMapTitle";
import "../../styles/index.less";
import "@/libs/fontawesome-5.2.0/css/all.css";
import ImageMapItems from "./ImageMapItems";
import { Button, Tooltip } from "antd";
import i18next from "i18next";
import { QuestionOutlined } from "@ant-design/icons";
import ImageMapHeaderToolbar from "@/editors/imagemap/ImageMapHeaderToolbar";

import Canvas from "@/canvas/Canvas";
const propertiesToInclude = [
  "id",
  "name",
  "locked",
  "file",
  "src",
  "link",
  "tooltip",
  "animation",
  "layout",
  "workareaWidth",
  "workareaHeight",
  "videoLoadType",
  "autoplay",
  "shadow",
  "muted",
  "loop",
  "code",
  "icon",
  "userProperty",
  "trigger",
  "configuration",
  "superType",
  "points",
  "svg",
  "loadType",
];

const defaultOption = {
  stroke: "rgba(255, 255, 255, 0)",
  strokeUniform: true,
  resource: {},
  link: {
    enabled: false,
    type: "resource",
    state: "new",
    dashboard: {},
  },
  tooltip: {
    enabled: true,
    type: "resource",
    template: "<div>{{message.name}}</div>",
  },
  animation: {
    type: "none",
    loop: true,
    autoplay: true,
    duration: 1000,
  },
  userProperty: {},
  trigger: {
    enabled: false,
    type: "alarm",
    script: "return message.value > 0;",
    effect: "style",
  },
};

const ImageMapEditor = () => {
  // 将 state 转换为 useState
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomRatio, setZoomRatio] = useState(1);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animations, setAnimations] = useState([]);
  const [styles, setStyles] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [editing, setEditing] = useState(false);
  const [descriptors, setDescriptors] = useState({});
  const [objects, setObjects] = useState(undefined);

  let canvasRef = useRef(null);

  const canvasHandler = {
    onAdd: (target) => {
      if (!editing) {
        changeEditing(true);
      }
      if (target.type === "activeSelection") {
        canvasHandler.onSelect(null);
        return;
      }
      canvasRef.current.handler.select(target);
    },
  };
  const changeEditing = (editing) => {
    setEditing(editing);
  };
  useEffect(() => {
    showLoading(true);
    import("./Descriptors.json").then((descriptors) => {
      setDescriptors(descriptors.default);
      showLoading(false);
    });
    return () => {
      // 卸载时的清理逻辑
    };
  }, []);

  const titleContent = (
    <React.Fragment>
      <span>Editor</span>
    </React.Fragment>
  );
  const showLoading = (bool) => setLoading(bool);
  const title = <ImageMapTitle title={titleContent} />;
  const content = (
    <div className="rde-editor">
      <ImageMapItems descriptors={descriptors} canvasRef={canvasRef.current} />
      <div className="rde-editor-canvas-container">
        <div className="rde-editor-header-toolbar">
          <ImageMapHeaderToolbar />
        </div>
        <div className="rde-editor-canvas">
          <Canvas
            ref={canvasRef}
            className="rde-canvas"
            minZoom={1}
            maxZoom={500}
            keyEvent={{
              transaction: true,
            }}
            canvasOption={{
              selectionColor: "rgba(8, 151, 156, 0.3)",
            }}
            onAdd={canvasHandler.onAdd}
            objectOption={defaultOption}
            propertiesToInclude={propertiesToInclude}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Content
      content={content}
      title={title}
      loading={loading}
      className=""
    ></Content>
  );
};

export default ImageMapEditor;
