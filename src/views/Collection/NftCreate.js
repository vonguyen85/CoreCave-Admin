import React from "react";
import Select from "components/Select/Select";
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

import { nftService } from "services/nftService";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUpload from "../../components/CustomUpload/ImageUpload";

const useStyles = makeStyles(styles);

export default function NftCreate() {
  const { register: nft, handleSubmit, setValue, control } = useForm();
  const { id } = useParams();
  const history = useHistory();

  async function create(payload) {
    try {
      const { data } = await nftService.create(payload);
      toast.success("Created");
      window.setTimeout(
        () => history.push("/admin/nft/" + data._id),
        500
      );
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function update(payload) {
    try {
      await nftService.update(id, payload);
      toast.success("Updated");
      window.setTimeout(
          () => history.push("/admin/nft/"),
          500
      );
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

  async function fetchNft() {
    try {
      const { data } = await nftService.view(id);
      const fields = ['title', 'description', 'activated', 'edition', 'isAuction', 'price', 'edition', 'creator', 'minter', 'owner', 'seller', 'image'];
      fields.forEach(field => setValue(field, data[field]));
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchNft()
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
            <h4 className={classes.cardIconTitle}>{!id ? 'Create NFT' : 'Edit NFT'}</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
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
                          ...nft("title"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Description
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          multiline: true,
                          rows: 4,
                          ...nft("description"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Sell method
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <Controller
                        control={control}
                        name="image"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            name="isAuction"
                            label=""
                            onChange={onChange}
                            value={value ?? 'false'}
                            options={[
                              { value: 'false', label: "Set price" },
                              { value: 'true', label: "Auction" },
                            ]}
                          />
                        )}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Price
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          ...nft("price"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Edition
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "number",
                          ...nft("edition"),
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Creator
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "text",
                            ...nft("creator"),
                          }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Minter
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "text",
                            ...nft("minter"),
                          }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Owner
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "text",
                            ...nft("owner"),
                          }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormLabel className={classes.labelHorizontal}>
                        Seller
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7}>
                      <CustomInput
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "text",
                            ...nft("seller"),
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
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <Controller
                    control={control}
                    name="image"
                    render={({ field: { value, onChange } }) => (
                      <ImageUpload value={value} onChange={onChange} />
                    )}
                  />
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
