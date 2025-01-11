import ResourceForm from "@/components/resources/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { models } from "@/resources";

interface ResourceProps {
  params: Promise<{
    name: string;
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function CreateResource({ params }: ResourceProps) {
  const { name: resourceName } = await params;
  const model = models.find(m => m.resource === resourceName);
  if (!model) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add new item</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceForm resource={model.resource} />
        </CardContent>
      </Card>
    </>
  );
}
