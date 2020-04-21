import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import TabPanel from "./TabPanel";
import RecipeBasicInfo from './RecipeComponents/RecipeBasicInfo';
import TagList from './RecipeComponents/TagList';
import NewTag from './RecipeComponents/NewTag';
import IngredientList from './RecipeComponents/IngredientList';
import MethodList from './RecipeComponents/MethodList';
import UploadButton from './UploadButton';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import RecipeDefault from "../Res/Img/RecipeDefault.jpg";

const useStyles = makeStyles(theme=>({
  card:{
    maxWidth: theme.breakpoints.values.sm,
    margin: "9px auto"
  },
  content:{
    paddingTop: 0,
  },
  media: {
    height: theme.spacing(30),
    opacity: 0.5,
  },
  uploadBtn: {
    position: "absolute",
    zIndex: "1",
  }
}));


export default ({ isEditable, recipe, setRecipe, attachment, setAttachment, ...props }) =>{
  const classes = useStyles();

  const [tabValue, setTabValue] = useState(0);

  const handleFileChange = (event) => {
    event.persist();
    setAttachment(event.target.files[0]);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!attachment && recipe.attachment) {
    attachment = recipe.attachment
  }else if (attachment) {
    attachment = URL.createObjectURL(attachment);
  }

  return(
    <Card className={classes.card} raised>
      {isEditable &&
        <div className={classes.uploadBtn}>
          <UploadButton handleFileChange={handleFileChange}/>
        </div>
      }
      <CardMedia
        className={classes.media}
        image={attachment ? attachment :RecipeDefault}
        title="Recipe Image"
      />
      <RecipeBasicInfo editable={isEditable} setRecipeData={setRecipe} recipeData={recipe}/>
      <TagList editable={isEditable} setRecipeData={setRecipe} recipeData={recipe}/>
      <CardContent className={classes.content}>
      {isEditable&&
        <NewTag setRecipeData={setRecipe} recipeData={recipe}/>
      }
        <Tabs centered value={tabValue} onChange={handleTabChange} className={classes.tabs}>
          <Tab label="Ingredients"/>
          <Tab label="Method"/>
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <IngredientList editable={isEditable} setRecipeData={setRecipe} recipeData={recipe}/>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <MethodList editable={isEditable} setRecipeData={setRecipe} recipeData={recipe} />
        </TabPanel>

      </CardContent>
    </Card>
  );
}
