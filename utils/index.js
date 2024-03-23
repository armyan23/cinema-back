const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const createRoomSeats = (row, column) => {
    const newArr = []
    for (let i = 0; i < row; i++ ) {
        const subArr = []
        for (let j = 1; j <= column; j++ ) {
            const firstItem = alphabet[i] ? alphabet[i] : i
            subArr.push(firstItem + '_' + j)
        }
        newArr.push(subArr)
    }

    return newArr
}
module.exports = {
    createRoomSeats
}