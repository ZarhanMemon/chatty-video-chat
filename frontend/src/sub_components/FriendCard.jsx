import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-3">
        <div className="flex items-center gap-3">
          {/* Image and Name in one line */}
          <div className="avatar size-14">
            <img
              src={friend.profilePic}
              alt={friend.name}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xl truncate">{friend.name}</h3>
          </div>
        </div>

        {/* Message button below */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline bg-blue-500 text-white text-sm rounded-sm mt-3"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
