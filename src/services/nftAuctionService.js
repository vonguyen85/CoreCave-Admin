import axios from "axios";
import { cleanObject } from "helper/cleanObject";
const NFT_AUCTION_PREFIX = '/auction';
export const nftAuctionService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get(`${NFT_AUCTION_PREFIX}?${searchParams.toString()}`);
  },
  async create(payload) {
    return await axios.post(NFT_AUCTION_PREFIX, payload);
  },
  async remove(id) {
    return await axios.delete(`${NFT_AUCTION_PREFIX}/${id}`);
  },
  async view(id) {
    return await axios.get(`${NFT_AUCTION_PREFIX}/${id}`);
  },
  async update(id, payload) {
    return await axios.patch(`${NFT_AUCTION_PREFIX}/${id}`, payload);
  },
  async minted(id, tokenId) {
    return await axios.patch(`${NFT_AUCTION_PREFIX}/${id}/minted`, { tokenId });
  },
};
