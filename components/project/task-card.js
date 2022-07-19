import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const TaskCard = (props) => {
  const { task, dueDate, priority} = props.task;

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="subtitle1" component="div">
            {task}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dueDate}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {priority}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TaskCard;