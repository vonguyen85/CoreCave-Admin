import React from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { productService } from "services/productService";
import { Chip, Fade, makeStyles, Switch, Tooltip } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import {DeleteForever, Edit, Visibility} from "@material-ui/icons";
import useConfirm from "hooks/useConfirm";
import CategorySelect from "../../components/CategorySelect/CategorySelect";

const useStyles = makeStyles({
  filter: {
    display: "flex",
    gap: "40px",
  },
});

function getRandomColor() {
  const colors = ['default', 'primary', 'secondary'];
  return colors[Math.floor(Math.random()*colors.length)];
}

export default function ProductIndex() {
  const classes = useStyles();
  const [confirm, showConfirm] = useConfirm();
  const [items, setItems] = React.useState([]);
  // Query
  const [category, setCategory] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [activated, setActivated] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(10);
  const [count, setCount] = React.useState(0);

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ImageProduct,
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: Category,
      },
      {
        Header: "Tags",
        accessor: "tags",
        sortable: "false",
        Cell: Tags,
      },
      {
        Header: "Price",
        accessor: "price",
        sortable: "true",
      },
      {
        Header: "Active",
        accessor: "activated",
        Cell: Active,
      },
      {
        Header: "Action",
        Cell: function remove({ cell }) {
          return (
            <Action
              cell={cell}
              handleDelete={(row) =>
                showConfirm("Are you sure remove ?", () =>
                  handleDelete(row._id)
                )
              }
            />
          );
        },
      },
    ],
    []
  );

  async function fetchProduct() {
    try {
      const { data } = await productService.list({
        category,
        search,
        page,
        size,
        activated,
      });
      setItems(data.items);
      setCount(data.paginate.count);
      setPage(data.paginate.page);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDelete(id) {
    try {
      await productService.remove(id);
      await fetchProduct();
      alert("done");
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    fetchProduct();
  }, [page, search, activated, category]);

  return (
    <div>
      {confirm}
      <Link to="/admin/product/create">
        <Button color="info">Create new product</Button>
      </Link>

      <div className={classes.filter}>
        <CustomInput
          labelText="Search"
          id="search"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Select
          label={"Status"}
          value={activated}
          onChange={setActivated}
          options={[
            { value: "", label: "ALL" },
            { value: "true", label: "ACTIVATED" },
            { value: "false", label: "UN ACTIVE" },
          ]}
        />

        <CategorySelect haveAll={true} onSelected={(id) => setCategory(id)} />
      </div>

      <TablePaginate
        count={count}
        page={page}
        setPage={setPage}
        size={size}
        columns={columns}
        data={items}
      />
    </div>
  );
}

function Active({ cell }) {
  return (
    <Switch
      checked={cell.value}
      inputProps={{ "aria-label": "controlled" }}
      color="primary"
    />
  );
}

Active.propTypes = {
  cell: PropTypes.any,
};

function ImageProduct({ cell }) {
  return <img src={cell.value} alt="" style={{ height: "50px" }} />;
}

ImageProduct.propTypes = {
  cell: PropTypes.any,
};

function Category({ cell }) {
  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={cell.value?.description ?? ''}
    >
      <span style={{cursor: "pointer"}}>{cell.value?.title}</span>
    </Tooltip>
  );
}
Category.propTypes = {
  cell: PropTypes.any,
};

function Tags({ cell }) {
  return (
    <>
      {cell.value.map((text, index) => {
        return (
          <Chip color={getRandomColor()} key={index} label={text} size="small" />
        );
      })}
    </>
  );
}
Tags.propTypes = {
  cell: PropTypes.any,
};

function Action({ cell, handleDelete }) {
  return (
    <div className="actions-right">
      <Link to={"/admin/product/edit/" + cell.row.original._id}>
        <Button justIcon round simple color="warning" className="edit">
          <Edit />
        </Button>
      </Link>
      <Link to={"/admin/product/edit/" + cell.row.original._id}>
        <Button justIcon round simple color="success" className="edit">
          <Visibility />
        </Button>
      </Link>
      <Button
        justIcon
        round
        simple
        onClick={() => handleDelete(cell.row.original)}
        color="danger"
        className="remove"
      >
        <DeleteForever />
      </Button>{" "}
    </div>
  );
}

Action.propTypes = {
  cell: PropTypes.any,
  handleDelete: PropTypes.func,
};
