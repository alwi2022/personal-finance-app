
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Dashboard/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Income from './pages/Dashboard/Income';
import Expanse from './pages/Dashboard/Expanse';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/dashboard/income" element={<Income />} />
        <Route path="/dashboard/expanse" element={<Expanse />} />

      </Routes>
    </Router>
  )
}

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}
