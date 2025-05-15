//  interface IPerson{
//     name:string,
//     grades:{
//         name:string,
//         score:number|null|undefined
//     }[]
//  }
 const averageGrade = (person) => {
    // console.log(person.grades)
   let scoreArray = person.grades.map((element) => {
       if(element.score){
        return element.score
    }else{return 0}
    });
    console.log(scoreArray)
    const result = scoreArray.reduce((acc,score)=>acc + score,0)/ scoreArray.length
    console.log(result)
    return result
 }
   

averageGrade({
   name: 'Chill Student',
   grades: [
       {
           name: 'Math',
           score: 1,
       },
       {
           name: 'Science',
           score: 5
       },
       {
           name: 'Invalid Name',
           score: null
       },
       {
           name: 'Invalid Subject',
           score: undefined
       },
       {
           name: 'Biology',
           score: 10
       }]
});