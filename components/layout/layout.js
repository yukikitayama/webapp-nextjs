import { Fragment, useEffect, useCallback } from "react";
import { useDispatch } from 'react-redux';
import { Auth } from 'aws-amplify';
import { Container } from "@mui/material";

import Navigation from "./navigation";
import { authActions } from '../../store/auth-slice';
import { retrieveStoredAuthData } from '../../helper/auth-util';

function Layout(props) {
  const dispatch = useDispatch();

  const logoutHandler = useCallback(async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      dispatch(authActions.logout());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const tokenData = retrieveStoredAuthData();
    if (tokenData) {
      dispatch(authActions.login({token: tokenData.token}));
      setTimeout(logoutHandler, tokenData.duration);
    }
  }, [dispatch, logoutHandler]);

  return (
    <Fragment>
      <Container maxWidth="lg">
        <Navigation />
        <main>{props.children}</main>
      </Container>
    </Fragment>
  );
}

export default Layout;
