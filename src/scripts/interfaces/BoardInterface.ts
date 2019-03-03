import { Difficulty } from "../enums/difficulty";

export default interface BoardInterface {
    levelWidth: number ;
    levelHeight: number ;
    smallMinesCount: number ;
    mediumMinesCount: number ;
    bigMinesCount: number;
    onRedirect: any;
    difficulty:Difficulty;
    isTutorial:boolean;
}