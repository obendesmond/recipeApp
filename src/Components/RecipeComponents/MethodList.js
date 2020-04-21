import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme =>({
  methodList: {
    display: "flex",
    flexDirection: "column",
    padding: 0,
    maxWidth: "500px",
    margin: "auto",
  },
  methodStep: {
    borderBottom: `2px dotted ${theme.palette.secondary.main}`,
    display: "flex",
    justifyContent: "space-between",
  },
  methodText: {
    width: "100%"
  },
  deleteBtn: {
    padding: "0px",
    width: ".5rem",
    background: "none",
    border: 0
  },
}));

export default ({recipeData, setRecipeData, ...props}) => {
  const classes=useStyles();

  const isDisabled=!props.editable;

  const changeMethod = (e,i) => {
    let x = [...recipeData.instructions];
    x[i] = e.target.value;
    let y = {...recipeData}
    y.instructions = x;
    setRecipeData(y);
  }

  const removeLine = (e,i) => {
    let y = {...recipeData};
    y.instructions.splice(i,1);
    setRecipeData(y);
  }

  const newLine = e => {
    let x = [...recipeData.instructions];
    x.push("")
    let y = {...recipeData}
    y.instructions = x;
    setRecipeData(y);
  }

  const steps = recipeData.instructions.map((step,i)=>(
    <div
      className={classes.methodStep}
      key={['step', i].join('_')}
    >
      <InputBase
        disabled={isDisabled}
        multiline
        onChange={(e)=>changeMethod(e,i)}
        value={step}
        className={classes.methodText}
        placeholder="Step"
      />
      {!isDisabled&&
        <button className={classes.deleteBtn} onClick={(e)=>removeLine(e,i)}>
          x
        </button>
      }
    </div>
  ));
  return(
    <ul className={classes.methodList}>
      {steps}
      {!isDisabled&&
        <Button onClick={newLine}>
          New Line
        </Button>}
    </ul>
  );
}
