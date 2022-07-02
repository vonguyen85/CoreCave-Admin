import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const categoryService = {
  async list(filter = {}) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/categories?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/categories", payload);
  },
  async remove(id) {
    return await axios.delete("/categories/" + id);
  },
  async view(id) {
    return await axios.get("/categories/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/categories/" + id, payload);
  },
};
