import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Tooltip from '@material-ui/core/Tooltip';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}
  
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
  


export default function EnhancedTableBody({
    rows,
    handleRemove,
    startEditing,
    editIdx,
    handleChange,
    stopEditing, 
    selected, setSelected,
    order, orderBy,
    page, rowsPerPage,
}){

    const handleClick = (event, ingredient) => {
        const selectedIndex = selected.indexOf(ingredient);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, ingredient);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected);
    };

    const isSelected = (ingredient) => selected.indexOf(ingredient) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.item);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const currentlyEditing = editIdx === index;

                  return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={`tr-${index}`}
                        selected={isItemSelected}
                      >
                        <TableCell onClick={(event) => handleClick(event, row.item)} padding="checkbox">
                            <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                            {currentlyEditing ? (
                                <TextField
                                  name={row.item}
                                  onChange={e => handleChange(e, row.item, index)}
                                  value={row.item}
                              />
                            ): row.item}
                        </TableCell>
                        <TableCell align="right">
                          {
                            currentlyEditing ?
                              (
                                <TextField
                                  name={row.item}
                                  onChange={e => handleChange(e, row.item, index)}
                                  value={row.quantity + ' ' + row.measurement}
                              />
                              )
                            : row.quantity + ' ' + row.measurement
                          }
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Drag the item" draggable="false">
                              <IconButton>
                                  <DragIndicatorIcon />
                              </IconButton>
                            </Tooltip>
                            {
                              currentlyEditing ?
                              (
                                <Tooltip title="Save Edit" draggable="false">
                                  <IconButton>
                                    <DoneIcon onClick={stopEditing} />
                                  </IconButton>
                                </Tooltip>
                              ) :
                              (
                                <React.Fragment>
                                  <Tooltip title="Edit Row" draggable="false">
                                      <IconButton>
                                        <EditIcon onClick={startEditing(index)} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Row" draggable="false">
                                    <IconButton>
                                      <DeleteIcon onClick={handleRemove(index)} />
                                    </IconButton>
                                  </Tooltip>
                                </React.Fragment>
                              )
                            }
                        </TableCell>
                      </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: (53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                )}
        </TableBody>
    )
}