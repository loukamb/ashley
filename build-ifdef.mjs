/**
 * Port of https://github.com/zziger/esbuild-ifdef to JavaScript.
 * Updated because zziger's impl breaks shit.
 */

import * as fs from "fs"

const regExps = {
  double: /\/\/[\s]*#(?<token>.*?)(?:[\s]+(?<expression>.*?))?[\s]*$/,
  triple: /\/\/\/[\s]*#(?<token>.*?)(?:[\s]+(?<expression>.*?))?[\s]*$/,
}

function ifdefPlugin(settings) {
  const regExp =
    settings.regExp ??
    (settings.requireTripleSlash !== false ? regExps.triple : regExps.double)
  const fileRegExp = settings.filePath ?? /\.[jt]sx?/
  const variables = Object.freeze(settings.variables ?? { ...process.env })

  function getToken(line) {
    const match = line.match(regExp)
    if (match)
      return [
        match.groups.token,
        match.groups.expression ?? "",
        match.index,
        match[0].length,
      ]
  }

  function evalExpression(expression, line, file) {
    const fn = new Function(
      ...Object.keys(variables),
      'return eval("' + expression + '")'
    )
    try {
      const res = !!fn(...Object.values(variables))
      if (settings.verbose)
        console.log(
          'Expression "' +
            expression +
            '" at ' +
            file +
            ":" +
            (line + 1) +
            " resulted with " +
            res
        )
      return res
    } catch (e) {
      if (typeof e === "object") e.line = line
      else {
        e = new Error("Error executing expression: " + e)
        e.line = line
      }
      throw e
    }
  }

  function parseIf(warn, file, lines, start = 0, ignore = false) {
    let remove = []
    let prune = false
    let done = false
    let i

    try {
      for (i = start; i < lines.length; i++) {
        const line = lines[i]
        const tokenData = getToken(line)
        if (prune || ignore) remove.push(i)
        if (!tokenData) {
          if (!prune && !ignore && settings.verbose)
            console.log("Including " + file + ":" + (i + 1))
          continue
        }
        remove.push(i)
        const [token, expression, column, length] = tokenData

        switch (token) {
          case "ifdef":
          case "if": {
            if (i !== start) {
              const data = parseIf(warn, file, lines, i, prune || ignore)
              i = data.end
              for (const n of data.remove) remove.push(n)
            } else {
              const exp = evalExpression(expression, i, file)
              done = exp
              prune = !exp
            }
            continue
          }
          case "endif":
            return { end: i, remove }
        }

        if (ignore || (prune && done)) continue
        switch (token) {
          case "else":
            prune = done
            break
          case "elseif":
          case "elif": {
            const exp = evalExpression(expression, i, file)
            prune = done || !exp
            if (!done) done = exp
          }
        }
        if (prune) continue
        switch (token) {
          case "warning":
          case "warn":
            warn({
              text: expression,
              location: {
                line: i + 1,
                lineText: lines[i],
                column,
                length,
              },
            })
            break
          case "error":
          case "err":
            const err = new Error(expression)
            err.line = i
            throw err
        }
      }
      throw new Error("Unterminated #if found on line " + start)
    } catch (err) {
      const line = err.line ?? start
      const tokenData = getToken(lines[line])
      err.location = {
        line: line + 1,
        lineText: lines[line],
      }
      if (tokenData) {
        err.location.column = tokenData[2]
        err.location.length = tokenData[3]
      }
      throw err
    }
  }

  function format(data, file, warn) {
    let i
    let remove = []
    const lines = data.split("\n")

    for (i = 0; i < lines.length; i++) {
      const line = lines[i]
      const tokenData = getToken(line)

      /// BEGIN ASHLEY CHANGES
      if (!tokenData /*|| tokenData[0] !== "if"*/) continue
      /// END ASHLEY CHANGES

      const data = parseIf(warn, file, lines, i, false)
      i = data.end
      for (const n of data.remove) remove.push(n)
    }

    let mapped
    if (settings.fillWithSpaces)
      mapped = lines.map((e, i) =>
        remove.includes(+i) ? " ".repeat(e.length) : e
      )
    else mapped = lines.map((e, i) => (remove.includes(+i) ? "//" + e : e))

    return mapped.join("\n")
  }

  const loaders = ["tsx", "jsx", "ts", "js"]

  return {
    name: "ifdef",
    setup(build) {
      build.onLoad({ filter: fileRegExp }, async (args) => {
        const warnings = []
        try {
          const text = await fs.promises.readFile(args.path, "utf8")
          const formatted = format(text, args.path, (msg) =>
            warnings.push({
              ...msg,
              location: { ...msg.location, file: args.path },
            })
          )

          const path = args.path.split(".")
          const ext = path[path.length - 1]
          return {
            contents: formatted,
            warnings,
            loader: loaders.includes(ext) ? ext : "js",
          }
        } catch (e) {
          if (!e.location) throw e
          return {
            warnings,
            errors: [
              {
                text: e.message,
                detail: e,
                location: {
                  file: args.path,
                  ...e.location,
                },
              },
            ],
          }
        }
      })
    },
  }
}

export default ifdefPlugin
