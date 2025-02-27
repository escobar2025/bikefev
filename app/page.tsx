/* App.css */
:root {
  --primary-color: #4caf50;
  --primary-hover: #3e8e41;
  --secondary-color: #2196f3;
  --danger-color: #f44336;
  --warning-color: #ff9800;
  --success-color: #4caf50;
  --text-color: #333;
  --light-text: #fff;
  --border-color: #e0e0e0;
  --bg-color: #f5f5f5;
  --card-bg: #fff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
}

.navbar h1 {
  color: var(--primary-color);
}

/* Buttons */
button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--light-text);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--light-text);
}

.btn-success {
  background-color: var(--success-color);
  color: var(--light-text);
}

.btn-danger {
  background-color: var(--danger-color);
  color: var(--light-text);
}

.logout-btn {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Auth container */
.auth-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
}

.auth-container p {
  text-align: center;
  margin-top: 20px;
}

.auth-container a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Messages */
.error-message, .success-message, .message {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.success-message {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
  border: 1px solid var(--success-color);
}

.message {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
}

/* Dashboard */
.dashboard-container, .maintenance-container, .ride-logger-container {
  padding: 20px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.dashboard-container h2, .maintenance-container h2, .ride-logger-container h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.admin-section, .user-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.admin-section h3, .user-section h3 {
  margin-bottom: 15px;
  color: var(--secondary-color);
}

/* Bikes list */
.bikes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.bike-card {
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: #f9f9f9;
}

.bike-card h4 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

/* Data tables */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

/* Status and Progress indicators */
.status-ok {
  color: var(--success-color);
}

.status-warning {
  color: var(--warning-color);
}

.status-danger {
  color: var(--danger-color);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-ok, .progress-warning, .progress-danger {
  height: 100%;
  border-radius: 5px;
}

.progress-ok {
  background-color: var(--success-color);
}

.progress-warning {
  background-color: var(--warning-color);
}

.progress-danger {
  background-color: var(--danger-color);
}

/* Navigation links */
.navigation-links {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.nav-link {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: var(--light-text);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: var(--primary-hover);
}

/* Media Queries */
@media (max-width: 768px) {
  .bikes-list {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    display: block;
    overflow-x: auto;
  }
  
  .admin-section, .user-section {
    padding: 15px;
  }
}
