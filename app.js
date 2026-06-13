const SHEET_ID = "179t_fUJ_q0bbwxsiXIQcaxV6YLBv6_cXq8rBbq2i9eg";

const URLS = {
  teams: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Teams`,
  players: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Players`,
  scoring: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Scoring`,
};

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  return text.split("\n").map(r => r.split(","));
}

function tableHTML(rows) {
  return `
    <table>
      ${rows.map((r, i) => `
        <tr>
          ${r.map(c => `<td>${c || ""}</td>`).join("")}
        </tr>
      `).join("")}
    </table>
  `;
}

async function loadData() {
  try {
    const [teams, players, scoring] = await Promise.all([
      fetchCSV(URLS.teams),
      fetchCSV(URLS.players),
      fetchCSV(URLS.scoring),
    ]);

    document.getElementById("teams").innerHTML = tableHTML(teams);
    document.getElementById("scoring").innerHTML = tableHTML(scoring);

    // Simple leaderboard (placeholder logic for now)
    const leaderboard = players.slice(1).map(p => [p[0], "0 pts"]);

    document.getElementById("leaderboard").innerHTML = tableHTML([
      ["Player", "Points"],
      ...leaderboard
    ]);

    document.getElementById("lastUpdated").innerText =
      "Last updated: " + new Date().toLocaleString();

  } catch (err) {
    console.error(err);
    document.getElementById("leaderboard").innerHTML =
      "<p>Error loading sheet. Check sharing settings.</p>";
  }
}

loadData();
setInterval(loadData, 60000);