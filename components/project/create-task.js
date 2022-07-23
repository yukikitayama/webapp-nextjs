import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";

import { projectActions } from "../../store/project-slice";

const CreateTask = () => {
  const dispatch = useDispatch();

  const openTaskDialogHandler = () => {
    dispatch(projectActions.openNewTaskDialog());
  };

  return (
    <Button
      variant="contained"
      sx={{ width: { xs: "100%", md: "20%" } }}
      onClick={openTaskDialogHandler}
    >
      Create
    </Button>
  );
};

export default CreateTask;
