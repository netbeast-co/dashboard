import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Settings from './settings.jsx'
import NotFound from './not-found.jsx'

import Notifications from './notifications'
import Drawer from './apps/drawer.jsx'
import AppLiveView from './apps/live.jsx'
import InstallView from './apps/install.jsx'
import Explore from './apps/explore.jsx'
import Devices from './devices/index.jsx'

import Login from './user/login.jsx'
import Signup from './user/signup.jsx'

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.getPathClassName = this.getPathClassName.bind(this)
    this.state = { path: this.getPathClassName() }
  }

  getPathClassName (nextProps) {
    const { location } = nextProps || this.props
    const regexp = new RegExp('/', 'g')
    const pathname = location.pathname.replace(regexp, '-')
    return (pathname === '-') ? '-root' : pathname
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ path: this.getPathClassName(nextProps) })
  }

  render () {
    let { path } = this.state
    path = path.indexOf('live') > -1 ? '-live' : path
    return (
      <div id='dashboard' className={`path${path}`}>
        <Notifications />
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}
Dashboard.propTypes = {
  children: React.PropTypes.element
}


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Dashboard}>
      <IndexRoute component={Drawer} />
      <Route path='activities' component={Drawer} />
      <Route path='plugins' component={Drawer} />
      <Route path='about' component={Drawer} />
      <Route path='remove' component={Drawer} />
      <Route path='explore' component={Explore} />
      <Route path='install' component={InstallView} />
      <Route path='settings' component={Settings} />
      <Route path='devices' component={Devices} />
      <Route path='login' component={Login} />
      <Route path='signup' component={Signup} />
      <Route path='i/:appName' component={AppLiveView} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
, document.getElementById('app'))
