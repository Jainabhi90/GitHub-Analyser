const BASE_URL = "https://api.github.com";

export async function fetchUser(username) {
  const res = await fetch(`${BASE_URL}/users/${username}`);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User not found. Please check the username.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
  
  return res.json();
}

export async function fetchRepos(username) {
  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`
  );
  
  if (!res.ok) {
    throw new Error("Failed to fetch repositories.");
  }
  
  return res.json();
}
export async function fetchEvents(username) {
  const res = await fetch(
    `${BASE_URL}/users/${username}/events?per_page=100`
  )
  if (!res.ok) {
    throw new Error("Failed to fetch activity data.")
  }
  return res.json()
}
