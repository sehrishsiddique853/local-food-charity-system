import PublicLayout from '../layouts/PublicLayout';
import { useLoginForm } from '../hooks/useLoginForm';
import LoginIntro from '../sections/LoginIntro';
import LoginForm from '../components/Auth/LoginForm';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const loginForm = useLoginForm();

  return (
    <PublicLayout pageClassName="login-page" navbarVariant="light">
      <main className="login-main">
        <LoginIntro />
        <LoginForm {...loginForm} />
      </main>
    </PublicLayout>
  );
};

export default LoginPage;
