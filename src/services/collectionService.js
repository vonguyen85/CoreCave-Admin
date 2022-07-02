import axios from "axios";
import { cleanObject } from "helper/cleanObject";

const path = "/collections/"

export const collectionService = {
    async list(filter = {}) {
        let searchParams = new URLSearchParams(cleanObject(filter));
        return await axios.get(path + "?" + searchParams.toString());
    },

    async view(id) {
        return await axios.get(path + id);
    },

    async update(id, payload) {
        return await axios.patch(path + id, payload);
    },
}
