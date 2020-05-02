import { API } from "aws-amplify";
import recipes from '../Data/recipes.json';
import ingredients from '../Data/ingredients.json';
import menuData from '../Data/menu.json';


// function to get all recipes
export const getRecipeList = () => {
  return recipes;

  // backend code to get all recipes from db
}

// function to gett all ingredients from db
export const getAllIngredients = () => {
  return ingredients;

  // backend code to get all recipes from db
}

// function to add recipe
export const addRecipe = (recipe) => {
  // backend code to add recipe 
}

// function to update a recipe
export const updateRecipe = (recipe) => {
  // backend api code to add recipe
}

// function to update incredient
export const updateIngredient = (oldIngredient, newIngredient) => {
  // backend api code to update recipe
}

// function to handle incredient deleting
export const deleteIngredient = (ingredient) => {
  // backend api code to delete ingredient
}


// function to handle save to pantry
export const saveToPantry = (ingredient, recipeList, setRecipeList) => {
  // backend api code to save to pantry
}



// export default get all menus
export const getMenuList = () => {
  return menuData;
  // api code to get menu data
}