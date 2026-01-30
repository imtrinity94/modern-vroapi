import { generateDts } from '../src/utils/dtsGenerator';

const testPlugin = {
    name: "TestPlugin",
    description: "A test plugin",
    classes: [
        {
            name: "TestClass",
            attributes: [
                { name: "strArray", type: "Array/string" },
                { name: "anyArray", type: "Array/any" },
                { name: "objArray", type: "Array/object" },
                { name: "customArray", type: "Array/MyClass" }
            ],
            methods: []
        }
    ]
};

console.log(generateDts(testPlugin));
