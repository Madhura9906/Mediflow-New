import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import { FaCapsules, FaPlus, FaTrash } from "react-icons/fa";

function AddMedicine() {
  const [medicines, setMedicines] = useState([
    { id:1, name:"Paracetamol", type:"Tablet", manufacturer:"Sun Pharma",  price:"12" },
    { id:2, name:"Amoxicillin", type:"Capsule",manufacturer:"Cipla",       price:"45" },
  ]);
  const [form, setForm] = useState({ name:"", type:"Tablet", manufacturer:"", price:"" });

  const add = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setMedicines([...medicines, { id:Date.now(), ...form }]);
    setForm({ name:"", type:"Tablet", manufacturer:"", price:"" });
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <h2 className="page-title"><FaCapsules /> Medicine Database</h2>
        <div className="card">
          <h3 style={{color:"#0077b6",marginBottom:16,fontSize:15}}>Add New Medicine</h3>
          <form onSubmit={add}>
            <div className="form-row">
              <div className="form-field"><input type="text" placeholder="Medicine Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              <div className="form-field">
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Injection</option>
                </select>
              </div>
              <div className="form-field"><input type="text" placeholder="Manufacturer" value={form.manufacturer} onChange={e=>setForm({...form,manufacturer:e.target.value})}/></div>
              <div className="form-field"><input type="number" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <button type="submit" className="btn-primary"><FaPlus/> Add</button>
            </div>
          </form>
        </div>
        <div className="card">
          <table>
            <thead><tr><th>#</th><th>Medicine</th><th>Type</th><th>Manufacturer</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {medicines.map((m,i) => (
                <tr key={m.id}>
                  <td>{i+1}</td><td>{m.name}</td><td><span className="badge badge-blue">{m.type}</span></td>
                  <td>{m.manufacturer}</td><td>₹{m.price}</td>
                  <td><button className="btn-danger" onClick={()=>setMedicines(medicines.filter(x=>x.id!==m.id))}><FaTrash/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default AddMedicine;
