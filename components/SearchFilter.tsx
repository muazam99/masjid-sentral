import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SearchFilter() {
  return (
    <div className="mb-8 p-4 bg-background rounded-lg border-[1px]">
      <div className="grid gap-4 md:grid-cols-4">
        <Input placeholder="Cari Masjid..." className="md:col-span-2" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Negeri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="selangor">Selangor</SelectItem>
            <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
            {/* Add more states as needed */}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Bandar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shah-alam">Shah Alam</SelectItem>
            <SelectItem value="petaling-jaya">Petaling Jaya</SelectItem>
            {/* Add more cities as needed */}
          </SelectContent>
        </Select>
        {/* <Select>
          <SelectTrigger>
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="historic">Historic</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline">Reset</Button>
        <Button>Search</Button>
      </div>
    </div>
  )
}

