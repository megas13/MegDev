import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const dictionary = JSON.parse(fs.readFileSync('src/lib/i18n/en.json','utf8'))
const unknown = new Map()
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name)
    if (entry.isDirectory()) {if(entry.name!=='api'&&entry.name!=='i18n')walk(file);continue}
    if(!/\.(tsx|ts)$/.test(file))continue
    const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)
    function visit(node){
      const jsxText = node.parent&&ts.isJsxExpression(node.parent)&&ts.isJsxElement(node.parent.parent)&&node.parent.parent.openingElement.tagName.getText(source)==='T'
      const fields = new Set(['name','label','title','description','desc','detail','outcome','question','answer','placeholder','aria-label'])
      const fieldText = node.parent&&(ts.isPropertyAssignment(node.parent)||ts.isJsxAttribute(node.parent))&&fields.has(node.parent.name.getText(source))
      if(ts.isStringLiteral(node)&&node.text&&(jsxText||fieldText)) {
        const value=node.text.trim()
        if(!dictionary[value]&&/[a-zA-Zçğıöşü]/.test(value))unknown.set(value,file)
      }
      ts.forEachChild(node,visit)
    }
    visit(source)
  }
}
walk('src')
console.log([...unknown].map(([text,file])=>`${text}\t${file}`).join('\n'))
