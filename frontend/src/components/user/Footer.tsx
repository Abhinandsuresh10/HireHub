import instagram  from '../../assets/instagram-icon.svg'
import whatsup from '../../assets/whatsup-icon.svg';
import linkdin from '../../assets/linkidin-icon.svg'


const Footer = () => {
  return (
  <footer className="bg-white shadow-md border-t border-gray-300 p-8 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Left  - Brand and Contact */}
        <div>
            <h1 className="text-2xl font-bold text-gray-800">HireHub</h1>
            <p className="text-gray-600 mt-2">Connect with us</p>
         <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-800 hover:text-blue-600"><img src={instagram} alt="Logo" width="20" height="10" /></a>
            <a href="#" className="text-gray-800 hover:text-blue-600"><img src={whatsup} alt="Logo" width="20" height="10" /></a>
            <a href="#" className="text-gray-800 hover:text-blue-600"><img src={linkdin} alt="Logo" width="20" height="10" /></a>
        </div>
        </div>

        {/* Middle - About Us */}
        <div>
            <h2 className="text-lg font-semibold text-gray-800">About Us</h2>
            <p className="text-gray-600 mt-2">Career</p>
            <p className="text-gray-600 mt-2">Employer home</p>
            <p className="text-gray-600 mt-2">Credits</p>
        </div>

        {/* Right - Help Center */}
        <div>
            <h2 className="text-lg font-semibold text-gray-800">Help Center</h2>
            <p className="text-gray-600 mt-2">Summons/Notices</p>
            <p className="text-gray-600 mt-2">Greivious</p>
            <p className="text-gray-600 mt-2">Report issue</p>
        </div>

        {/* Right - Privacy Policy */}
            <div>
            <h2 className="text-lg font-semibold text-gray-800">Privacy Policy</h2>
            <p className="text-gray-600 mt-2">Terms & conditions</p>
            <p className="text-gray-600 mt-2">Fraud alert</p>
            <p className="text-gray-600 mt-2">Trust & safety</p>
        </div>

      </div>
  </footer>
  )
}

export default Footer
