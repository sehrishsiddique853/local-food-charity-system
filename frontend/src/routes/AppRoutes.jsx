import { Route, Routes } from 'react-router-dom';
import DonationHistoryPage from '../pages/DonationHistoryPage';
import DonorDashboard from '../pages/DonorDashboard';
import DonorProfilePage from '../pages/DonorProfilePage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MyDonationsPage from '../pages/MyDonationsPage';
import NotificationsPage from '../pages/NotificationsPage';
import PostDonationPage from '../pages/PostDonationPage';
import RegisterPage from '../pages/RegisterPage';
import { ROUTES } from '../constants/routes';

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.home} element={<HomePage />} />
    <Route path={ROUTES.register} element={<RegisterPage />} />
    <Route path={ROUTES.login} element={<LoginPage />} />
    <Route path={ROUTES.donorDashboard} element={<DonorDashboard />} />
    <Route path={ROUTES.postDonation} element={<PostDonationPage />} />
    <Route path={ROUTES.myDonations} element={<MyDonationsPage />} />
    <Route path={ROUTES.donationHistory} element={<DonationHistoryPage />} />
    <Route path={ROUTES.donorProfile} element={<DonorProfilePage />} />
    <Route path={ROUTES.notifications} element={<NotificationsPage />} />
  </Routes>
);

export default AppRoutes;
