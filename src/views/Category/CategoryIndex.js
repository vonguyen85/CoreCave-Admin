import React from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { categoryService } from "services/categoryService";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import { DeleteForever, Edit, Visibility } from "@material-ui/icons";
import useConfirm from "hooks/useConfirm";
import { toast } from "react-toastify";
import CategoryView from "./CategoryView";

const useStyles = makeStyles({
  filter: {
    display: "flex",
    gap: "40px",
  },
});

export default function CategoryIndex() {
  const classes = useStyles();
  const [confirm, showConfirm] = useConfirm();
  const [items, setItems] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [activated, setActivated] = React.useState("");
  const [viewId, setViewId] = React.useState("");
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
                  handleDelete(row.id)
                )
              }
              handleView={(row) => setViewId(row.id)}
            />
          );
        },
      },
    ],
    []
  );

  async function fetchCategories() {
    try {
      const { data } = await categoryService.list({
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
      await categoryService.remove(id);
      await fetchCategories();
      toast.success("Deleted category");
    } catch (e) {
      console.log(e);
      toast.success("Cannot Delete category");
    }
  }

  React.useEffect(() => {
    fetchCategories();
  }, [page, search, activated]);

  return (
    <div>
      <CategoryView id={viewId} />

      {confirm}
      <Link to="/admin/category/create">
        <Button color="info">Create new category</Button>
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
            { value: "false", label: "UNACTIVE" },
          ]}
        />
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

function Action({ cell, handleDelete, handleView }) {
  return (
    <div className="actions-right">
      <Link to={"/admin/category/edit/" + cell.row.original._id}>
        <Button justIcon simple round color="warning">
          <Edit />
        </Button>
      </Link>
      <Button justIcon round simple color="success" onClick={() => handleView(cell.row.original)}>
        <Visibility />
      </Button>
      <Button
        justIcon
        round
        simple
        onClick={() => handleDelete(cell.row.original)}
        color="danger"
      >
        <DeleteForever />
      </Button>{" "}
    </div>
  );
}

Action.propTypes = {
  cell: PropTypes.any,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func,
};
