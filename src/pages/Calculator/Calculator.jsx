import "./Calculator.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Calculator() {
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // --- TAMBAHAN: Ambil data user dari localStorage ---
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

    // State untuk form
    const [formData, setFormData] = useState({
        namaProduk: "",
        jumlahProduksi: "",
        biayaBahanBaku: "",
        biayaTenagaKerja: "",
        biayaOverhead: "",
        metode: "Markup",
        presentase: ""
    });

    const [hasil, setHasil] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    // Fungsi Logout yang seragam
    const onClickLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // LOGIKA PERHITUNGAN CLIENT-SIDE
    const hitungHPP = (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        try {
            const { 
                namaProduk, 
                jumlahProduksi, 
                biayaBahanBaku, 
                biayaTenagaKerja, 
                biayaOverhead, 
                metode, 
                presentase 
            } = formData;

            if (!namaProduk || !jumlahProduksi || !biayaBahanBaku || !presentase) {
                throw new Error("Semua kolom wajib diisi!");
            }

            const hppTotal = Number(biayaBahanBaku) + (Number(biayaTenagaKerja) || 0) + (Number(biayaOverhead) || 0);
            const hppPerUnitRaw = hppTotal / Number(jumlahProduksi);

            let hargaJualKotor;
            const persenDecimal = Number(presentase) / 100;

            if (metode.toLowerCase() === 'markup') {
                hargaJualKotor = hppPerUnitRaw * (1 + persenDecimal);
            } else {
                if (persenDecimal >= 1) throw new Error("Margin tidak boleh 100% atau lebih!");
                hargaJualKotor = hppPerUnitRaw / (1 - persenDecimal);
            }

            const hargaJualPerUnit = Math.ceil(hargaJualKotor / 100) * 100;
            const hppPerUnit = Math.round(hppPerUnitRaw);

            setHasil({
                namaProduk,
                hppTotal,
                hppPerUnit,
                hargaJualPerUnit,
                keuntunganPerUnit: hargaJualPerUnit - hppPerUnit,
                totalPendapatan: hargaJualPerUnit * Number(jumlahProduksi)
            });

        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const handleAcceptPrice = () => {
        navigate("/product", { 
            state: { 
                nama: hasil.namaProduk,
                harga: hasil.hargaJualPerUnit,
                hpp: hasil.hppPerUnit 
            } 
        });
    };

    return (
        <div className="container">
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <nav className="menu">
                    <button className="menu-item" onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button className="menu-item" onClick={() => navigate("/cashier")}>Cashier</button>
                    <button className="menu-item" onClick={() => navigate("/product")}>Product</button>
                    <button className="menu-item active">Calculator</button>
                </nav>

                {/* --- UPDATE: Profile Card Dinamis --- */}
                <div className="profile-card">
                    <div className="profile-main" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer' }}>
                        <div className="profile-info-wrapper">
                            <span className="avatar">
                                {user?.store_name?.charAt(0).toUpperCase() || "U"}
                            </span>
                            <span>{user?.store_name || "User"}</span>
                        </div>
                        <span className={`arrow ${isProfileOpen ? "rotate" : ""}`}>🔻</span>
                    </div>
                   {/* DROPDOWN KE BAWAH (SESUAI REQUEST) */}
                    {isProfileOpen && (
                        <div className="profile-options-dropdown">
                            <button className="profile-opt-btn logout-text" onClick={onClickLogout}>
                                📕 Log out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <button className="hamburger" onClick={toggleSidebar}>☰</button>
                    <h2>CALCULATOR</h2>
                </header>

                <div className="calculator-card">
                    <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#f38a2c'}}>Kalkulator HPP</h1>
                    <form onSubmit={hitungHPP}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nama Produk</label>
                                <input type="text" name="namaProduk" value={formData.namaProduk} onChange={handleInputChange} placeholder="Cth: Roti Bakar" required />
                            </div>
                            <div className="form-group">
                                <label>Jumlah Produksi</label>
                                <input type="number" name="jumlahProduksi" value={formData.jumlahProduksi} onChange={handleInputChange} placeholder="0" required min="1" />
                            </div>
                            <div className="form-group">
                                <label>Biaya Bahan Baku</label>
                                <input type="number" name="biayaBahanBaku" value={formData.biayaBahanBaku} onChange={handleInputChange} placeholder="0" required />
                            </div>
                            <div className="form-group">
                                <label>Biaya Tenaga Kerja</label>
                                <input type="number" name="biayaTenagaKerja" value={formData.biayaTenagaKerja} onChange={handleInputChange} placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label>Biaya Overhead</label>
                                <input type="number" name="biayaOverhead" value={formData.biayaOverhead} onChange={handleInputChange} placeholder="Listrik, kemasan, dll" />
                            </div>
                            <div className="form-group">
                                <label>Penentuan Harga</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select name="metode" value={formData.metode} onChange={handleInputChange} style={{ width: '60%' }}>
                                        <option value="Markup">Markup</option>
                                        <option value="Margin">Margin</option>
                                    </select>
                                    <input type="number" name="presentase" value={formData.presentase} onChange={handleInputChange} placeholder="%" required style={{ width: '40%' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                            <button type="submit" className="btn-submit">Hitung HPP</button>
                        </div>
                    </form>
                </div>

                {errorMsg && <div className="result-card" style={{color: 'red', textAlign: 'center'}}>{errorMsg}</div>}

                {hasil && (
                    <div className="result-card">
                        <h3 className="result-title">Hasil: {hasil.namaProduk}</h3>
                        <div className="form-grid result-grid">
                            <div>
                                <p>HPP per Unit: <strong>Rp {hasil.hppPerUnit.toLocaleString('id-ID')}</strong></p>
                                <p>Harga Jual/Unit: <strong style={{color: '#f38a2c'}}>Rp {hasil.hargaJualPerUnit.toLocaleString('id-ID')}</strong></p>
                            </div>
                            <div>
                                <p>Laba/Unit: <strong>Rp {hasil.keuntunganPerUnit.toLocaleString('id-ID')}</strong></p>
                                <p>Total Pendapatan: <strong>Rp {hasil.totalPendapatan.toLocaleString('id-ID')}</strong></p>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                type="button" 
                                className="btn-submit" 
                                style={{ backgroundColor: '#28a745', border: 'none' }}
                                onClick={handleAcceptPrice}
                            >
                                ✅ Gunakan Harga & Tambah Produk
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Calculator;