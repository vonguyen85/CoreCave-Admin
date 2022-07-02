import React from "react";
import { Dialog, DialogContent, DialogTitle, Slide} from "@material-ui/core";

import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import {makeStyles} from "@material-ui/core/styles";
import Button from "../../components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import {categoryService} from "../../services/categoryService";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

CategoryView.propTypes = {
  id: PropTypes.string,
}
export default function CategoryView({ id }) {
  const [modal, setModal] = React.useState(false);
  const [category, setCategory] = React.useState({});

  async function fetchCategory() {
    try {
      const { data } = await categoryService.view(id);
      setCategory(data);
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    if (id) {
      fetchCategory();
      setModal(true);
    }
  }, [id])

  const classes = useStyles();
  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      open={modal}
      transition={Transition}
      keepMounted
      onClose={() => setModal(false)}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <Button
          justIcon
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="transparent"
          onClick={() => setModal(false)}
        >
          <Close className={classes.modalClose} />
        </Button>
        <h4 className={classes.modalTitle}>Category: {category.title}</h4>
      </DialogTitle>
      <DialogContent
        id="modal-slide-description"
        className={classes.modalBody}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <h5><strong>Title:</strong></h5>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            <h5>{category.title}</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <h5><strong>Description:</strong></h5>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
            <h5>{category.description}</h5>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <h5><strong>Active:</strong></h5>
          </GridItem>
          <GridItem xs={12} sm={12} md={9}>
                <Checkbox
                  checked={category.activated}
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
      </DialogContent>
    </Dialog>
  )
}