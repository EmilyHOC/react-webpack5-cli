import React, { useState } from "react";
import { FlowContext } from "../contexts";

interface FlexProps {
  children?: React.ReactNode;
}

const FlowContainer: React.FC<FlexProps> = (props) => {
  const { children } = props;
  const [selectedFlowNode, setSelectedFlowNode] = useState(null);
  return (
    <FlowContext.Provider
      value={{
        selectedFlowNode,
        setSelectedFlowNode,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export default FlowContainer;
