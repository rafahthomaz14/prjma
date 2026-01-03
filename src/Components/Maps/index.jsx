import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ===== Corrige ícones do Leaflet ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== Distribuidoras ===== */
const distribuidoras = [
  { id: 1, nome: "Distribuidora A", lat: -23.5505, lng: -46.6333 },
  { id: 2, nome: "Distribuidora B", lat: -23.552, lng: -46.64 },
  { id: 3, nome: "Distribuidora C", lat: -23.58, lng: -46.70 },
];

/* ===== Config ===== */
const RAIO_MAXIMO_KM = 3;

/* ===== Distância real (Haversine) ===== */
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ===== Hook localização precisa ===== */
function useUserLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Ative o GPS para localizar sua rua"),
      {
        enableHighAccuracy: true, // 🔥 ESSENCIAL
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
}

export default function Localizador() {
  const location = useUserLocation();

  if (!location) {
    return (
      <div className="mt-[-70px] flex justify-center">
        <p>Localizando sua rua...</p>
      </div>
    );
  }

  /* ===== Filtra distribuidoras próximas ===== */
  const distribuidorasProximas = distribuidoras
    .map((dist) => {
      const distancia = calcularDistancia(
        location.lat,
        location.lng,
        dist.lat,
        dist.lng
      );

      return { ...dist, distancia };
    })
    .filter((dist) => dist.distancia <= RAIO_MAXIMO_KM);

  return (
    <div className="mt-[-70px] flex justify-center">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16} // 🔥 mais próximo da rua
        style={{
          width: "90%",
          maxWidth: "1000px",
          height: "250px",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Usuário */}
        <Marker position={[location.lat, location.lng]}>
          <Popup>Você está aqui</Popup>
        </Marker>

        {/* Distribuidoras próximas */}
        {distribuidorasProximas.length > 0 ? (
          distribuidorasProximas.map((dist) => (
            <Marker key={dist.id} position={[dist.lat, dist.lng]}>
              <Popup>
                <strong>{dist.nome}</strong>
                <br />
                {dist.distancia.toFixed(2)} km de você
              </Popup>
            </Marker>
          ))
        ) : (
          <Popup position={[location.lat, location.lng]}>
            Nenhuma distribuidora próxima 😢
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
