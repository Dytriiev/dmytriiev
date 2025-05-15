class TreeNode {
   constructor(value) {
       this.value = value;
       // Ваш код тут
       this.children = [];

   }

   // Метод для додавання дочірнього вузла
   addChild(childValue) {
       const childNode = new TreeNode(childValue);
       // Ваш код тут
       this.children.push(childNode)
       return childNode;
   }
}

// Приклад використання
const root = new TreeNode('Root');
const child1 = root.addChild('Child 1');
const child2 = root.addChild('Child 2');
const grandchild1 =  child1.addChild('Grandchild 1.1');
const grandchild12 = child1.addChild('Grandchild 1.2');
child2.addChild('Grandchild 2.1');
///////////////// не змиг добитися щоб console.log(root) виводив так,
//  як віводить console.log(JSON.stringify(root));
console.log(root)
console.log(JSON.stringify(root));
////////////////////  ЗРАЗОК СТРУКТУРИ ЕКЗЕМПЛЯРА КЛАСА /////////////////////
const a = {

    "value": "Root",

    "children": [
        {

        "value": "Child 1",

        "children": [
            {"value": "Grandchild 1.1", "children": []},
         {"value": "Grandchild 1.2", "children": []}
        ]

    }, 
    {"value": "Child 2",
     "children": 
     [{"value": "Grandchild 2.1", "children": []}]
    }
]
}
/////////////////////////////////////////////////////////////////////

