import { createSlice } from "@reduxjs/toolkit";
import { statuses, projects, priorities, labels } from "../helper/project-util";

const initialProjectState = {
  isNewTaskDialogOpen: false,
  isUpdateTaskDialogOpen: false,
  closing: false,
  status: statuses[0].value,
  project: projects[0].value,
  task: "",
  priority: priorities[1].value,
  startDate: (new Date()).toString(),
  dueDate: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toString(),
  labels: []
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    openNewTaskDialog(state) {
      state.isNewTaskDialogOpen = true;
    },
    closeNewTaskDialog(state) {
      state.isNewTaskDialogOpen = false;
    },
    openUpdateTaskDialog(state) {
      state.isUpdateTaskDialogOpen = true;
    },
    closeUpdateTaskDialog(state) {
      state.isUpdateTaskDialogOpen = false;
    },
    updateClosingState(state) {
      state.closing = !state.closing;
    },
    setStatus(state, action) {
      state.status = action.payload.status;
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