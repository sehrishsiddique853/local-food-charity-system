import { useSearchParams } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { useRegisterForm } from '../hooks/useRegisterForm';
import RegisterIntro from '../sections/RegisterIntro';
import RegisterForm from '../components/Auth/RegisterForm';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const initialRole = requestedRole === 'ngo' || requestedRole === 'donor' ? requestedRole : 'donor';
  const registerForm = useRegisterForm(initialRole);

  return (
    <PublicLayout pageClassName="register-page" navbarVariant="light">
      <main className="register-main">
        <RegisterIntro />
        <RegisterForm {...registerForm} />
      </main>
    </PublicLayout>
  );
};

export default RegisterPage;
