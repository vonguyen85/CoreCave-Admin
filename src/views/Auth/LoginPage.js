import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import authService from "services/authService";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import { jwtManager } from "helper/jwtManager";
import configAxios from "plugins/axios";
import {Link, useHistory} from "react-router-dom";
import {Lock} from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await authService.login(username, password);
      setError("");
      setUsername("");
      setPassword("");

      jwtManager.set(data.access_token);
      configAxios();
      history.push("/admin/dashboard");
    } catch (e) {
      console.log("Login error: ", e);
      setError(e?.response?.data?.message);
    }
  }

  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 300);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={onSubmit}>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
                {error ? (
                  <SnackbarContent message={error} close color="danger" />
                ) : (
                  ""
                )}

                <CustomInput
                  labelText="Username..."
                  id="username"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Lock className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" size="lg" block type="submit">
                  Login
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Link to="/auth/forgot">
            <Button color="rose" simple size="lg" block type="submit">
              Forgot password
            </Button>
          </Link>
        </GridItem>
      </GridContainer>
    </div>
  );
}
