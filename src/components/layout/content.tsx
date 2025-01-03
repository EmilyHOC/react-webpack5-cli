import { Layout, Spin } from "antd";
import React from "react";

interface IProps {
  title?: React.ReactNode;
  leftSider?: React.ReactNode;
  content?: React.ReactNode;
  rightSider?: React.ReactNode;
  className?: string;
  loading?: boolean;
  children?: React.ReactNode;
}
//使用泛性约束props的类型
const Content: React.FC<IProps> = ({
  title,
  leftSider,
  content,
  rightSider,
  className = "rde-content-layout-main",
  loading = false,
  children,
}) => {
  return (
    <Spin spinning={loading}>
      <Layout className="rde-content-layout">
        {title}
        <Layout
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: `calc(100vh - ${title ? 98 : 60}px)`,
            height: `calc(100vh - ${title ? 98 : 60}px)`,
          }}
          className={className}
        >
          {content}
        </Layout>
      </Layout>
    </Spin>
  );
};

//给整个布局包一个组件
export default Content;
