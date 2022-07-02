import React from "react";

import { Alert, Snackbar } from "@mui/material";

export default function useNotify() {
  const [type, setType] = React.useState("success");
  const [message, setMessage] = React.useState("Success");
  const [open, setOpen] = React.useState(false);

  const notify = (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={type}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );

  function showSuccess(message = "Success") {
    setType("success");
    setMessage(message);
    setOpen(true);
  }

  function showError(message = "Error") {
    setType("error");
    setMessage(message);
    setOpen(true);
  }

  return [notify, showSuccess, showError];
}
