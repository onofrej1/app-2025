"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
//import Form, { FormRenderFunc } from "./form/form";
import { resources } from "@/resources";
import { FormSchema } from "@/validation";

export default function TableFilter() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const resourceName = params.name;
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const filters = resource.filter;
  const defaultData: Record<string, string | undefined> = {};
  filters.forEach((field) => {
    defaultData[field.name] = searchParams.get(field.name)?.toString();
    field["onChange"] = (value: any) => filter(field.name, value);
  });

  /*const render: FormRenderFunc = ({ fields, formState }) => {
    return (
      <div className="flex flex-row flex-wrap gap-2">
        {filters.map(f => <div key={f.name}>{fields[f.name]}</div>)}
      </div>
    )
  };*/

  const filter = (fieldName: string, value: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    if (value === "all" || value === "") {
      params.delete(fieldName);
    } else {
      params.set(fieldName, value);
    }

    const path = `${pathname}?${params.toString()}`;
    replace(path, { scroll: false });
  };

  return (
    <div>
      {/*<Form
      fields={filters}
      validation={FormSchema.FilterResource}
      data={defaultData}
      render={render}
      useClient={true}
      action={() => { }}
    />*/}
    </div>
  );
}
