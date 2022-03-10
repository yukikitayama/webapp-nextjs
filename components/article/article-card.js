import { Fragment } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";

const ArticleCard = () => {
  return (
    <Fragment>
      <Card>
        <CardMedia
          component="img"
          height="150"
          image="/images/article/security.jpg"
          alt="Image"
        />
        <CardContent>
          <Typography variant="h5" component="div">
            TITLE
          </Typography>
          <Typography variant="body2" color="text.secondary">
            EXCERPT
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Read More</Button>
        </CardActions>
      </Card>
    </Fragment>
  );
};

export default ArticleCard;
