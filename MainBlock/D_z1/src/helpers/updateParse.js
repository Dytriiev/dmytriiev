// парсінг команди update дозволяе змінювати name і freq незалежно 
// одна від одної


export function updateParse(data){
  let freq = ''
  let name = ''
  const objData = {}
     
  const dataArr = data.trim().split(' ').join('').split('--')
  const length = dataArr.length


  if(length <3){
    return
  }
  const idIndex = dataArr[1].indexOf('id')
  if(idIndex == -1||dataArr.length < 3){
    return
  }
  const id = +dataArr[1].slice(2)
  objData.id = id
  switch(length){
  case 3:
    if(dataArr[2].includes('name')){
      name = dataArr[2].slice(4)
    }
    if(dataArr[2].includes('freq')){
      freq = dataArr[2].slice(4)
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
  case 4:
    if(dataArr[2].includes('name')){
      name = dataArr[2].slice(4)
    }
    if(dataArr[3].includes('freq')){
      freq = dataArr[3].slice(4)
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
