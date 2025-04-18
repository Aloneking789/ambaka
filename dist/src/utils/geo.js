"use strict";
// geo.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoordinates = exports.calculateDistance = void 0;
/**
 * Calculate distance between two geographic points (in kilometers)
 * Uses the Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};
exports.calculateDistance = calculateDistance;
/**
 * Convert degrees to radians
 */
const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};
/**
 * Check if provided coordinates are valid
 */
const validateCoordinates = (latitude, longitude) => {
    return (!isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180);
};
exports.validateCoordinates = validateCoordinates;
