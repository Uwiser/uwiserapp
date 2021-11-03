import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import CallsScreen from './screens/CallsScreen'
import InterpretersScreen from './screens/InterpretersScreen'
import UsersScreen from './screens/UsersScreen'
import AdminsScreen from './screens/AdminsScreen'
import EnabledScreen from './screens/EnabledScreen'
import './App.css'

const routes = [
  {
    path: '/',
    component: LoginScreen
  },
  {
    path: '/Dashboard',
    component: DashboardScreen
  },
  {
    path: '/Calls',
    component: CallsScreen
  },
  {
    path: '/Interpreters',
    component: InterpretersScreen
  },
  {
    path: '/Users',
    component: UsersScreen
  },
  {
    path: '/Admins',
    component: AdminsScreen
  },
  {
    path: '/Enabled/:id',
    component: EnabledScreen
  },
];

export default function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          {routes.map((route) => (
            <Route
              exact
              key={route.path}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    </Router>
  );
}