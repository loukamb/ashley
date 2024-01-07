/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

// I hope this won't get confusing.
import { Announcement } from "@/forums/announcement.ts"

import { ComponentChildren } from "preact"

export default function Announcement({
  children,
  color,
  href,
}: {
  children: ComponentChildren
  color?: string
  href?: string
}) {
  return (
    <div class="announcement" data-color={color}>
      {(() => {
        if (href !== undefined) {
          return <a href={href}>{children}</a>
        }
        return children
      })()}
    </div>
  )
}
