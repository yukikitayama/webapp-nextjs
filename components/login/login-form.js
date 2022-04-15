import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Auth } from "aws-amplify";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import { authActions } from "../../store/auth-slice";
import { calculateRemainingTime } from "../../helper/auth-util";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  // Used to set auto-logout timer
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

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const signInResponse = await Auth.signIn(email, password);

      // console.log(signInResponse);

      // Only first time
      // if (signInResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
      //   const response = await Auth.completeNewPassword(
      //     signInResponse,
      //     'NEW_PASSWORD' // Replace it with the new password
      //   );
      //   console.log('Completed the new password because new password was required')
      // }

      const idToken = signInResponse.signInUserSession.idToken;
      const jwtToken = idToken.jwtToken;

      // Type: number, unit: second, meaning: Datetime when the ID expires
      // By default, expires in 1 hour
      const exp = idToken.payload.exp;
      const expirationTime = new Date(exp * 1000);

      // Update state
      localStorage.setItem("token", jwtToken);
      // toISOString() return UTC datetime string
      localStorage.setItem("expirationTime", expirationTime.toISOString());
      dispatch(authActions.login({ token: jwtToken }));

      const remainingTime = calculateRemainingTime(expirationTime);

      // Set auto logout timer
      setTimeout(logoutHandler, remainingTime);

      // After successful login, programmatically navigate to expense page
      setIsLoading(false);
      router.push("/expense");
    } catch (error) {
      setIsLoading(false);
      alert(`error signing in: ${error}`);
    }
  };

  return (
    <form onSubmit={formSubmissionHandler}>
      <Card>
        <CardHeader title="Login" />
        <CardContent>
          <Stack spacing={1}>
            <TextField
              label="Email"
              variant="outlined"
              required
              helperText="Required"
              onChange={emailChangeHandler}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              required
              helperText="Required"
              onChange={passwordChangeHandler}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ m: 1 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: { xs: "100%", md: "30%" } }}
          >
            Login
          </Button>
        </CardActions>
        {isLoading && <LinearProgress color="secondary" />}
      </Card>
    </form>
  );
}
