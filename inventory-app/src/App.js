import React, { useState, useEffect } from "react";
import "./App.css";
import saveAs from "file-saver";

const STORAGE_KEY = "inventory_data";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    size: "",
    color: "",
    quantity: 0,
    price: "",
    category: "",
    brand: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduct = () => {
    if (!form.productId || !form.productName) return;
    const newProduct = {
      ...form,
      quantity: parseInt(form.quantity),
      lastUpdated: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    setForm({
      productId: "",
      productName: "",
      size: "",
      color: "",
      quantity: 0,
      price: "",
      category: "",
      brand: "",
    });
  };

  const updateQuantity = (id, delta) => {
    const updated = products.map((p) =>
      p.productId === id
        ? {
            ...p,
            quantity: Math.max(0, p.quantity + delta),
            lastUpdated: new Date().toISOString(),
          }
        : p
    );
    setProducts(updated);
  };

  const downloadCSV = () => {
    if (products.length === 0) return;
    const header = Object.keys(products[0]).join(",");
    const rows = products
      .map((p) => Object.values(p).map((v) => `"${v}"`).join(","))
      .join("\n");
    const csv = `${header}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "inventory.csv");
  };

  return (
    <div className="App" style={{ padding: "2rem", maxWidth: 900, margin: "auto" }}>
      <h2>🧾 Clothing Inventory Manager</h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        {[
          "productId",
          "productName",
          "size",
          "color",
          "quantity",
          "price",
          "category",
          "brand",
        ].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            placeholder={key}
            onChange={handleChange}
          />
        ))}
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <h3>📦 Product Inventory</h3>
      <button onClick={downloadCSV} disabled={!products.length}>
        Download CSV
      </button>

      <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            {[
              "Product ID",
              "Name",
              "Size",
              "Color",
              "Qty",
              "Price",
              "Category",
              "Brand",
              "Last Updated",
              "Actions",
            ].map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td>{p.productId}</td>
              <td>{p.productName}</td>
              <td>{p.size}</td>
              <td>{p.color}</td>
              <td>{p.quantity}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.brand}</td>
              <td>{new Date(p.lastUpdated).toLocaleString()}</td>
              <td>
                <button onClick={() => updateQuantity(p.productId, 1)}>+</button>
                <button onClick={() => updateQuantity(p.productId, -1)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
