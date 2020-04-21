import React, {useState} from "react";
import { Auth } from "aws-amplify";
import { withRouter, useHistory } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Theme from "./Theme";
import uid from 'uid';

import { 
  getRecipeList,
  addRecipe, 
  updateRecipe, 
  updateIngredient, 
  deleteIngredient,
  saveToPantry
} from '../Libs/ApiLib';

import Routes from "../Libs/Routes";

const App = () => {
  let history = useHistory()
  // App State
  const [isAuthenticated, userHasAuthenticated] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const [currUserInfo, setCurrUserInfo] = useState(null);
  const [recipeList, setRecipeList] = useState(null);

  React.useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    // set recipes
    setRecipeList(getRecipeList());
    
    try {
      setCurrUser(await Auth.currentSession());
      setCurrUserInfo(await Auth.currentUserInfo());
      userHasAuthenticated(true);
    }
    catch(e) {
      console.log(e);
      if (e !== 'No current user') {
        if (e.message){
          alert(e.message)
        }else{
          alert(e);
        }
      }
    }

    setIsAuthenticating(false);
  }

  // function to add recipe
  const handleAddRecipe = (recipe) => {
      // uid generates a random id
      recipe.recipeId = uid();
      recipeList.push(recipe)
      setRecipeList(recipeList);
      history.push(`/Recipes/${recipe.recipeId}`);
      // addRecipe(recipe) from api backend 
  }

  // function to update a recipe (recipeList)
  const handleUpdateRecipe = (recipe) => {
    const index = recipeList.findIndex((r) => r.recipeId === recipe.recipeId);
    recipeList[index] = recipe;
    setRecipeList(recipeList);

    // updateRecipe(recipe) from api backend
  }

  // function to update incredient
  const handleUpdateIngredient = (oldIngredient, newIngredient) => {
    // loop through recipeList
    for(let i = 0; i < recipeList.length; i++){
      // find recipe where ingredient is from
      if(newIngredient.recipeId === recipeList[i].recipeId){
          const ingredients = recipeList[i].ingredients;
          ingredients[ingredients.indexOf(oldIngredient)] = newIngredient;
          recipeList[i].ingredients = ingredients;
          setRecipeList(recipeList)

          // updateIngredient(old, new)
      }
    }
  }

  const handleDeleteIngredient = (ingredient) => {
     // loop through recipeList
     for(let i = 0; i < recipeList.length; i++){
      // find recipe where ingredient is from
      if(ingredient.recipeId === recipeList[i].recipeId){
          const ingredients = recipeList[i].ingredients;
          ingredients.splice(ingredients.indexOf(ingredient), 1);
          recipeList[i].ingredients = ingredients;
          setRecipeList(recipeList)

          // deleteIngredient(ingredient) from backend api
      }
    }
  }

  // function to handle incredient deleting
  const handleSaveToPantry = (ingredient) => {
    // loop through recipeList
    for(let i = 0; i < recipeList.length; i++){
      // find recipe where ingredient is from
      if(ingredient.recipeId === recipeList[i].recipeId){
          const ingredients = recipeList[i].ingredients;
          ingredients[ingredients.indexOf(ingredient)].gotten = true;
          recipeList[i].ingredients = ingredients;
          setRecipeList(recipeList)
          
          // saveToPantry(ingredient) from backend api
      }
    }
  }

  return (
    !isAuthenticating &&
    <React.Fragment>
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, currUser, setCurrUser, currUserInfo, setCurrUserInfo, recipeList, setRecipeList, handleAddRecipe, handleUpdateRecipe, handleUpdateIngredient, handleSaveToPantry, handleDeleteIngredient }} />
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default withRouter(App);