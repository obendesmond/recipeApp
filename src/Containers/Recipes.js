import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { getRecipeList, updateRecipe, createRecipe } from "../Libs/ApiLib";
import { s3Upload, s3Get } from '../Libs/StorageLib';

import RecipeList from "../Components/RecipeList";
import RecipeCard from "../Components/RecipeCard";
import RecipeFab from '../Components/RecipeFab';
import EmptyRecipe from "../Components/EmptyRecipe";

import Container from '@material-ui/core/Container';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1
  }
}));

export default function Recipes({ recipeList, setRecipeList, isAuthenticated, handleAddRecipe, handleUpdateRecipe, ...props } ){
  const classes = useStyles();

  const recipeId = props.match.params.id;
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [fabValue, setFabValue] = useState(0);
  
  React.useEffect(() => {
    async function onLoad() {
      // Check user is authenticated
      if (!isAuthenticated)return;
      // Check recipeList exists, if not fetch recipeList
      if (!recipeList){
        try {
          await getRecipes();
        } catch (err) {
          alert(err);
        }
      }
      // if recipeId in url set selected recipe to the mathcing recipe
      if (recipeId && recipeList) {
        setSelectedRecipe(recipeList.find(recipe => {
          return recipe.recipeId === recipeId;
        }));
        setFabValue(1);
      }
      if (!recipeId) {
        setSelectedRecipe(null);
        setFabValue(0)
      }
    }
    onLoad();
  }, [isAuthenticated, recipeList, recipeId]);

  const getR = () => {
    return recipeList;
  }

  const getRecipes = () => {
      processRecipes(getR());
  }

  const processRecipes = async recipes => {
    Promise.all(recipes.map(async recipe => {
      if(recipe.attachment){
        recipe.attachment = await s3Get(recipe.attachment);
      }
      return recipe;
    })).then(result => {
      setRecipeList(result);
    });
  }



// Fab interactions
  const handleFabClick = async (event) => {
    // New Button Click
    if (fabValue === 0) {
      setSelectedRecipe(EmptyRecipe);
      setFabValue(2);
      setIsEditable(true);
    }
    // Edit Button Click
    if (fabValue === 1) {
      setFabValue(2);
      setIsEditable(true);
    }
    // Save Button Click
    if (fabValue === 2) {
      await handleSave();
      setFabValue(1);
      setIsEditable(false);
    }
  }

  const handleSave = async () => {
    if (attachment) {
      s3Upload(attachment).then(async result => {
        await postRecipe(result);
      }).catch(err => {
        console.log(err);
      });
    }else {
      await postRecipe(null);
    }
  }

  const postRecipe = async (attachment) => {
    selectedRecipe.attachment = attachment;
    if (!selectedRecipe.recipeId) {
      // await createRecipe(selectedRecipe)
      // add recipe
      handleAddRecipe(selectedRecipe);
    }else {
      // await updateRecipe(selectedRecipe)
      // update recipe
      handleUpdateRecipe(selectedRecipe);
    }
    await getRecipes()
  }

  const fabs = [
    {
      color: 'primary',
      icon: <AddIcon />,
      label: 'Add',
    },
    {
      color: 'secondary',
      icon: <EditIcon />,
      label: 'Edit',
    },
    {
      color: 'primary',
      icon: <SaveOutlinedIcon />,
      label: 'Save',
    }
  ]

  return(
    <Container style={{marginTop:'100px', marginBottom:'50px'}}>
      <RecipeFab handleClick={handleFabClick} fabs={fabs} value={fabValue}/>
      {selectedRecipe
        ?<RecipeCard recipe={selectedRecipe} setRecipe={setSelectedRecipe} attachment={attachment} setAttachment={setAttachment} expanded editable={isEditable} />
        :<RecipeList recipeList={recipeList} appProps={props} />
      }
    </Container>
  )
}
