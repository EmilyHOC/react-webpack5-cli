import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

// // Render your React component instead
// const root = createRoot(document.getElementById('root') as Element);
// root.render(<App />);

// 获取 DOM 容器节点
const container = document.getElementById("root") as Element;
// 创建根容器
const root = createRoot(container);

// 使用 createRoot 渲染应用，并包裹在 StrictMode 中

root.render(<App />);
