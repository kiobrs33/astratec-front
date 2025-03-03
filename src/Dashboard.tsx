import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "./Dashboard.css"; // Importar estilos
import astratecLogo from "./assets/images/astratec-logo.png";
import unsaLogo from "./assets/images/unsa-logo.png";
import pucpLogo from "./assets/images/pucp-logo.png";

const socket = io("http://localhost:4000");

// Definir el tipo de datos
type SensorData = {
  temperatura: number;
  presion: number;
  altitud: number;
  tendenciaAltitud: number;
  orientacion: number | 0;
  velocidadAngular: { x: number; y: number; z: number };
  aceleracion: { x: number; y: number; z: number };
  gps: {
    latitud: number;
    longitud: number;
    velocidad: number;
    satelites: number;
  };
  fecha: string;
  hora: string;
};

const Dashboard = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [temperatureData, setTemperatureData] = useState<
    { time: string; value: number }[]
  >([]);
  const [pressureData, setPressureData] = useState<
    { time: string; value: number }[]
  >([]);
  const [altitudeData, setAltitudeData] = useState<
    { time: string; value: number }[]
  >([]);

  useEffect(() => {
    // Escuchar datos desde el servidor
    socket.on("arduinoData", (newData: SensorData) => {
      setData(newData);

      // Agregar nuevos datos a los gráficos, manteniendo solo los últimos 20 registros
      setTemperatureData((prev) => [
        ...prev.slice(-19),
        { time: newData.hora, value: newData.temperatura },
      ]);
      setPressureData((prev) => [
        ...prev.slice(-19),
        { time: newData.hora, value: newData.presion },
      ]);
      setAltitudeData((prev) => [
        ...prev.slice(-19),
        { time: newData.hora, value: newData.altitud },
      ]);
    });

    return () => {
      socket.off("arduinoData");
    };
  }, []);

  return (
    <>
      <header className="header container">
        <img src={astratecLogo} alt="astratec" className="header__logo" />
        <div className="header__icons">
          <img src={unsaLogo} alt="unsa" className="header__icon" />
          <img src={pucpLogo} alt="pucp" className="header__icon" />
        </div>
      </header>
      <section className="sensors container">
        <h1 className="sensors__title">Datos del Cubsat</h1>
        <p className="sensors__description">
          Informacion recopilada en tiempo real desde el cubsat
        </p>

        {data ? (
          <>
            {/* CARDS SIMPLES */}
            <div className="sensors__cards">
              {/* Orientacion */}
              <div className="sensors__card-simple">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Orientación
                </h2>
                <p className="sensors__card-description">{data.orientacion}°</p>
              </div>

              {/* Velocidad Angular */}
              <div className="sensors__card-simple">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Velocidad Angular
                </h2>
                <p className="sensors__card-description">
                  x: {data.velocidadAngular.x}, y: {data.velocidadAngular.y}, z:{" "}
                  {data.velocidadAngular.z}
                </p>
              </div>

              {/* Aceleración */}
              <div className="sensors__card-simple">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Aceleración
                </h2>
                <p className="sensors__card-description">
                  x: {data.aceleracion.x}, y: {data.aceleracion.y}, z:{" "}
                  {data.aceleracion.z}
                </p>
              </div>

              {/* Gps */}
              <div className="sensors__card-simple">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Gps
                </h2>
                <p className="sensors__card-description">
                  Latitud: {data.gps.latitud} - Longitud: {data.gps.longitud} -
                  Satelites: {data.gps.satelites}
                </p>
              </div>

              {/* Fecha y Hora */}
              <div className="sensors__card-simple">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Fecha y Hora
                </h2>
                <p className="sensors__card-description">
                  {data.fecha} - {data.hora}
                </p>
              </div>
            </div>

            {/* CARDS GRAFIC */}
            <div className="sensors__cards">
              {/* Temperatura */}
              <div className="sensors__card-grafic">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Temperatura
                </h2>
                <p className="sensors__card-description">
                  {data.temperatura} °C
                </p>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  style={{ marginTop: "10px" }}
                >
                  <LineChart data={temperatureData}>
                    <XAxis
                      dataKey="time"
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                    />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                  style={{ marginTop: "10px" }}
                >
                  <AreaChart data={temperatureData}>
                    <XAxis
                      dataKey="time"
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      stroke="#fff"
                      tick={{ fill: "#fff" }}
                    />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ff7300"
                      fill="#ffb380"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Presión */}
              <div className="sensors__card-grafic">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Presión
                </h2>
                <p className="sensors__card-description">{data.presion} hPa</p>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  style={{ marginTop: "10px" }}
                >
                  <LineChart data={pressureData}>
                    <XAxis dataKey="time" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" stroke="#007bff" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Altitud */}
              <div className="sensors__card-grafic">
                <h2 className="sensors__card-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="m21.868 11.504-4-7A1 1 0 0 0 17 4H3a1 1 0 0 0-.868 1.496L5.849 12l-3.717 6.504A1 1 0 0 0 3 20h14a1 1 0 0 0 .868-.504l4-7a.998.998 0 0 0 0-.992z"></path>
                  </svg>
                  Altitud
                </h2>
                <p className="sensors__card-description">
                  {data.altitud} metros
                </p>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  style={{ marginTop: "10px" }}
                >
                  <LineChart data={altitudeData}>
                    <XAxis dataKey="time" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" stroke="#28a745" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <span>Cargando datos ...........</span>
        )}
      </section>
    </>
  );
};

export default Dashboard;
