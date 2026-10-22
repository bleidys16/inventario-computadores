import { useAuthStore } from './store/useAuthStore';
import { LoginView } from './pages/LoginView';
import { DashboardView } from './pages/DashboardView';

export function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <DashboardView />;
}

export default App;
