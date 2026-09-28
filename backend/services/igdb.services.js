import dotenv from "dotenv";

dotenv.config();

const getAccessToken = async () => {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) {
    console.log("Failed to connect to Twitch...");
    return;
  }
  const data = await res.json();
  return data;
};

export const getGames = async () => {
  const { access_token } = await getAccessToken();
  const conn = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
    body: `fields name, summary, cover.url, genres.name, platforms.name;
    where cover != null;
    limit 10;`,
  });
  if (!conn.ok) {
    console.log("Failed to fetch games...");
  }
  const data = await conn.json();
  return data;
};
