import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

function Dashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const [stats, setStats] = useState({
        labaHariIni: 0,
        transaksiHariIni: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get("/api/reports/dashboard-summary");
                
                // Ambil semua transaksi
                const allRecent = res.data.recent;
                
                // Filter hanya yang tanggalnya HARI INI untuk counter stat
                const today = new Date().toLocaleDateString('id-ID');
                const todayTransactions = allRecent.filter(tx => 
                    new Date(tx.created_at).toLocaleDateString('id-ID') === today
                );

                setStats({
                    labaHariIni: res.data.stats.labaHariIni,
                    transaksiHariIni: todayTransactions.length // Angka ini sekarang akurat
                });
                setRecentTransactions(allRecent);
            } catch (err) {
                console.error("Gagal ambil data dashboard", err);
            }
        };
        fetchDashboardData();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const onClickLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="container">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="menu">
                    <button className="menu-item active">Dashboard</button>
                    <button className="menu-item" onClick={() => navigate("/cashier")}>Cashier</button>
                    <button className="menu-item" onClick={() => navigate("/product")}>Product</button>
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

            <div className="main">
                <header className="top-header">
                    <button className="hamburger" onClick={toggleSidebar}>☰</button>
                </header>
                
                {/* Bagian Log out atas dihapus/disembunyikan sesuai gambar terbaru */}

                <div className="content">
                    <div className="header-title">
                        <h1>Dashboard 🔥</h1>
                        <p>Selamat datang kembali, <b>{user?.store_name}</b>!</p>
                    </div>

                    <div className="stats-container">
                        <div className="stat-card laba-full">
                            <div className="stat-main-info">
                                <h3>Laba Hari ini</h3>
                                <div className="stat-content">
                                    <span className="stat-value">Rp {stats.labaHariIni.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <div className="stat-badge-info">
                                <p className="stat-footer"><b>{stats.transaksiHariIni}</b> transaksi hari ini</p>
                            </div>
                        </div>
                    </div>

                    <div className="transaction-section">
                        <div className="section-title">
                            <span className="icon-history">⏳</span>
                            <h2>Transaksi Terakhir</h2> 
                        </div>
                        <div className="table-scroll-wrapper">
                            <div className="table-container">
                                <table className="transaction-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Metode</th>
                                            <th>Total</th>
                                            <th>Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td>#{tx.id.toString().slice(-5)}</td>
                                                <td>
                                                    <span className={`method-badge ${tx.payment_method?.toLowerCase()}`}>
                                                        {tx.payment_method}
                                                    </span>
                                                </td>
                                                <td className="amount-cell">Rp {tx.total_amount.toLocaleString('id-ID')}</td>
                                                <td>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;