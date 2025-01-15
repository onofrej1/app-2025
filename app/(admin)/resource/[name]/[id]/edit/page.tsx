import ResourceForm from "@/components/resources/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaQuery } from "@/db";
import { models } from "@/resources";

interface ResourceProps {
  params: Promise<{
    name: string;
    id: string;
  }>,
  searchParams: Promise<{ [key: string]: string }>
}

export default async function EditResource({ params }: ResourceProps) {
  const { name: resourceName, id } = await params;
  const model = models.find(m => m.resource === resourceName);
  if (!model) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const args = { where: { id: Number(id) }, include: model.relations };
  const data = await prismaQuery(model.model, 'findUnique', args);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit item</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceForm resource={model.resource} data={data} />
        </CardContent>
      </Card>
    </>
  );
}