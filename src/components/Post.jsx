import { getData, deleteData, updateData, insertedData } from "./Fetch";
import { useEffect, useState } from "react";

const Post = () => {
  const [data, setData] = useState([]);
  const [errorSet, setErrorSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insertData, setInsertData] = useState({
    title: "",
    body: "",
  });
  const [isSet, setIsSet] = useState(false);
  const [editId, setEditId] = useState(null);

  const getPostData = async () => {
    setIsLoading(true);
    try {
      const res = await getData();
      setData(res.data);
    } catch (error) {
      setErrorSet(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPostData();
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    const backup = data;
    setData((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteData(id);
    } catch (error) {
      setErrorSet(true);
      setData(backup);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInsertData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitting = async (data) => {
    try {
      const res = await insertedData(data);
      return res;
    } catch (error) {
      setErrorSet(true);
    }
  };

  const updating = async (id, data) => {
    try {
      const res = await updateData(id, data);
      return res;
    } catch (error) {
      setErrorSet(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (insertData.title === "" || insertData.body === "") {
      alert("Please enter a title and body");
      return;
    }

    setIsLoading(true);

    try {
      if (!isSet) {
        try {
          const res = await submitting(insertData);
          if (res.status === 201) {
            setData((prev) => [...prev, res.data]);
          }
        } catch (error) {
          setErrorSet(true);
        }
      } else {
        try {
          const res = await updating(editId, insertData);
          if (res.status === 200) {
            setData((prev) => prev.map((item) => (item.id === editId ? { ...res.data } : item)));
          }
        } catch {
          setErrorSet(true);
        }
      }
    } catch (error) {
      setErrorSet(true);
    } finally {
      setIsLoading(false);
      setInsertData({
        title: "",
        body: "",
      });
      setIsSet(false);
      setEditId(null);
    }
  };

  const handleUpdate = ({ id, title, body }) => {

    setInsertData({
      title: title,
      body: body,
    });

    setEditId(id);
    setIsSet(true);
  };

  if (errorSet) return <h1>error has occured</h1>;

  return (
    <>
      <form onSubmit={handleSubmit} className="add-post">
        <div className="Title">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="title"
            value={insertData.title}
            onChange={(e) => handleInsertData(e)}
          />
        </div>
        <div className="body">
          <label htmlFor="body">Body</label>
          <input
            type="text"
            name="body"
            id="body"
            autoComplete="off"
            placeholder="body"
            value={insertData.body}
            onChange={(e) => handleInsertData(e)}
          />
        </div>
        <button className={isSet ? "editing" : "adding"} type="submit">
          {isSet ? "edit" : "add"}
        </button>
      </form>
      {isLoading && <h2 className="loading">...loading</h2>}
      <section className="post">
        <ul className="post-list">
          {data.map((item) => (
            <li key={item.id} className="post-item">
              <h1>{item.id}</h1>
              <h2>title: {item.title}</h2>
              <p>body: {item.body}</p>
              <button className="edit" onClick={() => handleUpdate(item)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Post;
