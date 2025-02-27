// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import MaintenanceTracker from './components/MaintenanceTracker';
import RideLogger from './components/RideLogger';
import './App.css'; // Estilos atualizados com variáveis em português sem acentos

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Verificar se o usuário está autenticado ao carregar o aplicativo
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setIsAuthenticated(true);
    }
  }, []);
  
  // Função para login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Função para logout
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>BikeMaintenance</h1>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">Sair</button>
          )}
        </nav>
        
        <Switch>
          <Route exact path="/">
            {isAuthenticated ? (
              <Redirect to={user.isAdmin ? "/admin" : "/dashboard"} />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Route>
          
          <Route path="/register">
            {isAuthenticated ? (
              <Redirect to={user.isAdmin ? "/admin" : "/dashboard"} />
            ) : (
              <Register />
            )}
          </Route>
          
          <Route path="/admin">
            {isAuthenticated && user.isAdmin ? (
              <AdminDashboard user={user} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          
          <Route path="/dashboard">
            {isAuthenticated && !user.isAdmin ? (
              <UserDashboard user={user} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          
          <Route path="/maintenance">
            {isAuthenticated ? (
              <MaintenanceTracker user={user} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          
          <Route path="/log-ride">
            {isAuthenticated && !user.isAdmin ? (
              <RideLogger user={user} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userData = await loginUser(email, password);
      onLogin(userData);
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
      
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;

// components/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      await registerUser(name, email, password);
      setMessage('Cadastro realizado com sucesso! Aguardando aprovação do administrador.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Erro ao cadastrar. Tente novamente.');
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Cadastro</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Cadastrar</button>
      </form>
      
      <p>
        Já tem uma conta? <Link to="/">Faça login</Link>
      </p>
    </div>
  );
}

export default Register;

// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getPendingUsers, 
  approveUser, 
  rejectUser,
  getAllUsers,
  addBikePart
} from '../services/api';

function AdminDashboard({ user }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [partName, setPartName] = useState('');
  const [maintenanceKm, setMaintenanceKm] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadPendingUsers();
    loadAllUsers();
  }, []);
  
  const loadPendingUsers = async () => {
    try {
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      console.error("Erro ao carregar usuários pendentes:", err);
    }
  };
  
  const loadAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users.filter(u => !u.isAdmin));
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };
  
  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      loadPendingUsers();
      loadAllUsers();
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
    }
  };
  
  const handleReject = async (userId) => {
    try {
      await rejectUser(userId);
      loadPendingUsers();
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
    }
  };
  
  const handleAddPart = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await addBikePart(partName, parseInt(maintenanceKm));
      setMessage('Peça adicionada com sucesso!');
      setPartName('');
      setMaintenanceKm('');
    } catch (err) {
      setMessage('Erro ao adicionar peça.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <h2>Painel do Administrador</h2>
      
      <div className="admin-section">
        <h3>Usuários Pendentes</h3>
        {pendingUsers.length === 0 ? (
          <p>Nenhum usuário pendente de aprovação.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      onClick={() => handleApprove(user.id)}
                      className="btn-success"
                    >
                      Aprovar
                    </button>
                    <button 
                      onClick={() => handleReject(user.id)}
                      className="btn-danger"
                    >
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="admin-section">
        <h3>Usuários Ativos</h3>
        {allUsers.length === 0 ? (
          <p>Nenhum usuário ativo no sistema.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="admin-section">
        <h3>Adicionar Nova Peça</h3>
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleAddPart}>
          <div className="form-group">
            <label>Nome da Peça</label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Quilometragem para Manutenção</label>
            <input
              type="number"
              value={maintenanceKm}
              onChange={(e) => setMaintenanceKm(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Adicionar Peça</button>
        </form>
      </div>
      
      <div className="navigation-links">
        <Link to="/maintenance" className="nav-link">Ver Manutenções</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

// components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBikes, addUserBike, getUserParts } from '../services/api';

function UserDashboard({ user }) {
  const [bikes, setBikes] = useState([]);
  const [parts, setParts] = useState([]);
  const [bikeName, setBikeName] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadUserBikes();
    loadUserParts();
  }, []);
  
  const loadUserBikes = async () => {
    try {
      const userBikes = await getUserBikes(user.id);
      setBikes(userBikes);
    } catch (err) {
      console.error("Erro ao carregar bicicletas:", err);
    }
  };
  
  const loadUserParts = async () => {
    try {
      const userParts = await getUserParts(user.id);
      setParts(userParts);
    } catch (err) {
      console.error("Erro ao carregar peças:", err);
    }
  };
  
  const handleAddBike = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await addUserBike(user.id, bikeName);
      loadUserBikes();
      setBikeName('');
      setMessage('Bicicleta adicionada com sucesso!');
    } catch (err) {
      setMessage('Erro ao adicionar bicicleta.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <h2>Olá, {user.name}!</h2>
      
      <div className="user-section">
        <h3>Suas Bicicletas</h3>
        {bikes.length === 0 ? (
          <p>Você ainda não cadastrou nenhuma bicicleta.</p>
        ) : (
          <div className="bikes-list">
            {bikes.map(bike => (
              <div key={bike.id} className="bike-card">
                <h4>{bike.name}</h4>
                <p>Quilometragem total: {bike.totalKm} km</p>
                <p>Adicionada em: {new Date(bike.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="add-bike-form">
          <h3>Adicionar Nova Bicicleta</h3>
          {message && <div className="message">{message}</div>}
          
          <form onSubmit={handleAddBike}>
            <div className="form-group">
              <label>Nome da Bicicleta</label>
              <input
                type="text"
                value={bikeName}
                onChange={(e) => setBikeName(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">Adicionar</button>
          </form>
        </div>
      </div>
      
      <div className="user-section">
        <h3>Resumo de Manutenções</h3>
        {parts.length === 0 ? (
          <p>Nenhuma peça cadastrada ainda.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Km Atual</th>
                <th>Manutenção a cada</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => {
                const maintenance = part.maintenanceKm;
                const current = part.currentKm;
                const percentage = (current / maintenance) * 100;
                let status = "OK";
                let statusClass = "status-ok";
                
                if (percentage >= 90) {
                  status = "Manutenção Necessária";
                  statusClass = "status-danger";
                } else if (percentage >= 75) {
                  status = "Manutenção em Breve";
                  statusClass = "status-warning";
                }
                
                return (
                  <tr key={part.id}>
                    <td>{part.name}</td>
                    <td>{part.currentKm} km</td>
                    <td>{part.maintenanceKm} km</td>
                    <td className={statusClass}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="navigation-links">
        <Link to="/log-ride" className="nav-link">Registrar Novo Pedal</Link>
        <Link to="/maintenance" className="nav-link">Ver Manutenções</Link>
      </div>
    </div>
  );
}

export default UserDashboard;

// components/MaintenanceTracker.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserParts, resetPartKm, getAllParts } from '../services/api';

function MaintenanceTracker({ user }) {
  const [parts, setParts] = useState([]);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadParts();
  }, []);
  
  const loadParts = async () => {
    try {
      // Administrador vê todas as peças de todos os usuários
      if (user.isAdmin) {
        const allParts = await getAllParts();
        setParts(allParts);
      } else {
        // Usuário normal vê apenas suas peças
        const userParts = await getUserParts(user.id);
        setParts(userParts);
      }
    } catch (err) {
      console.error("Erro ao carregar peças:", err);
    }
  };
  
  const handleResetKm = async (partId) => {
    try {
      await resetPartKm(partId);
      setMessage('Quilometragem da peça resetada com sucesso!');
      loadParts();
    } catch (err) {
      setMessage('Erro ao resetar quilometragem.');
    }
  };
  
  return (
    <div className="maintenance-container">
      <h2>Controle de Manutenção</h2>
      {message && <div className="message">{message}</div>}
      
      {parts.length === 0 ? (
        <p>Nenhuma peça cadastrada ainda.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Peça</th>
              {user.isAdmin && <th>Usuário</th>}
              <th>Bicicleta</th>
              <th>Km Atual</th>
              <th>Manutenção a cada</th>
              <th>Progresso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => {
              const maintenance = part.maintenanceKm;
              const current = part.currentKm;
              const percentage = (current / maintenance) * 100;
              let progressClass = "progress-ok";
              
              if (percentage >= 90) {
                progressClass = "progress-danger";
              } else if (percentage >= 75) {
                progressClass = "progress-warning";
              }
              
              return (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  {user.isAdmin && <td>{part.userName}</td>}
                  <td>{part.bikeName}</td>
                  <td>{part.currentKm} km</td>
                  <td>{part.maintenanceKm} km</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className={progressClass}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span>{percentage.toFixed(1)}%</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleResetKm(part.id)}
                      className="btn-primary"
                    >
                      Resetar Km
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      
      <div className="navigation-links">
        <Link to={user.isAdmin ? "/admin" : "/dashboard"} className="nav-link">
          Voltar ao Painel
        </Link>
      </div>
    </div>
  );
}

export default MaintenanceTracker;

// components/RideLogger.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBikes, logRide } from '../services/api';

function RideLogger({ user }) {
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadUserBikes();
    // Configurar a data atual como padrão
    setDate(new Date().toISOString().substr(0, 10));
  }, []);
  
  const loadUserBikes = async () => {
    try {
      const userBikes = await getUserBikes(user.id);
      setBikes(userBikes);
      if (userBikes.length > 0) {
        setSelectedBike(userBikes[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar bicicletas:", err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Validação básica
    if (!selectedBike || !distance || !date) {
      setMessage('Preencha todos os campos.');
      return;
    }
    
    try {
      await logRide(user.id, selectedBike, parseFloat(distance), date);
      setMessage('Pedal registrado com sucesso!');
      setDistance('');
    } catch (err) {
      setMessage('Erro ao registrar pedal.');
    }
  };
  
  return (
    <div className="ride-logger-container">
      <h2>Registrar Novo Pedal</h2>
      
      {message && <div className="message">{message}</div>}
      
      {bikes.length === 0 ? (
        <div>
          <p>Você ainda não cadastrou nenhuma bicicleta.</p>
          <Link to="/dashboard" className="nav-link">
            Voltar ao Painel e Adicionar Bicicleta
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bicicleta</label>
            <select
              value={selectedBike}
              onChange={(e) => setSelectedBike(e.target.value)}
              required
            >
              {bikes.map(bike => (
                <option key={bike.id} value={bike.id}>
                  {bike.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Distância (km)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Registrar Pedal</button>
        </form>
      )}
      
      <div className="navigation-links">
        <Link to="/dashboard" className="nav-link">
          Voltar ao Painel
        </Link>
      </div>
    </div>
  );
}

export default RideLogger;

// services/api.js
// Este arquivo simularia as chamadas para o backend
// Em uma aplicação real, você substituiria por chamadas fetch ou axios

// Armazenamento local simulado
let users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

let bikes = [];
let parts = [
  {
    id: 1,
    name: 'Corrente',
    maintenanceKm: 1000,
    currentKm: 0
  },
  {
    id: 2,
    name: 'Freios',
    maintenanceKm: 500,
    currentKm: 0
  },
  {
    id: 3,
    name: 'Pneus',
    maintenanceKm: 2000,
    currentKm: 0
  }
];

let userParts = [];
let rides = [];

// Funções de API simuladas
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        u => u.email === email && 
        u.password === password && 
        u.isApproved
      );
      
      if (user) {
        // Não retorna a senha
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 500);
  });
};

export const registerUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Verifica se email já existe
      if (users.some(u => u.email === email)) {
        reject(new Error('Email já cadastrado'));
        return;
      }
      
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        isAdmin: false,
        isApproved: false,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

export const getPendingUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pending = users.filter(u => !u.isApproved);
      // Não retorna as senhas
      const pendingWithoutPasswords = pending.map(({ password, ...user }) => user);
      resolve(pendingWithoutPasswords);
    }, 500);
  });
};

export const getAllUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Não retorna as senhas
      const usersWithoutPasswords = users
        .filter(u => u.isApproved)
        .map(({ password, ...user }) => user);
      resolve(usersWithoutPasswords);
    }, 500);
  });
};

export const approveUser = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(u => u.id === parseInt(userId));
      if (userIndex !== -1) {
        users[userIndex].isApproved = true;
      }
      resolve(true);
    }, 500);
  });
};

export const rejectUser = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      users = users.filter(u => u.id !== parseInt(userId));
      resolve(true);
    }, 500);
  });
};

export const getUserBikes = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userBikes = bikes.filter(b => b.userId === parseInt(userId));
      resolve(userBikes);
    }, 500);
  });
};

export const addUserBike = (userId, bikeName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBike = {
        id: bikes.length + 1,
        userId: parseInt(userId),
        name: bikeName,
        totalKm: 0,
        createdAt: new Date().toISOString()
      };
      
      bikes.push(newBike);
      
      // Adicionar peças padrão para esta bicicleta
      parts.forEach(part => {
        userParts.push({
          id: userParts.length + 1,
          userId: parseInt(userId),
          bikeId: newBike.id,
          partId: part.id,
          name: part.name,
          bikeName: bikeName,
          userName: users.find(u => u.id === parseInt(userId)).name,
          maintenanceKm: part.maintenanceKm,
          currentKm: 0,
          createdAt: new Date().toISOString()
        });
      });
      
      resolve(newBike);
    }, 500);
  });
};

export const getUserParts = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parts = userParts.filter(p => p.userId === parseInt(userId));
      resolve(parts);
    }, 500);
  });
};

export const getAllParts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userParts);
    }, 500);
  });
};

export const resetPartKm = (partId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const partIndex = userParts.findIndex(p => p.id === parseInt(partId));
      if (partIndex !== -1) {
        userParts[partIndex].currentKm = 0;
      }
      resolve(true);
    }, 500);
  });
};

export const addBikePart = (partName, maintenanceKm) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPart = {
        id: parts.length + 1,
        name: partName,
        maintenanceKm,
        currentKm: 0
      };
      
      parts.push(newPart);
      resolve(newPart);
    }, 500);
  });
};

export const logRide = (userId, bikeId, distance, date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Registrar o pedal
      const newRide = {
        id: rides.length + 1,
        userId: parseInt(userId),
        bikeId: parseInt(bikeId),
        distance: parseFloat(distance),
        date,
        createdAt: new Date().toISOString()
      };
      
      rides.push(newRide);
      
      // Atualizar quilometragem da bicicleta
      const bikeIndex = bikes.findIndex(b => b.id === parseInt(bikeId));
      if (bikeIndex !== -1) {
        bikes[bikeIndex].totalKm += parseFloat(distance);
      }
      
      // Atualizar quilometragem das peças
      userParts.forEach((part, index) => {
        if (part.bikeId === parseInt(bikeId)) {
          userParts[index].currentKm += parseFloat(distance);
        }
      });
      
      resolve(newRide);
    }, 500);
  });
};
