import { addResource } from "@/actions";
import Form from "@/components/form/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaQuery } from '@/db'
import { resources } from "@/resources";

interface ResourceProps {
  params: {
    name: string;
    id: string;
  },
  searchParams: { [key: string]: string }
}

export default async function CreateResource({ params }: ResourceProps) {
  const { name: resourceName } = await params;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }
  const form = resource.form;

  for (const field of form) {
    if (['fk', 'm2m'].includes(field.type) && field.resource) {
      const d = await prismaQuery(field.resource, 'findMany', null);
      field['options'] = d.map((value: any) => ({ value: value.id, label: value[field.textField!] }));
    }
  }

  const action = addResource.bind(null, resource);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add new item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            fields={resource.form}
            validation={resource.rules}
            data={{}}
            action={action}
          />
        </CardContent>
      </Card>

    </>
  );
}