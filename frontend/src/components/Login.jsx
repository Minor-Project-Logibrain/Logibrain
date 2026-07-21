import { useSearchParams } from 'react-router-dom';
import "./Login.css";
import DriverLogin from './DriverLogin';
import OwnerLogin from './OwnerLogin';

function Login() {

  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  if (role === "driver") {
    return <DriverLogin />;
  }
  if (role === "owner") {
    return <OwnerLogin />;
  }
  return <h2 className='text-center'>Please select the role first</h2>
}

export default Login;




