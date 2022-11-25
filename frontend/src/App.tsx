import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import { Outlet } from 'react-router-dom';
import socketService from './services/socketService';
import { backendApiUrl } from './constants';

function App() {

  const connectSocket = async () => {
    await socketService.connect(backendApiUrl).catch((err) => {
      console.log(err)
    });
  }

  useEffect(() => {
    connectSocket();
  }, [])


  return (
    <div className="App">
      <Header />

      <Outlet />
    </div>
  );
}

export default App;
