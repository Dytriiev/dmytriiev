import * as readline from 'node:readline/promises';
import { commands } from './commands.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter command > ',
});

rl.prompt();


rl.on('line', async (line) => {
  console.log(`Hello, ${line}!`);
  const [command, ...rest] = line.trim().split(' ')
  const params = rest.join(' ')
 async function main(){
    switch(command){
    case 'add':
      await  commands.add(params)
         
        break
    case 'list':
    await commands.list()
         
        break
    case 'delete':
     await   commands.delete(params) 
        
        break
    case 'stats':
    await commands.stats()
        
        break
    case 'update':
     await   commands.update(params)
        
        break
    case 'done':
      await  commands.done(params)
        
        break
    case 'help':
        commands.help()
        
        break
    case 'exit':
        commands.exit(rl)  
        break    
    default:
        console.log(`command ${command} does not exist try command help`) ;
                            
  }

 }
await main()
  rl.prompt()
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});
////////////////////////////

