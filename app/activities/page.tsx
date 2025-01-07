"use client";

import { createActivity, getActivities, GpxRecord } from "@/actions/activities";
import FileUploader from "@/components/form/fileUpload";
import Map from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { FeatureCollection, LineString } from "geojson";
import Form, { FormRender } from "@/components/form/form";
import { getCoordsDistance } from "@/utils";
const { differenceInSeconds } = require("date-fns");

var togeojson = require("@mapbox/togeojson");

export default function Activities() {
  const [gpxData, setGpxData] = useState<GpxRecord>();
  const { data: activities = [], isFetching } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  if (isFetching) return null;

  const uploadFile = async (formData: FormData) => {
    console.log(formData);

    const file = formData.get("myFile") as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());
    const data: FeatureCollection = togeojson.gpx(
      new DOMParser().parseFromString(buffer.toString(), "text/xml")
    );
    /*const formObject = Object.fromEntries(formData.entries());
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const content = e.target.result;            
    };
    reader.readAsText(formObject['myFile'] as Blob);*/
    console.log(data);

    const { coordTimes, name, time, type } = data.features[0].properties as any;
    let prevPoint: any,
      totalDistance = 0,
      totalElevation = 0,
      avgSpeedKph = 0,
      totalTime = 0;
    const coords = (data.features[0].geometry as LineString).coordinates.map(
      ([lng, lat, elevation], index) => {
        let distance = 0;
        let diffInSeconds = 0;

        const time = new Date(coordTimes[index]);
        if (prevPoint) {
          distance = getCoordsDistance(prevPoint, { lat, lng });
          diffInSeconds = differenceInSeconds(time, prevPoint.time);
        }
        totalDistance += distance;
        totalTime += diffInSeconds;
        totalElevation += elevation;

        const speed = distance / diffInSeconds;
        const avgSpeedMps = totalDistance / totalTime;
        avgSpeedKph = avgSpeedMps * 3.6;

        const point = {
          lat,
          lng,
          elevation,
          time,
          totalTime,
          distance,
          totalDistance,
          speed,
          avgSpeed: avgSpeedKph,
        };
        prevPoint = point;
        //console.log(distance);
        //console.log(speed);
        console.log(avgSpeedKph);
        return point;
      }
    );
    console.log(totalDistance);

    setGpxData({
      name,
      time,
      type,
      distance: totalDistance,
      duration: totalTime,
      avgSpeed: avgSpeedKph,
      elevation: totalElevation,
      coords,
    });
  };

  const fields = [
    { name: "name" },
    { name: "type" },
    { name: "distance", type: "hidden" },
    { name: "duration", type: "hidden" },
  ];

  const data = {
    name: gpxData?.name,
    type: gpxData?.type,
    //distance: gpxData?.coords[gpxData.coords.length - 1].totalDistance,
    //duration: gpxData?.coords[gpxData.coords.length - 1].totalTime,
  };

  const renderForm: FormRender = ({ fields }) => {
    const { name, type, distance, duration } = fields;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1">{name}</div>
          <div className="flex-1">{type}</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            
          </div>
          <div className="flex-1">
            
          </div>
        </div>
        <Button type="submit">Create activity</Button>
      </div>
    );
  };

  const saveActivity = async (data: GpxRecord) => {
    console.log(data);
    if (gpxData) {
      gpxData.name = data.name;
      gpxData.type = data.type;
      await createActivity(gpxData);
    }
  };

  return (
    <div>
      Upload activity
      <FileUploader onUploadFile={uploadFile} />
      {activities.map((activity) => {
        return (
          <div key={activity.id} className="flex justify-between space-y-1">
            <div>
              {activity.name} ({new Date(activity.date).toLocaleDateString()})
            </div>
            <div>
              <Button onClick={() => {}}>Show activity</Button>
            </div>
          </div>
        );
      })}
      {gpxData && (
        <div>
          <div className="flex flex-col gap-5">
            <div className="flex-1">
              <Map coords={gpxData.coords} />
            </div>
            <div className="flex-1">
              <Form
                fields={fields}
                data={data}
                validation="CreateOrEditActivity"
                action={saveActivity}
                render={renderForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
