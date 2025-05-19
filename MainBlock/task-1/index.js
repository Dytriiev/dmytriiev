const strArray = "[1, 2, [3, 4, [5]], 6]"
console.log(JSON.parse(strArray))

const arrayStr_2 = '[[[]]]'

function summArrayStr(strArray){
    
 const array = JSON.parse(strArray)
 function summArray(array){
  return  array.reduce((acc,item)=>{
    if(!Array.isArray(item)){
        return acc + item
    } else {
        return acc + summArray(item)
    }
    },0)
} return summArray(array)
}
 let result1 = summArrayStr( arrayStr_2)
 console.log(result1)
 ////////////////////////////////////////////////////////

 /// Або так , щоб зовсім без циклив.  ///////////////////////////////

 function summArrayStr_2(strArray){
    
    const array = JSON.parse(strArray)
    

    function summArray_2(array){
        if(array.length === 0) return 0
        let length = array.length
     if(length === 1){
     let r = array[array.length-1]
     console.log(`r1:${r}`)
       if(!Array.isArray(r)){
    return r 
   } else {
    return summArray_2(r)
   }
     } else { 
     let r = array[array.length-1]
     array.pop()

      if(!Array.isArray(r)){
    return r + summArray_2(array)
   } else {
    return summArray_2(r) + summArray_2(array)
   }
     }
    }
    return summArray_2(array)
 }


 const res_2 = summArrayStr_2(arrayStr_2)
 console.log(res_2)

 
  
 