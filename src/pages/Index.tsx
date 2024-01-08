/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "@/server/session.ts"
import { getAnnouncements } from "@/forums/announcement.ts"
import { getIndexSections } from "@/forums/section.ts"

import Announcement from "@/components/Announcement.tsx"
import Helmet from "@/components/Helmet.tsx"
import Section from "@/components/Section.tsx"

export default async function Index({ session }: { session?: Session }) {
  // Retrieve announcements for the index page.
  const announcements = await getAnnouncements("index")

  // Retrieve sections for the index page.
  const indexSections = await getIndexSections(session)

  return (
    <>
      <Helmet>
        <title>Home page or something</title>
      </Helmet>

      {announcements.length > 0 && (
        <div id="announcements">
          {announcements.map((announcement) => (
            <Announcement
              key={announcement.id}
              href={announcement.href}
              color={announcement.color}
            >
              {announcement.contents}
            </Announcement>
          ))}
        </div>
      )}

      <div class="section-container">
        {indexSections.map((section) => (
          <Section key={section.id} src={section} index={true} />
        ))}
      </div>
    </>
  )
}
