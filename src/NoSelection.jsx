/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-11 22:14:31 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-11-04 20:22:27
 */

import React from "react"

class NoSelection extends React.Component {
  constructor(props) {
    super(props)
    this.onOKClick = this.onOKClick.bind(this)
  }

  onOKClick(e) {
    this.props.dialog.close()
  }

  render() {
    return (
      <form method="dialog" style={{ width: 300 }}>
        <h1>Uh Oh!</h1>
        <p>You need to select at least one artboard or layer.</p>
        <footer className="mt24">
          <button type="submit" uxp-variant="cta" onClick={this.onOKClick}>
            Close
          </button>
        </footer>
      </form>
    )
  }
}

export default NoSelection
