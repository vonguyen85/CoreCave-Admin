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

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

NftAuctionView.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
}
export default function NftAuctionView({ id, onClose }) {
  const [modal, setModal] = React.useState(false);
  const [nft, setNft] = React.useState({});

  async function fetchNFTauctions() {
    try {
      const { data } = await nftService.view(id);
      setNft(data);
    } catch (e) {
      console.log(e);
    }
  }

  function close() {
    onClose();
  }

  React.useEffect(() => {
    if (id) {
      fetchNFTauctions();
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
        <h4 className={classes.modalTitle}>Category: {nft.title}</h4>
      </DialogTitle>
      <DialogContent
        id="modal-slide-description"
        className={classes.modalBody}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h5><strong>Image: </strong></h5>
            {!nft?.image?.toLowerCase().match(/\.(mp4|amv)$/)
              ? <img src={nft?.image} alt="..." width="100%" />
              : <video width="100%" src={nft?.image} alt="..." controls="true" />
            }
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>

            <h5><strong>Title:</strong></h5>
            <h5>{nft.title}</h5>

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
                <h5><strong>Price:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.price} ETH</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Edition: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.edition}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Creator: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.creator}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Minter: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.minter}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Owner: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.owner}</h5>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Seller: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft.seller}</h5>
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
