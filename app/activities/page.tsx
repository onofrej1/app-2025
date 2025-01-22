"use client";

import { createActivity, getActivities, GpxRecord } from "@/actions/activities";
import FileUploader from "@/components/form/fileUpload";
import Map from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { FeatureCollection } from "geojson";
import Form, { FormRender } from "@/components/form/form";
import { analyzeGpxData } from "@/utils/gpx";
import { FormField } from "@/resources/resources.types";

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
    
    const parsedData = analyzeGpxData(data);
    setGpxData(parsedData);
  };

  const fields: FormField[] = [
    { name: "name", type: "text" },
    { name: "type", type: "text" },
    { name: "distance", type: "hidden" },
    { name: "duration", type: "hidden" },
  ];

  const data = {
    name: gpxData?.name,
    type: gpxData?.type,
  };

  const renderForm: FormRender = ({ fields }) => {
    const { name, type } = fields;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1">{name}</div>
          <div className="flex-1">{type}</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"></div>
          <div className="flex-1"></div>
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
