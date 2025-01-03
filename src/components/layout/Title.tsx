import React, { useState } from "react";
import { Button, Tooltip, Menu, MenuProps, Modal } from "antd";
import { Flex } from "@/components/flex";
import i18next from "i18next";
import styled from "styled-components";
import { Icon } from "@/components/icon";
import { ShortcutHelp } from "@/components/help";
// 定义可复用的样式片段

// 使用 styled-components 扩展 antd 的 Button 组件
const StyledButton = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  background： transparent,
  &:hover,
  &:focus {
    background: transparent !important;
    color: white !important;
  }

  &:active {
    background: transparent !important;
    color: white !important;
  }
`;
interface IProps {
  onChangeEditor: (param: any) => void;
  currentEditor: string;
}
type MenuItem = Required<MenuProps>["items"][number];
const Title: React.FC<IProps> = ({ onChangeEditor, currentEditor }) => {
  const [visible, setVisible] = useState(false);
  const handlers = {
    showHelp: () => {
      setVisible(true);
      console.log(visible, "visible");
    },
  };
  const items: MenuItem[] = [
    {
      label: "ImageMap",
      icon: "",
      key: "imagemap",
    },
  ];
  return (
    <Flex
      flex="1"
      alignItems="center"
      flexWrap="wrap"
      style={{
        background: "linear-gradient(141deg,#23303e,#404040 51%,#23303e 75%)",
      }}
    >
      <Flex style={{ marginLeft: 8 }} flex="0 1 auto">
        <span
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Design Editor
        </span>
        <Tooltip
          title={i18next.t("action.shortcut-help")}
          overlayStyle={{ fontSize: 16 }}
        >
          <StyledButton className="rde-action-btn" onClick={handlers.showHelp}>
            <Icon name="question" prefix="fas" size={1.5} />
          </StyledButton>
        </Tooltip>
      </Flex>
      <Flex style={{ marginLeft: 88 }}>
        <Menu
          mode="horizontal"
          theme="dark"
          style={{ background: "transparent", fontSize: "16px" }}
          onClick={onChangeEditor}
          selectedKeys={[currentEditor]}
          items={items}
        ></Menu>
      </Flex>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        closable={true}
        footer={null}
        width="50%"
      >
        <ShortcutHelp />
      </Modal>
    </Flex>
  );
};

export default Title;
