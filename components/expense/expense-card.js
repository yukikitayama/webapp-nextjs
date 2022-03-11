import { Fragment } from 'react';
import { Card, CardHeader, CardContent, CardActionArea } from '@mui/material';

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