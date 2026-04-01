import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://api.hargunmusicals.com/api/v1/admin";

const Brand = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchBrands = async () => {
    const res = await axios.get(`${API}/brand`);
    // console.log("res",res)
    setData(res.data.data || []);
  };

  const addBrand = async () => {
    await axios.post(`${API}/create/brand`, {
      brand_name: name,
    });
    setName("");
    setOpenModal(false);
    fetchBrands();
  };

  const updateBrand = async () => {
    await axios.put(`${API}/brand/edit/${editId}`, {
      brand_name: name,
    });
    setEditId(null);
    setName("");
    setOpenModal(false);
    fetchBrands();
  };

  const deleteBrand = async (id) => {
    if (window.confirm("Delete this brand?")) {
      await axios.delete(`${API}/brand-del/${id}`);
      fetchBrands();
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Brands</h2>

        <button
          onClick={() => {
            setOpenModal(true);
            setEditId(null);
            setName("");
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Brand
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Brand Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((brand, index) => (
                <tr
                  key={brand._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium text-gray-700">
                    {brand.brand_name}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditId(brand._id);
                        setName(brand.brand_name);
                        setOpenModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBrand(brand._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-5 text-gray-500">
                  No Brands Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl p-6 shadow-lg relative">

            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Brand" : "Add Brand"}
            </h3>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              {editId ? (
                <button
                  onClick={updateBrand}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={addBrand}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;