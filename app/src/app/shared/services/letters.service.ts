import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LettersService {

  constructor() { }

  accentReplace( word : string){
   const newWord =  word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return newWord
  }
}
