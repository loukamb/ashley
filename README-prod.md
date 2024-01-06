> This portion is to be rolled into the `README` when Ashley is ready for production. This is what I aim the project to have.

# Installation

Requirements:

- **Software:** Node 20.x and above.
- **Databases:** PostgreSQL and Redis (for caching). Connection options can be specified in your `ashley.config.json` file.

Steps:

1. Install Ashley on your system through `npm install -g ashleyforums`.
2. Create a new folder where you want your forum configuration and assets to be stored. Don't worry, you can configure a CDN for storage later.
3. Navigate to your new folder and invoke `ashleyforums init`.
4. Open `ashley.config.json` and input your database connection information under the `databases` field. Adjust any other configuration in the process. This is the only configuration necessary for serving your forum.
5. Serve the forum with `ashleyforums start`.
6. Navigate to the URL printed to console.

By default, your forum will be in **bootstrap mode**. During bootstrap mode, you will be automatically logged into a bootstrap administrator account while navigating the site, email services will be disabled by default, and account creation will be disabled.

> ⚠️ **Do not publicly expose your site in bootstrap mode.** Every visitor will be automatically logged into the administrator account. This is not good.

You should use bootstrap mode to configure your site's essentials, including email services, general forum layout, accounts for yourself and your staff, plugins, and security features. The admin account you are logged into will be irrecoverably deleted when you turn bootstrap mode off (including all posts!), so make sure to create an administrator account for yourself before turning bootstrap mode off. **If you don't, you will not be able to gain access to your site's administrative control panel unless you manually edit the database, which is obviously not recommended.**

If you need to create posts or threads prior to disabling bootstrap mode, create an administrator/"system" account, then use the administrative panel to log yourself into that account. From there, you can post content that will not get automatically wiped after bootstrap mode is turned off. Logging out of that account will automatically re-log you into the bootstrap administrator account. You can also create the content as the bootstrap administrator account then transfer ownership to another account afterwards, but since you may forget, this is not recommended.
