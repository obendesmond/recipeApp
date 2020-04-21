import React from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1
  }
}));

export default ({handleClick, fabs, value}) => {
  const classes = useStyles();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return(
    <React.Fragment>
    {fabs.map((fab, index) => (
      <Zoom
        key={index}
        in={value === index}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <Fab onClick={handleClick} aria-label={fab.label} className={classes.fab} color={fab.color}>
          {fab.icon}
        </Fab>
      </Zoom>
    ))}
    </React.Fragment>
  );
}
