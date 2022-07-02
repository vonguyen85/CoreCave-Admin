import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import PermIdentity from "@material-ui/icons/PermIdentity";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardAvatar from "components/Card/CardAvatar.js";

import styles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.js";

import avatar from "assets/img/faces/marc.jpg";
import { useForm } from "react-hook-form";
import authService from "../../services/authService";
import {toast} from "react-toastify";

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const { register, handleSubmit, setValue } = useForm();
  async function updateProfile(form) {
    try {
      await authService.updateProfile(form);
      toast.success("Updated profile");
    } catch (e) {
      console.log(e);
      toast.error("Cannot update");
    }
  }

  async function fetchUser() {
    const { data } = await authService.me();
    const fields = ['email', 'username', 'title', 'avatar', 'publicAddress'];
    fields.forEach(f => setValue(f, data[f]));
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <PermIdentity />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Edit Profile - <small>Complete your profile here</small>
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(updateProfile)}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true,
                        ...register('username')
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Wallet"
                      id="wallet"
                      formControlProps={{
                        fullWidth: true,
                        ...register('publicAddress')
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={register('email')}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Full name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={register('title')}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "password",
                        placeholder: "abcdefgh",
                        ...register('new_password')
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <Button type="submit" color="rose" className={classes.updateProfileButton}>
                  Update Profile
                </Button>
                <Clearfix />
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{}</h6>
              <h4 className={classes.cardTitle}>{}</h4>
              <h4 className={classes.cardTitle}>{}</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
