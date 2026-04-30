// import styles from './dashboard.module.css';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// export default function DashboardPage() {
//     return (
//         <Card className={styles.card}>
//             <CardHeader className={styles.cardHeader}>
//                 <CardTitle className={styles.cardTitle}>Admin Dashboard</CardTitle>
//             </CardHeader>
//             <CardContent className={styles.cardContent}>
//                 <p className={styles.infoText}>
//                     Welcome to the Order Me admin dashboard. Use the sidebar to manage media,
//                     admins, and your profile.
//                 </p>
//             </CardContent>
//         </Card>
//     );
// }

// app/page.tsx
import {
    Search,
    Settings,
    Users,
    UserPlus,
    Stethoscope,
    MapPin,
    TrendingUp,
    Calendar,
    Clock,
    Activity,
    DollarSign,
    Car,
    Home,
    PieChart,
    BarChart3,
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <span className="logo-icon">🏥</span>
                    <span className="logo-text">H-care</span>
                </div>

                <nav className="nav-menu">
                    <div className="nav-section">
                        <h3 className="nav-section-title">Register patient</h3>
                        <ul>
                            <li className="nav-item active">
                                <Users size={18} />
                                <span>Patients</span>
                            </li>
                            <li className="nav-item">
                                <TrendingUp size={18} />
                                <span>Overview</span>
                            </li>
                            <li className="nav-item">
                                <MapPin size={18} />
                                <span>Map</span>
                            </li>
                            <li className="nav-item">
                                <Home size={18} />
                                <span>Departments</span>
                            </li>
                            <li className="nav-item">
                                <Stethoscope size={18} />
                                <span>Doctors</span>
                            </li>
                            <li className="nav-item">
                                <Calendar size={18} />
                                <span>History</span>
                            </li>
                        </ul>
                    </div>

                    <div className="nav-settings">
                        <div className="nav-item">
                            <Settings size={18} />
                            <span>Settings</span>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="header-actions">
                        <div className="notification-icon">🔔</div>
                        <div className="user-avatar">👤</div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">👥</div>
                        <div className="stat-info">
                            <span className="stat-value">3,256</span>
                            <span className="stat-label">Total Patients</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">👨‍⚕️</div>
                        <div className="stat-info">
                            <span className="stat-value">394</span>
                            <span className="stat-label">Available Staff</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">💰</div>
                        <div className="stat-info">
                            <span className="stat-value">$2,536</span>
                            <span className="stat-label">Avg Treat. Costs</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">🚑</div>
                        <div className="stat-info">
                            <span className="stat-value">38</span>
                            <span className="stat-label">Available Cars</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="charts-row">
                    {/* Trend Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Outpatients vs. Inpatients Trend</h3>
                        </div>
                        <div className="trend-chart">
                            <div className="chart-months">
                                {['Oct 2019', 'Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020'].map(month => (
                                    <div key={month} className="month-label">{month}</div>
                                ))}
                            </div>
                            <div className="chart-bars">
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '60px' }}></div>
                                    <div className="bar outpatient" style={{ height: '80px' }}></div>
                                </div>
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '70px' }}></div>
                                    <div className="bar outpatient" style={{ height: '75px' }}></div>
                                </div>
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '65px' }}></div>
                                    <div className="bar outpatient" style={{ height: '85px' }}></div>
                                </div>
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '80px' }}></div>
                                    <div className="bar outpatient" style={{ height: '70px' }}></div>
                                </div>
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '75px' }}></div>
                                    <div className="bar outpatient" style={{ height: '90px' }}></div>
                                </div>
                                <div className="bar-group">
                                    <div className="bar inpatient" style={{ height: '85px' }}></div>
                                    <div className="bar outpatient" style={{ height: '95px' }}></div>
                                </div>
                            </div>
                            <div className="chart-legend">
                                <span><span className="legend-dot inpatient-legend"></span> Inpatients</span>
                                <span><span className="legend-dot outpatient-legend"></span> Outpatients</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Admitted Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Time Admitted</h3>
                        </div>
                        <div className="time-chart">
                            <div className="time-bars">
                                {['07 am', '08 am', '09 am', '10 am', '11 am', '12 pm'].map(time => (
                                    <div key={time} className="time-bar-item">
                                        <div className="time-bar" style={{ height: `${Math.random() * 100 + 40}px` }}></div>
                                        <span className="time-label">{time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="y-axis-label">
                                <span>150</span>
                                <span>100</span>
                                <span>50</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="bottom-row">
                    {/* Patients by Gender */}
                    <div className="info-card">
                        <h3>Patients by Gender</h3>
                        <div className="gender-chart">
                            <div className="gender-donut">
                                <svg viewBox="0 0 100 100" width="140" height="140">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#4A90D9" strokeWidth="20" strokeDasharray="283" strokeDashoffset="0" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#FF6B6B" strokeWidth="20" strokeDasharray="283" strokeDashoffset="113" />
                                </svg>
                                <div className="donut-center">
                                    <span className="percentage">28%</span>
                                </div>
                            </div>
                            <div className="gender-labels">
                                <span><span className="female-dot"></span> Female</span>
                                <span><span className="male-dot"></span> Male</span>
                            </div>
                        </div>
                    </div>

                    {/* Patients By Division */}
                    <div className="info-card">
                        <h3>Patients By Division</h3>
                        <div className="division-list">
                            <div className="division-item">
                                <span className="division-name">Cardiology</span>
                                <div className="division-bar-container">
                                    <div className="division-bar" style={{ width: '70%' }}></div>
                                </div>
                                <span className="division-count">247 PT.</span>
                            </div>
                            <div className="division-item">
                                <span className="division-name">Neurology</span>
                                <div className="division-bar-container">
                                    <div className="division-bar" style={{ width: '48%' }}></div>
                                </div>
                                <span className="division-count">164 PT.</span>
                            </div>
                            <div className="division-item">
                                <span className="division-name">Surgery</span>
                                <div className="division-bar-container">
                                    <div className="division-bar" style={{ width: '25%' }}></div>
                                </div>
                                <span className="division-count">86 PT.</span>
                            </div>
                        </div>
                    </div>

                    {/* Patients this month */}
                    <div className="info-card patients-month">
                        <h3>Patients this month</h3>
                        <div className="month-value">3,240</div>
                        <div className="month-label">Patients this month</div>
                        <div className="month-chart">
                            <div className="mini-chart-bars">
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                                <div className="mini-bar"></div>
                            </div>
                            <div className="chart-preview">28%</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}