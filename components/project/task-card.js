import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { projectActions } from "../../store/project-slice";

const TaskCard = (props) => {
  const { id, status, project, task, priority, startDate, dueDate, labels } =
    props.task;
  const cardType = props.cardType;
  const router = useRouter();
  const dispatch = useDispatch();

  const openUpdateTaskDialogHandler = () => {
    // startDate and dueDate are given as 'YYYY-MM-DD' string from database
    // I need to convert them to JavaScript Date object in local time
    const timezoneOffset = new Date(startDate).getTimezoneOffset();
    const localStartDate = new Date(
      new Date(startDate).getTime() + timezoneOffset * 60 * 1000
    );
    const localDueDate = new Date(
      new Date(dueDate).getTime() + timezoneOffset * 60 * 1000
    );

    // Set selected task information to dialog
    dispatch(projectActions.setId({ id: id }));
    dispatch(projectActions.setStatus({ status: status }));
    dispatch(projectActions.setProject({ project: project }));
    dispatch(projectActions.setTask({ task: task }));
    dispatch(projectActions.setPriority({ priority: priority }));
    dispatch(
      projectActions.setStartDate({ startDate: localStartDate.toString() })
    );
    dispatch(projectActions.setDueDate({ dueDate: localDueDate.toString() }));
    dispatch(projectActions.setLabels({ labels: labels }));

    // Open update task dialog
    dispatch(projectActions.openUpdateTaskDialog());
  };

  const navigateToProjectPage = () => {
    router.push("/project");
  };

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardActionArea
        onClick={
          cardType === "project"
            ? openUpdateTaskDialogHandler
            : navigateToProjectPage
        }
      >
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
