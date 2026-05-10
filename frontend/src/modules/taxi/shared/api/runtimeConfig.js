const DEFAULT_BACKEND_ORIGIN = (() => {
  const explicitOrigin =
    import.meta.env.VITE_BACKEND_ORIGIN ||
    import.meta.env.VITE_SOCKET_URL ||
    '';

  if (explicitOrigin) {
    return explicitOrigin.replace(/\/+$/, '');
  }

  const sharedApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
  if (sharedApiUrl) {
    return sharedApiUrl.replace(/\/api(?:\/v1)?(?:\/taxi)?\/?$/, '').replace(/\/+$/, '');
  }

  return 'http://localhost:5001';
})();

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    `${DEFAULT_BACKEND_ORIGIN}/api/v1`,
);

export const BACKEND_ORIGIN = trimTrailingSlash(
  import.meta.env.VITE_BACKEND_ORIGIN ||
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_ASSET_BASE_URL ||
    API_BASE_URL.replace(/\/api(?:\/v1)?$/, ''),
);

export const BACKEND_LABEL = BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN;
export const TAXI_API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_TAXI_API_URL || `${DEFAULT_BACKEND_ORIGIN}/api/taxi`,
);
export const TAXI_SOCKET_PATH = import.meta.env.VITE_TAXI_SOCKET_PATH || '/taxi/socket.io';
