import { Fragment, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";

import LoginForm from "../../components/login/login-form";
import { produceLogToKafka } from "../../helper/kafka-util";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    produceLogToKafka(router.pathname);
  }, [router.pathname]);

  return (
    <Fragment>
      <Head>
        <title>Login Yuki&apos;s Web App</title>
        <meta
          name="description"
          content="Login the web app to update expense data."
        />
      </Head>
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
    </Fragment>
  );
};

export default LoginPage;
