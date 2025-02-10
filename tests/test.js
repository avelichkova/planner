const object = [
    {
        name: "neshto",
        date : [1, 2, 3]
    },
    {
        name: "neshto2",
        date : [1, 2, 34]
    }
]
const arr = [1, 2, 3];
console.log(object.filter(a => a.date === arr));