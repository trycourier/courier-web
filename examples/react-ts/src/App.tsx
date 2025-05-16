import './App.css'
import { useEffect } from 'react'
import { CourierInbox, useCourier } from '@trycourier/courier-react'

function App() {

  const courier = useCourier();

  useEffect(() => {
    courier.signIn({
      userId: import.meta.env.VITE_USER_ID,
      jwt: import.meta.env.VITE_JWT,
      showLogs: true
    });
  }, []);

  return (
    <div className="App">
      <CourierInbox />
    </div>
  )
}

export default App;
