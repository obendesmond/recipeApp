import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import RouteLink from "./RouteLink"
import RecipeBasicInfo from './RecipeComponents/RecipeBasicInfo';
import TagList from './RecipeComponents/TagList';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

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
  link: {
    textDecoration: 'none'
  }
}));

export default ({ recipe }) => {
  const classes = useStyles();

  return(
    <Card className={classes.card} raised>
      <CardActionArea>
        <RouteLink className={classes.link} to={`/Recipes/${recipe.recipeId}`}>
          <CardMedia
            className={classes.media}
            image={recipe.attachment ? recipe.attachment :RecipeDefault}
            title="Recipe Image"
          />
          <RecipeBasicInfo recipeData={recipe}/>
          <TagList recipeData={recipe}/>
        </RouteLink>
      </CardActionArea>
    </Card>
  );
}
