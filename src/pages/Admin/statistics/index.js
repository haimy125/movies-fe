import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './Stats.css';
import '../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../components/AdminNav/AdminNav';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';

const Stats = () => {
    const [statics, setStatics] = useState({});
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staticsvip, setStaticsvip] = useState({});
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:1412/api/admin/static/monthly-revenue`);
            const revenueData = response.data;
            setMonthlyRevenueData(revenueData.map(item => ({
                month: item.month, // Ensure this matches the actual API response field
                revenue: item.totalPoints // Ensure this matches the actual API response field
            })));
            
            // For other statistics
            const staticResponse = await axios.get(`http://localhost:1412/api/admin/static/gettongso`);
            setStatics(staticResponse.data);

            const staticResponsevip = await axios.get(`http://localhost:1412/api/admin/static/getphimvip`);
            setStaticsvip(staticResponsevip.data);

            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    const userDistributionData = [
        { name: 'Phim trả phí', value: staticsvip.tongSoVipMovie },
        { name: 'Phim miễn phí', value: staticsvip.tongSoNoVipMovie },
    ];

    const COLORS = ['#ffb700', '#09ff00'];

    return (
        <div className='admin_layout'>
            <div className='header_ad'>
                <HeaderAdmin />
            </div>
            <div className='content'>
                <div className='nav'>
                    <div className='content_nav'>
                        <AdminNav />
                    </div>
                </div>

                <div className='content_data' style={{ display: 'flex' }}>
                    <div className='stats_container'>
                        <div className='stats_overview'>
                            <div className='stats_card totaluser'>
                                <h3>Tổng số tài khoản</h3>
                                <p className='stat_value'>{statics.tongSoUser}</p>
                                <div className='icon_static'>
                                    <i className="fa-solid fa-people-line"></i>
                                </div>
                            </div>
                            <div className='stats_card totalmovie'>
                                <h3>Phim</h3>
                                <p className='stat_value'>{statics.tongSoMovie}</p>
                                <div className='icon_static'>
                                    <i className="fa-solid fa-clapperboard"></i>
                                </div>
                            </div>
                            <div className='stats_card totalcategory'>
                                <h3>Thể loại</h3>
                                <p className='stat_value'>{statics.tongSoCategory}</p>
                                <div className='icon_static'>
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                            </div>
                        </div>
                        <div className='chart_section'>
                            <div className='chart_container totalcategory'>
                                <div className='chart_header'>
                                    <h3>Thống kê doanh thu theo tháng trong năm nay</h3>
                                </div>
                                <LineChart width={600} height={300} data={monthlyRevenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#007bff" activeDot={{ r: 8 }} />
                                </LineChart>
                            </div>

                            <div className='chart_container totaluser'>
                                <div className='chart_header'>
                                    <h3>Phân loại phim</h3>
                                </div>
                                <PieChart width={400} height={400}>
                                    <Pie data={userDistributionData} dataKey="value" outerRadius={150} fill="#8884d8" label>
                                        {userDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
