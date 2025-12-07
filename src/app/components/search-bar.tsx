import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="🔍 Search for Assignments" />
      <Button type="submit">Search</Button>
    </div>
  )
}
