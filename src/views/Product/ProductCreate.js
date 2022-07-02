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

import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { productService } from "../../services/productService";
import { toast } from "react-toastify";
import CategorySelect from "../../components/CategorySelect/CategorySelect";

const useStyles = makeStyles(styles);

export default function ProductCreate() {
  const { id } = useParams();
  const { register: product, handleSubmit, setValue } = useForm();
  const history = useHistory();
  const [image, setImage] = React.useState("");

  async function createProduct(payload) {
    try {
      await productService.create(payload);
      toast.success("Created");
      window.setTimeout(() => history.push("/admin/product"), 500);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message[0]);
    }
  }

  async function updateProduct(payload) {
    try {
      await productService.create(payload);
      toast.success("Updated");
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message[0]);
    }
  }

  async function onSubmit(form) {
    const payload = { ...form, tags: form.tags.split(",") };
    if (id) {
      updateProduct(payload);
    } else {
      createProduct(payload);
    }
  }

  async function fetchProduct() {
    try {
      const { data } = await productService.view(id);
      const fields = ["title", "description", "activated", "price", "image"];
      fields.forEach((field) => setValue(field, data[field]));
      setValue("tags", data.tags.join(","));
      setValue("category", data?.category?.id);
      setImage(data.image);
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchProduct();
    }
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
            <h4 className={classes.cardIconTitle}>
              {id ? "Update product" : "Create product"}
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={9}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Title
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          ...product("title"),
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
                    <GridItem xs={12} sm={12} md={9}>
                      <TextField
                        placeholder="description ..."
                        multiline
                        fullWidth={true}
                        rows={4}
                        {...product("description")}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Image URL
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          ...product("image"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Category
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9}>
                      <CategorySelect
                        haveAll={false}
                        inline={true}
                        onSelected={(id) => setValue("category", id)}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Tags
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          placeholder: "tag1, tag2,...",
                          type: "text",
                          ...product("tags"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Price
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "number",
                          ...product("price"),
                        }}
                      />
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
              </GridItem>

              <GridItem xs={12} sm={12} md={3}>
                <div className="fileinput-new thumbnail img-raised">
                  <img
                    src={image}
                    width="100%"
                    rel="nofollow"
                    alt="..."
                    style={{
                      borderRadius: "7px",
                      boxShadow: "2px 2px #6a6565",
                    }}
                  />
                </div>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
