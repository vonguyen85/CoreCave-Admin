import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const orderService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/orders?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/orders", payload);
  },
  async remove(id) {
    return await axios.delete("/orders/" + id);
  },
  async view(id) {
    return await axios.get("/orders/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/orders/" + id, payload);
  },
};
