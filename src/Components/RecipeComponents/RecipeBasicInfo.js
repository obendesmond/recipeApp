import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import TimerIcon from '@material-ui/icons/Timer';

const useStyles = makeStyles(theme =>({
  root: {
    textTransform: "capitalize",
    display: "grid",
    gridTemplateColumns: "1fr 85px 75px",
    width: "100%",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  input: {
    margin: "0 6px",
    padding: "4px 0",
    color: theme.palette.primary.contrastText
  },
  iconInputContainer:{
    display: "flex",
    alignItems:"center",
  },
}));

export default ({recipeData, setRecipeData, ...props}) => {
  const classes = useStyles();

  const isDisabled=!props.editable;

  const handleChange = (e) => {
    setRecipeData({
      ...recipeData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={classes.root}>
      <InputBase
        disabled={isDisabled}
        className={classes.input}
        onChange={handleChange}
        name="title"
        value={recipeData.title}
        placeholder="Name"
      />
      <div className={classes.iconInputContainer}>
        <LocalDiningIcon fontSize="small" color="secondary"/>
        <InputBase
          disabled={isDisabled}
          className={classes.input}
          onChange={handleChange}
          name="servings"
          value={recipeData.servings}
          placeholder="Serves"
        />
      </div>
      <div className={classes.iconInputContainer}>
        <TimerIcon fontSize="small" color="secondary"/>
        <InputBase
          disabled={isDisabled}
          className={classes.input}
          onChange={handleChange}
          name="cookTime"
          value={recipeData.cookTime}
          placeholder="Time"
        />
      </div>
    </div>
  )
};
