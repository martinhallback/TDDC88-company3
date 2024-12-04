import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import OldAlarms from "./OldAlarms";
import ActiveAlarms from "./ActiveAlarms";
import socket from "../utils/socket";
import { externalURL } from "../api/axiosConfig";
import { useAuthStore } from "../utils/useAuthStore";

const AlarmList = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [oldAlarms, setOldAlarms] = useState([]);
  const { error, token, setError } = useAuthStore();

  const sortByTimestamp = useCallback(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    [],
  );

  const sortByStatusAndTimestamp = useCallback((a, b) => {
    if (a.status === "NOTIFIED" && b.status === "PENDING") return -1;
    if (a.status === "PENDING" && b.status === "NOTIFIED") return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  }, []);

  const fetchAlarms = useCallback(async () => {
    try {
      // Fetch alarms with pagination from backend
      const response = await axios.get(
        `${externalURL}/alarms?page=1&per_page=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const allAlarms = response.data;

      // Process active alarms
      const active = allAlarms
        .filter(
          (alarm) => alarm.status === "PENDING" || alarm.status === "NOTIFIED",
        )
        .sort(sortByStatusAndTimestamp);
      setActiveAlarms(active);

      // Process old alarms (pagination handled by backend)
      const old = allAlarms
        .filter(
          (alarm) => alarm.status === "RESOLVED" || alarm.status === "IGNORED",
        )
        .sort(sortByTimestamp);

      setOldAlarms(old);
    } catch (err) {
      console.error("Error fetching alarms:", err);
      setError("Failed to load alarms.");
    }
  }, [setError, sortByStatusAndTimestamp, sortByTimestamp, token]);

  // Handle new alarms from the socket
  const handleNewAlarm = useCallback((newAlarm) => {
    setActiveAlarms((prevAlarms) => {
      const isDuplicate = prevAlarms.some((alarm) => alarm.id === newAlarm.id);
      return isDuplicate ? prevAlarms : [...prevAlarms, newAlarm];
    });
  }, []);

  // Initialize the component
  useEffect(() => {
    setError("");
    fetchAlarms();

    // Listen for socket events
    socket.on("new_alarm", handleNewAlarm);

    return () => {
      socket.off("new_alarm", handleNewAlarm);
    };
  }, [fetchAlarms, handleNewAlarm, setError]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 flex flex-col space-y-6">
      <div className="ml-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-NavyBlue">
            Active Alarms:
          </h2>
          <ActiveAlarms activeAlarms={activeAlarms} />
        </section>
      </div>

      <div className="ml-10">
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-NavyBlue">
            Old Alarms:
          </h2>
          <OldAlarms
            oldAlarms={oldAlarms}
            activeAlarmCount={activeAlarms.length}
          />
        </section>
      </div>
    </div>
  );
};

export default AlarmList;