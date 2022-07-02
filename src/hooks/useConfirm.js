import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles(styles);

export default function useConfirm() {
  const [confirm, setConfirm] = React.useState();
  const classes = useStyles();

  function showConfirm(title = "success", onConfirm, onCancel = () => {}) {
    setConfirm(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px", color: "black" }}
        title="Confirm"
        onConfirm={() => {
          onConfirm();
          hideConfirm();
        }}
        onCancel={() => {
          onCancel();
          hideConfirm();
        }}
        confirmBtnCssClass={classes.button + " " + classes.danger}
        cancelBtnCssClass={classes.button + " " + classes.success}
        showCancel
      >
        {title}
      </SweetAlert>
    );
  }

  function hideConfirm() {
    setConfirm(null);
  }
  return [confirm, showConfirm, hideConfirm];
}
