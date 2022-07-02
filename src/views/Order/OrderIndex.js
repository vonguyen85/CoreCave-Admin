import React from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { categoryService } from "services/categoryService";
import { makeStyles } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import { DeleteForever, Edit, Visibility } from "@material-ui/icons";
import useConfirm from "hooks/useConfirm";
import { toast } from "react-toastify";
import CategoryView from "./CategoryView";
import { orderService } from "../../services/orderService";

const useStyles = makeStyles({
  filter: {
    display: "flex",
    gap: "40px",
  },
});

export default function OrderIndex() {
  const classes = useStyles();
  const [confirm, showConfirm] = useConfirm();
  const [status, setStatus] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [viewId, setViewId] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(10);
  const [count, setCount] = React.useState(0);

  const columns = React.useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "customerName",
      },
      {
        Header: "Phone",
        accessor: "customerPhone",
      },
      {
        Header: "Address",
        accessor: "customerAddress",
      },
      {
        Header: "Author",
        accessor: "createdBy.username",
      },
      {
        Header: "Total",
        accessor: "total",
      },
      {
        Header: "Items",
        accessor: "items",
        // eslint-disable-next-line no-unused-vars,react/prop-types
        Cell: function ({ cell }) {
          // eslint-disable-next-line react/prop-types
          return <span>{cell?.value?.length}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: Status,
      },
      {
        Header: "Action",
        Cell: function remove({ cell }) {
          return (
            <Action
              cell={cell}
              handleDelete={(row) =>
                showConfirm("Are you sure remove ?", () => handleDelete(row.id))
              }
              handleView={(row) => setViewId(row.id)}
            />
          );
        },
      },
    ],
    []
  );

  async function fetchOrders() {
    try {
      const { data } = await orderService.list({
        status,
        search,
        page,
        size,
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
      await fetchOrders();
      toast.success("Deleted category");
    } catch (e) {
      console.log(e);
      toast.success("Cannot Delete category");
    }
  }

  React.useEffect(() => {
    fetchOrders();
  }, [page, search, status]);

  return (
    <div>
      <CategoryView id={viewId} />

      {confirm}
      <Link to="/admin/order/create">
        <Button color="info">Create new order</Button>
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
          value={status}
          onChange={setStatus}
          options={[
            { value: "", label: "ALL" },
            { value: "pending", label: "PENDING" },
            { value: "shipping", label: "SHIPPING" },
            { value: "success", label: "SUCCESS" },
            { value: "return", label: "RETURN" },
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

function Status({ cell }) {
  function getColor() {
    switch (cell.row.original.status) {
      case "pending":
        return "danger";
      case "shipping":
        return "warning";
      case "success":
        return "success";
      default:
        return "default";
    }
  }
  return <Button color={getColor()} size="sm">{cell.row.original.status}</Button>;
}
Status.propTypes = {
  cell: PropTypes.any,
};

function Action({ cell, handleDelete, handleView }) {
  return (
    <div className="actions-right">
      <Link to={"/admin/order/edit/" + cell.row.original._id}>
        <Button justIcon simple round color="warning">
          <Edit />
        </Button>
      </Link>
      <Button
        justIcon
        round
        simple
        color="success"
        onClick={() => handleView(cell.row.original)}
      >
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
