import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import { getAllIngredients } from '../Libs/ApiLib';


const getNotGotten = () => {
  const ing = getAllIngredients();
  let data = [];
  for (let i = 0; i < ing.length; i++) {
    if(ing[i].gotten === false){
      data.push(ing[i]);
    }
  }
  return data
}

const closest = function(el, selector, rootNode) {
  rootNode = rootNode || document.body;
  console.log("rootNode:", rootNode);
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  //   console.log('matchesSelector:', matchesSelector);
  while (el) {
    const flagRoot = el === rootNode;
    //     console.log('flagRoot:', flagRoot);
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
        //         console.log('flagRoot set el to null:', el);
      }
      //       console.log('break!');
      break;
    }
    el = el.parentElement;
    //     console.log('el = el.parentElement:', el);
  }
  //   console.log('closest:', el);
  el.setAttribute("style", "border: 50px solid red;");
  return el;
};

export default function Shopping(props) {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Item', field: 'item'},
      { title: 'Quantity', field: 'quantity'},
      // {title:' ', field:'measurement', render: rowData => <DragIndicatorIcon draggable="false" onMouseDown={(e) => onMouseDown(e)} />}
    ],
    data: getNotGotten(),
  });
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [draggedIndex, setDraggedIndex] = React.useState(-1)
  const [dragIndex, setDragIndex] = React.useState(-1)

  const onMouseDown = (e) => {
    // return console.log(e);
    const target = getTrNode(e.target);
    if (target) {
      target.setAttribute("draggable", true);
      target.ondragstart = onDragStart;
      target.ondragend = onDragEnd;
    }
  }
  
  const onDragStart = (e) => {
    console.log("onDragStart");
    const target = getTrNode(e.target);
    if (target) {
      //       e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = "move";
      console.log("target.parentElement:", target.parentElement);
      target.parentElement.ondragenter = onDragEnter;
      target.parentElement.ondragover = function(ev) {
        //         console.log('Tbody ondragover:',ev)
        //         ev.target.dataTransfer.effectAllowed = 'none'
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      console.log("dragIndex:", dragIndex);
      setDragIndex(dragIndex)
      setDraggedIndex(dragIndex)
    }
  }

  const onDragEnter = (e) => {
    const target = getTrNode(e.target);
    console.log("onDragEnter TR index:", target.rowIndex - 1);
    setDraggedIndex(target ? target.rowIndex - 1 : -1)
  }

  const onDragEnd = (e) => {
    console.log("onDragEnd");
    const target = getTrNode(e.target);
    if (target) {
      target.setAttribute("draggable", false);
      target.ondragstart = null;
      target.ondragend = null;
      target.parentElement.ondragenter = null;
      target.parentElement.ondragover = null;
      changeRowIndex();
    }
  }

  const getTrNode = (target) => {
    //     console.log('dragContainer:', refs.dragContainer)
    //     return closest(target, 'tr', refs.dragContainer.tableNode);
    return closest(target, "TableRow");
  }

  const changeRowIndex = () => {
    const result = {};
    const currentState = {
      draggedIndex,
      dragIndex,
      data: state.data
    };
    console.log("currentState:", currentState);
    result.dragIndex = result.draggedIndex = -1;
    if (
      currentState.dragIndex >= 0 &&
      currentState.dragIndex !== currentState.draggedIndex
    ) {
      const { dragIndex, draggedIndex, data: oldData } = currentState;
      const data = [...oldData];
      //       const data = oldData;
      const item = data.splice(dragIndex, 1)[0];
      data.splice(draggedIndex, 0, item);
      result.data = data;
      result.dragIndex = -1;
      result.draggedIndex = -1;
    }
    
    setDragIndex(result.dragIndex)
    setDraggedIndex(result.draggedIndex)
    setState({...state,data:result.data})
  }

  return (
      <Container style={{marginTop:'150px', marginBottom:'50px'}}>
          <MaterialTable
            title='Shopping'
            columns={state.columns}
            data={state.data}
            actions = {[
                {
                    icon: () => <CheckCircleOutlineIcon />,
                    tooltip: 'Save item(s) to Pantry',
                    onClick: (event, selectedData) => {
                        // loop through selected data
                        const data = [...state.data];
                        for (let i = 0; i < selectedData.length; i++) {
                          selectedData[i].gotten = true;
                          data.splice(data.indexOf(selectedData[i]), 1); //remove from table
                        }
                        setState({ ...state, data }); //update data in state
                    }
                }
            ]}
            editable={{
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
                selection: true,
                rowStyle: rowData => ({
                  backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                })
            }}
          />
      </Container>
  );
}