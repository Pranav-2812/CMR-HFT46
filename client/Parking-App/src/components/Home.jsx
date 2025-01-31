import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker, 
  DirectionsRenderer 
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const Home = () => {
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch User Location
  useEffect(() => {
    AOS.init();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Using default location.");
          setUserLocation({ lat: 17.6045, lng: 78.4859 });
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setUserLocation({ lat: 17.6045, lng: 78.4859 });
    }
  }, []);

  // Calculate Route
  const calculateRoute = () => {
    if (!userLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: userLocation,
      destination: destination,
      travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        setDirections(result);
      } else {
        console.error("Error fetching directions:", status);
        alert("Could not find a route to the selected destination.");
      }
    });
  };

  // When the user clicks on the map, set the destination
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setDestination({ lat, lng });
  };

  // Trigger route calculation when a destination is selected
  useEffect(() => {
    if (destination) {
      calculateRoute();
    }
  }, [destination]);

  // Open Google Maps Navigation
  const startNavigation = () => {
    if (!destination) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`, "_blank");
  };

  if (!isLoaded || !userLocation) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading map...</div>;
  }

  return (
    <div className="home">
      <img src="/1.jpeg" data-aos="fade-right" data-aos-duration="1000" alt="Parking" />

      <div className="home-content" data-aos="fade-left" data-aos-duration="1000">
        <h1>Welcome to Park.me</h1>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={12}
        onClick={handleMapClick} // Allow user to click anywhere
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* User Location Marker */}
        <Marker 
          position={userLocation} 
          title="Your Location" 
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />

        {/* Destination Marker (if user selects a location) */}
        {destination && (
          <Marker 
            position={destination} 
            title="Selected Destination" 
            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          />
        )}

        {/* Render Directions if available */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Navigation Button */}
      {destination && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button 
            onClick={startNavigation} 
            style={{ 
              padding: "10px 20px", 
              fontSize: "16px", 
              background: "#007bff", 
              color: "white", 
              border: "none", 
              cursor: "pointer", 
              borderRadius: "5px"
            }}
          >
            Start Navigation
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
