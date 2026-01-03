import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const distribuidoras = [
  { id: 1, nome: "Distribuidora A", lat: -23.5505, lng: -46.6333 },
  { id: 2, nome: "Distribuidora B", lat: -23.552, lng: -46.64 },
];

function useUserLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error)
    );
  }, []);

  return location;
}

export default function Localizador() {
  const location = useUserLocation();

  if (!location) return <p>Carregando mapa...</p>;

  return (
    <LoadScript googleMapsApiKey="AIzaSyBE_WTOOWRioVWETx98I6Y2uLhEmpV51NE">
      <GoogleMap
        center={location}
        zoom={14}
        mapContainerStyle={{ width: "100%", height: "400px" }}
      >
        {/* marcador do usuário */}
        <Marker position={location} />

        {/* marcadores das distribuidoras */}
        {distribuidoras.map((dist) => (
          <Marker
            key={dist.id}
            position={{ lat: dist.lat, lng: dist.lng }}
            title={dist.nome}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
