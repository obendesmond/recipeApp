export const preventDefault = event => event.preventDefault();

export const onLoad = (recipeList, setIngredients, state, setState, gotten) => {
    const ing = []
    for (let i = 0; i < recipeList.length; i++) {
        for (let j = 0; j < recipeList[i].ingredients.length; j++) {
            // if ingredient is not gotten
            if(recipeList[i].ingredients[j].gotten === gotten){
                // include a "recipe and recipeId" element in every ingredient
                recipeList[i].ingredients[j].recipe = recipeList[i].title;
                recipeList[i].ingredients[j].recipeId = recipeList[i].recipeId;

                ing.push(recipeList[i].ingredients[j]);
            }
        }
    }
    setIngredients(ing);
    // set data to be ingredients
    setState({...state, data:ing})
}