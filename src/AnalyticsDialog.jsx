/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 22:14:31
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-13 01:32:53
 */

import React from "react"
const ReactDOM = require("react-dom")
import { setAnalyticsEnabled, setAnalyticsFirstRun } from "./lib/GoogleAnalytics.js"

class AnalyticsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.onAgreeClick = this.onAgreeClick.bind(this)
    this.onDisagreeClick = this.onDisagreeClick.bind(this)
  }

  async componentDidMount() {
    await setAnalyticsFirstRun()
  }

  async onAgreeClick(e) {
    await setAnalyticsEnabled(true)
    ReactDOM.render(this.props.nextDialog, this.props.dialog)
  }

  async onDisagreeClick(e) {
    await setAnalyticsEnabled(false)
    ReactDOM.render(this.props.nextDialog, this.props.dialog)
  }

  render() {
    return (
      <form method="dialog" style={{ width: 350 }}>
        <h1>Analytics</h1>
        <p>
          Rename It uses Google Analytics to help improve the plugin. Click on 'Agree' to send
          diagnostics or 'Disagree' to disable analytics.
        </p>
        <footer className="mt24">
          <button type="button" uxp-variant="secondary" onClick={this.onDisagreeClick}>
            Disagree
          </button>

          <button type="button" uxp-variant="cta" onClick={this.onAgreeClick}>
            Agree
          </button>
        </footer>
      </form>
    )
  }
}

export default AnalyticsDialog
