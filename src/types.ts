export type QuestionType = 'mcq' | 'true_false' | 'fill' | 'error_spotting';

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

export interface FillQuestion {
	id: number;
	type: 'fill';
	codeWithBlank: string;   // code containing one or more "______" placeholders
	prompt: string;
	answer: string;          // the full corrected code
}

export interface ErrorSpotQuestion {
	id: number;
	type: 'error_spotting';
	codeWithError: string;
	prompt: string;
	answer: string;
}


export type Question = MCQQuestion | TrueFalseQuestion | FillQuestion | ErrorSpotQuestion;
