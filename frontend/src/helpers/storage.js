const getData = (key) => {
    const data = localStorage.getItem(key)
    return data && data !== undefined && data !== null && data !== 'undefined' ? JSON.parse(data) : null
}

const removeData = (key) => {
    localStorage.removeItem(key)
}

const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export {
    getData,
    removeData,
    setData
}