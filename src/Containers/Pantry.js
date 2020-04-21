import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { onLoad } from '../Libs/Utils';

export default function Pantry(props) {
  const { recipeList, handleUpdateIngredient, handleDeleteIngredient } = props;
  const [ingredients, setIngredients] = React.useState([]);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Item', field: 'item'},
      { title: 'Recipe', field: 'recipe'},
      { title: 'Qty', field: 'quantity', editable:'never'},
      { title: 'Measurement', field: 'measurement', editable:'never'},
      { title: 'Price', field:'price', }
    ],
    data: [],
  });

  React.useEffect(() => {
    onLoad(recipeList, setIngredients, state, setState, true);
 }, [recipeList]);



  return (
      <Container style={{marginTop:'150px', marginBottom:'50px'}}>
          <MaterialTable
            title={"Ingredients in Store: " + ingredients.length}
            columns={state.columns}
            data={state.data}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    if (oldData) {
                      setState((prevState) => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;

                        // update ingredient first
                        handleUpdateIngredient(oldData, newData)

                        return { ...prevState, data };
                      });
                    }
                  }, 600);
                }),
              onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);

                    // delete ingredient first
                    handleDeleteIngredient(oldData);
                    
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            }}
            options={{actionsColumnIndex: -1}}
          />
      </Container>
  );
}
