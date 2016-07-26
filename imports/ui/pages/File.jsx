import React from 'react';

export default class File extends React.Component {
  render() {
    return (
      <div onClick={this.props.clickHandler}>
        <div></div>
        <div>
          {this.props.name}
        </div>
      </div>
    );
  }
}

File.propTypes = {
  clickHandler: React.PropTypes.func,
  name: React.PropTypes.string,
};
