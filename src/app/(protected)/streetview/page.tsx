import StreetView from "@srms/components/features/streetView/StreetView";

export default function Page() {
  return (
    <main>
      <div className="h-screen w-full">
        <StreetView lat={6.12567010165266} lng={125.18470759392686} />
      </div>
    </main>
  );
}
