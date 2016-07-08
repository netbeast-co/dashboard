import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import NotFound from './not-found.jsx'

import { Navigation } from './navigation.jsx'
import Notifications from './notifications'
import Drawer from './apps/drawer.jsx'
import AppLiveView from './apps/live.jsx'
import InstallView from './apps/install.jsx'
import Explore from './apps/explore.jsx'
import { Devices } from './devices/index.jsx'
import History from './history/index.jsx'
import FeedbackPod from './misc/feedback-pod.jsx'
import ConnectionPod from './misc/connection-pod.jsx'
import Login from './user/login.jsx'
import Signup from './user/signup.jsx'
import Settings from './user/settings.jsx'

import { Auth } from './lib'

export default class Dashboard extends React.Component {
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
    const { nav, main } = this.props
    let { path } = this.state
    path = path.indexOf('live') > -1 ? '-live' : path

    return (
      <div id='dashboard' className={`path${path}`}>
        <FeedbackPod />
        <ConnectionPod />
        <Notifications />
        <div style={{ width: '100%', height: 70 }}>
          {nav || <Navigation />}
        </div>
        <main>
          {main || this.props.children}
        </main>
      </div>
    )
  }
}

Dashboard.propTypes = {
  children: React.PropTypes.element
}

const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
window.mqttUri = protocol + window.location.host

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Dashboard}>
      <IndexRoute component={Drawer} />
      <Route path='activities' component={Drawer} />
      <Route path='plugins' component={Drawer} />
      <Route path='about' component={Drawer} />
      <Route path='remove' component={Drawer} />
      <Route path='explore' component={Explore} >
        <Route path=':filter' component={Explore} />
      </Route>
      <Route path='install' component={InstallView} />
      <Route path='history' component={History} />
      <Route path='network' components={Devices} />
      <Route path='login' component={Login} />
      <Route path='settings' onEnter={Auth.isLogged} component={Settings} />
      <Route path='signup' component={Signup} />
      <Route path='live/:appName' component={AppLiveView} />
      <Route path='live/:appName/:path' component={AppLiveView} />
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
, document.getElementById('render-target'))
