import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { default as MtSelect } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";

import styles from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
const useStyles = makeStyles(styles);

const OptionShape = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

Select.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionShape).isRequired,
};

export default function Select({ label, value, onChange, options }) {
  const handleSimple = (event) => {
    onChange(event.target.value);
  };
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.selectFormControl}>
      <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
        {label}
      </InputLabel>
      <MtSelect
        MenuProps={{
          className: classes.selectMenu,
        }}
        classes={{
          select: classes.select,
        }}
        value={value}
        onChange={handleSimple}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            classes={{
              root: classes.selectMenuItem,
              selected: classes.selectMenuItemSelected,
            }}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </MtSelect>
    </FormControl>
  );
}
