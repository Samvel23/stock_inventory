export const getLoginHash = (currentRoute: string) =>
  `/login?redirect=${encodeURIComponent(currentRoute)}`;

export const redirectToLogin = () => {
  const currentRoute = window.location.hash.startsWith("#/")
    ? window.location.hash.slice(1)
    : "/";

  window.location.hash = getLoginHash(currentRoute);
};
