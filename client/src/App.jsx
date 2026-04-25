import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ServerWakeSplash from './components/ServerWakeSplash.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Games from './pages/Games.jsx';
import GameDetails from './pages/GameDetails.jsx';
import Plans from './pages/Plans.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Payment from './pages/Payment.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Terms from './pages/Terms.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminGames from './pages/admin/AdminGames.jsx';
import AdminSubscriptions from './pages/admin/AdminSubscriptions.jsx';
import AdminRentals from './pages/admin/AdminRentals.jsx';
import AdminPayments from './pages/admin/AdminPayments.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ServerWakeSplash />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/payment/:subscriptionId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/games" element={<AdminRoute><AdminGames /></AdminRoute>} />
          <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
          <Route path="/admin/rentals" element={<AdminRoute><AdminRentals /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
