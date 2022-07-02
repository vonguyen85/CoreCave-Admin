import axios from "axios";

export const uploadService = {
  async uploadOne(formData) {
    return await axios.post("/upload", formData);
  },
};
