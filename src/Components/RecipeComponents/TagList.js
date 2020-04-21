import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme =>({
  tag: {
    margin: theme.spacing(0.2,0.2)
  },
}));

export default ({recipeData, setRecipeData, ...props}) => {
  const removeTag = i => {
    let recipeDeepCopy = {...recipeData};
    recipeDeepCopy["tags"].splice(i,1);
    setRecipeData(recipeDeepCopy);
  }
  return (
    props.editable
    ?<Removable
      tags={recipeData.tags}
      removeTag={removeTag}
    />
    :<Standard
      tags={recipeData.tags}
    />
  )
}

const Standard = ({tags}) => {
  const classes = useStyles();
  if(!tags){
    return;
  }
  return tags.map((tag,i) => (
    <Chip
      key={i}
      label={tag}
      className={classes.tag}
      color="secondary"
      variant="outlined"
    />
  ));
}

const Removable = ({tags, removeTag}) => {
  const classes = useStyles();
  if(!tags){
    return;
  }
  return tags.map((tag,i) => (
    <Chip
      key={i}
      label={tag}
      className={classes.tag}
      onDelete={()=>removeTag(i)}
      color="secondary"
      variant="outlined"
    />
  ));
}
