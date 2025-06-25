export type QuestionType = 'mcq' | 'true_false';

export interface MCQOption {
	id: string;
	option: string;
}

export interface MCQQuestion {
	id: number;
	type: 'mcq';
	codeBefore?: string;
	codeAfter?: string;
	prompt: string;
	options: MCQOption[];
	answer: string[];
}

export interface TrueFalseQuestion {
	id: number;
	type: 'true_false';
	codeBefore?: string;
	codeAfter?: string;
	prompt: string;
	answer: 'true' | 'false';
}

export type Question = MCQQuestion | TrueFalseQuestion;
