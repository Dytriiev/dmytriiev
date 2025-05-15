// const promise1 = new Promise((resolve, reject) => {
//    setTimeout(() => {
//        resolve('First promise resolved after 1 second');
//    }, 1000);
// });

// const promise2 = new Promise((resolve, reject) => {
//    setTimeout(() => {
//        resolve('Second promise resolved after 2 seconds');
//    }, 2000);
// });

// const promise3 = new Promise((resolve, reject) => {
//    setTimeout(() => {
//        resolve('Third promise resolved after 3 seconds');
//    }, 3000);
// });
/////////////////////////////////////
const createrTimeout=(delay)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(`Promise width delay = ${delay/1000} seconds`)},delay)
    })
}
const testPromise = createrTimeout(2000)
testPromise.then((res)=>{
    console.log(res)
})