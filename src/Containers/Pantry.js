import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import { getAllIngredients } from '../Libs/ApiLib';


const getGotten = () => {
  const ing = getAllIngredients();
  let data = [];
  for (let i = 0; i < ing.length; i++) {
    if(ing[i].gotten === true){
      data.push(ing[i]);
    }
  }
  return data
}

export default function Pantry(props) {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Item', field: 'item'},
      { title: 'Quantity', field: 'quantity'}
    ],
    data: getGotten(),
  });
  const [selectedRow, setSelectedRow] = React.useState(null);


  return (
      <Container style={{marginTop:'150px', marginBottom:'50px'}}>
          <MaterialTable
            title='Pantry'
            columns={state.columns}
            data={state.data}
            actions = {[
                {
                    icon: 'delete',
                    tooltip: 'Delete',
                    onClick: (event, rowData) => {
                        const data = [...state.data];
                        data.splice(data.indexOf(rowData), 1); //remove from table
                        setState({ ...state, data }); //update data in state
                    }
                }
            ]}
            editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      setState((prevState) => {
                        const data = [...prevState.data];
                        data.push(newData);

                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;

                          return { ...prevState, data };
                        });
                      }
                    }, 600);
                  })
              }}
            onSelectionChange={(selectedData) => {
                // loop through selected data
                let data = [...state.data];
                // loop through selected data and remove it from it's position
                for (let i = 0; i < selectedData.length; i++) {
                  data.splice(data.indexOf(selectedData[i]), 1);
                }
                for (let i = 0; i < selectedData.length; i++) {
                  data.push(selectedData[i]);
                }
                console.log(data)
                // send selected data to bottom
                setState({ ...state, data }); //update data in state
            }}
            onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
            options={{
                actionsColumnIndex: -1,
                rowStyle: rowData => ({
                  backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                })
            }}
          />
      </Container>
  );
}