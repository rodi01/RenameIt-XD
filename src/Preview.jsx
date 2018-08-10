/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-07 15:21:14 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-08-08 22:27:28
 */

const React = require("react")

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
    if (this.state.preview === "") {
      return <span>&nbsp;</span>
    } else {
      return (
        <span>
          Preview: <strong>{this.state.preview}</strong>
        </span>
      )
    }
  }
  render() {
    return <div id="preview">{this.renderPreviewText()}</div>
  }
}

module.exports = Preview
