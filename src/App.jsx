import { useState } from 'react';
import BirthdayCard from './components/BirthdayCard';
import './App.css';

function App() {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' // Needed to boundary the tooltip
    }}>
      <BirthdayCard onOpenChange={setIsCardOpen} />
    </div>
  );
}

export default App;
