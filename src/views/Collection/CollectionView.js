import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import "react-quill/dist/quill.snow.css";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Button from "../../components/CustomButtons/Button";
import { Dialog, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { collectionService } from "services/collectionService";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

CollectionView.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
}

export default function CollectionView({ id, onClose }) {
  const [modal, setModal] = React.useState(false);
  const [collection, setCollection] = React.useState({});

  async function fetchCollection(id) {
    const { data } = await collectionService.view(id);
    setCollection(data);
  }

  React.useEffect(() => {
    if (id) {
      fetchCollection(id);
      setModal(true);
    } else {
      setModal(false);
    }
  }, [id]);

  const classes = useStyles();

  function close() {
    onClose()
  }

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal,
      }}
      open={modal}
      transition={Transition}
      keepMounted
      onClose={close}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
        style={{ display: "flex" }}
      >
        <h4 className={classes.modalTitle}>{collection?.name}</h4>
        <Button
          style={{ marginLeft: "auto" }}
          justIcon
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="transparent"
          onClick={close}
        >
          <Close className={classes.modalClose} />
        </Button>
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h5>
              <strong>Image: </strong>
            </h5>
            <img src={collection?.image} alt="..." width="100%" />
            {collection.cover && (
              <div>
                <h5>
                  <strong>Cover: </strong>
                </h5>
                <img src={collection?.cover} alt="..." width="100%" />
              </div>
            )}
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5>
                  <strong>Name:</strong>
                </h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{collection.name}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5>
                  <strong>Symbol: </strong>
                </h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{collection.symbol}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5>
                  <strong>Address: </strong>
                </h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{collection.address}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5>
                  <strong>Owner: </strong>
                </h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{collection.owner}</h5>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </DialogContent>
    </Dialog>
  );
}