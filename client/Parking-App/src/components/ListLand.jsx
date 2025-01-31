import React, { useState } from 'react';

const ListLand = () => {
  const [coordinates, setCoordinates] = useState([
    { lat: '', lng: '' },
    { lat: '', lng: '' },
    { lat: '', lng: '' },
    { lat: '', lng: '' },
  ]);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");

  const handleCoordinateChange = (index, field, value) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index][field] = value;
    setCoordinates(newCoordinates);
  };

  const handleGetLocation = (index) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleCoordinateChange(index, 'lat', position.coords.latitude);
          handleCoordinateChange(index, 'lng', position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get location. Please ensure location services are enabled and try again.");
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length + images.length < 2) {
      setImageError("Please upload at least two photos.");
      return;
    }
    setImageError("");

    const newImages = Array.from(files);
    setImages([...images, ...newImages]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-sans" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
      <div className="p-6 rounded-2xl w-120 max-h-[60vh] overflow-y-auto" style={{ backgroundColor: 'yellow' }}>
        <h2 className="text-center mb-4 text-2xl font-bold">Report Area</h2>
        <form>
          {coordinates.map((coord, index) => (
            <div key={index} className="mb-3 h-50">
              <h3 className="text-lg font-bold mb-2">Coordinate {index + 1}</h3>
              <label htmlFor={`latitude-${index}`} className="block text-sm font-medium mb-1">Latitude:</label>
              <input
                type="number"
                id={`latitude-${index}`}
                name={`latitude-${index}`}
                value={coord.lat}
                onChange={(e) => handleCoordinateChange(index, 'lat', e.target.value)}
                className="w-full h-8 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300 text-white bg-gray-700"
                step="any"
              />
              <label htmlFor={`longitude-${index}`} className="block text-sm font-medium mb-1">Longitude:</label>
              <input
                type="number"
                id={`longitude-${index}`}
                name={`longitude-${index}`}
                value={coord.lng}
                onChange={(e) => handleCoordinateChange(index, 'lng', e.target.value)}
                className="h-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300 text-white bg-gray-700 "
                step="any"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleGetLocation(index)}
                  className="mt-2 px-4 py-2 bg-black text-white rounded-2xl hover:bg-gray-800"
                >
                  Use My Location
                </button>
              </div>
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-sm font-medium mb-1">Upload Images (Minimum 2):</label>
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            />
            {imageError && <p className="text-red-500 mt-1">{imageError}</p>}
            <div className="mt-2 flex flex-wrap"> {/* Added flex flex-wrap for wrapping */}
              {images.map((image, index) => (
                <div key={index} className="mr-2 mb-2"> {/* Added margin bottom for spacing */}
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-1/2 bg-black text-yellow-400 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-yellow-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListLand;