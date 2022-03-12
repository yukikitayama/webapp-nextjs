import { Fragment, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";

const ArticleCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug, title, date, image, excerpt, category, view, vote } = props.article;

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
            <CardMedia
              component="img"
              height="150"
              image={imagePath}
              alt="Image"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {excerpt}
              </Typography>
              <Typography variant="body2" color="text.secondary" pt={1} align="inherit">
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
