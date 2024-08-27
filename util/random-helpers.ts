import { randomInt } from "crypto"

export function getRandomElement<T>(arr: T[]): T {
    // FIXME, add error handling to this, in case you get empty array
    if(arr.length  <= 0) {
        // TODO handle error
    }
    const randomIndex = randomInt(arr.length);
    return arr[randomIndex];
}

export function getRandomElements<T>(arr: T[], elementsToGet: number): T[] {
    // FIXME, add error handling to this, in case you get empty array
    if(arr.length  <= 0 || arr.length > elementsToGet) {
        // TODO handle error
    }
    if(!Number.isSafeInteger(elementsToGet)) {
        // TODO handle error
    }
    const result: T[] = [];
    const arrCopy = [...arr];

    for( let i = 0 ; i < elementsToGet ; i++) {
        const elementToAdd = Math.trunc(Math.random() * arrCopy.length);
        result.push(arrCopy[elementToAdd]);
        arrCopy.splice(elementToAdd, 1);
    }
    return result;
}