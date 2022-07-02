import axios from "axios";
import { cleanObject } from "helper/cleanObject";

export const userService = {
  async list(filter) {
    let searchParams = new URLSearchParams(cleanObject(filter));
    return await axios.get("/users?" + searchParams.toString());
  },
  async create(payload) {
    return await axios.post("/auth/register", payload);
  },
  async remove(id) {
    return await axios.delete("/users/" + id);
  },
  async view(id) {
    return await axios.get("/users/" + id);
  },
  async update(id, payload) {
    return await axios.patch("/users/" + id, payload);
  },
};
