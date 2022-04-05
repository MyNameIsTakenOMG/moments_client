import React, { useEffect, useRef } from 'react';
import './App.css';
// import {Provider} from 'react-redux'
// import configureStore from './store/configureStore'
import {BrowserRouter} from 'react-router-dom'

import {Switch,Route, Redirect} from 'react-router-dom'
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ResetPage from './pages/ResetPage'

// const store = configureStore()

import useLoadAuth from './hooks/useLoadAuth';
import { useSelector } from 'react-redux';
import { getUserInfo } from './store/user';

function App() {

  const {isAuthLoaded} = useLoadAuth()
  const userInfo = useSelector(getUserInfo) //------> cause  page re-render??? maybe store it in ref(userRef)

  // const username = useRef(userInfo.name)
  
  // useEffect(()=>{
  //   username.current = userInfo.name
  // },[userInfo.name])


  return (
    <div className="App">
      {/* <Provider store={store}> */}
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
      {/* </Provider> */}
    </div>
  );
}

export default App;
