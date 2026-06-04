export const signupUser = async (userData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    },
  );

  return response;
};

export const loginUser = async (userData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    },
  );
  return response;
};

export const logoutUser = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  return response;
};

export const checkAuthStatus = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/status`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  return response;
};
