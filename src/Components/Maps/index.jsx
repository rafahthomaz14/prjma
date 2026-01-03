import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

/* ===== Corrige ícones ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== Ícone usuário (azul) ===== */
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ===== Locais Monte Alto ===== */
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

/* ===== Rota ===== */
function Rota({ origem, destino }) {
  useEffect(() => {
    if (!origem || !destino || !window.leafletMap) return;

    const rota = L.Routing.control({
      waypoints: [
        L.latLng(origem.lat, origem.lng),
        L.latLng(destino.lat, destino.lng),
      ],
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(window.leafletMap);

    return () => window.leafletMap.removeControl(rota);
  }, [origem, destino]);

  return null;
}

export default function Localizador() {
  const location = useUserLocation();
  const [destino, setDestino] = useState(null);

  if (!location) {
    return (
      <div className="flex justify-center mt-[-70px]">
        <p className="text-sm text-gray-600">Localizando você...</p>
      </div>
    );
  }

  const locaisProximos = locais
    .map((l) => ({
      ...l,
      distancia: calcularDistancia(location.lat, location.lng, l.lat, l.lng),
    }))
    .filter((l) => l.distancia <= RAIO_MAXIMO_KM)
    .sort((a, b) => a.distancia - b.distancia);

  return (
    <div className="mt-[-70px] flex flex-col items-center gap-4">
      {/* MAPA */}
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16}
        whenCreated={(map) => (window.leafletMap = map)}
        className="w-[90%] max-w-[1000px] h-[250px] rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Usuário */}
        <Marker position={[location.lat, location.lng]} icon={userIcon}>
          <Popup>
            <div className="text-sm font-semibold">Você está aqui</div>
          </Popup>
        </Marker>

        {/* Locais */}
        {locaisProximos.map((local) => (
          <Marker key={local.id} position={[local.lat, local.lng]}>
            <Popup>
              <div className="flex flex-col gap-1">
                <span className="font-bold">{local.nome}</span>
                <span className="text-xs text-gray-600">
                  {local.distancia.toFixed(2)} km de você
                </span>
                <button
                  onClick={() => setDestino(local)}
                  className="mt-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                >
                  Abrir rota
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {destino && (
          <Rota origem={location} destino={{ lat: destino.lat, lng: destino.lng }} />
        )}
      </MapContainer>

      {/* LISTA COM ROLAGEM */}
      <div className="w-[90%] max-w-[1000px] pb-24">
        <h3 className="mb-2 text-lg font-bold">
          Locais perto de você
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400">
          {locaisProximos.map((local) => (
            <button
              key={local.id}
              onClick={() => setDestino(local)}
              className="min-w-[220px] flex-shrink-0 rounded-xl border bg-white p-4 text-left shadow-sm active:scale-95"
            >
              <p className="text-sm font-semibold">{local.nome}</p>
              <p className="mt-1 text-xs text-gray-500">
                {local.distancia.toFixed(2)} km de você
              </p>
              <p className="mt-2 text-sm font-bold text-blue-600">
                Abrir rota →
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
