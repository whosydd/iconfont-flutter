/* eslint-disable @typescript-eslint/naming-convention */
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'

type IconData = {
  icon_id: string
  name: string
  font_class: string
  unicode: string
  unicode_decimal: number
}

export default async (file: vscode.Uri) => {
  const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath
  const filePath = file.fsPath

  const result = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const { glyphs } = JSON.parse(result)

  if (!glyphs) {
    vscode.window.showErrorMessage('Not found any iconfont.')
    return
  }

  let iconfontName = await vscode.window.showInputBox({
    title: 'Set Font Family',
    value: 'IconFont',
  })

  if (!iconfontName) {
    iconfontName = 'IconFont'
  }

  const dst = path.resolve(rootPath, 'lib/widgets')

  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true })
  }

  let dart = path.resolve(dst, `${iconfontName.toLowerCase()}.dart`)
  let firstCode = `import 'package:flutter/widgets.dart';\n\nabstract class ${iconfontName} {\n\tstatic const String _family = 'iconfont';`

  try {
    fs.writeFileSync(dart, firstCode)
    glyphs.forEach((item: IconData) => {
      fs.writeFileSync(
        dart,
        `\n\tstatic const IconData icon_${item.font_class} = IconData(0x${item.unicode}, fontFamily: _family);`,
        { flag: 'a' }
      )
    })
    fs.writeFileSync(dart, `\n}`, { flag: 'a' })

    vscode.window.showInformationMessage('Done')
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message)
  }
}
