import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import authService from "services/authService";
import Danger from "components/Typography/Danger";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader.js";
import SweetAlert from "react-bootstrap-sweetalert";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function RegisterPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [alert, setAlert] = React.useState();
  const classes = useStyles();
  const alertClasses = useAlertStyles();
  const history = useHistory();

  const [errors, setErrors] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await authService.register(username, email, password);
      showAlert();
    } catch (e) {
      setErrors(e?.response?.data?.message);
    }
  }

  function showAlert() {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px", color: "black" }}
        title={"Success"}
        onConfirm={() => history.push("/auth/login")}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Your account is created, please login
      </SweetAlert>
    );
  }

  function hideAlert() {
    setAlert(null);
  }

  function getError(key) {
    key = key + " ";
    if (Array.isArray(errors)) {
      return errors?.find((item) => item.toLowerCase().includes(key));
    }

    return errors.toLowerCase().includes(key) ? errors : "";
  }

  // animation
  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 300);
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  return (
    <div className={classes.container}>
      {alert}
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={onSubmit}>
            <Card className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}> Register </h4>
              </CardHeader>

              <CardBody>
                <div>
                  <Danger> {getError("user")} </Danger>
                </div>

                <CustomInput
                  labelText="Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    autoComplete: "off",
                  }}
                />
                <div>
                  <Danger> {getError("email")} </Danger>
                </div>

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
                <div>
                  <Danger> {getError("username")} </Danger>
                </div>

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
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                  }}
                />
                <div>
                  <Danger> {getError("password")} </Danger>
                </div>
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" simple size="lg" block type="submit">
                  Register
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
