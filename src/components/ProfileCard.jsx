function ProfileCard({ user }) {
  return (
    <div className="glass rounded-2xl p-8 max-w-sm mx-auto card-hover animate-fadeInUp"
      style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-28 h-28 rounded-full border-4 border-blue-500 animate-pulse-glow"
          />
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent)' }}
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {user.name || user.login}
        </h2>
        <p className="text-blue-400 mb-3">@{user.login}</p>

        {user.bio && (
          <p className="text-gray-400 text-center text-sm mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}

        {user.location && (
          <p className="text-gray-500 text-sm mb-4">
            📍 {user.location}
          </p>
        )}

        <div className="flex gap-8 mt-2">
          <div className="text-center">
            <p className="text-white font-bold text-xl">
              {user.followers.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">
              {user.following.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Following</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">
              {user.public_repos}
            </p>
            <p className="text-gray-500 text-xs mt-1">Repos</p>
          </div>
        </div>

        <a
          href={`https://github.com/${user.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}

export default ProfileCard