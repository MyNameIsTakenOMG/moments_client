import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom'

import {Switch,Route, Redirect} from 'react-router-dom'
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ResetPage from './pages/ResetPage'

import {GoogleOAuthProvider} from '@react-oauth/google'

import useLoadAuth from './hooks/useLoadAuth';
import { useSelector } from 'react-redux';
import { getUserInfo } from './store/user';

function App() {

  const {isAuthLoaded} = useLoadAuth()
  const userInfo = useSelector(getUserInfo) 


  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {isAuthLoaded && (
        <BrowserRouter>
          <Switch>
            <Route exact path='/reset/:token'>
              {userInfo.name?<Redirect to={'/home'}/>:<ResetPage/>}
              {/* <ResetPage /> */}
            </Route>
            <Route exact path='/login'>
              {userInfo.name?<Redirect to={'/home'}/>:<LoginPage />}
                {/* <LoginPage /> */}
            </Route>
            <Route  path='/'>
              {userInfo.name?<MainPage />:<Redirect to={'/login'}/>}
              {/* <MainPage /> */}
            </Route>
          </Switch>
        </BrowserRouter>
      )}
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
