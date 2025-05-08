import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
} from "../store/useUserStore.js";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";

import FriendCard from "../sub_components/FriendCard.jsx";
import NoFriendsFound from "../sub_components/NoFriendFound.jsx";

const HomePage = ({ showRecommendFriend }) => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const {
    data: friends = [],
    isLoading: loadingFriends,
    isError: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  });

  const {
    data: recommendedUsers = [],
    isLoading: loadingUsers,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });


  useEffect(() => {
    const ids = new Set(outgoingFriendReqs.map((r) => r.recipient._id));
    setOutgoingRequestsIds(ids);
  }, [outgoingFriendReqs]);

  if (friendsError || usersError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 mt-10">
      <div className="container mx-auto space-y-14">
        {/* Friends Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Your Friends</h2>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((f) => <FriendCard key={f._id} friend={f}   />)}
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        {showRecommendFriend && (
          <section className="mt-10">
            <div className="mb-10">
              <h2 className="text-2xl sm:text-4xl font-semibold">
                Meet New Friends
              </h2>
              <p className="text-base text-muted-foreground mt-2">
                Discover perfect language exchange partners tailored to your interests and location.
              </p>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="bg-muted p-6 rounded-xl text-center shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                  No recommendations available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  return (
                    <div
                      key={user._id}
                      className="bg-white dark:bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6 space-y-5">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.name}
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            {user.location && (
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPinIcon className="size-4 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className={`btn w-full rounded-full transition ${hasRequestBeenSent
                              ? "btn-outline text-success cursor-default"
                              : "btn-primary"
                            }`}
                          onClick={() => {
                            if (!hasRequestBeenSent) {
                              sendRequestMutation(user._id);
                            }
                          }}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
