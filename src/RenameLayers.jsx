/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-08 22:28:53
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-14 23:59:19
 */

import React from "react"
import isBlank from "is-blank"
import isNumber from "is-number"
import { Rename } from "@rodi01/renameitlib"
import Preview from "./Preview.jsx"
import style from "./styles.scss"
import { hasChildLayer, getChildLayerName } from "./lib/RenameHelper"
import { track } from "./lib/GoogleAnalytics.js"

class RenameLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      valueAttr: "",
      sequence: 1,
      previewData: [],
      showError: "",
      disableButton: true,
      disableChildBtn: !hasChildLayer(props.selection.items),
    }

    this.rename = new Rename()
    this.rename.allowPageName = false
    this.rename.allowChildLayer = true

    this.isSubmitting = false
    this.reorderedSelection = this.reorderSelection()
    this.onNameInputChange = this.onNameInputChange.bind(this)
    this.onSequenceInputChange = this.onSequenceInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.enterFunction = this.enterFunction.bind(this)
    this.onButtonClicked = this.onButtonClicked.bind(this)
    track("pageview", { dp: "/rename" })
  }

  componentDidMount() {
    document.addEventListener("keydown", this.enterFunction, false)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.enterFunction, false)
  }

  reorderSelection() {
    const firstParent = this.props.selection.items[0].parent
    const sameParent = this.props.selection.items.every(
      (elem) => elem.parent.guid === firstParent.guid
    )
    if (sameParent) {
      const arr = []
      firstParent.children.forEach((child) => {
        if (this.props.selection.items.includes(child)) {
          arr.push(child)
        }
      })

      return arr
    } else {
      return this.props.selection.items
    }
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
      childLayer: getChildLayerName(item),
    }
    return this.rename.layer(options)
  }

  onNameInputChange(e) {
    this.setState(
      {
        valueAttr: e.target.value,
      },
      () => this.previewUpdate()
    )
  }

  onSequenceInputChange(e) {
    if (e.target.value == "" || isNumber(e.target.value)) {
      this.setState(
        {
          sequence: e.target.value,
          showError: "",
        },
        () => this.previewUpdate()
      )
    } else {
      this.setState(
        {
          sequence: e.target.value,
          showError: "show",
        },
        () => this.previewUpdate()
      )
    }
  }

  previewUpdate() {
    let renamed = []
    this.reorderedSelection.forEach((item, index) => {
      renamed.push(this.doRename(item, index))
    })
    this.setState({ previewData: renamed })

    this.setState({
      disableButton: !isBlank(this.state.valueAttr) && isNumber(this.state.sequence) ? "" : true,
    })
  }

  enterFunction(e) {
    if (e.keyCode === 13) {
      // Enter is pressed
      e.preventDefault()
      this.onSubmit()
    }
  }

  onSubmit(e) {
    if (!isBlank(this.state.valueAttr) && isNumber(this.state.sequence) && !this.isSubmiting) {
      this.isSubmiting = true
      this.reorderedSelection.forEach((item, index) => {
        item.name = this.doRename(item, index)
      })
      document.removeEventListener("keydown", this.enterFunction, false)
      this.props.dialog.close()
      track("event", {
        ec: "input",
        ea: "rename",
        el: String(this.state.valueAttr),
      })
    } else {
      return
    }
  }

  onCancelClick(e) {
    this.props.dialog.close()
  }

  onButtonClicked(e) {
    e.preventDefault()

    this.setState(
      {
        valueAttr: `${this.state.valueAttr}${e.target.getAttribute("data-char")}`,
      },
      () => this.previewUpdate()
    )

    track("event", {
      ec: "keywordButton",
      ea: `${e.target.getAttribute("id")}`,
      el: `${e.target.getAttribute("data-char")}`,
    })
  }

  render() {
    const buttons = [
      {
        id: "currentLayer",
        char: "%*",
        text: "Layer Name",
      },
      {
        id: "layerWidth",
        char: "%w",
        text: "Layer Width",
      },
      {
        id: "layerHeight",
        char: "%h",
        text: "Layer Height",
      },
      {
        id: "sequenceAsc",
        char: "%N",
        text: "Num. Sequence ASC",
      },
      {
        id: "sequenceDesc",
        char: "%n",
        text: "Num. Sequence DESC",
      },
      {
        id: "sequenceAlpha",
        char: "%A",
        text: "Alphabet Sequence",
      },
      {
        id: "parentName",
        char: "%o",
        text: "Parent Name",
      },
      {
        id: "childLayer",
        char: "%ch%",
        text: "Child Layer",
        disabled: this.state.disableChildBtn,
      },
    ]

    const listItems = buttons.map((b) => (
      <li key={b.id} className="keywordBtn">
        <button
          uxp-variant="action"
          id={b.id}
          title={`Shortcut: ${b.char}`}
          onClick={this.onButtonClicked}
          data-char={b.char}
          disabled={b.disabled}
        >
          {b.text}
        </button>
      </li>
    ))
    return (
      <form
        method="dialog"
        style={{
          width: 350,
        }}
      >
        <h1>Rename Selected Layers</h1>
        <hr />
        <div className="inputWrapper">
          <span>Name</span>
          <input
            type="text"
            id="name"
            placeholder="Item %n"
            value={this.state.valueAttr}
            onChange={this.onNameInputChange}
            ref="name"
          />
        </div>
        <div className="inputWrapper sequenceInput">
          <span>Start from</span>
          <input
            type="number"
            id="sequence"
            value={this.state.sequence}
            onChange={this.onSequenceInputChange}
          />
          <span className={`error ${this.state.showError}`}>&larr; Number is required</span>
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
          <button
            type="submit"
            uxp-variant="cta"
            disabled={this.state.disableButton}
            onClick={this.onSubmit}
          >
            Rename
          </button>
        </footer>
      </form>
    )
  }
}

export default RenameLayers
