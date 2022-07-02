import React from "react";
import { Dialog, DialogContent, DialogTitle, Slide } from "@material-ui/core";

import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { nftService } from "services/nftService";
import Image from "components/Image/Image";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

NftView.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
}
export default function NftView({ id, onClose }) {
  const [modal, setModal] = React.useState(false);
  const [nft, setNft] = React.useState({});
  const [sales, setSales] = React.useState([]);
  async function fetchNFTs() {
    try {
      const { data } = await nftService.view(id);
      setNft(data.nft);
      setSales(data.sales);
    } catch (e) {
      console.log(e);
    }
  }

  function close() {
    onClose();
  }

  React.useEffect(() => {
    if (id) {
      fetchNFTs();
      setModal(true);
    } else {
      setModal(false);
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
      onClose={close}
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
          onClick={close}
        >
          <Close className={classes.modalClose} />
        </Button>
        <h4 className={classes.modalTitle}>NFT: {nft?.name}</h4>
      </DialogTitle>
      <DialogContent
        id="modal-slide-description"
        className={classes.modalBody}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h5><strong>Image: </strong></h5>
            <Image src={nft?.image} type={nft?.fileType} alt={nft?.name} />
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>

            <h5><strong>Title:</strong></h5>
            <h5>{nft?.name}</h5>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Sell method:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.isAuction ? 'Auction' : 'Set price'}</h5>
              </GridItem>
            </GridContainer>


            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Creator: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft?.creator?.title}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Seller: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{sales[0]?.seller?.title}</h5>
              </GridItem>
            </GridContainer>

            <h5><strong>Description:</strong></h5>
            <h5>{nft.description}</h5>

          </GridItem>
        </GridContainer>
      </DialogContent>
    </Dialog>
  )
}
