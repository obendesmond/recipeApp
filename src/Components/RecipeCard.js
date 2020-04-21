import React from "react";
import ExpandedRecipeCard from './ExpandedRecipeCard';
import CollapsedRecipeCard from './CollapsedRecipeCard';

export default function RecipeCard({recipe, setRecipe, attachment, setAttachment, ...props}){
  const isEditable=props.editable;
  return (props.expanded
    ?<ExpandedRecipeCard
      isEditable={isEditable}
      recipe={recipe}
      setRecipe={setRecipe}
      attachment={attachment}
      setAttachment={setAttachment}
    />
    :<CollapsedRecipeCard
      recipe={recipe}
    />
  );
}
