import { Fragment } from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";

import classes from './architecture.module.css';

export default function Architecture() {
  return (
    <Fragment>
      <Typography variant="h2" component="div" align="center">
        Architecture
      </Typography>
      <div className={classes.architecture}>
        <Image
          src="/images/site/website_architecture.png"
          alt="An image showing website architecture diagram"
          layout="responsive"
          // width={960}
          width={3376}
          // height={540}
          height={2398}
          priority={true}
        />
      </div>
    </Fragment>
  );
}
