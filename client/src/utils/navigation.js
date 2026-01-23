import { ROLES } from '../constants/roles';

/**
 * Get the dashboard path for a user based on their role
 * @param {string} role - User role (customer, vendor, admin)
 * @returns {string} Dashboard path
 */
export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.VENDOR:
      return '/vendor';
    case ROLES.CUSTOMER:
      return '/customer';
    default:
      return '/customer'; // Default to customer dashboard
  }
};

/**
 * Navigate to the appropriate dashboard based on user role
 * @param {object} navigate - React Router navigate function
 * @param {object} user - User object with role property
 */
export const navigateToDashboard = (navigate, user) => {
  if (!user || !user.role) {
    console.warn('No user or role provided for navigation');
    navigate('/');
    return;
  }
  
  const dashboardPath = getDashboardPath(user.role);
  navigate(dashboardPath);
};