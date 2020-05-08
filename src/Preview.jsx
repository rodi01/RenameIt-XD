/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-07 15:21:14
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-08 00:23:47
 */

import React from "react"
import isBlank from "is-blank"

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: "",
      showPreview: "hide",
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(
      {
        preview: nextProps.data.filter((val) => val).join(", "),
      },
      () => this.updateClassName()
    )
  }

  updateClassName() {
    if (isBlank(this.state.preview) && isBlank(this.props.noMatch)) {
      this.setState({ showPreview: "hide" })
    } else {
      this.setState({ showPreview: "show" })
    }
  }

  renderPreviewText() {
    if (isBlank(this.state.preview) && isBlank(this.props.noMatch)) {
      return ` `
    } else if (!isBlank(this.props.noMatch)) {
      return `${this.props.noMatch}`
    } else {
      return `${this.state.preview}`
    }
  }

  render() {
    return (
      <div id="preview" className={isBlank(this.props.noMatch) ? "" : "noMatch"}>
        <h3 className={this.state.showPreview}>PREVIEW</h3>
        <span className="previewText">{this.renderPreviewText()}</span>
      </div>
    )
  }
}

export default Preview
