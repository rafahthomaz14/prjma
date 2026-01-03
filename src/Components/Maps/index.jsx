import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ===== Corrige ícones padrão ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== Ícone do usuário ===== */
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ===== Locais ===== */
const locais = [
  { id: 1, nome: "Distribuidora Farias", lat: -21.2618, lng: -48.4965 },
  { id: 2, nome: "Adega NK", lat: -21.2589, lng: -48.4981 },
  { id: 3, nome: "Cravo & Canela Distribuidora", lat: -21.2605, lng: -48.4928 },
  { id: 4, nome: "Gallo's Distribuidora", lat: -21.2632, lng: -48.5012 },
  { id: 5, nome: "The Hall Pub", lat: -21.2596, lng: -48.4973 },
  { id: 6, nome: "Empório do Jota", lat: -21.2601, lng: -48.4949 },
];

const RAIO_MAXIMO_KM = 3;

/* ===== Distância ===== */
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

/* ===== Localização ===== */
function useUserLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => alert("Ative a localização"),
      { enableHighAccuracy: true }
    );
  }, []);

  return location;
}

/* ===== COMPONENTE ===== */
export default function Localizador() {
  const location = useUserLocation();

  if (!location) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-sm text-gray-600">Localizando você...</p>
      </div>
    );
  }

  const locaisProximos = locais
    .map((l) => ({
      ...l,
      distancia: calcularDistancia(
        location.lat,
        location.lng,
        l.lat,
        l.lng
      ),
    }))
    .filter((l) => l.distancia <= RAIO_MAXIMO_KM)
    .sort((a, b) => a.distancia - b.distancia);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* MAPA */}
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16}
        className="w-[90%] max-w-[1000px] h-[250px] rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[location.lat, location.lng]} icon={userIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>

        {locaisProximos.map((local) => (
          <Marker key={local.id} position={[local.lat, local.lng]}>
            <Popup>
              <p className="font-semibold">{local.nome}</p>
              <p className="text-xs text-gray-500">
                {local.distancia.toFixed(2)} km
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* LISTA */}
      <div className="w-[90%] max-w-[1000px]">
        <h3 className="text-lg font-bold mb-2">
          Distribuidoras perto de você
        </h3>

        <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth">
          {locaisProximos.map((local, index) => (
            <div
              key={local.id}
              className="min-w-[220px] rounded-xl border bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold">
                {index === 0 && "🔥 "}
                {local.nome}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {local.distancia.toFixed(2)} km de você
              </p>

              <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700 active:scale-95">
                Fazer pedido
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
