import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import classes from "./article-card.module.css";

const ArticleCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug, title, date, image, excerpt, category, view, vote } =
    props.article;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const imagePath = `/images/article/${slug}/${image}`;
  const linkPath = `/article/${slug}`;

  const cardClickHandler = () => {
    setIsLoading(true);
  };

  return (
    <Fragment>
      <Link href={linkPath} passHref>
        <a>
          <Card onClick={cardClickHandler}>
            {/* <CardMedia
              component="img"
              height="150"
              image={imagePath}
              alt="Image"
            /> */}
            <CardMedia>
              <div className={classes.imageContainer}>
                <Image
                  src={imagePath}
                  alt="Image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </CardMedia>
            <CardContent>
              <Typography variant="h5" component="div">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {excerpt}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                pt={1}
                align="inherit"
              >
                {`${category} | ${date} | ${view} views | ${vote} votes`}
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small" color="inherit">
                Read More
              </Button>
            </CardActions> */}
            {isLoading && <LinearProgress />}
          </Card>
        </a>
      </Link>
    </Fragment>
  );
};

export default ArticleCard;
