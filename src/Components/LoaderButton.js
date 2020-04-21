import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  const classes = useStyles();

  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {props.children}
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress}/>}
    </Button>
  );
}
