import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
// import Check from "@material-ui/icons/Check";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { productService } from "services/productService";
import { useForm } from "react-hook-form";
import {useHistory, useParams} from "react-router-dom";

const useStyles = makeStyles(styles);

export default function ProductView() {
  const { id } = useParams();

  const { register: product, handleSubmit, setValue } = useForm();
  const [description, setDescription] = React.useState();
  const history = useHistory();
  function changeDescription(html) {
    setDescription(html);
  }

  async function updateProduct(form) {
    try {
      await productService.update(id, { description, ...form });
      alert("ok");
    } catch (e) {
      console.log(e.response);
    }
  }

  async function fetchProduct(id) {
    // const { data } = await companyService.view(id);
    console.log(id)
    const data = {
      deleted: false,
      activated: true,
      _id: "614589f4e0b70b0012780402",
      title: "ZFold 3",
      description: "abc",
      image: "https://cellphones.com.vn/media/catalog/product/g/a/galaxy-z-fold3-kv_5g__1p_cmyk_1.jpg",
      categories: ['a', 'b', 'c'],
      tags: ['x', 'y', 'z'],
      unit: "kg",
      unitprice: "10k",
      createdBy: "letieu8",
      createdAt: "2021-09-18T06:40:52.348Z",
      updatedAt: "2021-09-18T06:40:52.348Z",
      __v: 0,
    }
    setDescription(data.description);
    const fields = ["title", "activated", "image", "categories", "tags", "unit", "unitprice"];
    fields.forEach((field) => setValue(field, data[field]));
    // console.log(data, company);
  }

  React.useEffect(() => {
    fetchProduct(id);
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
            <h4 className={classes.cardIconTitle}>Edit Product</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(updateProduct)}>
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
                  <ReactQuill
                    onChange={changeDescription}
                    value={description}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Image
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <img
                    src="https://cellphones.com.vn/media/catalog/product/g/a/galaxy-z-fold3-kv_5g__1p_cmyk_1.jpg"
                    // src={{...product("image")}}
                    // onChange={changeDescription}
                    // value={description}
                    alt=""
                    style={{height: "300px"}}
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
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      ...product("categories"),
                    }}
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
                      type: "text",
                      ...product("tags"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Unit
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      ...product("unit"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Unit price
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      ...product("unitprice"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              {/* <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={9}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...product("activated")}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      }
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Active"
                    />
                  </div>
                </GridItem>
              </GridContainer>
               */}
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
