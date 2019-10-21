/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-08 22:28:53
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2019-10-21 11:12:17
 */

import React from "react"
import isBlank from "is-blank"
import {FindReplace} from "renameitlib";
import Preview from "./Preview.jsx"
import style from "./styles.scss"

class FindReplaceLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      findValue: "",
      replaceValue: "",
      caseSensitive: false,
      previewData: [],
      disableButton: true,
      noMatch: ""
    }

    this.findReplace = new FindReplace()
    this.isSubmiting = false
    this.onFindInputChange = this
      .onFindInputChange
      .bind(this)
    this.onSubmit = this
      .onSubmit
      .bind(this)
    this.onCancelClick = this
      .onCancelClick
      .bind(this)
    this.enterFunction = this
      .enterFunction
      .bind(this)
  }

  componentDidMount() {
    document.addEventListener("keydown", this.enterFunction, false)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.enterFunction, false)
  }

  doRename(item) {
    const opts = {
      layerName: item.name,
      findText: this.state.findValue,
      replaceWith: this.state.replaceValue,
      caseSensitive: this.state.caseSensitive
    }

    const name = this
      .findReplace
      .match(opts)
      ? this
        .findReplace
        .layer(opts)
      : false

    return name
  }

  onFindInputChange(e) {
    const isFind = e.target.id === "find"
    this.setState({
      findValue: isFind
        ? e.target.value
        : this.state.findValue,
      replaceValue: !isFind
        ? e.target.value
        : this.state.replaceValue
    }, () => this.previewUpdate())
  }

  onCaseSensitiveChange() {
    this.setState({
      caseSensitive: !this.state.caseSensitive
    }, () => this.previewUpdate())
  }

  previewUpdate() {
    const renamed = []
    let isMatch = true
    this
      .props
      .selection
      .items
      .forEach((item) => {
        const name = this.doRename(item)
        if (name || isBlank(name)) {
          renamed.push(name)
          isMatch = true
        } else {
          isMatch = false
        }
      })
    this.setState({
      previewData: renamed
    }, () => {
      this.showNoMatch(isMatch)
    })

  }

  enterFunction(event) {
    if (event.keyCode === 13) {
      // Enter is pressed
      this.onSubmit()
    }
  }

  onSubmit(e) {
    if (this.isSubmiting) 
      return
    this.isSubmiting = true
    this
      .props
      .selection
      .items
      .forEach((item) => {
        const name = this.doRename(item)

        if (name) {
          item.name = name
        }
      })

    document.removeEventListener("keydown", this.enterFunction, false)
    this
      .props
      .dialog
      .close()
  }

  onCancelClick(e) {
    this
      .props
      .dialog
      .close()
  }

  showNoMatch(isMatch) {
    let noMatchText = ""
    let disButton = false
    if (!isMatch && !isBlank(this.state.findValue)) {
      noMatchText = "No match"
      disButton = true
    }

    if (isBlank(this.state.findValue)) 
      disButton = true

    this.setState({noMatch: noMatchText})
    this.setState({
      disableButton: !disButton
        ? ""
        : true
    })
  }

  render() {
    return (
      <form
        className="findReplace"
        method="dialog"
        style={{
        width: 320
      }}>
        <h1>Find & Replace Selected Layers</h1>
        <hr/>
        <div className="inputWrapper">
          <span>Find</span>
          <input
            type="text"
            id="find"
            value={this.state.findValue}
            onChange={this.onFindInputChange}/>
        </div>

        <div className="inputWrapper">
          <span>Replace</span>
          <input
            type="text"
            id="replace"
            value={this.state.replaceValue}
            onChange={this.onFindInputChange}/>
        </div>
        <div className="inputWrapper caseSesitiveWrapper">
          <span>Case Sensitive</span>
          <input
            type="checkbox"
            id="case"
            defaultChecked={this.state.caseSensitive}
            ref={(el) => el && (el.onchange = () => this.onCaseSensitiveChange(el))}/>
        </div>

        <Preview data={this.state.previewData} noMatch={this.state.noMatch}/>

        <footer>
          <button type="submit" uxp-variant="secondary" onClick={this.onCancelClick}>
            Cancel
          </button>
          <button
            type="submit"
            uxp-variant="cta"
            onClick={this.onSubmit}
            disabled={this.state.disableButton}>
            Rename
          </button>
        </footer>
      </form>
    )
  }
}

export default FindReplaceLayers
