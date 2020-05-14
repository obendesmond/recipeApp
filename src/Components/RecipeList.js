import React from "react";

import MasonryGrid from "../Components/MasonryGrid";
import RecipeCard from "../Components/RecipeCard";
import Grid from '@material-ui/core/Grid';

const RecipeList = ({ recipeList, appProps }) => {

  if(!recipeList)return null;

  return(
    // <MasonryGrid>
    <Grid container spacing={3}>
      {recipeList.map((recipe) => (
        <Grid item md={4} sm={12} key={recipe.recipeId}>
          <RecipeCard  recipe={recipe} appProps={appProps}/>
        </Grid>
      )
      )}
    </Grid>
    // </MasonryGrid>
  );
}

export default RecipeList;
