//const BASE_URL = "https://jsonplaceholder.typicode.com";
const BASE_URL = "http://localhost:8080";

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Registration failed: ${response.status}`);
  }

  return text;
}


export async function loginUser(credentials) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Login failed: ${response.status}`);
  }

  return text;
}


