import React from "react";
import { productService } from "../../services/productService";
import { Autocomplete } from "@mui/material";
import {Box, TextField} from "@material-ui/core";
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
export default function ProductSelect({ onSelected, haveAll = false, inline = false }) {
  const classes = useStyles();
  const inlineClasses = useInlineStyles();
  const [products, setProducts] = React.useState([]);
  const [search, setSearch] = React.useState("");
  async function fetchProducts() {
    try {
      const { data } = await productService.list({ search });
      const items = data.items;
      if (haveAll && items) {
        items.unshift({ title: "ALL", id: "" });
      }
      setProducts(items ?? []);
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
      <Autocomplete
        className={classes.inline}
        classes={inline ? inlineClasses : classes}
        renderOption={(props, option) => {
          return (
            <li sx={{ '& > img': { mr: 2, flexShrink: 2 } }} {...props} key={option.id} >
              <img
                loading="lazy"
                width="50"
                src={option.image}
              />
              <Box ml={2}>
                <span>{option.title}</span>
                <br/>
                <i>{option.price}</i>
              </Box>
            </li>
          );
        }}
        onChange={(event, newValue) => {
          onSelected(newValue);
          setSearch('');
        }}
        inputValue={search}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
        }}
        disablePortal
        options={products}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Product" />}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
  );
}
