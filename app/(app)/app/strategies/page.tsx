import UserStrategies from "@/components/App/UserStrategies"

const StrategiesPage = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <h2 className="text-3xl leading-5 font-bold tracking-tight mb-6 w-full">
        Strategies
      </h2>
      <UserStrategies />
    </div>
  );
};
export default StrategiesPage;
