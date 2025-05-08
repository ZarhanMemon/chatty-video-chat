import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-300 flex items-center justify-center mb-4 w-16 h-16 sm:w-20 sm:h-20">
        <BellIcon className="h-8 w-8 sm:h-10 sm:w-10 text-base-content opacity-40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
      <p className="text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;
