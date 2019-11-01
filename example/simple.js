const { AstBuilder } = require('..')

class TreeOfNodes extends AstBuilder {
  constructor() {
    super(["node"])
  }
}

let tree = new TreeOfNodes().build(() =>
  node(1, () => {
    node(2, () =>
      node(3)
    )
    node(4)
  })
)

function toAsciiTree(tree, prefix = "", isTail = true) {
  if (!tree) {
    return null
  }

  let children = tree.children || []
  return [prefix, isTail ? "└" : "├", " ", tree.value, '\n']
    .concat(children.map((c, i) => toAsciiTree(c,
      prefix + (isTail ? "  " : "│ "), i >= children.length - 1)))
    .join('')
}

console.log(toAsciiTree(tree))