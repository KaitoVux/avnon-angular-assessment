import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IQuestion, QuestionType} from "../type";
import {FormBuilderService} from "../form-builder.service";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  isVisible = false;
  addQuestionForm!: FormGroup;
  answerForm!: FormGroup;
  questionType = QuestionType;

  MAX_OPTIONS = 5;

  questions: Array<IQuestion> = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private formBuilderService: FormBuilderService,
    private router: Router
  ) {
    this.addQuestionForm = this.fb.group({
      type: ['', [Validators.required]],
      title: ['', [Validators.required]],
      options: new FormArray([]),
      isRequired: [false],
      allowSpecifyAnswer: [false]
    });

    this.answerForm = this.fb.group({});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.formBuilderService.getQuestions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((questions: Array<IQuestion>) => {
        this.questions = questions;
        this.buildAnswerForm();
      })
  }

  addOption() {
    if (this.optionFormArray.length < this.MAX_OPTIONS) {
      const optionGroup = this.fb.group({
        name: ['', Validators.required],
      });
      this.optionFormArray.push(optionGroup);
    }
  }

  get optionFormArray(): FormArray {
    return this.addQuestionForm.get('options') as FormArray;
  }

  showModal(): void {
    this.isVisible = true;
  }

  validateQuestionForm() {
    this.addQuestionForm.markAllAsTouched();
    this.addQuestionForm.updateValueAndValidity();
  }

  handleOk(): void {
    this.validateQuestionForm();
    if (this.addQuestionForm.valid) {
      const value = this.addQuestionForm.value;
      const question: IQuestion = {
        type: value.type,
        title: value.title,
        required: value.isRequired,
        options: value.options.map((option: { name: string }) => option.name),
        allowSpecifyAnswer: value.allowSpecifyAnswer
      }
      this.formBuilderService.addQuestion(question);
      this.isVisible = false;
      this.addQuestionForm.reset();
      this.optionFormArray.clear();
    }
  }

  getControl(name: string) {
    return this.addQuestionForm.get(name);
  }

  isMultipleChoice() {
    return this.getControl('type')?.value === QuestionType.MultipleChoice;
  }

  handleCancel(): void {
    this.addQuestionForm.reset();
    this.optionFormArray.clear();
    this.isVisible = false;
  }

  handleAddNewQuestion() {
    this.showModal();
  }

  onTypeChanged(type: QuestionType) {
    if (type === QuestionType.Text) {
      this.optionFormArray.clear();
    } else {
      this.addOption();
    }
  }

  buildAnswerForm() {
    if (!this.questions.length) {
      return;
    }
    this.answerForm = this.fb.group({
      answers: new FormArray([])
    });

    this.questions.forEach((question: IQuestion) => {
      this.addAnswerFormItem(question);
    });
  }

  get answerFormArray(): FormArray {
    return this.answerForm.get('answers') as FormArray;
  }

  getAnswerFormArrayItem(index: number) {
    return this.answerFormArray.at(index);
  }

  getAnswerTitle(index: number) {
    return this.getAnswerFormArrayItem(index).get('title')?.value;
  }

  getAllowSpecifyAnswer(index: number) {
    return this.getAnswerFormArrayItem(index).get('allowSpecifyAnswer')?.value;
  }

  getAnswerIsRequired(index: number) {
    return this.getAnswerFormArrayItem(index).get('required')?.value;
  }

  getAnswerAnswer(index: number) {
    return this.getAnswerFormArrayItem(index).get('answer')?.value;
  }

  getAnswerType(index: number) {
    return this.getAnswerFormArrayItem(index).get('type')?.value;
  }

  getAnswerHasOther(index: number) {
    return this.getAnswerFormArrayItem(index).get('hasOther')?.value;
  }

  addAnswerFormItem(question: IQuestion) {
    if (question.type === QuestionType.Text) {
      this.answerFormArray.push(this.fb.group({
        title: [question.title],
        type: [question.type],
        required: [question.required],
        answer: ['', question.required ? [Validators.required] : []]
      }));
    } else {
      const initialAnswer = question.options?.map((item) => {
        return {
          label: item, value: item, checked: false
        }
      });
      this.answerFormArray.push(this.fb.group({
        title: [question.title],
        type: [question.type],
        required: [question.required],
        allowSpecifyAnswer: [question.allowSpecifyAnswer],
        hasOther: [false],
        otherOption: [''],
        answer: [initialAnswer, question.required ? [Validators.required] : []]
      }));
    }
  }

  validateAnswerForm() {
    this.answerForm.markAllAsTouched();
    this.answerForm.updateValueAndValidity();
  }

  submitAnswer() {
    this.validateAnswerForm();
    if (this.answerForm.invalid) {
      return;
    }
    const value = this.answerFormArray.value;
    const questionWithAnswers: Array<IQuestion> = value.map((item: any, index: number) => {
      if (item.type === QuestionType.MultipleChoice) {
        const answer: string[] = item.answer?.filter((answer: { checked: boolean }) => answer.checked).map((answer: {
          value: string
        }) => answer.value);
        if (item.allowSpecifyAnswer && item.hasOther && item.otherOption) {
          answer.push(`Other - ${item.otherOption}`);
        }
        return {
          ...item,
          answer
        }
      } else {
        return item;
      }
    });
    this.formBuilderService.setQuestions(questionWithAnswers);
    this.router.navigate(['/forms/answers'])
  }
}
