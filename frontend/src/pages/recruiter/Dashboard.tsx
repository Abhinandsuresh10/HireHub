import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import Footer from "../../components/user/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Briefcase, UserCheck, Users, FileText, User2 } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { getDashboardGraphData, getDashboardInterviews, getDashboardMatrics } from "../../api/recruiter/recriuters"
import { useNavigate } from "react-router-dom"


interface CompletedInterview {
  name: string;
  imageUrl: string;
  jobRole: string;
  date: Date;
}

const Dashboard = () => {

  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);

  useEffect(() => {
    const fetchMatrics = async () => {
      const response = await getDashboardMatrics(recruiter._id);
      if (response.data) {
        const values: number[] = response.data.matrics;

        setMatrics((prevMetrics) =>
          prevMetrics.map((metric, index) => ({
            ...metric,
            value: values[index] ?? metric.value,
          }))
        );
      }
    };

    fetchMatrics();
    const fetchInerviews = async () => {
      const response = await getDashboardInterviews(recruiter._id);
      if (response.data) {
        setRecentInterview(response.data.recentInterviews)
      }
    }
    fetchInerviews();

    const fetchGraphData = async () => {
      const response = await getDashboardGraphData(recruiter._id);
      if (response.data) {
        setGraphData(response.data.months);
      }
    }
    fetchGraphData();
  }, [recruiter]);

  const [metrics, setMatrics] = useState([
    {
      title: "Total Applications",
      value: 0,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      bg: "bg-white",
    },
    {
      title: "Open Jobs",
      value: 0,
      icon: <Briefcase className="h-6 w-6 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      title: "Sheduled Interviews",
      value: 0,
      icon: <UserCheck className="h-6 w-6 text-purple-500" />,
      bg: "bg-purple-50",
    },
    {
      title: "Completed Interviews",
      value: 0,
      icon: <Users className="h-6 w-6 text-yellow-500" />,
      bg: "bg-yellow-50",
    },
  ])

  const [graphData, setGraphData] = useState([
    { name: "Jan", applicants: 40, interviews: 24 },
    { name: "Feb", applicants: 30, interviews: 18 },
    { name: "Mar", applicants: 20, interviews: 12 },
    { name: "Apr", applicants: 27, interviews: 20 },
    { name: "May", applicants: 35, interviews: 28 },
  ])

  const [recentInterviews, setRecentInterview] = useState<CompletedInterview[]>([]);

  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/recruiter/CompletedInterviews')
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="w-full z-50">
          <RecruiterHeader />
        </header>

        <main className="flex-1 w-full p-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className={`shadow-md rounded-2xl ${metric.bg}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Graph + Recent Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Section */}
            <Card className="lg:col-span-2 shadow-md rounded-2xl bg-white">
              <CardHeader>
                <CardTitle>Applicants vs Interviews</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applicants" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="interviews" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Interviews Section */}
            <Card className="shadow-md rounded-2xl bg-white">
              <CardHeader>
                <CardTitle>Recent Completed Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentInterviews.map((interview, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                    <div className="flex justify-between w-full">
                      <p className="text-base font-medium">{interview.name}</p>
                      <p className="text-sm text-gray-500">{interview.jobRole}</p>
                      {interview.imageUrl ? (<img src={interview.imageUrl} alt="" className="w-10 h-10 rounded-full" />)
                        :
                        (<User2 className="w-10 h-10 bg-gray-200 rounded-full text-gray-700" />)}

                    </div>
                    {/* <p className="text-xs text-green-700">Completed </p> */}
                  </div>
                ))}
                <button onClick={handleNavigate} className="text-blue-700 text-sm hover:underline">view all</button>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="w-full z-50 mt-auto">
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default Dashboard
