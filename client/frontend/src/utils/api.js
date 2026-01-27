import axios from "axios";
const apiurl = import.meta.env.VITE_API_URL;

// POST Data
export const postData = async (url, formData) => {
  try {
    const token = localStorage.getItem("accesstoken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(apiurl + url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errordata = await response.json();
      return errordata;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Fetch Data From API
export const fetchDataFromApi = async (url) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const fullUrl = `${apiurl}${url.startsWith("/") ? "" : "/"}${url}`;

    const { data } = await axios.get(fullUrl, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.log("API Error:", error);

    return error.response ? error.response.data : error;
  }
};

// Upload Image
export const uploadImage = async (url, updatedData) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const params = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    };

    var response;
    await axios.put(apiurl + url, updatedData, params).then((res) => {
      console.log(res);
      response = res;
    });
    return response; // Response data
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

// EDIT Data
export const editData = async (url, updatedData) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const params = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put(apiurl + url, updatedData, params);

    return res.data;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

// DELETE Data
export const deleteData = async (url, payload) => {
  try {
    const token = localStorage.getItem("accesstoken");

    const { data } = await axios.delete(apiurl + url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      data: payload,
    });

    return data;
  } catch (error) {
    console.log("Delete Error:", error);
    return error.response ? error.response.data : error;
  }
};
