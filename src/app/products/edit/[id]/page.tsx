import EditProduct from "@/components/EditProduct";

export const metadata = {
  title: "Edit Product | Bannira Admin",
};

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function Page({ params }: PageProps) {
  return <EditProduct params={params} />;
}