import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IQuestion} from "./type";

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  questions$: BehaviorSubject<Array<IQuestion>> = new BehaviorSubject<Array<IQuestion>>([]);

  getQuestions(): Observable<Array<IQuestion>> {
    return this.questions$.asObservable();
  }
  addQuestion(question: IQuestion) {
    const questions = this.questions$.value;
    questions.push(question);
    this.questions$.next(questions);
  }

  setQuestions(questions: Array<IQuestion>) {
    this.questions$.next(questions);
  }
  constructor() {
  }
}
