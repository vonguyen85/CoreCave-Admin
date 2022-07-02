import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";

// @material-ui/icons
import Contacts from "@material-ui/icons/Contacts";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { categoryService } from "services/categoryService";
import { useForm } from "react-hook-form";
import {Box, TextField} from "@material-ui/core";
import {useHistory, useParams} from "react-router-dom";
import { toast } from "react-toastify";

const useStyles = makeStyles(styles);

export default function CategoryCreate() {
  const { register: category, handleSubmit, setValue } = useForm();
  const { id } = useParams();
  const history = useHistory();

  async function create(payload) {
    try {
      const { data } = await categoryService.create(payload);
      toast.success("Created");
      window.setTimeout(
        () => history.push("/admin/categories/" + data._id),
        500
      );
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function update(payload) {
    try {
      await categoryService.update(id, payload);
      toast.success("Updated");
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function onSubmit(form) {
    if (id) {
      update(form);
    } else {
      create(form);
    }
  }

  async function fetchCategory() {
    try {
      const { data } = await categoryService.view(id);
      const fields = ['title', 'description', 'activated'];
      fields.forEach(field => setValue(field, data[field]));
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    fetchCategory()
  }, [id]);

  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Contacts />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>{ !id ? 'Create Category' : 'Edit category' }</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Title
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={7}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      ...category("title"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Description
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={7}>
                  <TextField
                    placeholder="Description"
                    multiline
                    fullWidth={true}
                    rows={4}
                    {...category("description")}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Active
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <Box pt={5}>
                    <input
                      name="acceptTerms"
                      type="checkbox"
                      {...category('activated')}
                      id="acceptTerms"
                    />
                  </Box>

                </GridItem>
              </GridContainer>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={9}>
                  <Button onClick={() => history.goBack()}>Cancel</Button>
                  <Button color="rose" type="submit">
                    Submit
                  </Button>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
