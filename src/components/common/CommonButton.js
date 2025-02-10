import React from "react";
import { Tooltip, Button } from "antd";
import Icon from "../icon/Icon";

// interface CommonButtonInterface{
//     name?: string,
//     id?: string,
//     style?: Object,
//     wrapperStyle?: Object,
//     wrapperClassName?: string,
//     tooltipTitle?: string,
//     tooltipPlacement?: string,
//     className?: string,
//     icon?: string,
//     iconStyle?: Object,
//     iconClassName?: string,
//     iconAnimation?: string,
//     visible?: Boolean,
//     shape?: string,
//     disabled?: Boolean,
//     loading?: Boolean,
//     type?: string,
//     children?: React.ReactNode,
//     onClick: Function
// }

const CommonButton = (props) => {
  const {
    type = "default",
    visible = true,
    disabled = false,
    loading = false,
    wrapperClassName,
    wrapperStyle,
    icon,
    iconAnimation,
    children,
    tooltipTitle,
    tooltipPlacement,
    id,
    className,
    name,
    style,
    shape,
    size,
    onClick,
    iconStyle,
    iconClassName,
  } = props;

  return (
    <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
      <Button
        id={id}
        className={className}
        name={name}
        style={style}
        shape={shape}
        size={size}
        type={type}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
      >
        <Icon
          name={icon}
          style={iconStyle}
          className={iconClassName}
          onClick={onClick}
        />
        {children}
      </Button>
    </Tooltip>
  );
};

export default CommonButton;
