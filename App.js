import React, { useState } from 'react';
import Data from './components/data';
import Header from './components/header';
import Sidebar from './components/sidebar';
import { auth, provider } from './firebase';
import styled from 'styled-components';


const LoginWrapper = styled.div`
  background-color: lightgray;
  padding: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  margin-top: 100px;

  img {
    width: 100px;
  }

  button {
    width: 100%;
    background-color: darkmagenta;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 16px;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
`;

const AppContainer = styled.div`
  display: flex;
`;

function App() {
  const [user, setUser] = useState(null);

  const signIn = () => {
    auth.signInWithPopup(provider)
      .then(({ user }) => setUser(user))
      .catch(err => alert(err.message));
  };

  return (
    <>
      {user ? (
        <>
          <Header photoUrl={user.photoURL} />
          <AppContainer>
            <Sidebar />
            <Data />
          </AppContainer>
        </>
      ) : (
        <LoginWrapper>
          <img src="https://th.bing.com/th/id/OIP.lgdmCc6UHAWc27h0o4tSbwHaHa?rs=1&pid=ImgDetMain" alt="Google Drive" />
          <button onClick={signIn}>Login To Google Drive</button>
        </LoginWrapper>
      )}
    </>
  );
}

export default App;
