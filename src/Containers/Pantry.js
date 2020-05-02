import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import EnhancedTableHead from '../Components/ShoppingComponents/EnhancedTableHead';
import EnhancedTableToolbar from '../Components/ShoppingComponents/EnhancedTableToolbar';
import Container from '@material-ui/core/Container';
import { onLoad } from '../Libs/Utils';

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop:'100px',
    marginBottom:'20px'
  },
  paper: {
    // padding:'10px 10px',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function Pantry(props) {
  const { ingredientList, setIngredientList, handleUpdateIngredient, handleDeleteIngredient} = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([])
  const [editIdx, setEditIdx] = React.useState(-1)
  const [rowT, setRowT] = React.useState({name:'', qty:0})

  React.useEffect(() => {
    onLoad(ingredientList, setRows, true);
 }, [ingredientList]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
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

    console.log(rows.indexOf(newSelected))
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (row) => selected.indexOf(row) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const startEditing = i => {
    setEditIdx(i);
    rows.map((row, j) => {
      if(j === i){
        setRowT({name: row.item, qty: row.quantity})
      }
    })
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if(e.target.name === 'item'){
      setRowT({...rowT, name: value})
    } else {
      setRowT({...rowT, qty: value})
    }
  };

  const saveEdit = (row, i) => {
      rows.map((row, j) => {
        if(j === i){
          rows[i].item = rowT.name;
          rows[i].quantity = rowT.qty;
          setRows(rows);
          setEditIdx(-1);
        }
      })
  }

  const cancelEdit = () => {
    setEditIdx(-1);
  }

  const handleSaveSelected = () => {
    for (let i = 0; i < selected.length; i++) {
      handleUpdateIngredient(selected[i])
      setSelected([])
    }
  }
  
  
  const handleSearch = (e) => {
    const {value} = e.target;

    if(value.trim().length > 0 || value !== ''){
      let i = rows.filter((row) => {
        return row.item.indexOf(value) !== -1;
      })
      setRows(i)
    } else return setRows(rows);

    // alert(e.target.value)
  }

  return (
    <Container>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar handleSearch={handleSearch} handleSaveSelected={handleSaveSelected} numSelected={selected.length} />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row);
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
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                              onClick={(event) => handleClick(event, row)}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {currentlyEditing ? (
                                <TextField
                                  name='item'
                                  onChange={e => handleChange(e)}
                              />
                            ): row.item}
                          </TableCell>
                          <TableCell align="right">
                              {
                                currentlyEditing ?
                                  (
                                    <FormControl>
                                        <Input
                                          id="standard-adornment-weight"
                                          name={'quantity'}
                                          onChange={e => handleChange(e)}
                                          endAdornment={<InputAdornment position="end">{row.measurement}</InputAdornment>}
                                          aria-describedby="standard-weight-helper-text"
                                          inputProps={{
                                            'aria-label': 'weight',
                                          }}
                                        />
                                    </FormControl>
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
                                    <React.Fragment>
                                        <Tooltip title="Save Edit" draggable="false">
                                          <IconButton onClick={() => saveEdit(row, index)}>
                                            <DoneIcon />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel Edit" draggable="false">
                                          <IconButton onClick={cancelEdit}>
                                            <CloseIcon />
                                          </IconButton>
                                        </Tooltip>
                                    </React.Fragment>
                                  ) :
                                  (
                                    <React.Fragment>
                                      <Tooltip title="Edit Row" draggable="false">
                                          <IconButton onClick={() => startEditing(index)}>
                                            <EditIcon />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Row" draggable="false">
                                        <IconButton onClick={() => handleDeleteIngredient(row, index)}>
                                          <DeleteIcon />
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
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
    </Container>
  );
}
