/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-08 22:28:53 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-08-25 16:51:23
 */

const React = require("react")
const FindReplace = require("./lib/FindReplace.js")
const Preview = require("./Preview.jsx")
const style = require("./styles.css")

class FindReplaceLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      findValue: "",
      replaceValue: "",
      caseSensitive: false,
      caseImg: "../assets/unchecked.png",
      previewData: [],
    }
    this.onFindInputChange = this.onFindInputChange.bind(this)
    this.onCaseSensitiveChange = this.onCaseSensitiveChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.enterFunction = this.enterFunction.bind(this)
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
      caseSensitive: this.state.caseSensitive,
    }

    return FindReplace.matchString(opts) ? FindReplace.findReplace(opts) : false
  }

  onFindInputChange(e) {
    const isFind = e.target.id === "find"
    this.setState(
      {
        findValue: isFind ? e.target.value : this.state.findValue,
        replaceValue: !isFind ? e.target.value : this.state.replaceValue,
      },
      () => this.previewUpdate()
    )
  }

  onCaseSensitiveChange() {
    this.setState(
      {
        caseSensitive: !this.state.caseSensitive,
        caseImg: !this.state.caseSensitive ? "../assets/checked.png" : "../assets/unchecked.png",
      },
      () => this.previewUpdate()
    )
  }

  previewUpdate() {
    const renamed = []
    this.props.selection.items.forEach((item) => {
      const name = this.doRename(item)
      if (name) {
        renamed.push(name)
      }
    })
    this.setState({ previewData: renamed })
  }

  enterFunction(event) {
    if (event.keyCode === 13) {
      // Enter is pressed
      this.onSubmit()
    }
  }

  onSubmit(e) {
    this.props.selection.items.forEach((item) => {
      const name = this.doRename(item)
      if (name) {
        item.name = name
      }
    })

    this.props.dialog.close()
  }

  onCancelClick(e) {
    this.props.dialog.close()
  }

  render() {
    return (
      <form className="findReplace" method="dialog" style={{ width: 320, height: 235 }}>
        <h1>Find & Replace Selected Layers</h1>
        <div className="inputWrapper">
          <label>Find</label>
          <input
            type="text"
            id="find"
            value={this.state.findValue}
            onChange={this.onFindInputChange}
          />
        </div>

        <div className="inputWrapper">
          <label>Replace</label>
          <input
            type="text"
            id="replace"
            value={this.state.replaceValue}
            onChange={this.onFindInputChange}
          />
        </div>
        <div className="inputWrapper caseSesitiveWrapper">
          <label>Case Sensitive</label>
          {/* Faking checkbox for now */}
          <a href="#" id="case" onClick={this.onCaseSensitiveChange}>
            <img src={this.state.caseImg} />
          </a>
        </div>

        <Preview data={this.state.previewData} />

        <footer>
          <button type="submit" uxp-variant="secondary" onClick={this.onCancelClick}>
            Cancel
          </button>
          <button type="submit" uxp-variant="cta" onClick={this.onSubmit}>
            Rename
          </button>
        </footer>
      </form>
    )
  }
}

module.exports = FindReplaceLayers
