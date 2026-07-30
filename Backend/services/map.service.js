const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const response = await axios.get(
    "https://api.geoapify.com/v1/geocode/search",
    {
      params: {
        text: address,
        apiKey: process.env.GEOAPIFY_API_KEY,
        limit: 1,
      },
    },
  );

  const data = response.data;

  if (!data.features || data.features.length === 0) {
    throw new Error("Address not found");
  }

  const [lng, lat] = data.features[0].geometry.coordinates;

  return {
    lat,
    lng,
  };
};
module.exports.getDistanceTime = async (origin, destination) => {
  // console.log("ORIGIN:", origin);
  // console.log("DESTINATION:", destination);

  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    },
    {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  const summary = response.data.routes[0].summary;
  // console.log("Distance & Time Summary:", summary);
  return {
    distance: summary.distance,
    duration: summary.duration,
  };
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await response.json();

    return data.features.map((item) => ({
      placeId: item.properties.place_id,
      formatted: item.properties.formatted,
      lat: item.properties.lat,
      lon: item.properties.lon,
    }));
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
};

module.exports.getCaptainsInRadius = async (lat, lng, radiusKm) => {
  // Try GeoJSON based geospatial query first (if documents use GeoJSON Point or coordinate array)
  try {
    const geoCount = await captainModel.countDocuments({
      "location.coordinates": { $exists: true },
    });
    if (geoCount > 0) {
      // radiusKm converted to radians for $centerSphere
      const captains = await captainModel.find({
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusKm / 6371],
          },
        },
      });

      return captains;
    }
  } catch (err) {
    // ignore and fallback to haversine
  }

  // Fallback: documents store location as { lat, lng } — perform application-side Haversine filter
  const captainsWithLatLng = await captainModel.find({
    "location.lat": { $exists: true },
    "location.lng": { $exists: true },
  });

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const filtered = captainsWithLatLng.filter((c) => {
    const clat = c.location?.lat;
    const clng = c.location?.lng;
    if (clat === undefined || clng === undefined) return false;

    const dLat = toRad(clat - lat);
    const dLon = toRad(clng - lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(clat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c2 = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c2;

    return distanceKm <= radiusKm;
  });

  return filtered;
};
