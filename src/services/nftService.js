import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const nftService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/nfts?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/nfts", payload);
  },
  async remove(id) {
    return await axios.delete("/nfts/" + id);
  },
  async view(id) {
    return await axios.get("/nfts/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/nfts/" + id, payload);
  },
  async minted(id, tokenId) {
    return await axios.patch(`/nfts/${id}/minted`, { tokenId });
  },

};
