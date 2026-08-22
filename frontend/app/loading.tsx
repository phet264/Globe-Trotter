export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-4 border-muted"></div>
        <div className="absolute h-full w-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading experience...</p>
    </div>
  );
}
