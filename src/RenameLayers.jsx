/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-08 22:28:53 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-08-11 22:53:11
 */

const React = require("react")
const Rename = require("./lib/Rename.js")
const Preview = require("./Preview.jsx")
const style = require("./styles.css")

class RenameLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      valueAttr: "",
      sequence: 1,
      inputFocus: false,
      previewData: [],
    }
    this.onNameInputChange = this.onNameInputChange.bind(this)
    this.onSequenceInputChange = this.onSequenceInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.enterFunction = this.enterFunction.bind(this)
    this.onButtonClicked = this.onButtonClicked.bind(this)
  }

  componentDidMount() {
    document.addEventListener("keydown", this.enterFunction, false)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.enterFunction, false)
  }

  doRename(item, index) {
    const options = {
      layerName: item.name,
      currIdx: index,
      width: item.globalBounds.width,
      height: item.globalBounds.height,
      selectionCount: this.props.selection.items.length,
      inputName: this.state.valueAttr,
      startsFrom: Number(this.state.sequence),
      parentName: item.parent.name,
    }
    return Rename.rename(options)
  }

  onNameInputChange(e) {
    this.setState({ valueAttr: e.target.value }, () => this.previewUpdate())
  }

  onSequenceInputChange(e) {
    this.setState(
      {
        sequence: e.target.value,
        inputFocus: false,
      },
      () => this.previewUpdate()
    )
  }

  previewUpdate() {
    let renamed = []
    this.props.selection.items.forEach((item, index) => {
      renamed.push(this.doRename(item, index))
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
    this.props.selection.items.forEach((item, index) => {
      item.name = this.doRename(item, index)
    })
    this.props.dialog.close()
  }

  onCancelClick(e) {
    this.props.dialog.close()
  }

  onButtonClicked(event) {
    event.preventDefault()
    this.setState(
      {
        valueAttr: `${this.state.valueAttr}${event.target.getAttribute("data-char")}`,
        inputFocus: true,
      },
      () => this.previewUpdate()
    )
  }

  render() {
    const buttons = [
      { id: "currentLayer", char: "%*", text: "Layer Name" },
      { id: "layerWidth", char: "%w", text: "Layer Width" },
      { id: "layerHeight", char: "%h", text: "Layer Height" },
      { id: "sequenceAsc", char: "%n", text: "Num. Sequence ASC" },
      { id: "sequenceDesc", char: "%N", text: "Num. Sequence DESC" },
      { id: "sequenceAlpha", char: "%A", text: "Alphabet Sequence" },
      { id: "parentName", char: "%o", text: "Parent Name" },
    ]

    const listItems = buttons.map((b) => (
      <li key={b.id} className="keywordBtn">
        <button
          uxp-variant="action"
          title={`Shortcut: ${b.char}`}
          onClick={this.onButtonClicked}
          data-char={b.char}
        >
          {b.text}
        </button>
      </li>
    ))
    return (
      <form method="dialog" style={{ width: 320, height: 350 }}>
        <h1>Rename Selected Layers</h1>
        <div className="inputWrapper">
          <label>Name</label>
          <input
            type="text"
            id="name"
            placeholder="Item %n"
            value={this.state.valueAttr}
            onChange={this.onNameInputChange}
          />
        </div>
        <div className="inputWrapper sequenceInput">
          <label>Start from</label>
          <input
            type="number"
            id="sequence"
            value={this.state.sequence}
            onChange={this.onSequenceInputChange}
          />
        </div>
        <section id="keywordsSection">
          <h3>KEYWORDS</h3>
          <ul className="keywords">{listItems}</ul>
        </section>

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

module.exports = RenameLayers
