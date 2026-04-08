import React, { useState, useRef, useEffect } from "react";
import "./Product.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function Product() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  // State Produk
  const [product, setProduct] = useState({
    name: "",
    category: "",
    base_price: 0,
    sell_price: 0,
    stock: 0,
    description: "",
  });

  // Preview Gambar
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // LOGIKA AUTO-FILL DARI CALCULATOR
  useEffect(() => {
    if (location.state) {
      const { nama, harga, hpp } = location.state;
      setProduct((prev) => ({
        ...prev,
        name: nama || prev.name,
        sell_price: harga || prev.sell_price,
        base_price: hpp || prev.base_price,
      }));

      // Bersihkan state agar data tidak muncul lagi saat refresh manual
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onClickLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category || "Umum");
    formData.append("base_price", product.base_price);
    formData.append("sell_price", product.sell_price);
    formData.append("stock", product.stock);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await api.post("/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      
      // Reset form setelah berhasil
      setProduct({ name: "", category: "", base_price: 0, sell_price: 0, stock: 0, description: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah produk");
    } finally {
      setIsLoading(false);
    }
  };

  const estimasiLaba = product.sell_price - product.base_price;

  return (
    <div className="container">
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <nav className="menu">
          <button className="menu-item" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="menu-item" onClick={() => navigate("/cashier")}>Cashier</button>
          <button className="menu-item active">Product</button>
          <button className="menu-item" onClick={() => navigate("/calculator")}>Calculator</button>
        </nav>

        <div className="profile-card">
          <div className="profile-main" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer' }}>
            <div className="profile-info-wrapper">
              <span className="avatar">{user?.store_name?.charAt(0).toUpperCase() || "U"}</span>
              <span>{user?.store_name || "User"}</span>
            </div>
            <span className={`arrow ${isProfileOpen ? 'rotate' : ''}`}>▼</span>          
          </div>
          {isProfileOpen && (
            <div className="profile-options">
              <button className="profile-opt-btn logout" onClick={onClickLogout}>⏻ Log out</button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
          <h2>PRODUCT</h2>
        </header>

        <div className="product-page-container">
          <form className="product-form-card" onSubmit={handleSaveProduct}>
            <div className="form-layout">
              <div className="form-left">
                <div className="input-box">
                  <label>Nama produk</label>
                  <input
                    type="text"
                    required
                    value={product.name}
                    placeholder="Masukkan nama produk"
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                </div>

                <div className="input-box">
                  <label>Kategori</label>
                  <input
                    type="text"
                    value={product.category}
                    placeholder="Masukkan kategori"
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  />
                </div>

                <div className="input-row">
                  <div className="input-box">
                    <label>Harga jual</label>
                    <input
                      type="number"
                      required
                      // Logika agar angka 0 tidak mengganggu saat input baru
                      value={product.sell_price === 0 ? "" : product.sell_price}
                      placeholder="0"
                      onChange={(e) => setProduct({ ...product, sell_price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="input-box">
                    <label>HPP (Harga Modal)</label>
                    <input
                      type="number"
                      required
                      value={product.base_price === 0 ? "" : product.base_price}
                      placeholder="0"
                      onChange={(e) => setProduct({ ...product, base_price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="input-box">
                  <label>Stok Awal</label>
                  <input
                    type="number"
                    value={product.stock === 0 ? "" : product.stock}
                    placeholder="0"
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="laba-info">
                  Estimasi Laba per Item: <strong>Rp {estimasiLaba.toLocaleString("id-ID")}</strong>
                </div>

                <div className="action-buttons">
                  <button type="submit" className="btn-orange1" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button type="button" className="btn-orange2" onClick={() => navigate("/dashboard")}>Batal</button>
                </div>
              </div>

              <div className="form-right">
                <div className="upload-container" onClick={() => fileInputRef.current.click()}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="btn-upload-center">Upload Image</span>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Product;