function ProfileCard({ user }) {
  return (
    <div className="brut-card rounded-none p-0 max-w-2xl mx-auto overflow-hidden">

      {/* Top bar */}
      <div className="bg-black px-6 py-2 flex items-center justify-between">
        <span className="brut-tag-dark text-xs">PROFILE</span>
        <span className="text-gray-400 text-xs mono">github.com/{user.login}</span>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-6 items-start">

        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-28 h-28 border-2 border-black"
            style={{ filter: 'grayscale(10%)' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-2xl font-bold text-black">
              {user.name || user.login}
            </h2>
            <span className="brut-tag">Developer</span>
          </div>

          <p className="mono text-sm text-gray-600 mb-3">
            @{user.login}
          </p>

          {user.bio && (
            <p className="text-gray-700 text-sm leading-relaxed mb-4 max-w-md">
              {user.bio}
            </p>
          )}

          {user.location && (
            <p className="text-gray-500 text-xs mb-4">
              📍 {user.location}
            </p>
          )}

          {/* Stats row */}
          <div className="flex gap-0 border-t-2 border-black mt-4 pt-4">
            {[
              { label: 'Followers', value: user.followers.toLocaleString() },
              { label: 'Following', value: user.following.toLocaleString() },
              { label: 'Repos', value: user.public_repos },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex-1 text-center ${i < 2 ? 'border-r-2 border-black' : ''}`}
              >
                <p className="mono text-xl font-bold text-black">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-black px-6 py-3 flex justify-between items-center bg-gray-50">
        <span className="text-xs text-gray-500 mono">
          Member since {new Date(user.created_at).getFullYear()}
        </span>
        <a
          href={`https://github.com/${user.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="brut-btn-outline px-4 py-1.5 text-xs"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}

export default ProfileCard