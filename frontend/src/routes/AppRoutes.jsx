import { Route, Routes } from 'react-router-dom';
import DonorDashboard from '../pages/DonorDashboard';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
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
  </Routes>
);

export default AppRoutes;
