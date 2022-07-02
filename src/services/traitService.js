import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const traitService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/traits?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/traits", payload);
  },
  async remove(id) {
    return await axios.delete("/traits/" + id);
  },
  async view(id) {
    return await axios.get("/traits/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/traits/" + id, payload);
  },
  async minted(id, tokenId) {
    return await axios.patch(`/traits/${id}/minted`, { tokenId });
  },
  async groupsByType() {
    return await axios.get(`/traits/groups`);
  },
  types() {
    return {
      BACKGROUND: {
          name: 'BACKGROUND',
          layer: 1,
      },
      BODY: {
          name: 'BODY',
          layer: 2,
      },
      FACE: {
          name: 'FACE',
          layer: 3,
      },
      MOUTH: {
          name: 'MOUTH',
          layer: 4,
      },
      EYES: {
          name: 'EYES',
          layer: 5,
      },
      CLOTHES: {
          name: 'CLOTHES',
          layer: 6,
      },
      GLASSES: {
          name: 'GLASSES',
          layer: 7,
      },
      HAT: {
          name: 'HAT',
          layer: 8,
      },
      EARRING: {
          name: 'EARRING',
          layer: 9,
      },
      NECKLACE: {
          name: 'NECKLACE',
          layer: 10,
      },
    };
  }
};
