import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitSpam } from '../../api/common/Spam';


interface Spam {
    reason: string;
    description: string;
    additionalDetails: string;
}

const SpamReportForm = () => {
  const { role, id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [reportData, setReportData] = useState<Spam>({
    reason: '',
    description: '',
    additionalDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(reportData.description.length < 10 ) {
      toast.error('Description at least 10 character long')
      return
    }
    setIsSubmitting(true);
    
    try {
      const response = await submitSpam(role as string, id as string, reportData);
      if(response.data) {
        navigate(-1)
        toast.success(response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
    } 
  };

  // Reasons for reporting spam
  const reportReasons = [
    'Inappropriate content',
    'Suspicious links',
    'Fake job posting',
    'Harassment',
    'Request for personal information',
    'Financial scam',
    'Other'
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="text-red-500 w-8 h-8 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Report Spam or Inappropriate Message
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Help us maintain a professional environment by reporting suspicious or inappropriate messages. 
          All reports are confidential and will be reviewed by our moderation team.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Reporting {role === 'recruiter' ? 'Recruiter' : 'User'} ID: {id}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Reporting <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={reportData.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={reportData.description}
              onChange={handleChange}
              required
              placeholder="Please provide specific details about why you're reporting this message"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              rows={2}
              value={reportData.additionalDetails}
              onChange={handleChange}
              placeholder="Any other information that might help our investigation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reportData.reason || !reportData.description}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpamReportForm;