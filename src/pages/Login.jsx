import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // This function is now correct
  const handleLogin = async (e) => { // <-- async
    e.preventDefault();
    setError('');
    
    // await the login function from context
    // 'user' will now be the actual user object { id: 'admin', role: 'admin' }
    const user = await login(username, password); // <-- await
    
    if (user) {
      // user.role will now be 'admin', 'faculty', or 'student'
      navigate(`/${user.role}/dashboard`);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('password123');
    } else if (role === 'faculty') {
      setUsername('F001');
      setPassword('password123');
    } else if (role === 'student') {
      setUsername('1MS21CS001');
      setPassword('password123');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vidya-light-pink p-4">
      <div className="max-w-md w-full">
        <Logo className="justify-center mb-8" />
        <Card>
          <Card.Header>
            <Card.Title className="text-center text-2xl">Portal Login</Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-vidya-gray-700">Email / USN / SSN</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your ID"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-vidya-gray-700">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-vidya-gray-500">
              <p>Quick Access Credentials:</p>
              <div className="flex justify-center gap-2 mt-2">
                <button onClick={() => setDemoCredentials('admin')} className="text-vidya-pink hover:underline">Admin</button>
                <button onClick={() => setDemoCredentials('faculty')} className="text-vidya-pink hover:underline">Faculty</button>
                <button onClick={() => setDemoCredentials('student')} className="text-vidya-pink hover:underline">Student</button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;