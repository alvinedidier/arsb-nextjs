// utils/fetchApi.ts
export const fetchApi = async (
    url: string,
    method: 'GET' | 'POST',
    body?: any,
    customHeaders?: HeadersInit
  ): Promise<any> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
  
    const options: RequestInit = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  
    return response.json();
  };
  