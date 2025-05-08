import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../store/useUserStore.js';
import ChatLoader from '../sub_components/ChatLoader';
import CallButton from '../sub_components/CallButton'; 
import toast from 'react-hot-toast'; 
 
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from 'stream-chat-react';

import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();
  const [chatUser, setChatUser] = useState(null);
  const [channel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamtoken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePic,
          },
          tokenData?.token
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');
        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChatUser(client);
        setChatChannel(currChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Could not connect to chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (tokenData?.token && authUser && targetUserId) {
      initChat();
    }
  }, [tokenData, authUser, targetUserId]); // Effect runs only when one of these values changes

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success('Video call link sent successfully!');
    }
  };

  if (loading || !chatUser || !channel) return <ChatLoader />;

  return (
    <div className="pt-[80px] h-[calc(100vh-80px)]">
      <Chat client={chatUser}>
        <Channel channel={channel}>
          <Window>
            <div className="flex flex-col h-full w-full relative">
              {/* Optional call button */}
              <CallButton handleVideoCall={handleVideoCall} />

              {/* Chat header */}
              <ChannelHeader />

              {/* Scrollable message list */}
              <div className="flex-1 overflow-y-auto">
                <MessageList />
              </div>

              {/* Fixed input at the bottom */}
              <MessageInput focus />
            </div>
          </Window>

          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}

export default ChatPage;
