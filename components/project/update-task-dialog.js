import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import TaskDialogContent from "./task-dialog-content";
import { projectActions } from "../../store/project-slice";
import { timestampStringToDateString } from "../../helper/project-util";

const UpdateTaskDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isUpdateTaskDialogOpen = useSelector(
    (state) => state.project.isUpdateTaskDialogOpen
  );
  const id = useSelector((state) => state.project.id);
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

  const updateTaskHandler = async () => {
    setIsLoading(true);

    const startDateString = timestampStringToDateString(startDate);
    const dueDateString = timestampStringToDateString(dueDate);
    const body = JSON.stringify({
      id: id,
      status: status,
      project: project,
      task: task,
      priority: priority,
      startDate: startDateString,
      dueDate: dueDateString,
      labels: labels,
    });

    // console.log(body);

    const response = await fetch(
      `${process.env.apiGatewayUrl}/project/private`,
      {
        method: "PUT",
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
        dispatch(projectActions.closeUpdateTaskDialog());
        dispatch(projectActions.updateClosingState());
      })
      .catch((error) => {
        setIsLoading(true);
        alert(`Error: ${error}`);
      });
  };

  const archiveTaskHandler = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${process.env.apiGatewayUrl}/project/private`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    setIsLoading(false);

    if (response.ok) {
      dispatch(projectActions.resetTask());
      dispatch(projectActions.closeUpdateTaskDialog());
      dispatch(projectActions.updateClosingState());
    }
  };

  const deleteTaskHandler = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${process.env.apiGatewayUrl}/project/private`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    setIsLoading(false);

    if (response.ok) {
      dispatch(projectActions.resetTask());
      dispatch(projectActions.closeUpdateTaskDialog());
      dispatch(projectActions.updateClosingState());
    }
  };

  return (
    <Dialog
      onClose={() => dispatch(projectActions.closeUpdateTaskDialog())}
      open={isUpdateTaskDialogOpen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Update task</DialogTitle>
      <TaskDialogContent />
      <DialogActions>
        <Button
          variant="text"
          onClick={() => dispatch(projectActions.closeUpdateTaskDialog())}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={updateTaskHandler}
          disabled={!isAuthenticated}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={archiveTaskHandler}
          disabled={!isAuthenticated}
        >
          Archive
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteTaskHandler}
          disabled={!isAuthenticated}
        >
          Delete
        </Button>
      </DialogActions>
      {isLoading && <LinearProgress />}
    </Dialog>
  );
};

export default UpdateTaskDialog;
