import { createPracties,showList,makePract, delPract,
    updatePract,statsPract } from "./service.js"
const formatCom = [
    '  * add --name <текст звички> --freq <daily|weekly|monthly>  додає звичку;',
    '  * list  показує всі звички у вигляді таблиці;',
    '  * done --id <ідентифікатор>  відмічає, що звичку виконано сьогодні;',
    '  * stats  друкує для кожної звички відсоток виконання за останні 7(30) днів;',
    '  * delete --id <ідентифікатор>  видаляє звичку;',
    '  * update --id <ідентифікатор> --name "<текст звички>" --freq <daily|weekly|monthly>  вносить зміни у назву, або регулярність;'
]

export  const commands = {
    add: async (input)=>{
         await createPracties(input)
    },
    help: async ()=>{
        let com = Object.keys(commands)
        console.log('Commands list :')
        for(let c of com){
           console.log(c) 
        } 
        console.log('Формат команд :')
        for(let f of formatCom){
            console.log(f)
        } 

    },
    
    list: async ()=>{
       const list = await showList()
        return list
    },

    done: async (data)=>{
      return await makePract(data)
    },

    delete: async (data)=>{
        return await delPract(data)
    },
    exit: (rl)=>{return rl.close()},

    update: async (data)=>{
        return await updatePract(data)
    },

    stats: async ()=>{
        return await statsPract()
    }
    

}

