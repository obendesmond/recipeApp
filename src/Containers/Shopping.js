import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import { onLoad } from '../Libs/Utils';

export default function Shopping(props) {
  const { recipeList, handleUpdateIngredient, handleSaveToPantry} = props;
  const [ingredients, setIngredients] = React.useState([]);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Item', field: 'item', editable:'onAdd'},
      { title: 'Recipe', field: 'recipe', editable:'onAdd'},
      { title: 'Qty', field: 'quantity', editable:'onAdd'},
      { title: 'Measurement', field: 'measurement', editable:'onAdd'},
      { title: 'Price Bought ($)', field:'price'}
    ],
    data: [],
  });

  React.useEffect(() => {
     onLoad(recipeList, setIngredients, state, setState, false);
  }, [recipeList]);



  return (
      <Container style={{marginTop:'150px', marginBottom:'50px'}}>
          <MaterialTable
            title={"Ingredients to Get: " + ingredients.length}
            columns={state.columns}
            data={state.data}
            actions = {[
                {
                    icon: () => <CheckCircleOutlineIcon />,
                    tooltip: 'Save to Pantry',
                    onClick: (event, rowData) => {
                        if(rowData.price > 0){
                            const data = [...state.data];
                            rowData.gotten = true;
                            
                            // save ingredient first
                            handleSaveToPantry(rowData);

                            data.splice(data.indexOf(rowData), 1); //remove from table
                            setState({ ...state, data }); //update data in state
                            setIngredients(data); // update ingredients too
                        }else {
                            alert('Edit the ingredient and insert the price you bought it before saving to Pantry')
                        }
                    }
                }
            ]}
            editable={{
                // onRowAdd: (newData) =>
                //   new Promise((resolve) => {
                //     setTimeout(() => {
                //       resolve();
                //       setState((prevState) => {
                //         const data = [...prevState.data];
                //         data.push(newData);
                //         // update ingredients
                //         setIngredients(data);
                //         // add ingredient first
                //         handleAddIngredient(data)

                //         return { ...prevState, data };
                //       });
                //     }, 600);
                //   }),
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
                  })
              }}
            options={{
                actionsColumnIndex: -1
            }}
          />
      </Container>
  );
}
