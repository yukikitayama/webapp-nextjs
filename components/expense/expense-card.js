import { Fragment } from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";

const ExpenseCard = (props) => {
  return <Fragment>
    <Card elevation={4}>
      <CardActionArea>
        {props.title && <CardHeader title={props.title} titleTypographyProps={{ variant: 'h2' }}/>}
        <CardContent>
          {props.content}
        </CardContent>
      </CardActionArea>
    </Card>
  </Fragment>
};

export default ExpenseCard;