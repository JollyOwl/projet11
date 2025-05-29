import SecondaryButton from "../UI/SecondaryButton";
import PrimaryButton from "../UI/PrimaryButton";

export default function AccountCard({   
  accountName = "Argent Bank Checking",
  accountBalance = 2082.79,
  accountType = "Checking"
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full p-6 bg-green-50 rounded-lg border-1 border-green-200 transition-shadow">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-gray-900 flex justify-start">{accountName}</h3>
        <p className="text-4xl font-bold text-gray-900 flex justify-start">${accountBalance}</p>
        <p className="text-sm text-gray-600 flex justify-start">{accountType} Available</p>
      </div>
      <div className=" md:w-auto mt-4 md:mt-0">
        <SecondaryButton >
          View transactions
        </SecondaryButton>
      </div>
    </div>
  );
}