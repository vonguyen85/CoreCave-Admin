import React, { useState } from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { nftAuctionService } from "services/nftAuctionService";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import { DeleteForever, Edit, Gavel, Visibility } from "@material-ui/icons";
import useConfirm from "hooks/useConfirm";
import { toast } from "react-toastify";
import NftAuctionView from "./NftAuctionView";
import { createMarketItem } from "utils/interact";

const useStyles = makeStyles({
    filter: {
        display: "flex",
        gap: "40px",
    },
});

export default function NftAuctionIndex() {
    const classes = useStyles();
    const [confirm, showConfirm] = useConfirm();
    const [items, setItems] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [viewId, setViewId] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [size] = React.useState(10);
    const [count, setCount] = React.useState(0);

    const columns = React.useMemo(
        () => [
            /*{
                Header: "Thumbnail",
                accessor: "image",
                Cell: Thumnail,
            },*/
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Supply",
                accessor: "supply",
            },
            {
                Header: "Creator",
                accessor: "creator",
            },
            {
                Header: "Status",
                accessor: "status",
            },
            {
                Header: "Minted Date",
                accessor: "mintedAt",
            },
            {
                Header: "Start Date",
                accessor: "dateStart",
            },
            {
                Header: "End Date",
                accessor: "dateEnd",
            },
            // {
            //     Header: "Type",
            //     // @ts-ignore
            //     Cell: Type,
            // },
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
                            handleMint={mint}
                        />
                    );
                },
            },
        ],
        []
    );

    async function fetchNftAuctions() {
        try {
            const { data } = await nftAuctionService.list({
                search,
                page,
                size,
                status,
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
            await nftAuctionService.remove(id);
            await fetchNftAuctions();
            toast.success("Deleted nft");
        } catch (e) {
            console.log(e);
            toast.success("Cannot Delete nft");
        }
    }

    async function mint(item) {
        const tokentId = await createMarketItem(item);
        console.log("After mint", tokentId);
        if (tokentId) {
            await nftAuctionService.minted(item.id, tokentId);
            fetchNftAuctions();
        }
    }

    React.useEffect(() => {
        fetchNftAuctions();
    }, [page, search, status]);

    return (
        <div>
            <NftAuctionView id={viewId} onClose={() => setViewId('')} />

            {confirm}
            <Link to="/admin/nft/create">
                <Button color="info">Create new nft</Button>
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
                        { value: "uploaded", label: "UPLOADED" },
                        { value: "minted", label: "MINTED" },
                        { value: "sold", label: "SOLD" },
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

function Action({ cell, handleDelete, handleView, handleMint }) {
    const [mintting, setMintting] = useState(false);
    async function onMint(item) {
        try {
            setMintting(true);
            await handleMint(item);
        } catch (e) {
            console.log('error', e);
        } finally {
            setMintting(false);
        }
    }

    if (mintting) {
        return (
            <div className="actions-right"> Please accept 2 transaction... </div>
        )
    }

    return (
        <div className="actions-right">
            <Button justIcon round simple color="success" onClick={() => handleView(cell.row.original)}>
                <Visibility />
            </Button>
            { (cell.row.original.status != 'minted') && (
                <>
                    <Button justIcon simple round color="success" onClick={() => onMint(cell.row.original)}>
                        <Gavel />
                    </Button>
                    <Link to={"/admin/nft/edit/" + cell.row.original._id}>
                        <Button justIcon simple round color="warning">
                            <Edit />
                        </Button>
                    </Link>
                    <Button
                        justIcon
                        round
                        simple
                        onClick={() => handleDelete(cell.row.original)}
                        color="danger"
                    >
                        <DeleteForever />
                    </Button>{" "}
                </>
            )}
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
    return <img src={cell.value} alt="" style={{ height: "50px" }} />;
}
Thumnail.propTypes = {
    cell: PropTypes.any,
};

function Type({ cell }) {
    // return cell.row.original.image.toLowerCase().match(/\.(mp4|amv)$/) ? 'Video' : 'Image';
    return cell.row.original.image?.toLowerCase().match(/\.(mp4|amv)$/) ? 'Video' : 'Image';
}
Type.propTypes = {
    cell: PropTypes.any,
};
