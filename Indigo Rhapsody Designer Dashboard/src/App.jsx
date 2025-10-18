import { ThemeProvider } from "styled-components";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import Loginscreen from "./screens/loginScreen/Loginscreen"; // Import the login screen
import PageNotFound from "./screens/error/PageNotFound";
import { theme } from "./styles/theme/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/global/GlobalStyles";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./screens/products/productsPage";
import OrderScreen from "./screens/orders/orderScreen";
import ShippingPage from "./screens/shipping/shippingPage";
import ReturnRequest from "./screens/returnRequest/ReturnRequest";
import ProfileScreen from "./screens/profile/profileScreen";
import VideosScreen from "./screens/videos/videosScreen";
import "react-toastify/dist/ReactToastify.css";
import NotificationScreen from "./screens/notifications/notificationScreen";
import SignupScreen from "./screens/signUpScreen/signupScreen";
import { AuthProvider } from "./context/AuthContext";
import { getApiBaseUrl, isProduction, isTesting } from "./config/environment";

function App() {
  // Environment startup banner
  console.log(`%c🚀 Indigo Rhapsody Designer Dashboard`, 'color: #9C27B0; font-weight: bold; font-size: 16px;');
  console.log(`%c🌍 Environment: ${isProduction() ? 'PRODUCTION' : isTesting() ? 'TESTING' : 'UNKNOWN'}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
  console.log(`%c🔗 API Base URL: ${getApiBaseUrl()}`, 'color: #2196F3; font-weight: bold;');
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router>
          <GlobalStyles />

          <Routes>
            <Route path="/" element={<Loginscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <BaseLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardScreen />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrderScreen />} />
              <Route path="shippingDetails" element={<ShippingPage />} />
              <Route path="returnRequest" element={<ReturnRequest />} />
              <Route path="videos" element={<VideosScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="notifications" element={<NotificationScreen />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
