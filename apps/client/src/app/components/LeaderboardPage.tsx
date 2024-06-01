// LeaderboardPage.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation'
import { useSession } from 'next-auth/react';
import styles from '../../styles/styles.module.css';
import { FaSearch } from 'react-icons/fa';
import { BACKEND_URL } from '@/lib/Constants';
import { State } from '@/lib/types';
import QRCodeScannerComponent from './QRCodeScannerComponent';

const LeaderboardPage = () => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [states, setStates] = useState<State[]>([]);
  const [selectedUser, setSelectedUser] = useState<State | null>(null); // Updated to hold selected user data
  const router = useRouter();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/pomodoro`);
        if (res.ok) {
          const data = await res.json();
          setStates(data);
        } else {
          console.error('Failed to fetch data from the backend');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAdminViewClick = (user: string) => { // Updated to accept user data
   
 
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStates = filteredStates.sort((a, b) => b.totalHours - a.totalHours);

  if (!session || !session.user || !session.user.isAdmin) {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className={styles.container2}>
      <h1 className={`${styles.heading} ${styles.big} ${styles.center} ${styles.bold}`}>Leaderboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
          style={{ marginRight: '10px' }}
        />
        <FaSearch className={styles.searchIcon} />
      </div>
      <table className={`${styles.table} ${styles.center}`} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Hours Studied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStates.map((state, index) => (
            <tr key={state.userId}>
              <td>{index + 1}</td>
              <td>
                <a href={`/profile/${state.name}`}>
                  {state.name}
                </a>
              </td>
              <td>{state.totalHours}</td>
              <td>
                <button 
                  className={styles.button} 
                  onClick={() => handleAdminViewClick(state.name)} 
                >
                  Admin View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Conditionally render QR code scanner if a user is selected */}
      {selectedUser && (
        <QRCodeScannerComponent user={selectedUser} />
      )}
    </div>
  );
};

export default LeaderboardPage;
