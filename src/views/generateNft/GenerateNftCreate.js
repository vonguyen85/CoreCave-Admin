import FormLabel from "@material-ui/core/FormLabel";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Contacts from "@material-ui/icons/Contacts";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Button from "components/CustomButtons/Button.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Select from "components/Select/Select";
import React, {useState, useEffect} from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { traitService } from "services/traitService";
import mergeImages from 'merge-images';
import _ from "lodash";

const useStyles = makeStyles(styles);

export default function GenerateNftCreate() {
  const { handleSubmit, setValue, control } = useForm();setValue;
  const { id } = useParams();
  const history = useHistory();
  const [traitGroups, setTraitGroups] = useState({});
  const [traitLayers, setTraitLayers] = useState({});

  const traitTypes = traitService.types();

  async function create(payload) {
    try {
      const { data } = await traitService.create(payload);
      toast.success("Created");
      window.setTimeout(
        () => history.push("/admin/generatenft/" + data._id),
        500
      );
    } catch (e) {
      toast.error(e?.response?.data?.message[0]);
      console.log(e);
    }
  }

  async function update(payload) {
    try {
      await traitService.update(id, payload);
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

  async function fetchTraitGroups() {
    try {
      const { data } = await traitService.groupsByType();
      setTraitGroups(data);
      const fields = Object.keys(traitTypes);
      fields.forEach(field => setValue(field, ''));
    } catch (e) {
      console.log(e);
    }
  }
  function getSelectOption(traitGroups, type) {
    let options = [];
    if (traitGroups && Array.isArray(traitGroups[type])) {
      options = traitGroups[type];
    }
    return options.map(item => ({label: item.title, value: item.id}))
  }

  function changeSelect(value, typeName) {
    let trait = traitGroups[typeName].find(item => item.id == value);
    let newTraitLayers = {
      ...traitLayers,
      [traitTypes[typeName].layer]: trait
    }
    combine(Object.values(newTraitLayers) || [])

    setValue(typeName, value)
    setTraitLayers(newTraitLayers);
  }

  async function download(e){
   e.preventDefault();
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('combined-image').src
    link.click();
  }

  async function combine(traitList) {
    traitList = _.orderBy(traitList, [function(trait) { return traitTypes[trait.type].layer; }] , ['asc']);
    const sources = traitList.map(item=>item.image);
    const previewImage = document.getElementById('combined-image')
    if (sources.length>0) {
      const b64 = await mergeImages(sources, {
        format: 'image/png',
        quality: 0.92,
        crossOrigin: "Anonymous",
      });
      previewImage.src = b64;
    } else {
      previewImage.src = 'https://www.w3schools.com/w3css/img_lights.jpg'
    }
  }

  async function fetchNft() {
    try {
      // const { data } = await traitService.view(id);
      // const fields = Object.keys(traitTypes);
      // fields.forEach(field => setValue(field, data[field] || {}));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchTraitGroups()
  }, []);

  useEffect(() => {
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
            <h4 className={classes.cardIconTitle}>Generate NFT</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  {traitTypes && Object.values(traitTypes).map(traitType =>
                    <GridContainer key={traitType.name}>
                      <GridItem xs={12} sm={12} md={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          {traitType.name[0].toUpperCase() + traitType.name.slice(1).toLowerCase()}
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={5}>
                        <Controller
                          control={control}
                          name={traitType.name}
                          defaultValue=''
                          render={({ field: { value} }) => (
                            <Select
                              name={traitType.name}
                              label=""
                              onChange={value => {
                                changeSelect(value, traitType.name)
                              }}
                              value={value}
                              options={getSelectOption(traitGroups, traitType.name)}
                            />
                          )}
                        />
                      </GridItem>
                    </GridContainer>
                  )}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Body*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="BODY"*/}
                  {/*      defaultValue={{}}*/}
                  {/*      render={({ field: { value } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="BODY"*/}
                  {/*          label=""*/}
                  {/*          onChange={value => changeSelect(value, 'BODY')}*/}
                  {/*          value={value}*/}
                  {/*          options={getSelectOption(traitGroups, 'BODY')}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Face*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="face"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="face"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Mouth*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="mouth"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="mouth"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Eyes*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="eyes"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="eyes"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Clothes*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="clothes"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="clothes"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Glasses*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="glasses"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="glasses"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Hat*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="hat"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="hat"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Earring*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="earring"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="earring"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}
                  {/*<GridContainer>*/}
                  {/*  <GridItem xs={12} sm={12} md={3}>*/}
                  {/*    <FormLabel className={classes.labelHorizontal}>*/}
                  {/*      Necklace*/}
                  {/*    </FormLabel>*/}
                  {/*  </GridItem>*/}
                  {/*  <GridItem xs={12} sm={12} md={5}>*/}
                  {/*    <Controller*/}
                  {/*      control={control}*/}
                  {/*      name="necklace"*/}
                  {/*      render={({ field: { value, onChange } }) => (*/}
                  {/*        <Select*/}
                  {/*          name="necklace"*/}
                  {/*          label=""*/}
                  {/*          onChange={onChange}*/}
                  {/*          value={value}*/}
                  {/*          options={[*/}
                  {/*            { value: 'false', label: "Set price" },*/}
                  {/*            { value: 'true', label: "Auction" },*/}
                  {/*          ]}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    />*/}
                  {/*  </GridItem>*/}
                  {/*</GridContainer>*/}




                  {/* <GridContainer justify="flex-end">
                    <GridItem xs={12} sm={12} md={9}>
                      <Button onClick={() => history.goBack()}>Cancel</Button>
                      <Button color="rose" type="submit">
                        Submit
                      </Button>
                    </GridItem>
                  </GridContainer> */}
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ textAlign: "center", position: "relative" }}>
                  {/* <Controller
                    control={control}
                    name="image"
                    render={({ field: { value, onChange } }) => (
                      <ImageUpload value={value} onChange={onChange} />
                    )}
                  /> */}
                  {/*{traitLayerList && traitLayerList.map(item => (*/}
                  {/*  <img className={"trait-layer-test"} key = {item.id}*/}
                  {/*    style={{ width: "100%", position: "absolute", top: 0, left: 0}}*/}
                  {/*    src={item.image} alt="" crossOrigin="anonymous"/>*/}
                  {/*))}*/}

                  {/*<img id="image_result" style={{width: '100%', display: (traitLayers.length==0? "none":"block")}}></img>*/}
                  <img id="combined-image" style={{width: "100%"}} alt="" src="https://www.w3schools.com/w3css/img_lights.jpg"></img>
                  <Button color="rose" type="submit" onClick={download}>Download</Button>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>\
    </GridContainer>
  );
}


