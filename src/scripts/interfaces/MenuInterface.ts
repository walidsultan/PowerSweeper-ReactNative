import { Difficulty } from "../enums/difficulty";

export default interface MenuInterface {
    onNewLevel(difficulty:Difficulty):any;    
}