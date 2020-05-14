import { API } from "aws-amplify";
import recipes from '../Data/recipes.json';
import ingredients from '../Data/ingredients.json';
import menuData from '../Data/menu.json';
import { appointmentData } from '../Data/data';


// function to get all recipes
export const getRecipeList = () => {
  return recipes;

  // backend code to get all recipes from db
}

// function to gett all ingredients from db
export const getAllIngredients = (gotten) => {
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

// **********************************************
const colors = ['#cb6bb2','#56ca85','#1e90ff']
const recipesToBeModified = getRecipeList();
const processRecipes = () => {
  for (let i = 0; i < recipes.length; i++) {
    recipes[i].id = recipes[i].recipeId;
    recipes[i].text = recipes[i].title;
    recipes[i].color = colors[Math.floor(Math.random() * Math.floor(3))]
  }
  return recipesToBeModified;
}

// return modified recipesData for appointment management
export const recipesData = processRecipes();
// data here represents appointments like appointmentData
export const data =  appointmentData;
export const priorityData = [
  {
    text: 'Break Fast',
    id: 1,
    color: '#1e90ff'
  }, {
    text: 'Launch',
    id: 2,
    color: '#ff9747'
  },
  {
      text:'Supper',
      id:3,
      color:'#1e90ff'
  }
];
// ***********************************************