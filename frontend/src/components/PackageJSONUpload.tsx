import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"

export const PackageJSONUpload = () => {
  const callApi = () => {

  }
  return (
    <div className="flex flex-row">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="packageJson">Package JSON </Label>
        <Input id="packageJson" type="file" />
      </div>
      <Button onClick={callApi}>Upload</Button>
    </div>
  )
}
