import React, {useState} from "react";
import { Auth } from "aws-amplify";
import { withRouter, useHistory } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Theme from "./Theme";
import uid from 'uid';
import Notification from './Notification';
import notify from 'devextreme/ui/notify';

import { 
  getRecipeList,
  getAllIngredients,
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
  const [ingredientList, setIngredientList] = useState(null);

  React.useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    // set recipes and ingredients
    setRecipeList(getRecipeList());
    setIngredientList(getAllIngredients());
    
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

  const showToast = (event, value, type) => {
    notify(`${event} "${value}" recipe`, type, 800);
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

  // function to update ingredient
  const handleUpdateIngredient = (newIngredient) => {
    // loop through ingredientList
    for(let i = 0; i < ingredientList.length; i++){
      // find recipe where ingredient is from
      if(newIngredient.id === ingredientList[i].id){
          newIngredient.gotten = true;
          setIngredientList(ingredientList.filter((row, j) => row.id !== newIngredient.id));
          // updateIngredient(old, new)
      }
    }
  }

   // function to handle ingredient deleting
  const handleDeleteIngredient = (ingredient, index) => {
      const repeatedIngId = ingredient.ids;
      if(repeatedIngId.length > 0){
          for (let j = 0; j < repeatedIngId.length; j++) {
            setIngredientList(ingredientList.filter(row => row.id !== repeatedIngId[j]))
          }
      } else {
        setIngredientList(ingredientList.filter((row, j) => row.id !== ingredient.id));
        // showToast('Deleted', ingredient.item, 'success');
      }
      // setIngredientList(rows => ingredientList.filter((row, j) => j !== i));
  }

  return (
    !isAuthenticating &&
    <React.Fragment>
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, currUser, setCurrUser, currUserInfo, setCurrUserInfo, recipeList, setRecipeList, ingredientList, setIngredientList, handleAddRecipe, handleUpdateRecipe, handleUpdateIngredient, handleDeleteIngredient }} />
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default withRouter(App);