/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-07 15:21:14 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-09-09 15:03:42
 */

const React = require("react")
const isBlank = require("is-blank")

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: "",
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      preview: nextProps.data.filter((val) => val).join(", "),
    })
  }

  renderPreviewText() {
    if (isBlank(this.state.preview)) {
      return <span>&nbsp;</span>
    } else {
      return `Preview: ${this.state.preview}`
    }
  }
  render() {
    return <div id="preview">{this.renderPreviewText()}</div>
  }
}

module.exports = Preview
