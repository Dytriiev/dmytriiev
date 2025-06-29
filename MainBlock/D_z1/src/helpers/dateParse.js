import dotenv from 'dotenv'
dotenv.config()
//кількість днів від дня коли ми робимо звичьку у майбутньому, до сьoгодні
const DAY_OFFSET = process.env.DAY_OFFSET || 0
//кількість днів від фактичного сьогодні до уявного Майбутнього сьoгодні
const DAY_NOW = process.env.DAY_NOW || 0
 

//не меняя кода почемуто stats  работает по разному 
 
export function madeAt(){
  const date = new Date(Date.now() + DAY_OFFSET  * 24 * 60 * 60 * 1000)
  return  date
}
export function period(data){
  
  const statsArr = data.map( pract => {
    let numDays = 0
    let stats = 0
    if(!pract.done){
      stats=0      
    }else{
      numDays = days(pract.done)
      const num = pract.done.length
      switch(pract.freq){
      case 'daily':
        stats = Math.round((num/numDays)*100)
        break
      case 'weekly':
        stats = Math.round(num/(numDays/7)*100) 
        break
      case 'monthly':
        stats =  Math.round(num/(numDays/31)*100) 
        break    
      }
 
    }

    return {
      name : pract.name,
      stats : stats
    }
  })

  function days(data){
    let days = 0
    if(data.length<1){
      return days
    }
    const numDone = data.map(d=>{
      const date =new Date(d)
      return +date
    }).sort((a,b)=>a-b)
    const dayNow = (new Date(Date.now() + DAY_NOW  * 24 * 60 * 60 * 1000)).getTime()
    days = Math.floor((dayNow-numDone[0])/(24 * 60 * 60 * 1000)) + 1
    return days
  }

  return statsArr
}
