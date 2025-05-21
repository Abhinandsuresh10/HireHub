import { useState, useEffect } from 'react';
import { Search, ShieldAlert, Mail, AlertCircle, User, Calendar } from 'lucide-react';
import Sidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { getSpamReports } from '../../api/common/Spam';

interface SpamReport {
  id: number;
  role: string;
  name: string;
  email: string;
  reason: string;
  description: string;
  additionalDetails?: string;
  createdAt: string;
}

const SpamReports = () => {
  const [reports, setReports] = useState<SpamReport[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getSpamReports();
        console.log(response.data.reports)
        setReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader pageTitle='spamPage' />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={24} />
              Spam Reports
            </h1>
            
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No reports found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div key={report.id} className="shadow-xl rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium">{report.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {report.role}
                        </span>
                      </div>
                      
                      <div className="space-y-3 text-sm text-gray-600">
                        {/* Report details... */}
                        <div className="flex items-start gap-2">
                          <Mail className="flex-shrink-0 mt-0.5" size={16} />
                          <span>{report.email}</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <AlertCircle className="flex-shrink-0 mt-0.5 text-red-500" size={16} />
                          <div>
                            <span className="font-medium">Reason:</span> {report.reason}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                    <User className="flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <span className="font-medium">Description:</span> {report.description}
                    </div>
                  </div>
                  
                  {report.additionalDetails && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-medium">Details:</span> {report.additionalDetails}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar size={14} />
                    Reported on: {report.createdAt.slice(0, 10)}
                  </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SpamReports;