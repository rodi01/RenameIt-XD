/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-08 22:28:53 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-09-04 22:19:56
 */

const React = require("react")
const FindReplace = require("./lib/FindReplace.js")
const Preview = require("./Preview.jsx")
const History = require("./lib/History.js")
const HistoryDropdown = require("./HistoryDropdown.jsx")
const style = require("./styles.scss")

class FindReplaceLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      findValue: "",
      replaceValue: "",
      caseSensitive: false,
      previewData: [],
      findHistory: [],
      replaceHistory: [],
    }

    History.getFindHistory().then((item) => {
      this.setState({ findHistory: item })
    })

    History.getReplaceHistory().then((item) => {
      this.setState({ replaceHistory: item })
    })

    this.onFindInputChange = this.onFindInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.enterFunction = this.enterFunction.bind(this)
    this.handleFindHistory = this.handleFindHistory.bind(this)
    this.handleReplaceHistory = this.handleReplaceHistory.bind(this)
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
      },
      () => this.previewUpdate()
    )
  }

  handleFindHistory(str) {
    this.setState(
      {
        findValue: str,
      },
      () => this.previewUpdate()
    )
  }

  handleReplaceHistory(str) {
    this.setState(
      {
        replaceValue: str,
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

    // History
    History.setFindHistory(this.state.findValue)
    History.setReplaceHistory(this.state.replaceValue)

    this.props.dialog.close()
  }

  onCancelClick(e) {
    this.props.dialog.close()
  }

  render() {
    return (
      <form className="findReplace" method="dialog" style={{ width: 320, height: 224 }}>
        <h1>Find & Replace Selected Layers</h1>
        <div className="inputWrapper">
          <label>Find</label>
          <input
            type="text"
            id="find"
            value={this.state.findValue}
            onChange={this.onFindInputChange}
            tabIndex="0"
          />

          <HistoryDropdown
            dropdownId="findDD"
            handleHistory={this.handleFindHistory}
            menuData={this.state.findHistory}
          />
        </div>

        <div className="inputWrapper">
          <label>Replace</label>
          <input
            type="text"
            id="replace"
            value={this.state.replaceValue}
            onChange={this.onFindInputChange}
            tabIndex="1"
          />
          <HistoryDropdown
            dropdownId="replaceDD"
            handleHistory={this.handleReplaceHistory}
            menuData={this.state.replaceHistory}
          />
        </div>
        <div className="inputWrapper caseSesitiveWrapper">
          <label>Case Sensitive</label>
          <input
            type="checkbox"
            id="case"
            defaultChecked={this.state.caseSensitive}
            ref={(el) => el && (el.onchange = () => this.onCaseSensitiveChange(el))}
          />
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
