import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import Search from '../Search';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    button:{
      fontSize:'12px'
    }
  }));
  
export default function EnhancedTableToolbar(props){
    const classes = useToolbarStyles();
    const { numSelected, handleSaveSelected, handleSearch} = props;
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Shopping
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <React.Fragment>
            <Search handleSearch={handleSearch} />
            <Tooltip title="Complete Shopping">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={ <AssignmentTurnedInIcon />}
                onClick={handleSaveSelected}
              >
                Save
              </Button>
            </Tooltip>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Search handleSearch={handleSearch}  />
            <Tooltip title="Filter list">
              <span>
                <Button
                  disabled
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.button}
                  startIcon={ <AssignmentTurnedInIcon />}
                >
                  Save
                </Button>
              </span>
            </Tooltip>
          </React.Fragment>
        )}
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    handleSaveSelected: PropTypes.func.isRequired,
  };