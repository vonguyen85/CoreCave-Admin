import React from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { nftService } from "services/nftService";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Visibility } from "@material-ui/icons";
import NftView from "./NftView";
import * as moment from "moment"
import FILETYPE from "consts/fileType";
import Image from "components/Image/Image";

const useStyles = makeStyles({
    filter: {
        display: "flex",
        gap: "40px",
    },
});

export default function NftIndex() {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [type, setType] = React.useState("all");
    const [viewId, setViewId] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [size] = React.useState(10);
    const [count, setCount] = React.useState(0);

    const columns = React.useMemo(
        () => [
            {
                Header: "Thumbnail",
                accessor: "image",
                Cell: Thumnail,
            },
            {
                Header: "Title",
                accessor: "name",
            },
            {
                Header: "Creator",
                accessor: "creator.title",
            },
            {
                Header: "Type",
                accessor: "fileType",
                Cell: Type,
            },
            {
                Header: "Create At",
                accessor: "createdAt",
                Cell: CreatedAt
            },
            {
                Header: "Action",
                Cell: function remove({ cell }) {
                    return (
                        <Action
                            cell={cell}
                            handleView={(row) => setViewId(row.id)}
                        />
                    );
                },
            },
        ],
        []
    );

    async function fetchNfts() {
        try {
            const { data } = await nftService.list({
                search,
                page,
                size,
                fileType: type,
            });
            setItems(data.items);
            setCount(data.paginate.count);
            setPage(data.paginate.page);
        } catch (e) {
            console.log(e);
        }
    }

    React.useEffect(() => {
        fetchNfts();
    }, [page, search, type]);

    return (
        <div>
            <NftView id={viewId} onClose={() => setViewId('')} />
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
                    label={"Type"}
                    value={type}
                    onChange={setType}
                    options={[
                        { value: "all", label: "ALL" },
                        { value: FILETYPE.IMAGE, label: "IMAGE" },
                        { value: FILETYPE.VIDEO, label: "VIDEO" },
                        { value: FILETYPE.AUDIO, label: "AUDIO" },
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


function CreatedAt({ cell }) {
    return moment(cell.value).format("DD/MM/YYYY");
}

CreatedAt.propTypes = {
    cell: PropTypes.any
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
    handleDelete: PropTypes.func,
    handleView: PropTypes.func,
    handleMint: PropTypes.func,
};

function Thumnail({ cell }) {
    const src = cell.value;
    const alt = cell.row.original.name
    const type = cell.row.original.fileType
    return <Image src={src} alt={alt} type={type} />
}
Thumnail.propTypes = {
    cell: PropTypes.any,
};

function Type({ cell }) {
    switch (cell.value) {
        case FILETYPE.VIDEO:
            return "Video";
        case FILETYPE.IMAGE:
            return "Image";
        case FILETYPE.AUDIO:
            return "Audio"
        default:
            return "Other"
    }
}
Type.propTypes = {
    cell: PropTypes.any,
};
