import { Fragment } from "react";
import Switch from "@mui/material/Switch";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function ThemeToggle() {
  const toggleModeHandler = () => {
    console.log('click');
  };

  return (
    <Fragment>
      <Brightness7Icon />
      <Switch defaultChecked onChange={toggleModeHandler} />
      <Brightness4Icon />
    </Fragment>
  );
};

export default ThemeToggle;