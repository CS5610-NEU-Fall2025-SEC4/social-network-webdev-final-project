import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface PublicUserRef {
  id: string
  username: string
}
interface PublicProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  bio?: string | null
  location?: string | null
  website?: string | null
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  followers?: PublicUserRef[]
  following?: PublicUserRef[]
}

async function fetchPublicProfile(id: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as PublicProfile
  } catch {
    return null
  }
}

export default async function PublicProfileById({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await fetchPublicProfile(id)
  const initials = (
    (profile?.firstName?.[0] || '') + (profile?.lastName?.[0] || profile?.username?.[0] || 'U')
  ).toUpperCase()

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-5xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700 !no-underline text-sm"
        >
          &lt; Back
        </Link>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 text-white shadow-md mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/50 backdrop-blur flex items-center justify-center text-2xl font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-white/80">@{profile?.username}</p>
            </div>
          </div>
        </div>

        {!profile ? (
          <div className="rounded-lg bg-white shadow p-6 text-gray-700">Profile not found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-4">
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-line">{profile.bio || 'No bio yet.'}</p>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Contact</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  {/* Email intentionally hidden for public view */}
                  <li>
                    <span className="font-medium">Website:</span> {profile.website || '—'}
                  </li>
                  <li>
                    <span className="font-medium">Location:</span> {profile.location || '—'}
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.interests || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-indigo-50 text-indigo-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {!profile.interests?.length && (
                    <p className="text-gray-500 text-sm">No interests listed.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Social</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {profile.social?.twitter && (
                    <li>
                      <a
                        href={profile.social.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Twitter
                      </a>
                    </li>
                  )}
                  {profile.social?.github && (
                    <li>
                      <a
                        href={profile.social.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        GitHub
                      </a>
                    </li>
                  )}
                  {profile.social?.linkedin && (
                    <li>
                      <a
                        href={profile.social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn
                      </a>
                    </li>
                  )}
                  {!profile.social?.twitter &&
                    !profile.social?.github &&
                    !profile.social?.linkedin && (
                      <li className="text-gray-500">No social links added yet.</li>
                    )}
                </ul>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Following</h3>
                <ul className="text-sm space-y-1">
                  {(profile.following || []).map((u) => (
                    <li key={u.id}>
                      <Link href={`/profile/${u.id}`} className="text-blue-700 hover:underline">
                        @{u.username}
                      </Link>
                    </li>
                  ))}
                  {!profile.following?.length && (
                    <li className="text-gray-500">Not following anyone yet.</li>
                  )}
                </ul>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Followers</h3>
                <ul className="text-sm space-y-1">
                  {(profile.followers || []).map((u) => (
                    <li key={u.id}>
                      <Link href={`/profile/${u.id}`} className="text-blue-700 hover:underline">
                        @{u.username}
                      </Link>
                    </li>
                  ))}
                  {!profile.followers?.length && (
                    <li className="text-gray-500">No followers yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
