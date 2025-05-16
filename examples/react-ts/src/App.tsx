import { useEffect } from 'react'
import './App.css'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

function App() {

  const courier = useCourier();

  // const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {

    // Add auth listener after signing in
    const listener = courier.addAuthenticationListener((props) => {
      console.log('Auth state changed:', props);
      // setUserId(props.userId);
    });

    // Sign in immediately when component mounts
    console.log('Signing in', {
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT
    });
    courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: true
    });

    // Clean up listener on unmount
    return () => {
      console.log('Removing listener');
      listener.remove();
    };
  }, []);

  return (
    <div className="App">
      <CourierInbox />
    </div>
  )
}

export default App
