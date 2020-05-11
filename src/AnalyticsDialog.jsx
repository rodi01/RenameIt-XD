/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 22:14:31
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-11 01:48:55
 */

import React from "react"
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
    this.props.dialog.close()
  }

  async onDisagreeClick(e) {
    await setAnalyticsEnabled(false)
    this.props.dialog.close()
  }

  render() {
    return (
      <form method="dialog" style={{ width: 300 }}>
        <h1>Analytics</h1>
        <p>
          Rename It uses Google Analytics to help improving the product. Click on 'Agree' to send
          diagnostics or 'Disagree' to disable analytics.
        </p>
        <footer className="mt24">
          <button type="submit" uxp-variant="secondary" onClick={this.onDisagreeClick}>
            Disagree
          </button>

          <button type="submit" uxp-variant="cta" onClick={this.onAgreeClick}>
            Agree
          </button>
        </footer>
      </form>
    )
  }
}

export default AnalyticsDialog
