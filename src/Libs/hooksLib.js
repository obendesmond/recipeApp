import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function(event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
}
// 
// export function useRecipe(initialData) {
//   const [title, setTitle] = useState(initialData.title);
//   const [tags, setTags] = useState(initialData.tags);
//   const [servings, setServings] = useState(initialData.servings);
//   const [instructions, setInstructions] = useState(initialData.instructions);
//   const [ingredients, setIngredients] = useState(initialData.ingredients);
//   const [cookTime, setCookTime] = useState(initialData.cookTime);
//   const [attachment, setAttachment] = useState(initialData.attachment);
//
// }
