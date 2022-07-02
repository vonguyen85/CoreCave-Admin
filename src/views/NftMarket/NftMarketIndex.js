import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TablePaginate from "components/TablePaginate/TablePaginate";
import Select from "components/Select/Select";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { makeStyles, Switch } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import { Visibility } from "@material-ui/icons";
import { toast } from "react-toastify";
import { nftSaleService } from "../../services/nftSaleService";
import NftMarketView from "./NftMarketView";
import * as moment from "moment"
import Image from "components/Image/Image";

const useStyles = makeStyles({
    filter: {
        display: "flex",
        gap: "40px",
    },
});

export default function NftMarketIndex() {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [saleType, setSaleType] = React.useState("");
    const [viewId, setViewId] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [size] = React.useState(5);
    const [count, setCount] = React.useState(0);
    const [chain_pass, setChain_pass] = React.useState([]);

    async function fetchNfts() {
        try {
            const { data } = await nftSaleService.list({
                search,
                page,
                limit: size,
                saleType,
            });
            console.log("nft", data);
            setItems(data.items);
            setCount(data.paginate.count);
            setPage(data.paginate.page);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchNfts();
    }, [page, search, saleType])

    const columns = React.useMemo(
        () => [
            {
                Header: "Thumbnail",
                accessor: "nft.image",
                Cell: Thumnail,
            },
            {
                Header: "Name",
                accessor: "nft.name",
            },
            {
                Header: "Price",
                accessor: "unitPrice",
            },
            {
                Header: "Seller",
                accessor: "seller.title",
            },
            {
                Header: "Sale Type",
                accessor: "saleType",
                Cell: SaleType
            },
            {
                Header: "Type",
                accessor: "fileType",
                Cell: Type,
            },
            {
                Header: "Feature",
                accessor: "feature",
                Cell: Feature
            },
            {
                Header: "Is Denied",
                accessor: "isDenied",
                Cell: IsDenied
            },
            {
                Header: "Is Hot",
                accessor: "isHot",
                Cell: IsHot
            },
            {
                Header: "Create At",
                accessor: "createAt",
                Cell: CreateAt,
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


    return (
        <div>
            <NftMarketView id={viewId} chain={chain_pass} onClose={() => { setViewId(''); setChain_pass('') }} />

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
                    label={"Sale Type"}
                    value={saleType}
                    onChange={setSaleType}
                    options={[
                        { value: "", label: "ALL" },
                        { value: "1", label: "AUCTION" },
                        { value: "0", label: "SALE" },
                    ]}
                />
            </div>

            <TablePaginate
                count={count}
                page={page - 1}
                setPage={(page) => setPage(page + 1)}
                size={size}
                columns={columns}
                data={items}
            />
        </div>
    );
}

IsHot.propTypes = {
    cell: PropTypes.any
}

function IsHot({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (!cell.value) {
            cell.value = false
        }
        setChecked(cell.value);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        console.log(isChecked);
        const id = cell.row.original._id;
        try {
            const { data } = await nftSaleService.update(id, { isHot: isChecked });
            console.log(data);
            toast.success("Updated NFT Sale feild is hot");
        } catch (e) {
            console.log(e);
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

IsDenied.propTypes = {
    cell: PropTypes.any
}

function IsDenied({ cell }) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (!cell.value) {
            cell.value = false
        }
        setChecked(cell.value);
    }, [cell]);

    function onChange(e) {
        setChecked(e.target.checked);
        toogleChecked(e.target.checked);
    }

    async function toogleChecked(isChecked) {
        const id = cell.row.original._id;
        try {
            await nftSaleService.update(id, { isDenied: isChecked });
            toast.success("Updated NFT Sale feild is denied");
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

function Feature({ cell }) {
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
            await nftSaleService.update(id, { feature: isChecked });
            toast.success("Updated NFT Sale feild feature");
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

SaleType.propTypes = {
    cell: PropTypes.any
}

function SaleType({ cell }) {
    switch (cell.value) {
        case 0:
            return "Sale"
        default:
            return "Auction";
    }
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

function Thumnail({ cell }) {
    const type = cell.row.original.nft.fileType;
    const value = cell.value;
    const name = cell.row.original.nft.name
    return <Image src={value} type={type} alt={name} />
}
Thumnail.propTypes = {
    cell: PropTypes.any,
};

Type.propTypes = {
    cell: PropTypes.any,
};

function Type({ cell }) {
    const type = cell.value;
    switch (type) {
        case "video":
            return "Video";
        case "audio":
            return "Audio";
        default:
            return "Image";
    }
}

Status.propTypes = {
    cell: PropTypes.any,
};

function Status({ cell }) {
    // edit
    if (cell.value === 0) {
        return 'FIXED';
    } else if (cell.value == 0) {
        return 'AUCTION'
    } else {
        return '';
    }
}
