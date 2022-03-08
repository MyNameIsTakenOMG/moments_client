import React from 'react';
import './App.css';
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'

import {Switch,Route} from 'react-router-dom'
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ResetPage from './pages/ResetPage'

const store = configureStore()

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Switch>
          <Route exact path='/reset/:token'>
            <ResetPage />
          </Route>
          <Route exact path='/login'>
              <LoginPage />
            </Route>
          <Route  path='/'>
            <MainPage />
          </Route>
        </Switch>
      </Provider>
    </div>
  );
}

export default App;
