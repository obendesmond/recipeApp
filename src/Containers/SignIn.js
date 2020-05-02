import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormFields } from "../Libs/hooksLib";
import { Auth } from "aws-amplify";

import LoaderButton from "../Components/LoaderButton";
import RouteLink from "../Components/RouteLink";

import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = React.useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      props.setCurrUser(await Auth.currentSession());
      props.setCurrUserInfo(await Auth.currentUserInfo());
      props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <Container style={{marginTop:'100px'}} component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            onChange={handleFieldChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="off"
            autoFocus
          />
          <TextField
            onChange={handleFieldChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
          />
          <LoaderButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Sign In
          </LoaderButton>
          <Grid container>
            <Grid item xs>
              <Link component={RouteLink} to="/ForgotPassword">
                <Typography variant="body2">
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouteLink} to="/SignUp">
                <Typography variant="body2">
                Don't have an account?
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
