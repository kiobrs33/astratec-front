import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css"; // Importar los estilos mejorados

const socket = io("http://localhost:4000"); // Conectar con el backend

type SensorData = {
  time: string;
  sensor1: number;
  sensor2: number;
  sensor3: number;
};

function App() {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    socket.on("arduinoData", (value) => {
      setData((prevData) => [
        ...prevData.slice(-30), // Mantener solo los últimos 30 datos
        {
          time: new Date().toLocaleTimeString(), // Formato de hora más claro
          sensor1: value.sensor1,
          sensor2: value.sensor2,
          sensor3: value.sensor3,
        },
      ]);
    });

    return () => {
      socket.off("arduinoData");
    };
  }, []);

  return (
    <div className="container">
      <h1>📊 Gráficos en Tiempo Real</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", borderRadius: "10px" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="sensor1"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sensor2"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sensor3"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
