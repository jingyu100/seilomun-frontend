import StepTabs from "./StepTabs";

const Payment = () => {
  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <StepTabs />
      </div>
    </div>
  );
};

export default Payment;
