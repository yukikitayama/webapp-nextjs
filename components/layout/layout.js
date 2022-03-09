import { Fragment } from "react";
import { Container } from "@mui/material";

import Navigation from "./navigation";

function Layout(props) {
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
