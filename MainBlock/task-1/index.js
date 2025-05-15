const strArray = "[1, 2, [3, 4, [5]], 6]"
console.log(JSON.parse(strArray))

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
 let result1 = summArrayStr(strArray)
 console.log(result1)
