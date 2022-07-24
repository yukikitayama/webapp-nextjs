import { createSlice } from "@reduxjs/toolkit";
import { statuses, projects, priorities, labels } from "../helper/project-util";

const initialProjectState = {
  isNewTaskDialogOpen: false,
  isUpdateTaskDialogOpen: false,
  closing: false,
  id: "",
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
    setId(state, action) {
      state.id = action.payload.id;
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
    },
    resetTask(state) {
      state.id = "";
      state.status = statuses[0].value;
      state.project = projects[0].value;
      state.task = "";
      state.priority = priorities[1].value;
      state.startDate = (new Date()).toString();
      state.dueDate = (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toString();
      state.labels = [];
    }
  }
});

export const projectActions = projectSlice.actions;

export default projectSlice.reducer;