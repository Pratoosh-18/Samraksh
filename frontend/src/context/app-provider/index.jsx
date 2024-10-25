import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );
  const [appData, setAppData] = useState({
    active_persons: 0,
    active_guns: 0,
    face_ids_map: { modi1: "Modi G" },
    uploaded_videos_list: [],
    detected_person_ids_map: {}
  });

  // console.log(appData);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAppData(data);
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a short delay
      setTimeout(() => {
        console.log("Reconnecting...");
        connectWebSocket();
      }, 1000);
    };
    return ws;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("You have been logged out")
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const ws = connectWebSocket();
    return () => ws && ws.close();
  }, [isAuthenticated, connectWebSocket]);

  const value = useMemo(
    () => ({
      appData,
      isAuthenticated,
      setIsAuthenticated,
      handleLogout,
    }),
    [appData, isAuthenticated, setIsAuthenticated, handleLogout],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
