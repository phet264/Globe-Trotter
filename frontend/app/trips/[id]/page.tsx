import { TripWorkspace } from '@/components/trip/TripWorkspace';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TripWorkspace tripId={id} />;
}
