import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme =>({
  tagInput: {
    width: "100%",
    padding: theme.spacing(0.5),
  },
}));

export default ({recipeData, setRecipeData, ...props}) => {
  const classes = useStyles();

  const addTag = (e) => {
    e.persist();
    if (e.key === "Enter" && e.target.value !== "") {
      let recipeDeepCopy = {...recipeData};
      recipeDeepCopy["tags"].push(e.target.value);
      setRecipeData(recipeDeepCopy);
      e.target.value = "";
    }
  }

  return (
    <TextField
      variant="outlined"
      size="small"
      className={classes.tagInput}
      onKeyUp={addTag}
      name="newTag"
      placeholder="press enter to add tag"
    />
  )
}
