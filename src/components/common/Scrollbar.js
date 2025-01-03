import { Scrollbars } from "react-custom-scrollbars";
import { Component } from "react";

class Scrollbar extends Component {
  renderTrack = (props) => <div {...props} className="rde-track-vertical" />;

  render() {
    return (
      <Scrollbars renderTrackVertical={this.renderTrack}>
        {this.props.children}
      </Scrollbars>
    );
  }
}

export default Scrollbar;
