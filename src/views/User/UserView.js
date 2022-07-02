import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Contacts from "@material-ui/icons/Contacts";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import "react-quill/dist/quill.snow.css";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { userService } from "services/userService";
import { useParams, useHistory } from "react-router-dom";
import Button from "../../components/CustomButtons/Button";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function UserView() {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = React.useState({});

  async function fetchUser(id) {
    const { data } = await userService.view(id);
    setUser(data);
  }

  React.useEffect(() => {
    fetchUser(id);
  }, []);

  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Contacts />
            </CardIcon>
            <h4 className={classes.cardIconTitle}> {user.username} </h4>
          </CardHeader>

          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Full Name:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.title}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Username:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.username}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Email:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.email}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Wallet Address:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.address}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Role:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.role}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Is creator:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <Checkbox
                  checked={user?.isCreator ?? false}
                  checkedIcon={
                    <Check className={classes.checkedIcon} />
                  }
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Bio:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={9}>
                <h5>{user?.bio}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <h5><strong>Logo & Cover:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <img src={user?.avatar} alt="avatar" style={{ width: "200px", borderRadius: '20px' }} />
              </GridItem>
              <GridItem xs={12} sm={12} md={5}>
                <img src={user?.cover} alt="cover" style={{ width: "200px", borderRadius: '20px' }} />
              </GridItem>
            </GridContainer>

            <GridContainer className="ml-2">
              <Box m={2} pt={3}>
                <Button onClick={() => history.goBack()}>Cancel</Button>
              </Box>
            </GridContainer>

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
