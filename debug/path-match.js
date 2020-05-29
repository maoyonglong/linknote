const path = "/read(\\?aid=\w+)?"
const re = new RegExp(path)
console.log(re.test('/rea'))
