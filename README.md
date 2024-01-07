
<img align="right" width="120" src="assets/logo.png">

**ashley** is general purpose, public domain forum software. It aims to be simple, correct, consistent, and complete. It is both for tightly-knit communities with a lot of ongoing discussion, and for existing projects in need of a support platform.

### Table of Contents

- [Overview](#overview)
- [Development](#development)
- [Roadmap](#roadmap)
- [Philosophy](#philosophy)
- [License](#license)

> Ashley is heavy **WIP** software and not ready for production. You shouldn't use this as anything but a toy. This document serves as a roadmap, and not necessarily as a list of currently available features. Do not use for anything serious until 1.0 has been released.

# Overview

Ashley is free, extensible, public domain, general purpose forum software. It implements all common forum functionality while leaving any additions to be implemented by the webmaster through the easy plugin interface.

**Key aspects:**

- **Straightforward.** Ashley is made to be very easy to use. It can be installed on any environment supported by Node and has only a few requirements.
- **Extensible.** Develop plugins that run _horrifyingly_ close to the server code. Installation is as easy as dropping their contents into `/plugin`.
- **Reproducible.** Everything in your forum can be exported to a single reproducible forum state that can be re-deployed with `ashleyforums import`.
- **Customizable.** The entirety of the site's look and feel is defined through stylesheets. Multiple themes can be installed and selected by users.
- **Private.** Individual content groups (such as private messages) can be configured to be cryptographically encrypted. Any and all data logging can be disabled.

# Development

After cloning this repository, you can launch the development server using `npm run dev` (or, preferably, `pnpm dev` if you have [`pnpm`](https://pnpm.io/) installed). The server will automatically restart when any code or stylesheet change is detected. You can build the server with `npm run build`/`pnpm build`. It can be started with `npm run start`/`pnpm start`.

I highly recommend checking out the [development help](DEVELOPMENT.md) document to better understand how Ashley's internals work. A lot of heterodox React techniques are used that may be unfamiliar to the traditional React developer.

# Roadmap

We use the [issue tracker](https://github.com/mblouka/ashley/issues) as the roadmap.

# Philosophy

You can access Ashley's full philosophy under [`PHILOSOPHY.md`](./PHILOSOPHY.md).

**TL;DR:** Traditional forum software was good. New forum software proclaiming itself as "modern" alternatives were engineered, incidentally discarding a lot of the good stuff that traditional forum software offered. Traditional software is good for communities, while "modern" software is tailored for support purposes and project tracking. Ashley aims to use these accessible "modern" technologies, while offering the experience of traditional forum software.

**Shorter TL;DR:** Ashley is a love letter to phpBB and MyBB.

# License

This is free and unencumbered software released into the public domain. For more information, read the [full license](./LICENSE).
