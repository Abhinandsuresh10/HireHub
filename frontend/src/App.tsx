import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "react-hot-toast"
import store from "./store/store"
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { JoinRoomOnLogin } from "./components/common/JoinRoomOnLogin"



const App = () => {
  return (
    <>
    <Provider store={store}>
     <Toaster />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
       <JoinRoomOnLogin/>
       <AppRoutes />
      </GoogleOAuthProvider>
    </Provider>
    </>
  )
}

export default App
