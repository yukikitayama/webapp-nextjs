import { Fragment } from "react";
import { useDispatch } from "react-redux";
import Switch from "@mui/material/Switch";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";

import { modeActions } from "../../store/mode-slice";

function ThemeToggle() {
  const dispatch = useDispatch();

  const toggleModeHandler = () => {
    dispatch(modeActions.toggleMode());
  };

  return (
    <Fragment>
      {/* <Brightness7Icon /> */}
      <Switch defaultChecked onChange={toggleModeHandler} />
      {/* <Brightness4Icon /> */}
    </Fragment>
  );
};

export default ThemeToggle;