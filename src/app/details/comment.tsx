export default function CommentDetails({
  username,
  id,
  firstName,
  lastName,
  email,
}: {
  username: string
  id: string
  firstName: string
  lastName: string
  email: string
}) {
  return (
    <div>
      <p>username - {username}</p>
      <p>id - {id}</p>
      <p>firstName - {firstName}</p>
      <p>lastName- {firstName}</p>
      <p>lastName- {lastName}</p>
      <p>email- {email}</p>
    </div>
  )
}
