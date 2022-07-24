import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import TaskDialogContent from "./task-dialog-content";
import { projectActions } from "../../store/project-slice";

const CreateTaskDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isNewTaskDialogOpen = useSelector(
    (state) => state.project.isNewTaskDialogOpen
  );
  const status = useSelector((state) => state.project.status);
  const project = useSelector((state) => state.project.project);
  const task = useSelector((state) => state.project.task);
  const priority = useSelector((state) => state.project.priority);
  const labels = useSelector((state) => state.project.labels);
  const startDate = useSelector((state) => state.project.startDate);
  const dueDate = useSelector((state) => state.project.dueDate);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const idToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const submitTaskHandler = async () => {
    setIsLoading(true);

    const startDateString = new Date(
      new Date(startDate).getTime() -
        new Date(startDate).getTimezoneOffset() * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const dueDateString = new Date(
      new Date(dueDate).getTime() -
        new Date(dueDate).getTimezoneOffset() * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const body = JSON.stringify({
      status: status,
      project: project,
      task: task,
      priority: priority,
      startDate: startDateString,
      dueDate: dueDateString,
      labels: labels,
    });

    // console.log(idToken);
    // console.log(body);

    const response = await fetch(
      `${process.env.apiGatewayUrl}/project/private`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: body,
      }
    );

    response
      .json()
      .then((data) => {
        setIsLoading(false);
        dispatch(projectActions.resetTask());
        dispatch(projectActions.closeNewTaskDialog());
        dispatch(projectActions.updateClosingState());
      })
      .catch((error) => {
        setIsLoading(false);
        alert(`Error: ${error}`);
      });
  };

  return (
    <Dialog
      onClose={() => dispatch(projectActions.closeNewTaskDialog())}
      open={isNewTaskDialogOpen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Create task</DialogTitle>
      <TaskDialogContent />
      <DialogActions>
        <Button
          variant="text"
          onClick={() => dispatch(projectActions.closeNewTaskDialog())}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submitTaskHandler}
          disabled={!isAuthenticated}
        >
          Create
        </Button>
      </DialogActions>
      {isLoading && <LinearProgress />}
    </Dialog>
  );
};

export default CreateTaskDialog;
