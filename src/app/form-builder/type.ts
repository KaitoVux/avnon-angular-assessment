export enum QuestionType {
  Text = 'text',
  MultipleChoice = 'multipleChoice',
}

export type IQuestion = {
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Array<string>;
  answer?: string | string [];
  allowSpecifyAnswer?: boolean;
  hasOther?: boolean;
  otherOption?: string;
}
