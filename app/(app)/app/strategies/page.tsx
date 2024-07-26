import { DemoDashboard } from "@/components/demo-dashboard/demo-dashboard";
import AppShell from "@/components/App/AppShell";
import Strategies from "@/components/App/Strategies";

const StrategiesPage = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl leading-5 font-bold tracking-tight mb-6">
        Strategies
      </h2>
      <Strategies />
    </div>
  );
};
export default StrategiesPage;
