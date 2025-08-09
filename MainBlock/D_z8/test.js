 class NextPromise{
    constructor(executor){
        this.status = 'pending';
        this.value = undefined;
        this.onfullfildedAray = [];
        this.onrejectedAray = [];

        const resolve =(value)=>{
            if(this.status === 'pending'){
                this.status = 'fullfilded';
               this.value = value 
               this.onfullfildedAray.forEach((fn)=>{
                console.log('resolve with timeout')
                fn(this.value)})
            }
        }
        const reject = (value)=>{
            if(this.status === 'pending'){
                this.status = 'rejected';
                this.value = value;
                this.onrejectedAray.forEach((fn)=>{fn(this.value)})
            }
        }
        try {
            executor(resolve , reject)
        } catch (error) {
            
        }
    }
    
    
    then(onFullfiled,onRejected){
        // сооружаем новый ОБЬЕКТ(newPromise без своего названия(для примера назовем НАШ))
        return new NextPromise((resolve,reject)=>{
        //здесь проверяем статус первоначального промиса (не нового)    
        // если статус 'pending' значит коренной resolve не выполнился еще и необходимо 
        // сохрнить функцию обработки результата(onFullfiled) в массив.
          if(this.status === 'pending'){
            this.onfullfildedAray.push(()=>{
        //здесь сохраняем,сооружаем новый обработчик(беымянная стрелочная функция)
        // в массив  this.onfullfildedAray       
        //выполняем первоначально-переданный обработчик с первым полученным значением(this.value)
        //и результат выполнения кладем в newOnFullfilded
                const newOnFullfilded = onFullfiled(this.value)
        // здесь про веряем является ли результат вызова-выполнения  тоже промисом        
        // т.е если в функции-обработчике стоит строка:
        //    return new Promise((resolve,reject)=>{/..../})
                if(newOnFullfilded instanceof NextPromise){
        // если она является промисом , то необходимо получить результат ее выполнения.            
        // здесь получаем результат . В аргументах then используем именно resolve,reject 
        //образца который прописан в конструкторе NextPromise котрые были переданы при 
        // инициализации НАШЕГО промиса 
        // Далее непонятно РАЗБЕРИСЬ ПОЗЖЕ............./////////////////////////
                    newOnFullfilded.then(resolve,reject)
                }else{
        // если результат выполнения(newOnFullfilded)  функции-обработчика(onFullfiled(this.value)) результата первоначального            
        //промиса не является промисом , то необходимо считать что newOnFullfilded является 
        // результатом выполнения функции и этот результат надо зарезолвить(т.е вызвать
        // resolve НАШЕГО промиса и установатить value в НАШЕМ промисе как newOnFullfilded)
                    resolve(newOnFullfilded)
                }
            })
     
          }

            if(this.status === 'fullfilded'){
                const newOnFullfilded = onFullfiled(this.value)
                if(newOnFullfilded instanceof NextPromise){
                    newOnFullfilded.then(resolve,reject)
                }else{
                    resolve(newOnFullfilded)
                }
            }
            
        })
        
    }


        
        
    

    catch(onRejected){
     return this.then(null,onRejected)
    }
 }
 
 const promise1 = new NextPromise((one,two)=>{
    console.log(1111)
//     reject('promise 1 ERROR')
   setTimeout(()=> one('success timeout 1sec'),1000) 
 })
 console.log(1)
 /////////////////////// ОПИСАНИЕ 
//  Новый промис в этом примере promise1 это ОБЬЕКТ с полями status,value, onfullfildedAray,
// onrejectedAray и методами then (в оригинальном промисе еще catch finally)
//в new NextPromise передается какаято функция(Fn) которая должна уметь принимать 2 параметра(one,two)
// далее внутри конструктора промиса этими параметрами становятся функции resolve и reject
// в переданной функции Fn далее вызывается первый или второй параметр(сразу или с задержкой времени)
//если вызван первый параметр, то он соответствует внутренней функции промиса resolve 
//которая в свою очередь принимает в качестве параметра кокоето значение(value) 
// которое является результатом какогото процеса или результатом работы какойто функции
// этот результат записывается в ОБЬЕКТ промис в поле this.value
// далее доступ к результату возможен только через вызов функции(метода) промиса .then
// then принимает 2 ПАРАМЕТРА , которые мы передаем в него при вызове.
// эти парапетры являются функциями обработчиками результата выполнения функции Fn , котрые
// были сохранены в промисе с помощью вызова resolve , котрая поместила результат в поле 
// value ОБЬЕКТА , котрым и является новый промис. Первая функция-обработчик в методе then
// получает this.value в качестве АРГУМЕНТА , следовательно, чтоб вызват ее в .then мы 
// должны написать функцию которая принимает один ПАРАМЕТР, и далее делает с ним какието
// манипуляции . Принято писать result  или res , хотя можно назвать как угодно.
// (result)=>{ тут мы чтото делаем с result}
//  ПРИМЕР :
// function loadScript(src) {
//   return new Promise(function(resolve, reject) {
//     let script = document.createElement('script');
//     script.src = src;

//     script.onload = () => resolve(script);
//     script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));

//     document.head.append(script);
//   });
// }
// вызов  let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");
// получение результатов :
//promise.then(
//   script => alert(`${script.src} загружен!`),
//   error => alert(`Ошибка: ${error.message}`)
// );
// promise.then(script => alert('Ещё один обработчик...'));
//   console.log(promise1)
// Возвращаемся к .then . Функция обработчик результата может оказаться вызвана до получения
// результата(задержки в интернете) , т.о. чтоб она не исчезла безследно выполнившись без
// результата необходимо ее записать в массив, а затем вызвать внутри функции resolve( котрая 
// выполнится только по окончании работы функции Fn( в примере это :
//     script.src = src;
//     script.onload = () => resolve(script);))
// эта запись в массив происходит внутри .then в поле обьекта(promise1) onfullfildedAray,
// которое является массивом. Далее при выполнении resolve достается функчия из массива
// и выполняется
//                this.onfullfildedAray.forEach((fn)=>{
//                   console.log('resolve with timeout')
//    тут она выполняется            fn(this.value)})
////////////////////////////////////
 promise1
 .then((someResult)=>{
    console.log(`promise1; ${someResult}`)
 },
)
.then((someResult)=>{
    console.log(`then 2 ${someResult}`)})
.then((res)=>{
    console.log(`then 3 ${res}`)
    return new NextPromise((resolve,reject)=>{
        console.log('New Promise 2')
        setTimeout(()=>{resolve('new promise 2 data')},2000)
    })
})
.then((res)=>{
    console.log(`then 4 ${res}`)
})

// })
// .then((res)=>{console.log(res)
//     return res+ ' 2 result'})
// .then((res)=>{
//     console.log(res)
// })
// console.log(promise1.value)
// ORIGIN ////////////////
// const promiseOrigin= new Promise((resolve,reject)=>{
//     console.log('promoseOrigin')
//     resolve('origin')
// })
// promiseOrigin
// .then((res)=>{
//     console.log(res)
//     return res + 'one then origin'
// })
// .then((res)=>{
//     console.log(res)
//     return res + 'second then origin'
// })
/////////////////////////////////////////
// promise1.then((res)=>{
//     console.log(`promise 1 + 1; ${res}`)
//  },
//  (res)=>{console.log(`promise1 error: ${res}`)}
// )

//  promise2.then(null,
//     (res)=>{
//     console.log(`promise2:${res}`)
//  })
