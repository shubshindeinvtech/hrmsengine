import { useEffect, useState, useRef } from "react";
import ApiendPonits from "../../../api/APIEndPoints.json";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.logs}`
      // "https://hrmsapi.invezzatech.com/api/admin/logs"
    );

    eventSource.onmessage = (event) => {
      const logEntry = parseLog(event.data);
      setLogs((prevLogs) => [...prevLogs, logEntry]); // Append at the bottom
    };

    eventSource.onerror = () => {
      console.error("SSE connection error.");
      eventSource.close();
    };

    return () => eventSource.close(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]); // Auto-scroll on new logs

  const parseLog = (log) => {
    try {
      const parsed = JSON.parse(log);
      return {
        timestamp: parsed.timestamp || new Date().toLocaleTimeString(),
        message: parsed.message || log,
        level: parsed.level || "info",
      };
    } catch {
      return {
        timestamp: new Date().toLocaleTimeString(),
        message: log,
        level: "info",
      };
    }
  };

  const getLogStyle = (level) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="h-full min-h-full pb-20 mx-auto  text-white rounded-lg shadow-lg">
      <div className="dark:bg-neutral-950 bg-white rounded-md p-2 h-full">
        {/* <h2 className="text-lg font-bold mb-2">📜 Real-Time Logs</h2> */}
        <div
          ref={logContainerRef}
          className="bg-gray-900 p-3 h-full overflow-y-scroll scrollbrhdn border border-gray-700 rounded-lg font-mono text-sm"
        >
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center">Waiting for logs...</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`py-1 px-2 border-b border-gray-700 ${getLogStyle(
                  log.level
                )}`}
              >
                <span className="text-gray-400">[{log.timestamp}]</span>{" "}
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
