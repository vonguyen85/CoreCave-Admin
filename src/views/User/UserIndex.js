/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { userService } from "services/userService";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import { Visibility } from "@material-ui/icons";
import { toast } from "react-toastify";
import { SaleType } from "consts/saleType";

const useStyles = makeStyles({
    filter: {
        display: "flex",
        gap: "40px",
    },
});

export default function UserIndex() {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [size] = React.useState(10);
    const [count, setCount] = React.useState(0);

    const columns = React.useMemo(
        () => [
            {
                Header: "Username",
                accessor: "username",
            },
            {
                Header: "Full Name",
                accessor: "title",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Wallet",
                accessor: "address",
            },
            {
                Header: "Total Buy",
                accessor: "lengthEvent",
            },
            {
                Header: "Total Auction",
                accessor: "lengthAuction",
            },
            {
                Header: "Total Sale",
                accessor: "sale.length",
            },
            {
                Header: "Total Create",
                accessor: "lengthNft",
            },
            {
                Header: "Verified",
                accessor: "verified",
                Cell: Verified
            },
            {
                Header: "Feature",
                accessor: "feature",
                Cell: Feature
            },
            {
                Header: "Action",
                Cell: function remove({ cell }) {
                    return (
                        <Action
                            cell={cell}
                        />
                    );
                },
            },
        ],
        []
    );

    async function fetchUsers() {
        try {
            const { data } = await userService.list({
                search,
                page,
                size,
                status,
            });
            console.log("data", data.items)
            setItems(data.items);
            setCount(data.paginate.count);
            setPage(data.paginate.page);
            const items = await userService.list({
                feature: true,
                page,
                size,
            });
            console.log("data", items)
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        fetchUsers();
    }, [page, search, status]);

    return (
        <div>
            <Link to="/admin/user/create">
                <Button color="info">Create new User</Button>
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
                        { value: "active", label: "ACTIVATED" },
                        { value: "unactive", label: "BLOCKED" },
                    ]}
                />
            </div>

            <TablePaginate
                count={count}
                page={page - 1}
                setPage={page => setPage(page + 1)}
                size={size}
                columns={columns}
                data={items}
            />
        </div>
    );
}

Verified.propTypes = {
    cell: PropTypes.any
}



function Verified({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(cell.value ? cell.value : false);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original._id;
        try {
            await userService.update(id, { verified: isChecked });
            toast.success("Updated user");
        } catch (e) {
            toast.error(e.response.data.message[0]);
        }
    }
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            inputProps={{ "aria-label": "controlled" }}
            color="primary"
        />
    );
}

Feature.propTypes = {
    cell: PropTypes.any
}
function Feature({ cell = null }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(cell?.value ? cell.value : false);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original._id;
        try {
            await userService.update(id, { feature: isChecked });
            toast.success("Updated user");
        } catch (e) {
            toast.error(e.response.data.message[0]);
        }
    }
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            inputProps={{ "aria-label": "controlled" }}
            color="primary"
        />
    );
}

function IsCreator({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(cell.value);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original.id;
        try {
            await userService.update(id, { isCreator: isChecked });
            toast.success("Updated user");
        } catch (e) {
            toast.error(e.response.data.message[0]);
        }
    }
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            inputProps={{ "aria-label": "controlled" }}
            color="primary"
        />
    );
}

IsCreator.propTypes = {
    cell: PropTypes.any,
};

function Action({ cell }) {
    return (
        <div className="actions-right">
            <Link to={"/admin/user/" + cell.row.original.id}>
                <Button
                    justIcon
                    round
                    simple
                    color="success"
                    className="edit"
                >
                    <Visibility />
                </Button>
            </Link>
        </div>
    );
}

Action.propTypes = {
    cell: PropTypes.any,
};
