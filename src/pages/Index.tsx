/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { Session } from "../session.ts"

import Helmet from "../components/Helmet.tsx"
import { getAnnouncements } from "../announcement.ts"

export default async function Index({ session }: { session?: Session }) {
  // Retrieve announcements for the index page.
  const announcements = await getAnnouncements("index")

  return (
    <>
      <Helmet>
        <title>Home page or something</title>
      </Helmet>
    </>
  )
}
