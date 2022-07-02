import axios from "axios"
import { cleanObject } from "helper/cleanObject";

const path = "/nfts/sales/"

const list = async (filter = {}) => {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get(path + "?" + searchParams.toString());
}

const view = async (id) => {
    return await axios.get(path + id);
}

const update = async (id, payload) => {
    return await axios.patch(path + id, payload);
}

export const nftSaleService = {
    list,
    view,
    update,
}