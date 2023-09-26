import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilderService} from "../form-builder.service";
import {IQuestion, QuestionType} from "../type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-review-answer',
  templateUrl: './review-answer.component.html',
  styleUrls: ['./review-answer.component.scss']
})
export class ReviewAnswerComponent implements OnInit, OnDestroy {
  questionWithAnswers: Array<IQuestion> = [];
  questionType = QuestionType;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private formBuilderService: FormBuilderService, private router: Router) {
  }

  hasAnswer(question: IQuestion): boolean {
    return Array.isArray(question.answer) ? question.answer.length > 0 : !!question.answer;
  }

  ngOnInit(): void {
    this.formBuilderService.getQuestions().pipe(takeUntil(this.destroy$)).subscribe((questions) => {
      this.questionWithAnswers = questions;
    });
  }

  onBack() {
    this.formBuilderService.setQuestions([]);
    this.router.navigate(['/forms/builder']);
  }
}
