import fs from 'fs'
import sass from 'sass'
import { harmony } from 'simpler-color'

const template = fs.readFileSync('src/style-template.scss', 'utf-8')

// generate material colors
const colors = JSON.parse(fs.readFileSync('data/colors-material.json', 'utf-8'))

for (const name in colors) {
  let code = template
  const palette = harmony(colors[name])
  for (const key in palette) {
    code = code.replace(new RegExp(`{{${key}}}`, 'g'), palette[key])
  }
  const fname = `dist/bulma--${name}.min.css`
  fs.writeFileSync(fname + '.scss', code, 'utf-8')
  const result = sass.compile(fname + '.scss', { style: 'compressed' })
  fs.writeFileSync(fname, result.css.replace(/^\uFEFF/, ''))
  console.log('wrote css file at', fname, 'utf-8')
}
