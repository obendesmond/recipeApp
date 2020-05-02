import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useFormFields } from "../Libs/hooksLib";
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import PersonAddIcon from '@material-ui/icons/PersonAdd';

import LoaderButton from "../Components/LoaderButton";

const useStyles = makeStyles(theme => ({
  form: {
    width: '90%', // Fix IE 11 issue.
    margin: "auto",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Signup(props) {
  const classes = useStyles();

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    firstName: "",
    surname: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(null);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.firstName.length > 0 &&
      fields.surname.length > 0
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    let emailV = fields.email.toLowerCase();
    if (!emailV.includes("@")){emailV=emailV+"@daimler.com"}
    let firstNameV = fields.firstName.toLowerCase();
    let surnameV = fields.surname.toLowerCase();

    setUserName(emailV);
    try {
      const newUser = await Auth.signUp({
        username: emailV,
        password: fields.password,
        attributes: {
          email: emailV,
          given_name: firstNameV,
          family_name: surnameV
        }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(userName, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      props.setCurrUser(await Auth.currentSession());
      props.setCurrUserInfo(await Auth.currentUserInfo());
      props.userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
      <TextField
        onChange={handleFieldChange}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="confirmationCode"
        label="Confirmation Code"
        type="tel"
        id="confirmationCode"
        autoComplete="off"
        inputProps={{
          maxLength:6
        }}
      />
      <LoaderButton
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        isLoading={isLoading}
        disabled={!validateConfirmationForm()}
      >
        Verify
      </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          onChange={handleFieldChange}
          margin="dense"
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
          margin="dense"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="off"
        />
        <TextField
          onChange={handleFieldChange}
          margin="dense"
          required
          fullWidth
          name="firstName"
          label="First Name"
          type="text"
          id="firstName"
          autoComplete="off"
        />
        <TextField
          onChange={handleFieldChange}
          margin="dense"
          required
          fullWidth
          name="surname"
          label="Surname"
          type="text"
          id="surname"
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
          Sign Up
        </LoaderButton>
      </form>
    );
  }

  return (
    <Container style={{marginTop:'100px'}} component="main" maxWidth="xs">
      <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <PersonAddIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      {newUser === null ? renderForm() : renderConfirmationForm()}
      </div>
    </Container>
  );
}
