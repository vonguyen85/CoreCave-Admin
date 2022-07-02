/* eslint-disable no-unused-vars */
import React from "react";
import { Dialog, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import Image from "components/Image/Image";
import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button";
import Close from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import { nftSaleService } from "services/nftSaleService";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import * as moment from "moment"
const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

NftMarketView.propTypes = {
  id: PropTypes.string,
  chain: PropTypes.any,
  onClose: PropTypes.func,
}
export default function NftMarketView({ id, onClose, chain }) {

  const [modal, setModal] = React.useState(false);
  const [nft, setNft] = React.useState({});
  const [auctionEnddate, setAuctionEnddate] = React.useState();

  async function fetchNFTs() {
    try {
      if (id) {
        const { data } = await nftSaleService.view(id);
        console.log(data);
        setNft(data)
      }
    } catch (e) {
      setAuctionEnddate()
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

  const renderEndTime = (endTime) => {
    const current = new Date().getTime() / 1000;
    if (endTime < current) {
      return "Expired Auction"
    }
    if (endTime != 0) {
      return moment((new Date(endTime * 1000)).toString()).format("DD/MM/YYYY")
    }
    return endTime;
  }

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
        <h4 className={classes.modalTitle}>{nft?.title}</h4>
      </DialogTitle>
      <DialogContent
        id="modal-slide-description"
        className={classes.modalBody}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h5><strong>Image: </strong></h5>
            <Image alt={nft?.nft?.name} src={nft?.nft?.image} type={nft?.nft?.fileType} />
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Name:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft?.nft?.name}</h5>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Price:</strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft?.unitPrice}</h5>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Royal: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft?.nft?.royalty}</h5>
              </GridItem>
            </GridContainer>
            {
              nft?.creator && <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <h5><strong>Creator: </strong></h5>
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                  <h5>{nft?.creator?.title}</h5>
                </GridItem>
              </GridContainer>
            }
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>Seller: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{nft?.seller?.title}</h5>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <h5><strong>End Time: </strong></h5>
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <h5>{renderEndTime(nft?.endTime)}</h5>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </DialogContent>
    </Dialog>
  )
}
