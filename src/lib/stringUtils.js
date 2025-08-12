const capitalize = (text) => {
  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}


const replaceUnderscores = (text) => {
  return text.replace(/_/g, ' ')
}

export { capitalize, replaceUnderscores }