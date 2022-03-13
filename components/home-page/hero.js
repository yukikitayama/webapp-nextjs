import Image from "next/image";
import { Link } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

import classes from "./hero.module.css";

function Hero() {
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
      <h1>Hi, I&apos;m Yuki!</h1>
      <p>Welcome to my web app.</p>
      <p>Click the hamburger shape or toolbar at the top and enjoy applications.</p>
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
    </section>
  );
}

export default Hero;
