//script ID must be hashWorker

importScripts("https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js")
const incrementalMD5 = file =>
  new Promise((resolve, reject) => {
    var loaded = 0
    var startTime = performance.now()
    var tSize = file.size
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    const chunkSize = 2097152 // Read in chunks of 2MB
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    fileReader.onload = event => {
      spark.append(event.target.result) // Append array buffer
      ++currentChunk
      currentChunk < chunks ? loadNext() : resolve(spark.end()) // Compute hash
    }
    fileReader.addEventListener("progress", event => {
      loaded += event.loaded
      let pE = Math.round((loaded / tSize) * 100)
      let rS = pE + "%"
      //console.log(rS)
    })
    fileReader.addEventListener("loadend", event => {
      if (event.total > 0) {
        var endTime = performance.now()
        //console.log(`Took ${endTime - startTime} milliseconds`)
      }

    })
    fileReader.onerror = () => reject(fileReader.error)

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end))
    }
    loadNext()
  })
self.onmessage = async function (event) {
  //console.log(event.data)
  if (event.data.file && (event.data.msg == "begin hash")) {
    const gmd5 = await incrementalMD5(event.data.file)
    postMessage({ status: "complete", hash: gmd5 })
    self.close()
  }
}
