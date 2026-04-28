import { useEffect, useState } from "react";
import { fetchToken, fetchDashboard } from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const tokenData = await fetchToken();
        setToken(tokenData.accessToken);

        const dashData = await fetchDashboard();
        setDashboard(dashData);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="app">Loading dashboard...</div>;
  if (error) return <div className="app error">{error}</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>DummyJSON Dashboard</h1>
        <div className="token-box">
          <span>Backend Token (truncated): </span>
          <code>{token ? token.slice(0, 25) + "..." : "N/A"}</code>
        </div>
      </header>

      <section className="summary">
        <div className="card">
          <h2>Products</h2>
          <p>{dashboard.summary.totalProducts}</p>
        </div>
        <div className="card">
          <h2>Users</h2>
          <p>{dashboard.summary.totalUsers}</p>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Products</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.products.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.brand}</td>
                  <td>${p.price}</td>
                  <td>{p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Age</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.username}</td>
                  <td>{u.age}</td>
                  <td>{u.address?.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;

