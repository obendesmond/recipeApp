import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles"

import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme=> ({
  root: {
    margin: theme.spacing(0.8,1),
  },
  input: {
    width: "100%",
    padding: theme.spacing(0.5),
  },
  tagsContainer: {
    padding: "5px"
  },
  tag: {
    margin: theme.spacing(0,0.2)
  }
}));

export default function Tags({tags, ...props}){
  const classes=useStyles();

  const [newTag, setNewTag] = useState("");

  const handleKeyUp = e => {
    if (e.key === "Enter" && newTag !== "") {
      props.addTag(newTag);
      setNewTag("");
    };
  };

  const TagList = () => {
    if(!tags){
      return;
    }
    return tags.map((tag,i) => (
      <Chip
        key={i}
        label={tag}
        className={classes.tag}
        onDelete={()=>props.removeTag(i)}
        color="secondary"
        variant="outlined"
      />
    ));
  }

  return(
    <div className={classes.root}>
      <div className={classes.tagsContainer}>
        <TagList />
      </div>
      <TextField
        variant="outlined"
        size="small"
        className={classes.input}
        onChange={(e)=>setNewTag(e.target.value)}
        onKeyUp={handleKeyUp}
        name="newTag"
        value={newTag}
        placeholder="press enter to add tag"
      />
    </div>
  );
};
