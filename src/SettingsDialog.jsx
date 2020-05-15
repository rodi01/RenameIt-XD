/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 22:14:31
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-14 23:55:18
 */

import React from "react"
import { setAnalyticsEnabled, analyticsEnabled } from "./lib/GoogleAnalytics.js"

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      analytics: true,
    }

    this.onAnalyticsChange = this.onAnalyticsChange.bind(this)
  }

  async setAnalytics() {
    const a = await analyticsEnabled()

    this.setState({
      analytics: a,
    })
  }

  async componentDidMount() {
    await this.setAnalytics()
  }

  async onAnalyticsChange(event) {
    this.setState({
      analytics: event.target.checked,
    })

    await setAnalyticsEnabled(event.target.checked)
  }

  render() {
    return (
      <form method="dialog" style={{ width: 350 }}>
        <h1>Settings</h1>
        <hr />
        <p>Rename It uses Google Analytics to help improve the plugin.</p>
        <label className="row" style={{ alignItems: "center" }}>
          <input
            id="analytics"
            type="checkbox"
            checked={this.state.analytics}
            onChange={this.onAnalyticsChange}
          />
          <span>Enable Google Analytics</span>
        </label>
        <footer className="mt24">
          <button type="submit" uxp-variant="cta">
            Done
          </button>
        </footer>
      </form>
    )
  }
}

export default SettingsDialog
