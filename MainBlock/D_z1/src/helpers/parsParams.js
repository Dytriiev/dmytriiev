
export function parseId(data){
  const dArr = data.trim().split('')
  const id = dArr.at(-1)
  return id
}

export function parseParams(data){
  let freq = ''
  let name = ''
  const objData = {}
     
  const dataArr = data.trim().split(' ').join('').split('--')
  const length = dataArr.length


  if(length <2){
    return
  }
  switch(length){
  case 2:
    if(dataArr[1].includes('name')){
      name = dataArr[1].slice(4)
    }
    if(dataArr[1].includes('freq')){
      freq = dataArr[1].slice(4)
    }
    if(name){
      objData.name = name
      break
    }
    if(freq){
      objData.freq = freq
      break
    }
    return
  case 3:
    if(dataArr[1].includes('name')){
      name = dataArr[1].slice(4)
    }
    if(dataArr[2].includes('freq')){
      freq = dataArr[2].slice(4)
    }
    if(name){
      objData.name = name
    }
    if(freq){
      objData.freq = freq
      break
    }
    return
  }
    
    
  return objData
}
