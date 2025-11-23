// Helper function to handle token storage
export const setAuthToken = (token: string) => {
  // Remove any existing token
  localStorage.removeItem('access_token');
  
  // Store the new token (ensure it's a string and trim any whitespace)
  if (token) {
    // Ensure the token doesn't have quotes and is properly trimmed
    const cleanToken = token.toString().trim().replace(/^"|"$/g, '');
    // Verify it looks like a JWT token (3 parts separated by dots)
    if (cleanToken.split('.').length !== 3) {
      console.error('Invalid JWT token format');
      return;
    }
    localStorage.setItem('access_token', cleanToken);
  }
};

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  // Clean the token and verify format
  const cleanToken = token.replace(/^"|"$/g, '').trim();
  if (cleanToken.split('.').length !== 3) {
    console.error('Stored token has invalid format');
    return null;
  }
  
  return cleanToken;
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
};

// Helper to create auth headers
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
