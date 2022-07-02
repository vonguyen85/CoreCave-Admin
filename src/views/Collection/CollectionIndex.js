import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { toast } from "react-toastify";
import { collectionService } from "services/collectionService";
import { Visibility } from "@material-ui/icons";
import * as moment from "moment"
import CollectionView from "./CollectionView";

const useStyles = makeStyles({
    filter: {
        display: "flex",
        gap: "40px",
    },
});

export default function CollectionIndex() {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [size] = React.useState(5);
    const [count, setCount] = React.useState(0);
    const [viewId, setViewId] = React.useState(null);
    const [chain_pass, setChain_pass] = React.useState([]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Thumbnail",
                accessor: "image",
                Cell: Thumnail
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Symbol",
                accessor: "symbol",
            },
            {
                Header: "Owner",
                accessor: "owner",
            },
            {
                Header: "Is Top",
                accessor: "isTop",
                Cell: IsTop,
            },
            {
                Header: "Is Hot",
                accessor: "isHot",
                Cell: IsHot,
            },
            {
                Header: "Create At",
                accessor: "createdAt",
                Cell: CreateAt
            },
            {
                Header: "Action",
                Cell: function remove({ cell }) {
                    return (
                        <Action
                            cell={cell}
                            handleView={(row) => {
                                setViewId(row._id)
                            }}

                        />
                    );
                },
            },
        ],
        []
    );


    function CreateAt({ cell }) {
        return moment(cell.value).format("MM/DD/YYYY")
    }

    CreateAt.propTypes = {
        cell: PropTypes.any
    }

    function Thumnail({ cell }) {
        return <img src={cell.value} alt="" style={{ height: "50px" }} />;
    }

    Thumnail.propTypes = {
        cell: PropTypes.any,
    };

    async function fetchCollections() {
        try {
            const { data } = await collectionService.list({
                search,
                page,
                size,
                status,
            });
            console.log("collection", data)
            setItems(data.items);
            setCount(data.paginate.count);
            setPage(data.paginate.page);
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        fetchCollections();
    }, [page, search, status]);

    return (
        <div>
            <CollectionView id={viewId} chain={chain_pass} onClose={() => { setViewId(null); setChain_pass('') }} />
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
                        { value: "isTop", label: "Is Top" },
                        { value: "isHot", label: "Is Hot" },
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

IsHot.propTypes = {
    cell: PropTypes.any,
};

function IsHot({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(cell.value);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original._id;
        try {
            await collectionService.update(id, { isHot: isChecked });
            toast.success("Updated collections");
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

IsTop.propTypes = {
    cell: PropTypes.any,
};

function IsTop({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(cell.value);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original._id;
        try {
            await collectionService.update(id, { isTop: isChecked });
            toast.success("Updated collections");
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

function Action({ cell, handleView }) {
    return (
        <div className="actions-right">
            <Button justIcon round simple color="success" onClick={() => handleView(cell.row.original)}>
                <Visibility />
            </Button>
        </div>
    );
}

Action.propTypes = {
    cell: PropTypes.any,
    handleView: PropTypes.func,
};