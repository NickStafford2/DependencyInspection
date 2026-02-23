import * as React from "react"
import { ResizablePanelGroup } from "./ui/resizable"

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [query])

  return matches
}

export function ResponsiveResizableGroup({ children, ...props }) {
  const isMdUp = useMediaQuery("(min-width: 768px)")
  const direction = isMdUp ? "horizontal" : "vertical"

  return (
    <ResizablePanelGroup direction={direction} {...props}>
      {children}
    </ResizablePanelGroup>
  )
}
