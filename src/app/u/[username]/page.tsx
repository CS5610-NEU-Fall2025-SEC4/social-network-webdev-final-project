import Link from 'next/link'

export default function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params

  const DIRECTORY: Record<
    string,
    {
      username: string
      firstName: string
      lastName: string
      bio?: string
      karma?: number
      joined?: string
      location?: string
      website?: string
      interests?: string[]
      social?: { twitter?: string; github?: string; linkedin?: string }
      stats?: { posts?: number; comments?: number; followers?: number; following?: number }
    }
  > = {
    demo: {
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      bio: 'This is a demo public profile. Connect a backend to load real data.',
      karma: 1234,
      joined: '2024-01-15T00:00:00.000Z',
      location: 'Internet',
      website: 'https://example.com',
      interests: ['webdev', 'nextjs', 'typescript'],
      social: {
        twitter: 'https://twitter.com/demo',
        github: 'https://github.com/demo',
        linkedin: 'https://www.linkedin.com/in/demo',
      },
      stats: { posts: 12, comments: 47, followers: 25, following: 18 },
    },
    alice: {
      username: 'alice',
      firstName: 'Alice',
      lastName: 'Lee',
      bio: 'Curious builder. Loves open-source.',
      karma: 980,
      joined: '2023-08-03T00:00:00.000Z',
      location: 'Boston, MA',
      website: 'https://alice.dev',
      interests: ['oss', 'ui', 'data-vis'],
      social: { github: 'https://github.com/alice' },
      stats: { posts: 22, comments: 301, followers: 102, following: 54 },
    },
  }

  const user = DIRECTORY[username] || {
    username,
    firstName: username,
    lastName: '',
    bio: 'This user profile will show more details once connected to the backend.',
    karma: 0,
    joined: undefined,
    location: undefined,
    website: undefined,
    interests: [],
    social: {},
    stats: {},
  }

  const initials = (
    (user.firstName?.[0] || '') + (user.lastName?.[0] || user.username?.[0] || 'U')
  ).toUpperCase()

  return (
    <div className="p-4 md:p-6">
      <div className="mb-2">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-600 !no-underline text-sm"
        >
          &lt; Back
        </Link>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 leading-tight">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-4">
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-line">{user.bio || 'No bio yet.'}</p>
          </div>
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-2">Contact</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>
                <span className="font-medium">Website:</span> {user.website || '—'}
              </li>
              <li>
                <span className="font-medium">Location:</span> {user.location || '—'}
              </li>
            </ul>
          </div>
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {(user.interests || []).map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  {tag}
                </span>
              ))}
              {!user.interests?.length && (
                <p className="text-gray-500 text-sm">No interests listed.</p>
              )}
            </div>
          </div>
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-2">Social</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {user.social?.twitter && (
                <li>
                  <a
                    href={user.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Twitter
                  </a>
                </li>
              )}
              {user.social?.github && (
                <li>
                  <a
                    href={user.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </li>
              )}
              {user.social?.linkedin && (
                <li>
                  <a
                    href={user.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {!user.social?.twitter && !user.social?.github && !user.social?.linkedin && (
                <li className="text-gray-500">No social links added yet.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Stats</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Posts</dt>
                <dd className="font-semibold">{user.stats?.posts ?? 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Comments</dt>
                <dd className="font-semibold">{user.stats?.comments ?? 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Followers</dt>
                <dd className="font-semibold">{user.stats?.followers ?? 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Following</dt>
                <dd className="font-semibold">{user.stats?.following ?? 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Karma</dt>
                <dd className="font-semibold">{user.karma ?? 0}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Joined</dt>
                <dd className="font-semibold">
                  {user.joined ? new Date(user.joined).toLocaleDateString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Location</dt>
                <dd className="font-semibold">{user.location || '—'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
