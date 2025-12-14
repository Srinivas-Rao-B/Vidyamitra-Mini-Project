import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-vidya-pink">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-vidya-gray-900">Page Not Found</h2>
      <p className="mt-2 text-vidya-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6">
        <Button>Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFound;
