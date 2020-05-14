import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import {  fade, makeStyles } from '@material-ui/core/styles';
import { getRecipeList, updateRecipe, createRecipe } from "../Libs/ApiLib";
import { s3Upload, s3Get } from '../Libs/StorageLib';

import RecipeList from "../Components/RecipeList";
import RecipeCard from "../Components/RecipeCard";
import RecipeFab from '../Components/RecipeFab';
import EmptyRecipe from "../Components/EmptyRecipe";
import Search from '../Components/Search';

import Container from '@material-ui/core/Container';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1
  },
  search: {
    marginBottom: '20px',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    border: '2px solid green',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Recipes({ recipeList, setRecipeList, isAuthenticated, handleAddRecipe, handleUpdateRecipe, ...props } ){
  const classes = useStyles();
  const history = useHistory();

  const recipeId = props.match.params.id;
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [fabValue, setFabValue] = useState(0);
  const [searchedRecipe, setSearchedRecipe] = React.useState([]);
  const [searchTxt, setSearchTxt] = React.useState('')
  
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

  const goback = () => {
    history.push('/Recipes')
  }

  const handleSearch = (e) => {
    setSearchTxt(e.target.value.trim())
    let newData = searchTxt ? recipeList.filter((item)=>{
      for (let key in item) {
        let v = item[key] && item[key].toString().toLowerCase();
        if (v && v.indexOf(searchTxt.toLowerCase()) !== -1 ) {
          return true;
        }
      }
      return false;
    }) : recipeList;
    setSearchedRecipe(newData);
    console.log(searchedRecipe);
  }

  return(
    <Container style={{marginTop:'100px', marginBottom:'50px'}}>
      {
      recipeId ? 
        (
          <Button onClick={() => goback()} color="secondary" variant="contained">
            <ArrowBackIcon />
          </Button> 
        ):null
      }

      {
        selectedRecipe ? null
        : (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange = {(e) => handleSearch(e)}
            />
          </div>
        )
      }
      
      <RecipeFab handleClick={handleFabClick} fabs={fabs} value={fabValue}/>
      {selectedRecipe
        ?<RecipeCard recipe={selectedRecipe} setRecipe={setSelectedRecipe} attachment={attachment} setAttachment={setAttachment} expanded editable={isEditable} />
        : (
            (searchedRecipe.length > 0) 
            ? <RecipeList recipeList={searchedRecipe} appProps={props} />
            : <RecipeList recipeList={recipeList} appProps={props} />
          )
      }
    </Container>
  )
}
