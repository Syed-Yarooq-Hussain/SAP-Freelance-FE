export const startLinkedInAuth = () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin`;

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone?.trim()) {
      window.location.assign(
        `${endpoint}?timezone=${encodeURIComponent(timezone)}`,
      );
      return;
    }
  } catch {
    // Continue with the existing endpoint when timezone detection is unavailable.
  }

  window.location.assign(endpoint);
};
