import React from "react";

import MasonryGrid from "../Components/MasonryGrid";
import RecipeCard from "../Components/RecipeCard";

const RecipeList = ({ recipeList, appProps }) => {

  if(!recipeList)return null;

  return(
    <MasonryGrid>
      {recipeList.map((recipe) =>
        <RecipeCard key={recipe.recipeId} recipe={recipe} appProps={appProps}/>
      )}
    </MasonryGrid>
  );
}

export default RecipeList;
