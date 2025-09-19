import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function CrudPage() {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [editedNames, setEditedNames] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  // Add food data
  const addFoodData = () => {
    if (!foodName || !description) {
      alert("Please enter both food name and description.");
      return;
    }

    Axios.post("https://react-mongodb-crud-server.onrender.com/insert", {
      foodName,
      description,
    })
      .then((response) => {
        console.log(response);
        alert("Data Added");
        setFoodName("");
        setDescription("");
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Fetch food data
  const fetchData = () => {
    Axios.get("https://react-mongodb-crud-server.onrender.com/read")
      .then((response) => {
        console.log(response.data);
        setFoodList(response.data);
      })
      .catch((err) => {
        console.log("Error fetching data", err);
      });
  };

  // Update food name
  const updateFood = (id) => {
    const newFoodName = editedNames[id];
    if (!newFoodName) {
      alert("Please enter a new food name.");
      return;
    }

    Axios.put("https://react-mongodb-crud-server.onrender.com/update", {
      id,
      newFoodName,
    })
      .then(() => {
        fetchData();
        setEditedNames((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      })
      .catch((err) => console.log(err));
  };

  // Delete food
  const deleteFood = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this food?");
    if (!confirmDelete) return;

    Axios.delete(`https://react-mongodb-crud-server.onrender.com/delete/${id}`)
      .then(() => fetchData())
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      <h2>CRUD PAGE</h2>

      {/* Add Food Form */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Food Name"
          required
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Food Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={addFoodData}>
          Add Food
        </button>
      </div>

      {/* Food Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Food Name</th>
            <th>Food Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((val) => (
            <tr key={val._id}>
              <td>{val.foodName}</td>
              <td>{val.description}</td>
              <td>
                <input
                  type="text"
                  placeholder="Update Food Name"
                  value={editedNames[val._id] || ""}
                  onChange={(e) =>
                    setEditedNames({ ...editedNames, [val._id]: e.target.value })
                  }
                />
                <button className="btn btn-sm btn-warning ms-2" onClick={() => updateFood(val._id)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => deleteFood(val._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudPage;
