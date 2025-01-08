import { FeatureCollection, LineString } from "geojson";
const { differenceInSeconds } = require("date-fns");

function rad(x: number) {
  return (x * Math.PI) / 180;
}

export function getCoordsDistance(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
}

export function analyzeGpxData(data: FeatureCollection) {
  const { coordTimes, name, time, type } = data.features[0].properties as any;
  let prevPoint: any,
    totalDistance = 0,
    totalElevation = 0,
    totalTime = 0,
    elevationStart: number;

  let split = 1000,
    splitDistance = 0,
    splitTime = 0,
    splitAscent = 0,
    splitDescent = 0,
    splitBestPace = 10000,
    splits: any[] = [];

  const coords = (data.features[0].geometry as LineString).coordinates.map(
    ([lng, lat, elevation], index) => {
      let distance = 0;
      let diffInSeconds = 0;

      const time = new Date(coordTimes[index]);
      if (!elevationStart) {
        elevationStart = elevation;
      }
      if (prevPoint) {
        distance = getCoordsDistance(prevPoint, { lat, lng });
        diffInSeconds = differenceInSeconds(time, prevPoint.time);
      }

      // Calculate total distance, time and elevation
      totalDistance += distance;
      totalTime += diffInSeconds;
      totalElevation += elevation;

      // Calculate split distance and time
      splitDistance += distance;
      splitTime += diffInSeconds;

      // Calculate elevation
      const elevationDiff = elevation - elevationStart;
      if (elevationDiff > 0) {
        splitAscent += elevationDiff;
      }
      if (elevationDiff < 0) {
        splitDescent += -elevationDiff;
      }
      elevationStart = elevation;

      // Calculate best pace
      const distanceKm = distance / 1000;
      const pace = diffInSeconds / distanceKm;
      if (pace < splitBestPace) {
        splitBestPace = pace;
      }

      // Calculate speed
      const speed = distance / diffInSeconds;

      const point = {
        lat,
        lng,
        elevation,
        totalElevation,
        time,
        totalTime,
        distance,
        totalDistance,
        speed,
      };
      prevPoint = point;

      if (totalDistance >= split) {
        splits.push({
          distance: splitDistance,
          time: splitTime,
          elevationUp: splitAscent,
          elevationDown: splitDescent,
          avgPace: getPacePerKm(splitDistance, splitTime),
          avgPaceMinSec: getPacePerKm(splitDistance, splitTime, true),
          bestPace: splitBestPace,
          bestPaceMinSec: secondsToMinSec(splitBestPace),
        });

        splitDistance = 0;
        splitTime = 0;
        splitAscent = 0;
        splitDescent = 0;
        splitBestPace = 10000;

        split += 1000;
      }
      return point;
    }
  );

  // Calculate average speed and pace
  const avgPacePerKm = getPacePerKm(totalDistance, totalTime);
  const avgSpeedMps = totalDistance / totalTime;
  const avgSpeedKph = avgSpeedMps * 3.6;

  return {
    name,
    time,
    type,
    distance: totalDistance,
    duration: totalTime,
    elevation: totalElevation,
    avgSpeed: avgSpeedKph,
    avgPace: avgPacePerKm,
    coords,
  };
}

export function getPacePerKm(distance: number, time: number) {
  const distancePerKm = distance / 1000;
  const secondsPerKm = time / distancePerKm;

  return secondsPerKm;
}

export function getPacePerKmMinSec(distance: number, time: number) {
  return secondsToMinSec(getPacePerKm(distance, time));
}

export function secondsToMinSec(secondsPerKm: number) {
  const minsPerKm = Math.floor(secondsPerKm / 60);
  const seconds = secondsPerKm % 60;

  return `${minsPerKm}:${seconds}`;
}
