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
  const isNewTaskDialogOpen = useSelector((state) => state.project.isNewTaskDialogOpen);
  const status = useSelector((state) => state.project.status);
  const project = useSelector((state) => state.project.project);
  const task = useSelector((state) => state.project.task);
  const priority = useSelector((state) => state.project.priority);
  const labels = useSelector((state) => state.project.labels);
  const startDate = useSelector((state) => state.project.startDate);
  const dueDate = useSelector((state) => state.project.dueDate);
  const dispatch = useDispatch();

  const submitTaskHandler = () => {
    setIsLoading(true);

    console.log(status);
    console.log(project);
    console.log(task);
    console.log(priority);
    console.log(labels)
    console.log(startDate);
    console.log(dueDate);

    setIsLoading(false);
  };

  return (
    <Dialog onClose={() => dispatch(projectActions.closeNewTaskDialog())} open={isNewTaskDialogOpen} fullWidth maxWidth="md">
      <DialogTitle>Create task</DialogTitle>
      <TaskDialogContent />
      <DialogActions>
        <Button variant="text" onClick={() => dispatch(projectActions.closeNewTaskDialog())}>Cancel</Button>
        <Button variant="contained" onClick={submitTaskHandler}>Create</Button>
      </DialogActions>
      {isLoading && <LinearProgress />}
    </Dialog>
  );
};

export default CreateTaskDialog;
