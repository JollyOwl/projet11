// Dashboard with all the inbalances

import AccountCard from './AccountCard';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className=" py-7 m-0 flex justify-start">
        <h1 className="text-3xl font-bold text-gray-900">Your accounts</h1>
      </div>
      <div className="space-y-6">
        <AccountCard />
        <AccountCard />
        <AccountCard />
      </div>
    </div>
  );
}
  

  