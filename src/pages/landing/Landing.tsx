import "./Landing.css";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import astratecLogo from "../../assets/images/astratec-logo.png";
import unsaLogo from "../../assets/images/unsa-logo.png";
import pucpLogo from "../../assets/images/pucp-logo.png";

const socket = io("http://localhost:4000");

// Definir el tipo de datos
interface SensorData {
  temperatura: number;
  presion: number;
  altitud: number;
  tendenciaAltitud: number;
  orientacion: number;
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
}

const initialSensorData: SensorData = {
  temperatura: 0,
  presion: 0,
  altitud: 0,
  tendenciaAltitud: 0,
  orientacion: 0,
  velocidadAngular: { x: 0, y: 0, z: 0 },
  aceleracion: { x: 0, y: 0, z: 0 },
  gps: {
    latitud: 0,
    longitud: 0,
    velocidad: 0,
    satelites: 0,
  },
  fecha: "0000-00-00",
  hora: "00:00:00",
};

export const Landing = () => {
  const [data, setData] = useState<SensorData | null>(initialSensorData);

  // Charts
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
    socket.on("arduinoData", (newData: SensorData = initialSensorData) => {
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
    <div className="dashboard">
      <header className="header container">
        <img src={astratecLogo} alt="astratec" className="header__logo" />
        <div className="header__icons">
          <img src={unsaLogo} alt="unsa" className="header__icon" />
          <img src={pucpLogo} alt="pucp" className="header__icon" />
        </div>
      </header>
      <div className="sensors">
        <div className="sensor sensor--temperature">
          <div className="sensor__title">Temperatura</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M9 16a3.001 3.001 0 0 0 6 0c0-.353-.072-.686-.184-1H9.184A2.962 2.962 0 0 0 9 16z"></path>
              <path d="M18 6V4h-3.185A2.995 2.995 0 0 0 12 2c-1.654 0-3 1.346-3 3v5.8A6.027 6.027 0 0 0 6 16c0 3.309 2.691 6 6 6s6-2.691 6-6a6.027 6.027 0 0 0-3-5.2V10h3V8h-3V6h3zm-4.405 6.324A4.033 4.033 0 0 1 16 16c0 2.206-1.794 4-4 4s-4-1.794-4-4c0-1.585.944-3.027 2.405-3.676l.595-.263V5a1 1 0 0 1 2 0v7.061l.595.263z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">{data?.temperatura}</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--pressure">
          <div className="sensor__title">Presión</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 15-5-5h4V7h2v5h4l-5 5z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--time ">
          <div className="sensor__title">Fecha y Hora</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--altitude">
          <div className="sensor__title">Altitud</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <circle cx="6.5" cy="6.5" r="2.5"></circle>
              <path d="m14 7-5.223 8.487L7 13l-5 7h20z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--gps-orientation">
          <div className="sensor__title">Orientación GPS</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
              <path d="m8 16 5.991-2L16 8l-6 2z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--gps-speed">
          <div className="sensor__title">Velocidad GPS</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path>
              <path d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--gps-latitude">
          <div className="sensor__title">Latitud GPS</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"></path>
              <path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--gps-longitude">
          <div className="sensor__title">Longitud GPS</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"></path>
              <path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                <span className="sensor__number">25</span>°C
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--angular">
          <div className="sensor__title">Velocidad Angular - X Y Z</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s
              </h2>
            </div>
          </div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s
              </h2>
            </div>
          </div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s
              </h2>
            </div>
          </div>
        </div>

        <div className="sensor sensor--angular">
          <div className="sensor__title">Velocidad Angular - X Y Z</div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s2
              </h2>
            </div>
          </div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s2
              </h2>
            </div>
          </div>
          <div className="sensor__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="sensor__icon"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
            <div className="sensor__data">
              <h2 className="sensor__text">
                Eje x:
                <span className="sensor__number sensor__number--angular">
                  25
                </span>
                m/s2
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Graficos */}
      <div className="charts">
        {/* Temperatura */}
        <div className="chart">
          <h2 className="chart__title">Temperatura</h2>
          <p className="chart__description">{data?.temperatura} °C</p>
          <ResponsiveContainer
            width="100%"
            height={300}
            style={{ marginTop: "10px" }}
          >
            <AreaChart data={temperatureData}>
              <XAxis dataKey="time" stroke="#fff" tick={{ fill: "#fff" }} />
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
                stroke="#f37335"
                fill="#fdc830"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Presion */}
        <div className="chart">
          <h2 className="chart__title">Presión</h2>
          <p className="chart__description">{data?.presion} hPa</p>
          <ResponsiveContainer
            width="100%"
            height={300}
            style={{ marginTop: "10px" }}
          >
            <AreaChart data={pressureData}>
              <XAxis dataKey="time" stroke="#fff" tick={{ fill: "#fff" }} />
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
                stroke="#71b280"
                fill="#134e5e"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Altitud */}
        <div className="chart">
          <h2 className="chart__title">Altitud</h2>
          <p className="chart__description">{data?.altitud} m</p>
          <ResponsiveContainer
            width="100%"
            height={300}
            style={{ marginTop: "10px" }}
          >
            <AreaChart data={altitudeData}>
              <XAxis dataKey="time" stroke="#fff" tick={{ fill: "#fff" }} />
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
                stroke="#1488cc"
                fill="#2b32b2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <button className="btn__up"></button>
    </div>
  );
};
