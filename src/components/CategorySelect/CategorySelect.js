import React from "react";
import { categoryService } from "../../services/categoryService";
import { Autocomplete } from "@mui/material";
import { TextField } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useInlineStyles = makeStyles({
  root: {
    marginTop: "10px",
    width: "100% !important",
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(34px, 20px) scale(1);",
    },
    "& .MuiInputLabel-root": {
      display: "none",
      color: "#3C4858 !important",
      fontSize: "12px",
      lineHeight: "1.42857",
      textTransform: "uppercase"
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #D2D2D2"
    },
    "& .MuiInput-underline:not(.Mui-disabled):before": {
      borderBottom: "1px solid #D2D2D2"
    },
    "& .MuiInput-underline.Mui-focused:after": {
      borderBottom: "2px solid #9c27b0",
    },
    "& .MuiAutocomplete-input": {
      padding: "12px 0px 7px !important",
      color: "#3C4858 !important",
      fontSize: ".75rem",
      textTransform: "uppercase"
    }
  },
});

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    width: "100% !important",
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(34px, 20px) scale(1);",
    },
    "& .MuiInputLabel-root": {
      color: "#3C4858 !important",
      fontSize: "12px",
      lineHeight: "1.42857",
      textTransform: "uppercase"
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #D2D2D2"
    },
    "& .MuiInput-underline:not(.Mui-disabled):before": {
      borderBottom: "1px solid #D2D2D2"
    },
    "& .MuiInput-underline.Mui-focused:after": {
      borderBottom: "2px solid #9c27b0",
    },
    "& .MuiAutocomplete-input": {
      padding: "12px 0px 7px !important",
      color: "#3C4858 !important",
      fontSize: ".75rem",
      textTransform: "uppercase"
    }
  },
  inputRoot: {
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: "200px"
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    }
  }
});

// eslint-disable-next-line react/prop-types
export default function CategorySelect({ onSelected, haveAll = false, inline = false, value='' }) {
  const classes = useStyles();
  const inlineClasses = useInlineStyles();
  const [categories, setCategories] = React.useState([]);
  const [search, setSearch] = React.useState("");
  async function fetchCategories() {
    try {
      const { data } = await categoryService.list({ search });
      const items = data.items;
      if (haveAll && items) {
        items.unshift({ title: "ALL", id: "" });
      }
      setCategories(items ?? []);
      console.log(value);
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    fetchCategories();
  }, [search]);

  return (
      <Autocomplete
        className={classes.inline}
        classes={inline ? inlineClasses : classes}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          );
        }}
        onChange={(event, newValue) => {
          onSelected(newValue?.id);
        }}
        inputValue={search}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
        }}
        disablePortal
        options={categories}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Category" />}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
  );
}
