import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import { Controller } from "react-hook-form";
import Select from "components/Select/Select";

// @material-ui/icons
import Contacts from "@material-ui/icons/Contacts";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import "react-quill/dist/quill.snow.css";
import PictureUpload from "components/CustomUpload/PictureUpload.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { userService } from "services/userService";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import CardFooter from "../../components/Card/CardFooter";
import Button from "../../components/CustomButtons/Button";

const useStyles = makeStyles(styles);

export default function UserCreate() {
  const { register: user, handleSubmit, setValue, control } = useForm({
    status: false,
  });
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const { id } = useParams();

  async function createUser(payload) {
    setLoading(true);
    try {
      const { data } = await userService.create(payload);
      toast.success("Created user");
      window.setTimeout(() => history.push("/admin/user/" + data._id), 2000);
    } catch (e) {
      toast.error(e.response.data.message[0]);
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(payload) {
    setLoading(true);
    if (!payload.password) {
      delete payload.password;
    }
    try {
      const { data } = await userService.update(id, payload);
      toast.success("Updated user");
      window.setTimeout(() => history.push("/admin/user/" + data._id), 2000);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message[0]);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(form) {
    const payload = {
      status: form.status ? "active" : "unactive",
      username: form.new_username,
      password: form.new_password,
      title: form.title,
      bio: form.bio,
      email: form.email,
      publicAddress: form.publicAddress,
      avatar: form.avatar,
      cover: form.cover,
      role: form.role,
      isCreator: form.isCreator,
    };
    if (id) {
      updateUser(payload);
    } else {
      createUser(payload);
    }
  }

  async function fetchUser(id) {
    const { data } = await userService.view(id);
    const fields = ["email", "title", "avatar", "publicAddress", "bio", "isCreator", "role"];
    fields.forEach((field) => setValue(field, data[field]));
    setValue("new_username", data.username);
    setValue("status", data.status === "active");
  }

  React.useEffect(() => {
    if (id) fetchUser(id);
  }, [id]);

  const classes = useStyles();
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader color="rose" icon>
          <CardIcon color="rose">
            <Contacts />
          </CardIcon>
          <h4 className={classes.cardIconTitle}>
            {id ? "Edit user" : "Create user"}
          </h4>
        </CardHeader>
        <GridContainer>
          <GridItem xs={12} sm={12} md={9}>
            <CardBody>
              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Username
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                      autoComplete: "off",
                    }}
                    inputProps={{
                      disabled: !!id,
                      type: "text",
                      autoComplete: "nope",
                      ...user("new_username"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Full Name
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      autoComplete: "off",
                      ...user("title"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Email
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "email",
                      ...user("email"),
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Role
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        name="role"
                        label="Role"
                        onChange={onChange}
                        value={value ?? 'user'}
                        options={[
                          { value: 'admin', label: "ADMIN" },
                          { value: 'user', label: "USER" },
                        ]}
                      />
                    )}
                  />

                </GridItem>
              </GridContainer>

              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Public Address
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      ...user("publicAddress"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer alignItems="flex-start">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Password
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "password",
                      autoComplete: "new-password",
                      ...user("new_password"),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    IsCreator
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <Controller
                    control={control}
                    name="isCreator"
                    render={({ field: { value, onChange } }) => (
                      <Box pt={5}>
                        <input
                          id={ value + 'a' }
                          name="role"
                          type="checkbox"
                          onChange={onChange}
                          checked={value}
                        />
                      </Box>
                    )}
                  />
                </GridItem>

              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Bio
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      multiline: true,
                      rows: 8,
                      ...user("bio"),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={6} md={6}>
                  <Button onClick={() => history.goBack()}>Cancel</Button>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    variant="outlined"
                  >
                    Submit
                  </LoadingButton>
                </GridItem>
              </GridContainer>
            </CardFooter>
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <Box sx={{ justifyContent: "center" }}>
              …
              <Controller
                control={control}
                name="avatar"
                render={({ field: { value, onChange } }) => (
                  <PictureUpload value={value} onChange={onChange} />
                )}
              />
            </Box>
            <Box sx={{ justifyContent: "center" }}>
              …
              <Controller
                control={control}
                name="cover"
                render={({ field: { value, onChange } }) => (
                  <PictureUpload value={value} onChange={onChange} />
                )}
              />
            </Box>
          </GridItem>
        </GridContainer>
      </form>
    </Card>
  );
}
