import { useEffect, useState } from 'react'
import './App.css'
import { CourierInbox, Courier } from '@trycourier/courier-react'

function App() {

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {

    // Add auth listener after signing in
    const listener = Courier.shared.addAuthenticationListener((props) => {
      console.log('Auth state changed:', props);
      setUserId(props.userId);
    });

    // Sign in immediately when component mounts
    Courier.shared.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: true
    });

    // Clean up listener on unmount
    return () => {
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
