import React from "react";
import clsx from 'clsx';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FaceIcon from '@material-ui/icons/Face';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const drawerHeight = 208;

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: "center",
  },
  navigationBtn: {
    position: "fixed",
    left: "50%",
    padding: 0
  },
  navigationBar: {
    position: "fixed",
  },
  profileBtn: {
    marginLeft: "auto"
  },
  fullList: {
    width: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginTop: drawerHeight,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  routerLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    width: "100%",
    height: "100%"
  },
  authProfile: {
    padding: theme.spacing(1.5),
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(6),
    height: theme.spacing(6)
  },
  faceIcon: {
    width: "100%",
    height: "100%",
  },
  button: {
    margin: theme.spacing(0.5),
    fontSize: "11px"
  },
  divider: {
    margin: theme.spacing(0.5),
    width: "100%"
  },
  name: {
    margin: theme.spacing(0.5),
    textTransform: "capitalize"
  },
  email: {
    margin: theme.spacing(0.5),
    textTransform: "none"
  },
  margin: {
    margin: theme.spacing(2),
  },
}));

export default ({ appProps }) => {
  const history = useHistory();
  const classes = useStyles();

  const [drawer, setDrawer] = React.useState(false);

  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

  const [value, setValue] = React.useState(0);

  
  React.useEffect(() => {
    
    switch (window.location.pathname) {
      case '/Recipes':
        setValue(0);
        break;
      case '/Menu':
        setValue(1);
        break;
      case '/Pantry':
        setValue(2);
        break;
      case '/Shopping':
        setValue(3);
        break;
      default:
        setValue(-1);
        break;
    }
  });

  const pageList = ['Recipes', 'Menu', 'Pantry', 'Shopping'];

  const toggleDrawer = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(!drawer);
  };

  const toggleProfilePopover = event => {
    setProfileAnchorEl(profileAnchorEl ? null : event.currentTarget);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    history.push(`/${pageList[newValue]}`)
  };

  async function handleLogout() {
    toggleProfilePopover();
    await Auth.signOut();
    appProps.userHasAuthenticated(false);
    history.push("/SignIn");
  }

  const FullList = () => (
    <div
      className={classes.fullList}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {pageList.map((text, index) => (
          <ListItem key={text} button disabled={false/*index > 0*/} >
            <RouterLink to={`/${text}`} className={classes.routerLink}>
              <ListItemText primary={text} />
            </RouterLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const UnAuthProfile = () => (
    <Paper>
      <List>
        <RouterLink onClick={toggleProfilePopover} key="SignIn" to="/SignIn" className={classes.routerLink}>
          <ListItem button>
              <ListItemText primary="Sign In" />
          </ListItem>
        </RouterLink>
        <RouterLink onClick={toggleProfilePopover} key="SignUp" to="/SignUp" className={classes.routerLink}>
          <ListItem button>
              <ListItemText primary="Sign Up" />
          </ListItem>
        </RouterLink>
      </List>
    </Paper>
  )

  const AuthProfile = () => (
    <Paper>
      <Container className={classes.authProfile} maxWidth="xs">
        <Badge
          className={classes.margin}
          badgeContent={<PhotoCameraIcon fontSize="small"/>}
          color="primary"
          overlap="circle"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
        >
          <Avatar className={classes.avatar}>
            <FaceIcon className={classes.faceIcon} />
          </Avatar>
        </Badge>
        <Typography className={classes.typography} variant="body1">
          {appProps.currUserInfo ? appProps.currUserInfo.attributes.given_name + " " + appProps.currUserInfo.attributes.family_name : 'John Doe'}
        </Typography>
        <Typography className={classes.typography} variant="body2">
          {appProps.currUserInfo ? appProps.currUserInfo.attributes.email : 'johndoe@gmail.com'}
        </Typography>
        <Divider className={classes.divider}  variant="middle"/>
        {/*<Button className={classes.button}>Change Password</Button>*/}
        <Button onClick={handleLogout} className={classes.button} variant="outlined" >Sign Out</Button>
      </Container>
    </Paper>
  );

  return (
    <div className="Header">
      <AppBar position="fixed" className={clsx(classes.appBar, drawer && classes.appBarShift)}>
        <Toolbar className={classes.root}>
          <NavLink to='/' style={{textDecoration:'none', color:'white'}}>
            <Typography variant="h6">Food Buddy</Typography>
          </NavLink>
          <Hidden mdUp>
            <IconButton edge="start" color="inherit" aria-label="menu" className={classes.navigationBtn} onClick={toggleDrawer}>
              <ExpandLessIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <Tabs value={value} centered onChange={handleChange} className={classes.navigationBar} aria-label="simple tabs example">
              <Tab label="Recipes"/>
              <Tab label="Menu" />
              <Tab label="Pantry" />
              <Tab label="Shopping" />
            </Tabs>
          </Hidden>
          <IconButton onClick={toggleProfilePopover} className={classes.profileBtn} edge="start" color="inherit" aria-label="menu">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="top" open={drawer} onClose={toggleDrawer}>
        <FullList />
      </Drawer>
      <Popover
        onClose={toggleProfilePopover}
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
          {appProps.isAuthenticated
            ?<AuthProfile />
            :<UnAuthProfile />
          }
      </Popover>
    </div>
  );
}
