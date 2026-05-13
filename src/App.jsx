import { useState } from "react";

import "./App.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function App() {

  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);

  const [repos, setRepos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function getGithubData() {

    if (username.trim() === "") {

      setError("Please enter username");
      return;

    }

    setLoading(true);

    setError("");

    setUser(null);

    setRepos([]);

    try {

      // user profile

      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userResponse.ok) {

        throw new Error("User not found");

      }

      const userData = await userResponse.json();

      // repos

      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );

      if (!repoResponse.ok) {

        throw new Error("Repositories not found");

      }

      const repoData = await repoResponse.json();

      // sorting repos

      repoData.sort((a, b) => {

        return b.stargazers_count - a.stargazers_count;

      });

      setUser(userData);

      setRepos(repoData);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }

  // language count

  let languages = {};

  repos.forEach((repo) => {

    if (repo.language) {

      if (languages[repo.language]) {

        languages[repo.language] =
          languages[repo.language] + 1;

      } else {

        languages[repo.language] = 1;

      }

    }

  });

  // chart data

  const data = {

    labels: Object.keys(languages),

    datasets: [
      {
        data: Object.values(languages),

        backgroundColor: [
          "#dc2626",
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#9333ea",
          "#0891b2",
          "#ea580c",
          "#db2777",
          "#14b8a6",
          "#4f46e5"
        ],

        borderWidth: 2,
        borderColor: "#fff"
      }
    ]

  };

  return (

    <div className="main-container">

      <div className="top-section">

        <p className="small-heading">
          GitHub Analyzer
        </p>

        <h1>
          Explore GitHub Profiles
        </h1>

        <p className="desc">
          Search GitHub users and check their
          repositories, followers and languages.
        </p>

        <div className="search-area">

          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => {

              setUsername(e.target.value);

            }}
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                getGithubData();

              }

            }}
          />

          <button
            onClick={getGithubData}
            disabled={loading}
          >

            {loading ? "Loading..." : "Analyze"}

          </button>

        </div>

      </div>

      {loading && (

        <div className="message-box">

          Loading GitHub profile...

        </div>

      )}

      {error && (

        <div className="error-box">

          {error}

        </div>

      )}

      {user && (

        <>

          <div className="profile-section">

            <div className="left-profile">

              <img
                src={user.avatar_url}
                alt="profile"
              />

              <div>

                <h2>
                  {user.name || "No Name"}
                </h2>

                <p className="username">
                  @{user.login}
                </p>

                <p className="bio">
                  {user.bio || "No bio available"}
                </p>

              </div>

            </div>

            <div className="right-profile">

              <div className="stat-card">

                <h3>
                  {user.followers}
                </h3>

                <span>
                  Followers
                </span>

              </div>

              <div className="stat-card">

                <h3>
                  {user.following}
                </h3>

                <span>
                  Following
                </span>

              </div>

              <div className="stat-card">

                <h3>
                  {user.public_repos}
                </h3>

                <span>
                  Repositories
                </span>

              </div>

            </div>

          </div>

          <div className="chart-box">

            <h2>
              Most Used Languages
            </h2>

            <Pie data={data} />

          </div>

          <div className="repo-wrapper">

            <div className="repo-top">

              <h2>
                Popular Repositories
              </h2>

              <p>
                Top repositories sorted by stars
              </p>

            </div>

            <div className="repo-grid">

              {repos.slice(0, 6).map((repo) => (

                <div
                  className="repo-card"
                  key={repo.id}
                >

                  <div className="repo-header">

                    <h3>
                      {repo.name}
                    </h3>

                    <span>
                      {repo.language || "Code"}
                    </span>

                  </div>

                  <p>

                    {repo.description ||
                      "No description available"}

                  </p>

                  <div className="repo-bottom">

                    <div>

                      ⭐ {

                        repo.stargazers_count >= 1000

                          ? (repo.stargazers_count / 1000).toFixed(1) + "k"

                          : repo.stargazers_count

                      }

                    </div>

                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >

                      Open Repo

                    </a>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </>

      )}

    </div>

  );

}

export default App;