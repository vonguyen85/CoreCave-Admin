import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
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
import {Link } from "react-router-dom";
import { Mail} from "@material-ui/icons";
import {toast} from "react-toastify";

const useStyles = makeStyles(styles);

export default function ForgotPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await authService.forgot(email);
      setError("");
      toast.success("Email reset password was sent");
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
                <h4 className={classes.cardTitle}>Forget password</h4>
              </CardHeader>
              <CardBody>
                {error ? (
                  <SnackbarContent message={error} close color="danger" />
                ) : (
                  ""
                )}

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
                        <Mail className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" size="lg" block type="submit">
                  Send email
                </Button>
              </CardFooter>
            </Card>
          </form>

          <Link to="/auth/login">
            <Button color="rose" simple size="lg" block type="submit">
              Login
            </Button>
          </Link>
        </GridItem>
      </GridContainer>
    </div>
  );
}
