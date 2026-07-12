import { useCallback, useEffect, useState } from "react";

const defaultLocation = { lat: 13.0827, lng: 80.2707 };

export const useGeolocation = (requestOnMount = true) => {
  const [location, setLocation] = useState(defaultLocation);
  const [loading, setLoading] = useState(requestOnMount);
  const [error, setError] = useState("");

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is unavailable; using the default region.");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setError("");
        setLoading(false);
      },
      () => {
        setError("Location access denied; using the default region.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    if (requestOnMount) locate();
  }, [locate, requestOnMount]);

  return { location, setLocation, locate, loading, error };
};
