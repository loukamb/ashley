/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

// I hope this won't get confusing.
import { Announcement } from "../announcement.ts"

import React from "react"

export default function Announcement({
  children,
  color,
  href,
}: {
  children: React.ReactNode
  color?: string
  href?: string
}) {
  return (
    <div className="announcement" data-color={color}>
      {(() => {
        if (href !== undefined) {
          return <a href={href}>{children}</a>
        }
        return children
      })()}
    </div>
  )
}
