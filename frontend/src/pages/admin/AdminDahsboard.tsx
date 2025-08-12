import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { User, Briefcase, Users, FileText, CalendarCheck, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import "animate.css";
import { useEffect, useState } from "react";
import { getDasboardBarData, getDashboardLineData, getDashboardStats } from "../../api/admin/admin";


Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {

  useEffect(() => {
    const fetchStats = async() => {
      const response = await getDashboardStats();
      if(response.data) {
        setStats(prevStats => [
          { ...prevStats[0], value: response.data.stats.users },
          { ...prevStats[1], value: response.data.stats.recruiters },
          { ...prevStats[2], value: response.data.stats.jobs },
          { ...prevStats[3], value: response.data.stats.listing },
          { ...prevStats[4], value: response.data.stats.applications },
          { ...prevStats[5], value: response.data.stats.interviews }
        ]);
      }
      
    }
    const fetchBarData = async() => {
      const response = await getDasboardBarData();
      
      if(response.data) {
        setBarData(prevBarData => ({
        ...prevBarData, 
        datasets: [
          {
            ...prevBarData.datasets[0], 
            data: response.data.applications 
          },
          {
            ...prevBarData.datasets[1], 
            data: response.data.interviews 
          }
        ]
      }));
      }
    }

    const fetchLineData = async() => {
      const response = await getDashboardLineData();
      if(response.data) {
        setLineData(prevLineData => ({
          ...prevLineData,
          datasets: [
            {
              ...prevLineData.datasets[0],
              data: response.data.lineData
            }
          ]
        }))

      }
    }

    fetchStats();
    fetchBarData();
    fetchLineData()
  },[])
  
  const [stats, setStats] = useState([
    {
      label: "Total Users",
      value: 0,
      icon: <User size={28} className="text-cyan-400" />,
    },
    {
      label: "Total Recruiters",
      value: 0,
      icon: <Users size={28} className="text-fuchsia-400" />,
    },
    {
      label: "Total Jobs Posted",
      value: 0,
      icon: <Briefcase size={28} className="text-amber-400" />,
    },
    {
      label: "Active Listings",
      value: 0,
      icon: <TrendingUp size={28} className="text-green-400" />,
    },
    {
      label: "Applications Submitted",
      value: 0,
      icon: <FileText size={28} className="text-indigo-400" />,
    },
    {
      label: "Interviews Scheduled",
      value: 0,
      icon: <CalendarCheck size={28} className="text-purple-400" />,
    }
  ]);

  const [barData, setBarData ] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Applications",
        data: [120, 190, 170, 210, 250, 200, 180],
        backgroundColor: "rgba(6,182,212,0.7)",
        borderRadius: 12,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      {
        label: "Interviews",
        data: [20, 30, 25, 40, 35, 30, 28],
        backgroundColor: "rgba(139,92,246,0.7)",
        borderRadius: 12,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      }
    ]
  });

  const barOptions: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 12, weight: "bold" }
        }
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: () => "#fff",
        bodyColor: () => "#fff"
      }
    },
    scales: {
      x: { ticks: { color: "#fff", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" } },
      y: { ticks: { color: "#fff", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.08)" } }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeOutQuart" }
  };

  const [lineData, setLineData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Active Listings",
        data: [180, 200, 210, 220],
        borderColor: "#f59e42",
        backgroundColor: "rgba(251,191,36,0.15)",
        tension: 0.5,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#f59e42"
      }
    ]
  });

  const lineOptions: ChartOptions<"line"> = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 12, weight: "bold" }
        }
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: () => "#fff",
        bodyColor: () => "#fff"
      }
    },
    scales: {
      x: { ticks: { color: "#fff", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" } },
      y: { ticks: { color: "#fff", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.08)" } }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeOutQuart" }
  };


  return (
    <div className="h-screen flex bg-white text-black">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-auto bg-gray-200">
        <AdminHeader pageTitle="Dashboard" />

        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.slice(0, 6).map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-black text-white shadow-2xl rounded-2xl p-5 flex items-center gap-4 animate__animated animate__fadeInUp"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="bg-white bg-opacity-10 rounded-full p-3 shadow-lg">{stat.icon}</div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-200">{stat.label}</h3>
                <p className="text-2xl font-bold mt-1 text-white drop-shadow-lg">
                  <CountUp end={stat.value} duration={1.2} separator="," />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl shadow-2xl p-5 col-span-2 flex flex-col min-h-[320px] bg-black text-white">
            <h3 className="text-lg font-semibold mb-4 text-white">Platform Activity (This Week)</h3>
            <div className="h-64 w-full">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl shadow-2xl p-5 min-h-[220px] bg-black text-white">
              <h3 className="text-lg font-semibold mb-4 text-white">Active Listings Trend</h3>
              <div className="h-40 w-full">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AdminDashboard;