import ResourceForm from "@/components/resources/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaQuery } from "@/db";
import { resources } from "@/resources";

interface ResourceProps {
  params: Promise<{
    name: string;
    id: string;
  }>,
  searchParams: Promise<{ [key: string]: string }>
}

export default async function EditResource({ params }: ResourceProps) {
  const { name: resourceName, id } = await params;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }
  const form = [{ name: 'id', type: 'hidden', label: 'Id' }, ...resource.form];

  const include: Record<string, boolean> = {};
  for (const field of form) {
    if (['fk', 'm2m'].includes(field.type) && field.resource) {
      const values = await prismaQuery(field.resource, 'findMany', null);
      field['options'] = values.map((value: any) => ({ value: value.id, label: value[field.textField!] }));
    }
    if (field.type === 'm2m') {
      include[field.name] = true;
    }
  }

  const args = { where: { id: Number(id) }, include };
  const data = await prismaQuery(resource.model, 'findUnique', args);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceForm resource={resource.resource} fields={form} data={data} />
        </CardContent>
      </Card>
    </>
  );
}