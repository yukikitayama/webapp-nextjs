import Image from "next/image";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typewriter from "typewriter-effect";

import classes from "./hero.module.css";

function Hero() {
  const message = "Hi, I'm Yuki! Welcome to my web app. This app has technical articles on statistics and computer science. It also monitors my expense and fitness. Enjoy!";

  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/github_profile_picture.png"
          alt="An image showing Yuki"
          width={250}
          height={250}
        />
      </div>
      <Grid container justifyContent="center" alignItems="center">
        {/* <Grid item sx={{ width: { xs: "100%", md: "50%" } }}>
          <div className={classes.windowOutside}>
            <div className={classes.window}>
              <p>
                Hi, I&apos;m Yuki! Welcome to my web app. This app has technical
                articles on statistics and computer science, and monitors my
                expense and fitness. Enjoy!
              </p>
            </div>
          </div>
        </Grid> */}
        <Grid item sx={{ width: { xs: "100%", md: "50%" } }} pb={2}>
          <div className={classes.windowOutside} >
            <Box className={classes.window} sx={{ minHeight: { xs: "150px", md: "100px" } }}>
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(message)
                      // millisecond pause duration after the string is typed
                      .pauseFor(3000)
                      .deleteAll()
                      .start();
                  }}
                  options={{ cursor: "", loop: true }}
                />
            </Box>
          </div>
        </Grid>
      </Grid>

      <div className={classes.links}>
        <Link
          href="https://www.linkedin.com/in/yukikitayama/"
          target="_blank"
          color="inherit"
          p={0.5}
        >
          <LinkedInIcon fontSize="large" />
        </Link>
        <Link
          href="https://github.com/yukikitayama"
          target="_blank"
          color="inherit"
          p={0.5}
        >
          <GitHubIcon fontSize="large" />
        </Link>
        <Link
          href="https://www.facebook.com/yuki.kitayama"
          target="_blank"
          color="inherit"
          p={0.5}
        >
          <FacebookIcon fontSize="large" />
        </Link>
        <Link
          href="https://twitter.com/YukiKitayama1"
          target="_blank"
          color="inherit"
          p={0.5}
        >
          <TwitterIcon fontSize="large" />
        </Link>
      </div>
    </section>
  );
}

export default Hero;
