import axios from "axios";

const register = (username, email, password) => {
  return axios.post("auth/register", {
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  const response = await axios.post("auth/login", {
    username,
    password,
  });

  return response;
};

const me = async () => {
  return await axios.post("auth/me");
};

const updateProfile = async (payload) => {
  if (payload?.new_password) payload.password = payload.new_password;
  return await axios.post("/auth/profile", payload);
}

const forgot = async (email) => {
  return await axios.post("/auth/reset_request", {email});
}

export default {
  forgot,
  register,
  login,
  me,
  updateProfile,
};
