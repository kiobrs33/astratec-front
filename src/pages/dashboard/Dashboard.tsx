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

import "../../assets/css/dashboard.css";
import astratecLogo from "../../assets/images/astratec-logo.png";
import unsaLogo from "../../assets/images/unsa-logo.png";
import pucpLogo from "../../assets/images/pucp-logo.png";

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

export const Dashboard = () => {
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
    <div>
      {data ? (
        <>
          <div className="parent">
            <div className="item div1 navbar">
              <img src={astratecLogo} alt="astratec" className="navbar__logo" />
              <div className="navbar__icons">
                <img src={unsaLogo} alt="unsa" className="navbar__icon" />
                <img src={pucpLogo} alt="pucp" className="navbar__icon" />
              </div>
            </div>
            <div className="item div2 sensor sensor--temperature">
              <h2 className="sensor__title">Temperatura</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.temperatura}</span>°C
                  </p>
                </div>
              </div>
            </div>
            <div className="item div3 sensor sensor--altitude">
              <h2 className="sensor__title">Altitud</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.altitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div4 sensor sensor--gps-orientation">
              <h2 className="sensor__title">Orientacion GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.satelites}</span>
                    °
                  </p>
                </div>
              </div>
            </div>
            <div className="item div5 sensor sensor--gps-speed">
              <h2 className="sensor__title">Velocidad GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.velocidad}</span>
                    m/s
                  </p>
                </div>
              </div>
            </div>
            <div className="item div6 sensor sensor--gps-latitude">
              <h2 className="sensor__title">Latitud GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m12 17 1-2V9.858c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4S8 3.794 8 6c0 1.858 1.279 3.411 3 3.858V15l1 2z"></path>
                    <path d="m16.267 10.563-.533 1.928C18.325 13.207 20 14.584 20 16c0 1.892-3.285 4-8 4s-8-2.108-8-4c0-1.416 1.675-2.793 4.267-3.51l-.533-1.928C4.197 11.54 2 13.623 2 16c0 3.364 4.393 6 10 6s10-2.636 10-6c0-2.377-2.197-4.46-5.733-5.437z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.latitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div7 sensor sensor--gps-longitude">
              <h2 className="sensor__title">Longitud GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m12 17 1-2V9.858c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4S8 3.794 8 6c0 1.858 1.279 3.411 3 3.858V15l1 2z"></path>
                    <path d="m16.267 10.563-.533 1.928C18.325 13.207 20 14.584 20 16c0 1.892-3.285 4-8 4s-8-2.108-8-4c0-1.416 1.675-2.793 4.267-3.51l-.533-1.928C4.197 11.54 2 13.623 2 16c0 3.364 4.393 6 10 6s10-2.636 10-6c0-2.377-2.197-4.46-5.733-5.437z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.longitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div8 sensor sensor--pressure">
              <h2 className="sensor__title">Presion</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 15-5-5h4V7h2v5h4l-5 5z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.presion}</span>hPa
                  </p>
                </div>
              </div>
            </div>
            <div className="item div9 sensor sensor--time">
              <h2 className="sensor__title">Hora y Fecha</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.hora}</span>m/s
                  </p>
                </div>
              </div>
            </div>
            <div className="item div10"></div>
            <div className="item div11"></div>
            <div className="item div12"></div>
            <div className="item div13 sensor sensor--speed-angular">
              <h2 className="sensor__title sensor__title--speed-angular">
                Velocidad Angular
              </h2>
              <div className="sensor__content">
                <div className="sensor__icon-container sensor__icon-container--speed-angular">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"></path>
                  </svg>
                </div>
                <div className="sensor__data sensor__content--speed-angular">
                  <p className="sensor__value">
                    Eje x:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.velocidadAngular.x}
                    </span>
                    m/s
                  </p>
                  <p className="sensor__value">
                    Eje y:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.velocidadAngular.y}
                    </span>
                    m/s
                  </p>
                  <p className="sensor__value">
                    Eje z:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.velocidadAngular.z}
                    </span>
                    m/s
                  </p>
                </div>
              </div>
            </div>
            <div className="item div14 sensor sensor--speed-angular">
              <h2 className="sensor__title sensor__title--speed-angular">
                Aceleración Angular
              </h2>
              <div className="sensor__content">
                <div className="sensor__icon-container sensor__icon-container--speed-angular">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"></path>
                  </svg>
                </div>
                <div className="sensor__data sensor__content--speed-angular">
                  <p className="sensor__value">
                    Eje x:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.aceleracion.x}
                    </span>
                    m/s
                  </p>
                  <p className="sensor__value">
                    Eje y:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.aceleracion.y}
                    </span>
                    m/s
                  </p>
                  <p className="sensor__value">
                    Eje z:
                    <span className="sensor__number sensor__value--speed-angular">
                      {data.aceleracion.z}
                    </span>
                    m/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SENSORS */}
          <div className="sensors">
            <div className="item div2 sensor sensor--temperature">
              <h2 className="sensor__title">Temperatura</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.temperatura}</span>°C
                  </p>
                </div>
              </div>
            </div>
            <div className="item div3 sensor sensor--altitude">
              <h2 className="sensor__title">Altitud</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.altitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div4 sensor sensor--gps-orientation">
              <h2 className="sensor__title">Orientacion GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
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
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.satelites}</span>
                    °
                  </p>
                </div>
              </div>
            </div>
            <div className="item div5 sensor sensor--gps-speed">
              <h2 className="sensor__title">Velocidad GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.velocidad}</span>
                    m/s
                  </p>
                </div>
              </div>
            </div>
            <div className="item div6 sensor sensor--gps-latitude">
              <h2 className="sensor__title">Latitud GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m12 17 1-2V9.858c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4S8 3.794 8 6c0 1.858 1.279 3.411 3 3.858V15l1 2z"></path>
                    <path d="m16.267 10.563-.533 1.928C18.325 13.207 20 14.584 20 16c0 1.892-3.285 4-8 4s-8-2.108-8-4c0-1.416 1.675-2.793 4.267-3.51l-.533-1.928C4.197 11.54 2 13.623 2 16c0 3.364 4.393 6 10 6s10-2.636 10-6c0-2.377-2.197-4.46-5.733-5.437z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.latitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div7 sensor sensor--gps-longitude">
              <h2 className="sensor__title">Longitud GPS</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="m12 17 1-2V9.858c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4S8 3.794 8 6c0 1.858 1.279 3.411 3 3.858V15l1 2z"></path>
                    <path d="m16.267 10.563-.533 1.928C18.325 13.207 20 14.584 20 16c0 1.892-3.285 4-8 4s-8-2.108-8-4c0-1.416 1.675-2.793 4.267-3.51l-.533-1.928C4.197 11.54 2 13.623 2 16c0 3.364 4.393 6 10 6s10-2.636 10-6c0-2.377-2.197-4.46-5.733-5.437z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.gps.longitud}</span>m
                  </p>
                </div>
              </div>
            </div>
            <div className="item div8 sensor sensor--pressure">
              <h2 className="sensor__title">Presion</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 15-5-5h4V7h2v5h4l-5 5z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.presion}</span>hPa
                  </p>
                </div>
              </div>
            </div>
            <div className="item div9 sensor sensor--time">
              <h2 className="sensor__title">Hora y Fecha</h2>
              <div className="sensor__content">
                <div className="sensor__icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="sensor__icon"
                  >
                    <path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
                  </svg>
                </div>
                <div className="sensor__data">
                  <p className="sensor__value">
                    <span className="sensor__number">{data.hora}</span>m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Cargando .....</div>
      )}
    </div>
  );
};
