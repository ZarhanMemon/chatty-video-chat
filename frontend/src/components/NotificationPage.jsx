import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../store/useUserStore.js";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../sub_components/NoNotificationsFound.jsx";
import { useEffect } from "react";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading, isError, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    onSuccess: (data) => {
      console.log("Friend Requests Data (onSuccess):", data);
    },
    onError: (err) => {
      console.error("Error fetching friend requests:", err);
    },
  });

  useEffect(() => {
    if (friendRequests) {
      return;
    }
  }, [friendRequests]);

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPendingReject } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incoming || [];
  const outgoingRequests = friendRequests?.outgoing || [];
  const rejectRequests = friendRequests?.rejecting || [];

  if (isError) {
    return <div>Error fetching friend requests: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-10">
      <div className="container mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto relative"
                    >
                      {/* New Friend Badge */}
                      <div className="absolute top-2 right-2 badge badge-success flex items-center gap-2 text-xs">
                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                        New Friend
                      </div>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-base-300">
                            <img src={request.sender?.profilePic} alt={request.sender.name} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{request.sender.name}</h3>
                          </div>
                          <div className="flex gap-2 mt-2 sm:mt-0 ml-auto">
                            <button
                              className="btn btn-primary btn-xs sm:btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-error btn-xs sm:btn-sm"
                              onClick={() => rejectRequestMutation(request._id)}
                              disabled={isPendingReject}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* New Connections */}
            {outgoingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {outgoingRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm w-full sm:w-auto relative">
                      {/* New Friend Badge */}
                      <div className="absolute top-2 right-2 badge badge-success flex items-center gap-2 text-xs">
                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                        New Friend
                      </div>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-base-300">
                            <img src={notification.recipient.profilePic} alt={notification.recipient.name} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm sm:text-base">{notification.recipient.name}</h3>
                            <p className="text-xs sm:text-sm my-1">
                              {notification.recipient.name} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rejected Friend Requests */}
            {rejectRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-error" />
                  Rejected Requests
                </h2>

                <div className="space-y-3">
                  {rejectRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-100 border border-error shadow-sm w-full sm:w-auto relative">
                      {/* New Friend Badge */}
                      <div className="absolute top-2 right-2 badge badge-error flex items-center gap-2 text-xs">
                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                        Rejected
                      </div>
                      <div className="card-body p-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300">
                            <img src={notification.recipient.profilePic} alt={notification.recipient.name} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg sm:text-2xl">{notification.recipient.name}</h3>
                            <p className="text-sm text-error">Rejected your friend request</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Notifications Found */}
            {incomingRequests.length === 0 && outgoingRequests.length === 0 && rejectRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
