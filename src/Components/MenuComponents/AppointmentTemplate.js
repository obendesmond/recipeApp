import React from 'react';
import Query from 'devextreme/data/query';

import { recipesData } from '../../Libs/ApiLib';
import defaultImage from '../../Data/defaultImage.jpg';

function getRecipesById(id) {
  return Query(recipesData).filter(['id', id]).toArray()[0];
}

export default function AppointmentTemplate(model) {

  const recipeInfo = getRecipesById(model.appointmentData.recipeId) || {};
  return (
    <center >
      <img src={/*recipeInfo.attachment ? recipeInfo.attachment : */defaultImage} style={{height:'100px'}}/>
      <div style={{fontSize:'90%',whiteSpace:'normal'}}>{recipeInfo.text}</div>
    </center>
  );
}