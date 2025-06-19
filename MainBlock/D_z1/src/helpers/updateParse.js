// парсінг команди update дозволяе змінювати name і freq незалежно 
// одна від одної


export function updateParse(data){
     let freq = ''
     let name = ''
     let objData = {}
     
    let dataArr = data.trim().split(' ').join('').split('--')
    let length = dataArr.length

    // console.log(`dataArr ${dataArr}`)

    if(length <3){
         console.log('неверно введена команда 1')
        return
    }
    let idIndex = dataArr[1].indexOf('id')
    if(idIndex == -1||dataArr.length < 3){
        console.log('неверно введена команда 2')
        return
    }
    let id = +dataArr[1].slice(2)
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
            console.log('неверно введена команда 3')
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
            console.log('неверно введена команда 4')
            return
    }
    
    
    // console.log(objData)
    return objData
}
