import { Navigate } from "react-router-dom";

export { PrivateRoute };

function PrivateRoute(props) {
  if (!props.user) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }

  // authorized so return child components
  return children;
}
