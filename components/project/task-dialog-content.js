import { useSelector, useDispatch } from "react-redux";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";

import {
  statuses,
  projects,
  priorities,
  labels as labelsToChoose,
} from "../../helper/project-util";
import { projectActions } from "../../store/project-slice";

const TaskDialogContent = () => {
  const status = useSelector((state) => state.project.status);
  const project = useSelector((state) => state.project.project);
  const task = useSelector((state) => state.project.task);
  const priority = useSelector((state) => state.project.priority);
  const labels = useSelector((state) => state.project.labels);
  const startDate = new Date(useSelector((state) => state.project.startDate));
  const dueDate = new Date(useSelector((state) => state.project.dueDate));
  const dispatch = useDispatch();

  const handleStatusChange = (event) => {
    dispatch(projectActions.setStatus({ status: event.target.value }));
  };

  const handleProjectChange = (event) => {
    dispatch(projectActions.setProject({ project: event.target.value }));
  };

  const handleTaskChange = (event) => {
    dispatch(projectActions.setTask({ task: event.target.value }));
  };

  const handlePriorityChange = (event) => {
    dispatch(projectActions.setPriority({ priority: event.target.value }));
  };

  const handleLabelChange = (event) => {
    const {
      target: { value },
    } = event;
    const labelsToSet = typeof value === "string" ? value.split(",") : value;
    dispatch(projectActions.setLabels({ labels: labelsToSet }));
  };

  return (
    <DialogContent>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={handleStatusChange}>
            {statuses.map((element) => (
              <MenuItem key={element.value} value={element.value}>
                {element.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item>
          <InputLabel>Project</InputLabel>
          <Select value={project} onChange={handleProjectChange}>
            {projects.map((project) => (
              <MenuItem key={project.value} value={project.value}>
                {project.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item>
          <TextField
            margin="dense"
            label="Task"
            type="text"
            fullWidth
            multiline
            variant="standard"
            value={task}
            onChange={handleTaskChange}
          />
        </Grid>

        <Grid item>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={handlePriorityChange}>
            {priorities.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                {priority.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Start date"
              value={startDate}
              onChange={(newValue) => {
                dispatch(projectActions.setStartDate(newValue.toString()));
              }}
              renderInput={(params) => <TextField {...params} />}
            ></DesktopDatePicker>
          </LocalizationProvider>
        </Grid>

        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Due date"
              value={dueDate}
              onChange={(newValue) => {
                dispatch(projectActions.setDueDate(newValue.toString()));
              }}
              renderInput={(params) => <TextField {...params} />}
            ></DesktopDatePicker>
          </LocalizationProvider>
        </Grid>

        <Grid item>
          <InputLabel>Labels</InputLabel>
          <Select
            multiple
            fullWidth
            value={labels}
            onChange={handleLabelChange}
            input={<OutlinedInput label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {labelsToChoose.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default TaskDialogContent;
