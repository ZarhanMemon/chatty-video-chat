import { axiosInstance } from "../lib/axiuos.js";


export async function getMyFriends() {
  const { data } = await axiosInstance.get("/users/friends");
  return data;
}

export async function getRecommendedUsers() {
  const { data } = await axiosInstance.get("/users");
  return data;
}

export async function getOutgoingFriendReqs() {
  const { data } = await axiosInstance.get("/users/outgoing-friend-requests");
  return data;
}

export async function getFriendRequests() {
  const { data } = await axiosInstance.get("/users/friend-requests");
  return data;
}

export async function sendFriendRequest(userId) {
  console.log("Sending request to:", userId);

  const { data } = await axiosInstance.post(`/users/friend-request/${userId}`);


  return data;
}

export async function acceptFriendRequest(requestId) {
  const { data } = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return data;
}

export async function rejectFriendRequest(requestId) {
  const { data } = await axiosInstance.post(
    `/users/friend-request/${requestId}/reject`
  );
  return data;
}

// --- Chat / Streaming ---
export async function getStreamToken() {
  const { data } = await axiosInstance.get("/chat/token");
  return data;
}