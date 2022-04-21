import { Fragment, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "aws-amplify";
// import Auth from "@aws-amplify/auth";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import Navigation from "./navigation";
import { authActions } from "../../store/auth-slice";
import { retrieveStoredAuthData } from "../../helper/auth-util";
import darkTheme from "../../styles/theme/darkTheme";
import lightTheme from "../../styles/theme/lightTheme";

function Layout(props) {
  const mode = useSelector((state) => state.mode.mode);
  const dispatch = useDispatch();

  const logoutHandler = useCallback(async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      dispatch(authActions.logout());
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }, [dispatch]);

  useEffect(() => {
    const tokenData = retrieveStoredAuthData();
    if (tokenData) {
      dispatch(authActions.login({ token: tokenData.token }));
      setTimeout(logoutHandler, tokenData.duration);
    }
  }, [dispatch, logoutHandler]);

  return (
    <Fragment>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Navigation />
          <main>{props.children}</main>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

export default Layout;
