export const preventDefault = event => event.preventDefault();

export const onLoad = (ingredientList, setRows, gotten) => {
    const ings = [];
    const foundIngs = [];
    for (let i = 0; i < ingredientList.length; i++) {
        if(ingredientList[i].gotten === gotten){

            ingredientList[i].ids = [ingredientList[i].id];
            // check if ingredient already exists
            const found = ings.some(eng => eng.item === ingredientList[i].item);
            if(!found) ings.push(ingredientList[i]);
            else {
                // add an ids property to repeated ingredients
                foundIngs.push(ingredientList[i]);
            }
        }
    }

    // add the item qty
    ings.forEach(ing => { 
        foundIngs.forEach(fi => {
            if(ing.item === fi.item){
                ing.ids.push(fi.id);
                ing.quantity = ing.quantity + fi.quantity
                // foundIngs.splice(foundIngs.indexOf(fi), 1);
            }  
        })
    });

    // set data to be ingredients
    setRows(ings)
}
