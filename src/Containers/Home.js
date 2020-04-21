import React from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import logo from '../Data/logo.png'


export default props => {

  return(
    <Container maxWidth="sm" style={{marginTop:'100px'}}>
      <center>
          <img src={logo} style={{height:'200px', marginTop:'50px'}} alt="no logo" />
          <Typography variant="h1">Food Buddy</Typography>
          <Typography variant="subtitle1">Your personal food assistant</Typography>
          {/* <Typography variant="subtitle2">This Site is still in development, we'll be adding stuff all the time so make sure to check back and see the latest release</Typography> */}
      </center>
    </Container>
  )
}
