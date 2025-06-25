export type QuestionType = 'mcq' | 'true_false' | 'fill' | 'error_spotting' | 'output_prediction' | 'code_writing';

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


export interface OutputPredictionQuestion {
	id: number;
	type: 'output_prediction';
	snippet: string;   // full C# code to display in Monaco read-only
	prompt: string;    // markdown description of what to predict
	answer: string;    // exact console output (including newlines)
}

export interface CodeWritingQuestion {
	id: number;
	type: 'code_writing';
	prompt: string;       // markdown formatted explanation
	examples: string[];   // each item is a full console session (input + output)
}

// Union update:
export type Question = MCQQuestion | TrueFalseQuestion | FillQuestion | ErrorSpotQuestion | OutputPredictionQuestion | CodeWritingQuestion;
