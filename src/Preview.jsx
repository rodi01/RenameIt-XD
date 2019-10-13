/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-07 15:21:14
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2019-10-12 18:16:51
 */

const React = require("react")
const isBlank = require("is-blank")

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      preview: nextProps
        .data
        .filter((val) => val)
        .join(", ")
    })
  }

  renderPreviewText() {

    if (isBlank(this.state.preview) && isBlank(this.props.noMatch)) {
      return <span>&nbsp;</span>
    } else if (!isBlank(this.props.noMatch)) {
      return `${this.props.noMatch}`
    } else {
      return `Preview: ${this.state.preview}`
    }
  }
  render() {
    return <div
      id="preview"
      className={isBlank(this.props.noMatch)
      ? ""
      : "noMatch"}>{this.renderPreviewText()}</div>
  }
}

module.exports = Preview
