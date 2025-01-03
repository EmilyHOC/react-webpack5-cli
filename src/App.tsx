import React, { useState } from "react";

import "./App.less";
import "./styles/index.less";
import FlowContainer from "./containers/FlowContainer";
import { ImageMapEditor } from "./editors";
import { Title } from "./components/layout";
import { i18nClient } from "./i18n";
type EditorType = "imagemap" | "workflow" | "flow" | "hexgrid" | "fiber";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";

import i18next from "i18next";

const antResources: any = {
  en: enUS,
  "en-US": enUS,
};

const App = () => {
  const [activeEditor, setActiveEditor] = useState("imagemap");
  const handleChangeEditor = (key: string) => {
    setActiveEditor(key);
  };

  const renderEditor = (activeEditor: EditorType) => {
    switch (activeEditor) {
      case "imagemap":
        return <ImageMapEditor />;

      default:
        return <ImageMapEditor />;
    }
  };

  return (
    <ConfigProvider
      locale={antResources[i18next.language]}
      theme={{ token: { colorPrimary: "#08979c" } }}
    >
      <div className="rde-main">
        <div className="rde-title">
          <Title
            currentEditor={activeEditor}
            onChangeEditor={handleChangeEditor}
          ></Title>
        </div>
        <FlowContainer>
          <div className="rde-content">
            {renderEditor(
              activeEditor as
                | "imagemap"
                | "workflow"
                | "flow"
                | "hexgrid"
                | "fiber",
            )}
          </div>
        </FlowContainer>
      </div>
    </ConfigProvider>
  );
};

i18nClient();
export default App;
