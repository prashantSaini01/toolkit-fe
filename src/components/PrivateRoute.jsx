// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { toast } from 'react-toastify';
 
// const PrivateRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
 
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('token');
       
//         if (token) {
//           // Token verification logic (JWT or custom logic)
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//           throw new Error('No valid authentication found');
//         }
//       } catch (error) {
//         console.error('Authentication check failed:', error);
//         setIsAuthenticated(false);
//         toast.error('Please log in to continue');
//         navigate('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };
 
//     checkAuth();
//   }, [navigate]);
 
//   if (isLoading) {
//     // You can replace this with a loading spinner component
//     return <div>Loading...</div>;
//   }
 
//   return isAuthenticated ? children : null;
// };
 
// PrivateRoute.propTypes = {
//   children: PropTypes.node.isRequired,
// };


// export default PrivateRoute;
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          // Optional: verify token here
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Please log in to continue');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
