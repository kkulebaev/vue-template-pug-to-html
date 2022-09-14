const pug = require('pug')
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const decode = require('unescape')
const walktree = require('walktree')
const PRETTIER_CONFIG = require('./.prettierrc.js')

const VUE_EXT = '*.vue'
const SRC_DIR = './src'
const DIST_DIR = './dist'
const WALKTREE_TYPE = 'files'

// Получаем массив путей для всех файлов с расширением filter из директории root
const allVueFilePaths = walktree.arraySync({
  root: SRC_DIR,
  type: WALKTREE_TYPE,
  filter: VUE_EXT
})

allVueFilePaths.forEach(vueFilePath => {
  // Создаем копию директории каждого файла, если ее еще не существует
  const dir = path.dirname(vueFilePath)
  const newDirPath = path.join(DIST_DIR, dir)

  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath, { recursive: true })
  }

  // Читаем файл из исходной директории
  const vueFile = fs.readFileSync(vueFilePath, 'utf8')

  // Из-за того, что lang="pug" иногда написан в в single quotes, надо провреять оба варианта
  const TEMPLATE_TAG_1 = '<template lang="pug">'
  const TEMPLATE_TAG_2 = "<template lang='pug'>"

  let twoPartsTemplate = vueFile.split(TEMPLATE_TAG_1)

  if (twoPartsTemplate.length < 2) {
    twoPartsTemplate = vueFile.split(TEMPLATE_TAG_2)
  }
  const temp = twoPartsTemplate[1].split('</template>')

  // Сохраняем в переменные 3 части от vue-файла
  const beforeTemplate = twoPartsTemplate[0]
  const template = temp[0]
  const afterTemplate = temp[1]

  // Компилируем pug в html https://pugjs.org/api/reference.html#pugcompilesource-options
  const compiledFunction = pug.compile(template, {
    pretty: true // Возможны проблемы с этим свойством
  })
  const rawHTML = compiledFunction()

  // FIXME: Подумать как красиво расставить теги по линиям, пока что есть только вариант ставить пробел между скобками и затем, с помощью prettier форматировать. Возможно pretty атрибут в паг компайлере делает тоже самое.
  // const correctedHTML = rawHTML.replace('<', ' <').replace('>', '> ')

  // Прогоняем html через prettier https://prettier.io/docs/en/api.html#prettierformatsource-options
  const prettierHTML = prettier.format(rawHTML, {
    ...PRETTIER_CONFIG,
    parser: 'html'
  })

  // Декодируем HTML символы https://www.npmjs.com/package/unescape#characters
  const decodedHTML = decode(prettierHTML)

  // FIXME: Исправить компиляцию v-else -> v-else="v-else"
  // const correctedSecondHTML = decodedHTML.replace("v-else='v-else'", 'v-else')

  const writeVueFile = `${beforeTemplate} <template>\n${decodedHTML}</template> ${afterTemplate}`

  fs.writeFileSync(path.join(DIST_DIR, vueFilePath), writeVueFile)
})
