import { createSlice } from "reduxjs/toolkit";
import { statuses, projects, priorities, labels } from "../helper/project-util";

const initialProjectState = {
  isDialogOpen: false,
  closing: false,
  status: statuses[0].value,
  project: projects[0].value,
  task: "",
  priority: priorities[1].value,
  startDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  labels: []
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    openTaskDialog(state) {
      state.isDialogOpen = true;
    },
    closeTaskDialog(state) {
      state.isDialogOpen = false;
    },
    updateClosingState(state) {
      state.closing = !state.closing;
    },
    setStatus(state, action) {
      state.status = action.pyaload.status;
    },
    setProject(state, action) {
      state.project = action.payload.project;
    },
    setTask(state, action) {
      state.task = action.payload.task;
    },
    setPriority(state, action) {
      state.priority = action.payload.priority;
    },
    setStartDate(state, action) {
      state.startDate = action.payload.startDate;
    },
    setDueDate(state, action) {
      state.dueDate = action.payload.dueDate;
    },
    setLabels(state, action) {
      state.labels = action.payload.labels;
    }
  }
});

export const projectActions = projectSlice.actions;

export default projectSlice.reducer;