import HomeClient from './HomeClient'
import TopStories from '../top/page'

export const dynamic = 'force-dynamic'

export default async function Home() {
  return <HomeClient topStories={<TopStories />} />
}
