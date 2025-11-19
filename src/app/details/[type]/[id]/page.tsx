'use client'
import PostDetails from '../../post'
import UserDetails from '../../user'
import CommentDetails from '../../comment'

export default function DetailsPage({ params }: { params: { type: string; id: string } }) {
  const { type, id } = params
  let template
  switch (type) {
    case 'post': {
      template = (
        <PostDetails
          username="placeholder"
          email="placeholder@example.com"
          firstName="John"
          lastName="Doe"
          id={id}
        />
      )
      break
    }
    case 'comment': {
      template = (
        <CommentDetails
          username="placeholder"
          email="placeholder@example.com"
          firstName="John"
          lastName="Doe"
          id={id}
        />
      )
      break
    }
    default: {
      template = (
        <UserDetails
          username="placeholder"
          email="placeholder@example.com"
          firstName="John"
          lastName="Doe"
          id={id}
        />
      )
    }
  }
  return <div>{template}</div>
}
