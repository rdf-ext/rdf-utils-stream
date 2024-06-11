async function eventToPromise (event) {
  return new Promise((resolve, reject) => {
    event.on('end', () => resolve())
    event.on('error', err => reject(err))
  })
}

export default eventToPromise
