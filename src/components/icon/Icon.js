const Icon = (props) => {
  let {
    name = null,
    color = "",
    style,
    className = "",
    size = 1,
    innerIcon = null,
    innerColor,
    innerClassName = "",
    innerSize = 1,
    prefix = "fas",
    onClick,
  } = props;

  if (name && name.startsWith("icon-")) {
    name = name.substr("icon-".length);
  }
  const getIconHtml = (prefix, name, className, size, color) => {
    const iconClassName = `${prefix} fa-${name} ${className}`;
    const iconStyle = Object.assign({}, style, {
      fontSize: `${size}em`,
      color,
    });
    return <i className={iconClassName} style={iconStyle} onClick={onClick} />;
  };
  const iconHtml = getIconHtml(prefix, name, className, size, color);
  let innerIconHtml = null;
  if (innerIcon) {
    innerIconHtml = getIconHtml(
      innerIcon,
      innerClassName,
      innerSize,
      innerColor,
    );
  } else {
    return iconHtml;
  }
  return (
    <span className="fa-stack">
      {iconHtml}
      {innerIconHtml}
    </span>
  );
};

export default Icon;
