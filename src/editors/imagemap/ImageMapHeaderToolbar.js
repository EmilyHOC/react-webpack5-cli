import { Flex } from "@/components/flex";
import CommonButton from "@/components/common/CommonButton";
import i18n from "i18next";
import { Icon } from "@/components/icon";
const ImageMapHeaderToolbar = (props) => {
  const { canvasRef } = props;
  console.log(canvasRef, "canvasRef");
  const isCropping = canvasRef
    ? canvasRef.handler?.interactionMode === "crop"
    : false;
  return (
    <Flex className="rde-editor-header-toolbar-container" flex="1">
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-list">
        <CommonButton
          shape="circle"
          icon="layer-group"
          tooltipTitle={i18n.t("action.canvas-list")}
        />
        <div className="rde-canvas-list"></div>
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.bringForward()}
          icon="angle-up"
          tooltipTitle={i18n.t("action.bring-forward")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.sendBackwards()}
          icon="angle-down"
          tooltipTitle={i18n.t("action.send-backwards")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.bringToFront()}
          icon="angle-double-up"
          tooltipTitle={i18n.t("action.bring-to-front")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.sendToBack()}
          icon="angle-double-down"
          tooltipTitle={i18n.t("action.send-to-back")}
        />
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.alignmentHandler.left()}
          icon="align-left"
          tooltipTitle={i18n.t("action.align-left")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.alignmentHandler.center()}
          icon="align-center"
          tooltipTitle={i18n.t("action.align-center")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.alignmentHandler.middle()}
          icon="align-center"
          tooltipTitle={i18n.t("action.align-middle")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          disabled={isCropping}
          onClick={() => canvasRef.handler?.alignmentHandler.right()}
          icon="align-right"
          tooltipTitle={i18n.t("action.align-right")}
        />
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-group">
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          onClick={() => canvasRef.handler?.toGroup()}
          icon="object-group"
          tooltipTitle={i18n.t("action.object-group")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="object-ungroup"
          onClick={() => canvasRef.handler?.toActiveSelection()}
          tooltipTitle={i18n.t("action.object-ungroup")}
        />
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-crop">
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="crop"
          tooltipTitle={i18n.t("action.crop")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="check"
          tooltipTitle={i18n.t("action.crop-save")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="times"
          tooltipTitle={i18n.t("action.crop-cancel")}
        />
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-operation">
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="image"
          tooltipTitle={i18n.t("action.canvas-save")}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="clone"
          tooltipTitle={i18n.t("action.clone")}
          onClick={() => canvasRef.handler?.duplicate()}
        />
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="trash"
          tooltipTitle={i18n.t("action.delete")}
        />
      </Flex.Item>
      <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-history">
        <CommonButton className="rde-action-btn">
          <Icon name="undo-alt" style={{ marginRight: 8 }} />
          Undo
        </CommonButton>
        <CommonButton className="rde-action-btn">
          Redo
          <Icon name="redo-alt" style={{ marginLeft: 8 }} />
        </CommonButton>
      </Flex.Item>
    </Flex>
  );
};

export default ImageMapHeaderToolbar;
