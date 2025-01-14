import { Flex } from "@/components/flex";
import { Component } from "react";
import { Collapse, Input, message } from "antd";
import i18n from "i18next";
import classnames from "classnames";
import { Scrollbar, CommonButton } from "@/components/common";
import Icon from "@/components/icon/Icon";
import debounce from "lodash/debounce";
import { uuid } from "uuidv4";
import { nanoid } from "nanoid";

class ImageMapItems extends Component {
  state = {
    activeKey: [],
    collapse: false,
    textSearch: "",
    descriptors: {},
    filteredDescriptors: [],
    svgModalVisible: false,
  };

  //类里面的静态成员变量
  handlers = {
    onCollapse: () => {
      this.setState({
        collapse: !this.state.collapse,
      });
    },
    onSearchNode: (e) => {
      const filteredDescriptors = this.handlers
        .transformList()
        .filter((item) => {
          this.props.descriptors.name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
      this.setState({
        textSearch: e.target.value,
        filteredDescriptors,
      });
    },
    transformList: () => {
      return Object.values(this.props.descriptors).reduce(
        (prev, curr) => prev.concat(curr),
        [],
      );
    },
    onChangeActiveKey: (activeKey) => {
      this.setState({ activeKey });
    },
    onAddItem: (item, centered) => {
      const { canvasRef } = this.props;
      if (canvasRef?.handler?.interactionMode === "polygon") {
        message.info("Already drawing").then((r) => console.log(r));
        return;
      }
      const id = nanoid();
      const option = Object.assign({}, item.option, { id });
      canvasRef?.handler?.add(option, centered);
      console.log(canvasRef, "canvasRef");
    },
  };

  events = {
    onDragStart: function (e, item) {
      this.item = item;
      const { target } = e;
      target.classList.add("dragging");
    },
    onDragEnd: function (e, item) {
      const { target } = e;
      target.classList.add("over");
    },
    onDragOver: function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = "copy";
      return false;
    },
  };
  renderItems = (items) => (
    <Flex flexWrap="wrap" flexDirection="column" style={{ width: "100%" }}>
      {items.map((item) => this.renderItem(item))}
    </Flex>
  );
  renderItem = (item, centered) =>
    item.type === "drawing" ? (
      <div
        key={item.name}
        draggable
        className="rde-editor-items-item"
        style={{ justifyContent: this.state.collapse ? "center" : null }}
      >
        <span className="rde-editor-items-item-icon">
          <Icon
            name={item.icon.name}
            prefix={item.icon.prefix}
            style={item.icon.style}
          />
        </span>
        {this.state.collapse ? null : (
          <div className="rde-editor-items-item-text">{item.name}</div>
        )}
      </div>
    ) : (
      <div
        key={item.name}
        draggable
        onClick={(e) => this.handlers.onAddItem(item, centered)}
        onDragStart={(e) => this.events.onDragStart(e, item)}
        onDragEnd={(e) => this.events.onDragEnd(e, item)}
        className="rde-editor-items-item"
        style={{ justifyContent: this.state.collapse ? "center" : null }}
      >
        <span className="rde-editor-items-item-icon">
          <Icon
            name={item.icon.name}
            prefix={item.icon.prefix}
            style={item.icon.style}
          />
        </span>
        {this.state.collapse ? null : (
          <div className="rde-editor-items-item-text">{item.name}</div>
        )}
      </div>
    );
  render() {
    const { descriptors } = this.props;
    const { collapse, textSearch, activeKey = [] } = this.state;
    const className = classnames("rde-editor-items", {
      minimize: collapse,
    });
    const items = Object.keys(descriptors).map((item) => {
      return {
        key: item,
        label: item,
        children: this.renderItems(descriptors[item]),
      };
    });

    return (
      <div className={className}>
        <Flex flex="1" flexDirection="column" style={{ height: "100%" }}>
          <Flex
            justifyContent="center"
            alignItems="center"
            style={{ height: 40 }}
          >
            <CommonButton
              icon={collapse ? "angle-double-right" : "angle-double-left"}
              shape="circle"
              className="rde-action-btn"
              style={{ margin: "0 4px" }}
              onClick={this.handlers.onCollapse}
            />
            {collapse ? null : (
              <Input
                style={{ margin: "8px" }}
                placeholder={i18n.t("action.search-list")}
                onChange={this.handlers.onSearchNode}
                value={textSearch}
                allowClear
              />
            )}
          </Flex>
          <Scrollbar>
            <Flex flex="1" style={{ overflowY: "hidden" }}>
              {collapse ? (
                <Flex
                  flexWrap="wrap"
                  flexDirection="column"
                  style={{ width: "100%" }}
                  justifyContent="center"
                >
                  {this.handlers
                    .transformList()
                    .map((item) => this.renderItem(item))}
                </Flex>
              ) : (
                <Collapse
                  items={items}
                  style={{ width: "100%" }}
                  bordered={false}
                  activeKey={
                    activeKey.length ? activeKey : Object.keys(descriptors)
                  }
                  onChange={this.handlers.onChangeActiveKey}
                />
              )}
            </Flex>
          </Scrollbar>
        </Flex>
      </div>
    );
  }
}

export default ImageMapItems;
