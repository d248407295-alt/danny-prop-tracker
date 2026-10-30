import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import Auth from './Auth';

const MENU_ITEMS = [
  'Dashboard',
  'My Accounts',
  'Challenges',
  'Funded Account',
  'Certificates',
  'Screenshots',
  'Risk Manager',
  'Trading Journal',
  'Analytics',
  'Psychology',
  'Settings',
];

function Dashboard({ user }) {
  const [activeMenuItem, setActiveMenuItem] = useState(MENU_ITEMS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);

  const [challengeFirm, setChallengeFirm] = useState('');
  const [challengeSize, setChallengeSize] = useState('');
  const [challengeType, setChallengeType] = useState('');
  const [challengePhase, setChallengePhase] = useState('');
  const [challengeDate, setChallengeDate] = useState('');

  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
const [databaseError, setDatabaseError] = useState('');
// LOAD CHALLENGES FROM SUPABASE
useEffect(() => {
  const loadChallenges = async () => {
    setLoadingChallenges(true);
    setDatabaseError('');

    const { data, error } = await supabase
      .from('prop_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database loading error:', error.message);
      setDatabaseError(error.message);
      setLoadingChallenges(false);
      return;
    }

    const formattedChallenges = data.map((item) => ({
      id: item.id,
      firm: item.firm,
      size: Number(item.account_size),
      type: item.challenge_type,
      phase: item.phase,
      date: item.start_date,
    }));

    setChallenges(formattedChallenges);
    setLoadingChallenges(false);
  };

  loadChallenges();
}, [user.id]);

  const [selectedFirm, setSelectedFirm] = useState('');
  const [selectedChallengeType, setSelectedChallengeType] = useState('');

  const [accounts, setAccounts] = useState([]);

  const [accountName, setAccountName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [accountSize, setAccountSize] = useState('');
  const [accountType, setAccountType] = useState('Challenge');

  // WINDOW RESIZE
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobileView = useMemo(
    () => windowWidth < 768,
    [windowWidth]
  );

  // SAVE CHALLENGE TO SUPABASE
const handleDeleteChallenge = async (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this account?'
  );

  if (!confirmDelete) return;

  setDatabaseError('');

  const { error } = await supabase
    .from('prop_accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete error:', error.message);
    setDatabaseError(error.message);
    return;
  }

  setChallenges((previousChallenges) =>
    previousChallenges.filter((challenge) => challenge.id !== id)
  );
};

  return (
    <div className="App">
<button
  onClick={() => supabase.auth.signOut()}
  style={{
    position: 'absolute',
    top: '15px',
    right: '20px',
    zIndex: 1000
  }}
>
  Logout
</button>
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="menu-Title">MENU</div>

        {MENU_ITEMS.map((item) => (
          <div
            key={item}
            className={`menu-item ${
              activeMenuItem === item ? 'active' : ''
            }`}
            onClick={() => setActiveMenuItem(item)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="content">
        {loadingChallenges && <p>Loading your accounts...</p>}

{databaseError && (
  <p style={{ color: 'red' }}>
    Database error: {databaseError}
  </p>
)}

        {activeMenuItem === 'Dashboard' && (
          <h1>Dashboard</h1>
        )}

        {activeMenuItem === 'My Accounts' && (
          <h1>My Accounts</h1>
        )}

        {/* ================= CHALLENGES ================= */}

        {activeMenuItem === 'Challenges' && (
          <div className="challenge-section">

            <div className="challenge-heading">

              <h1>MY CHALLENGES</h1>

              <button
                className="challenge-btn"
                onClick={() => setShowChallengeForm(true)}
              >
                +add
              </button>

            </div>

            {showChallengeForm && (
              <form
                className="challenge-form"
                onSubmit={handleSaveChallenge}
              >

                <select
                  value={challengeFirm}
                  onChange={(e) => setChallengeFirm(e.target.value)}
                  required
                >
                  <option value="">select account type</option>
                  <option value="ftmo">ftmo</option>
                  <option value="5ers">5ers</option>
                  <option value="fundedpips">fundedpip</option>
                </select>

                <select
                  value={challengeSize}
                  onChange={(e) => setChallengeSize(e.target.value)}
                  required
                >
                  <option value="">selecr account size</option>
                  <option value="2500">2500</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                  <option value="25000">25000</option>
                  <option value="50000">50000</option>
                  <option value="100000">100000</option>
                </select>

                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  required
                >
                  <option value="">Select challenge type</option>

                  <option value="1-Step">1-Step Challenge</option>
                  <option value="2-Step">2-Step Challenge</option>
                  <option value="High Stakes">High Stakes</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Hyper Growth">Hyper Growth</option>
                  <option value="1 Step Flex">1 Step Flex</option>
                  <option value="2 Step Standard">2 Step Standard</option>
                  <option value="2 Step Pro">2 Step Pro</option>
                </select>

                <select
                  value={challengePhase}
                  onChange={(e) => setChallengePhase(e.target.value)}
                  required
                >
                  <option value="">Select challenge phase</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Funded">Funded</option>
                </select>

                <input
                  type="date"
                  value={challengeDate}
                  onChange={(e) => setChallengeDate(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowChallengeForm(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save Challenge
                </button>

              </form>
            )}

            <div className="saved-challenges">

              {challenges
                .filter(challenge => challenge.phase !== "Funded")
                .map((challenge) => (

                  <div
                    className="challenge-card"
                    key={challenge.id}
                  >

                    <h2>{challenge.firm}</h2>

                    <p>
                      Account Size: $
                      {Number(challenge.size).toLocaleString()}
                    </p>

                    <p>Challenge Type: {challenge.type}</p>

                    <p>Phase: {challenge.phase}</p>

                    <p>Start Date: {challenge.date}</p>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      Delete
                    </button>

                  </div>

                ))}

            </div>

          </div>
        )}

        {/* ================= FUNDED ACCOUNT ================= */}

        {activeMenuItem === 'Funded Account' && (
          <div className="Funded-section">

            <div className="Funded-heading">

              <h1>FUNDED ACCOUNT</h1>

              <button
                onClick={() => {
                  setChallengeFirm('');
                  setChallengeSize('');
                  setChallengeType('');
                  setChallengeDate('');
                  setChallengePhase("Funded");
                  setShowChallengeForm(true);
                }}
              >
                + Add
              </button>

            </div>

            {showChallengeForm && (
              <form
                className="challenge-form"
                onSubmit={handleSaveChallenge}
              >

                {/* Prop Firm */}

                <select
                  value={challengeFirm}
                  onChange={(e) => setChallengeFirm(e.target.value)}
                  required
                >
                  <option value="">Select account type</option>
                  <option value="ftmo">FTMO</option>
                  <option value="5ers">5ers</option>
                  <option value="fundedpips">FundedPips</option>
                </select>

                {/* Account Size */}

                <select
                  value={challengeSize}
                  onChange={(e) => setChallengeSize(e.target.value)}
                  required
                >
                  <option value="">Select account size</option>
                  <option value="2500">2500</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                  <option value="25000">25000</option>
                  <option value="50000">50000</option>
                  <option value="100000">100000</option>
                </select>

                {/* Challenge Type */}

                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  required
                >
                  <option value="">Select challenge type</option>
                  <option value="1-Step">1-Step Challenge</option>
                  <option value="2-Step">2-Step Challenge</option>
                  <option value="High Stakes">High Stakes</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Hyper Growth">Hyper Growth</option>
                  <option value="1 Step Flex">1 Step Flex</option>
                  <option value="2 Step Standard">2 Step Standard</option>
                  <option value="2 Step Pro">2 Step Pro</option>
                </select>

                {/* Phase */}

                <select
                  value={challengePhase}
                  onChange={(e) => setChallengePhase(e.target.value)}
                  required
                >
                  <option value="Funded">Funded</option>
                </select>

                {/* Date */}

                <input
                  type="date"
                  value={challengeDate}
                  onChange={(e) => setChallengeDate(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowChallengeForm(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save Funded Account
                </button>

              </form>
            )}

            {/* Display Funded Accounts */}

            <div className="saved-challenges">

              {challenges
                .filter(challenge => challenge.phase === "Funded")
                .map(challenge => (

                  <div
                    className="challenge-card"
                    key={challenge.id}
                  >

                    <h2>{challenge.firm}</h2>

                    <p>
                      Account Size: $
                      {Number(challenge.size).toLocaleString()}
                    </p>

                    <p>Challenge Type: {challenge.type}</p>

                    <p>Phase: {challenge.phase}</p>

                    <p>Start Date: {challenge.date}</p>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      Delete
                    </button>

                  </div>

                ))}

            </div>

          </div>
        )}

        {/* ================= OTHER SECTIONS ================= */}

        {activeMenuItem === 'Certificates' && (
          <h1>CERTIFICATES</h1>
        )}

        {activeMenuItem === 'Screenshots' && (
          <h1>SCREENSHOTS</h1>
        )}

        {activeMenuItem === 'Risk Manager' && (
          <h1>RISK MANAGER</h1>
        )}

        {activeMenuItem === 'Trading Journal' && (
          <h1>TRADING JOURNAL</h1>
        )}

        {activeMenuItem === 'Analytics' && (
          <h1>ANALYTICS</h1>
        )}

        {activeMenuItem === 'Psychology' && (
          <h1>PSYCHOLOGY</h1>
        )}

        {activeMenuItem === 'Settings' && (
          <h1>SETTINGS</h1>
        )}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
      }

      setUser(data?.session?.user ?? null);
      setCheckingAuth(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Auth />;
  }

  return <Dashboard user={user} />;
}

export default App;