function ProfileCard({ user }) {
  return (
    <div className="flex flex-col items-center bg-gray-800 rounded-2xl p-8 max-w-sm mx-auto shadow-lg">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4"
      />
      <h2 className="text-2xl font-bold text-white">
        {user.name || user.login}
      </h2>
      <p className="text-gray-400 mb-4">@{user.login}</p>

      {user.bio && (
        <p className="text-gray-300 text-center text-sm mb-4">{user.bio}</p>
      )}

      <div className="flex gap-6 mt-2">
        <div className="text-center">
          <p className="text-white font-bold text-xl">{user.followers}</p>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xl">{user.following}</p>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xl">{user.public_repos}</p>
          <p className="text-gray-400 text-sm">Repos</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard