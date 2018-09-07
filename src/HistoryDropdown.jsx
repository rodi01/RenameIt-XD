/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-09-02 15:24:03 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-09-04 21:57:37
 */
const React = require("react")

class HistoryDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: "",
      longestText: "", //hack for now
    }
    this.onTargetSelect = this.onTargetSelect.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.menuClose = this.menuClose.bind(this)
    this.menuRef = React.createRef()
    this.longTextRef = React.createRef()
  }

  onTargetSelect(event) {
    this.props.handleHistory(event.target.getAttribute("data-title"))
  }

  toggleDropdown(event) {
    this.setState({
      isOpened: "opened",
    })

    const rect = event.target.getBoundingClientRect()
    this.menuRef.current.popupAt(
      rect.right - this.longTextRef.current.clientWidth + 8,
      rect.bottom + 5
    )
  }

  menuClose() {
    this.setState({
      isOpened: "",
    })
  }

  render() {
    let menuItems
    let fakeMenu

    if (this.props.menuData.length > 0) {
      menuItems = this.props.menuData.map((d, idx) => (
        <menuitem
          key={`${this.props.dropdownId}-${idx}`}
          id={`${this.props.dropdownId}-${idx}`}
          data-title={d}
          label={d}
          onClick={this.onTargetSelect}
        />
      ))
      fakeMenu = this.props.menuData.map((d, idx) => (
        <div
          key={`${this.props.dropdownId}-${idx}-fake`}
          style={{ fontSize: 14, paddingLeft: 22, paddingRight: 22 }}
        >
          {d}
        </div>
      ))
    } else {
      menuItems = <menuitem label="Empty History" disabled />
      fakeMenu = (
        <div style={{ fontSize: 14, paddingLeft: 22, paddingRight: 22 }}>Empty History</div>
      )
    }
    return (
      <div id={this.props.dropdownId} className={`dropdown ${this.state.isOpened}`}>
        <div className="historyIcon" onClick={this.toggleDropdown}>
          <img
            srcSet="./assets/historyIcon.png,
              ./assets/historyIcon@2x.png 2x"
            src="./assets/historyIcon.png"
          />
        </div>
        <menu className="menuItems" ref={this.menuRef} onClose={this.menuClose}>
          {menuItems}
        </menu>
        <div
          ref={this.longTextRef}
          style={{ position: "absolute", right: 0, top: 40, visibility: "hidden" }}
        >
          {fakeMenu}
        </div>
      </div>
    )
  }
}

module.exports = HistoryDropdown
