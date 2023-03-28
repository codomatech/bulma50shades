import fs from 'fs'
import sass from 'sass'
import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";

const template = fs.readFileSync('src/style-template.scss', 'utf-8')

// get material colors
const colors = JSON.parse(fs.readFileSync('data/colors-material.json', 'utf-8'))

for (const name in colors) {
  let code = template
  //const palette = harmony(colors[name])
  //console.debug(Object.keys(palette))

  const theme = themeFromSourceColor(argbFromHex(colors[name]), [
    {
      name: "custom-1",
      value: argbFromHex('#f3f3f3'),
      blend: true,
      contrast: true,
      dislike: true,
    },
  ]);

  const palette = theme.schemes.light.props
  for (const key in palette) {
    code = code.replace(new RegExp(`{{${key}}}`, 'g'), '#' + palette[key].toString(16).substring(2))
  }
  const fname = `dist/bulma--${name}.min.css`
  fs.writeFileSync(fname + '.scss', code, 'utf-8')
  const result = sass.compile(fname + '.scss', { /*style: 'compressed'*/ })
  fs.writeFileSync(fname, result.css.replace(/^\uFEFF/, ''))
  console.log('wrote css file at', fname, 'utf-8')
}
