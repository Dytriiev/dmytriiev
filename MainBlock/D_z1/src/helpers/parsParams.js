
export function parseId(data){
    let dArr = data.trim().split('')
    const id = dArr.at(-1)
    return id
}
//////////////////////////////
export function parseParams(data){
     let freq = ''
     let name = ''
     let objData = {}
     
    let dataArr = data.trim().split(' ').join('').split('--')
    let length = dataArr.length

    // console.log(dataArr)

    if(length <2){
         console.log('неверно введена команда 1')
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
            console.log('неверно введена команда 2')
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
            console.log('неверно введена команда 3')
            return
    }
    
    
    // console.log(objData)
    return objData
}
