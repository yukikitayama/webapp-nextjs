import { Grid } from "@mui/material";

import LoginForm from "../../components/login/login-form";

const LoginPage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt={2}
      pb={10}
    >
      <Grid item sx={{ width: { xs: "100%", md: "70%" } }}>
        <LoginForm />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
