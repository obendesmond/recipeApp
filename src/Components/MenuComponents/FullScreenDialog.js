import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {recipeList, selectRecipe, meal, mealType} = props

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const select = (name) => {
    meal.mealType = mealType;
    selectRecipe(name, meal);
    handleClose();
  }

  return (
    <div>
      <Button style={{width:'100%'}} variant="outlined" color="primary" onClick={handleClickOpen}>
        Change Recipe
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Select Recipe!
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Toolbar>
        </AppBar>
        <List>
            {
                recipeList.map((recipe, i) => {
                    return (
                        <React.Fragment key={i}>
                             <ListItem button onClick={() => select(recipe.title)}>
                                <ListItemText primary={recipe.title} secondary={recipe.createdAt} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    )
                })
            }
        </List>
      </Dialog>
    </div>
  );
}