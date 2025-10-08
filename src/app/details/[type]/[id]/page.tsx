'use client'
import { useParams } from 'next/navigation'
import PostDetails from '../../post'
import UserDetails from '../../user'
import CommentDetails from '../../comment'

export default function DetailsPage() {
  const pathParamters = useParams<{ type: string; id: string }>()
  let template
  console.log(pathParamters)
  console.log(typeof pathParamters.type)
  switch (pathParamters.type) {
    case 'post': {
      template = (
        <PostDetails
          username={'hi'}
          email={'johndoe@lost.com'}
          firstName={'john'}
          lastName={'doe'}
          id={'23324'}
        />
      )
      break
    }
    case 'comment': {
      template = (
        <CommentDetails
          username={'hi'}
          email={'johndoe@lost.com'}
          firstName={'john'}
          lastName={'doe'}
          id={'234'}
        />
      )
      template = <div>Comment Here</div>
      break
    }
    default: {
      template = (
        <UserDetails
          username={'hi'}
          email={'johndoe@lost.com'}
          firstName={'john'}
          lastName={'doe'}
          id={'2342345'}
        />
      )
    }
  }
  return <div> {template} </div>
}
