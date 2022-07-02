import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const productService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/products?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/products", payload);
  },
  async remove(id) {
    return await axios.delete("/products/" + id);
  },
  async view(id) {
    return await axios.get("/products/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/products/" + id, payload);
  },
};
