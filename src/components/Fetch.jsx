
import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
})

//get method 
export const getData = () => api.get("/posts");
export const deleteData = (id) => api.delete(`/posts/${id}`);
export const updateData = (id, post) => api.put(`/posts/${id}`,post);
export const insertedData = (post) => api.post("/posts",post);