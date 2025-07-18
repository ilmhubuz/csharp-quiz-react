export type QuestionType =
    | 'mcq'
    | 'true_false'
    | 'fill'
    | 'error_spotting'
    | 'output_prediction'
    | 'code_writing';

export type TopicCategory =
    | 'asosiy-til-xususiyatlari'
    | 'tip-tizimi-oop'
    | 'metod-xususiyatlari'
    | "kolleksiyalar-ma'lumot-tuzilmalari"
    | 'linq-funksional-dasturlash'
    | "ilg'or-mavzular"
    | 'exception-handling';

export interface QuestionMetadata {
    category: TopicCategory;
    subcategory: string;
}

export interface MCQOption {
    id: string;
    option: string;
}

export interface MCQQuestion {
    id: number;
    type: 'mcq';
    metadata: QuestionMetadata;
    codeBefore?: string;
    codeAfter?: string;
    prompt: string;
    options: MCQOption[];
    answer: string[];
    explanation?: string;
}

export interface TrueFalseQuestion {
    id: number;
    type: 'true_false';
    metadata: QuestionMetadata;
    codeBefore?: string;
    codeAfter?: string;
    prompt: string;
    answer: 'true' | 'false';
    explanation?: string;
}

export interface FillQuestion {
    id: number;
    type: 'fill';
    metadata: QuestionMetadata;
    codeWithBlank: string;
    prompt: string;
    answer: string;
    explanation?: string;
    hints?: string[];
}

export interface ErrorSpotQuestion {
    id: number;
    type: 'error_spotting';
    metadata: QuestionMetadata;
    codeWithError: string;
    prompt: string;
    answer: string;
    explanation?: string;
}

export interface OutputPredictionQuestion {
    id: number;
    type: 'output_prediction';
    metadata: QuestionMetadata;
    snippet: string;
    prompt: string;
    answer: string;
    explanation?: string;
}

export interface CodeWritingQuestion {
    id: number;
    type: 'code_writing';
    metadata: QuestionMetadata;
    prompt: string;
    codeAfter?: string;
    examples: string[];
    solution?: string;
    testCases?: Array<{
        input: string;
        expectedOutput: string;
    }>;
    rubric?: string[];
}

export type Question =
    | MCQQuestion
    | TrueFalseQuestion
    | FillQuestion
    | ErrorSpotQuestion
    | OutputPredictionQuestion
    | CodeWritingQuestion;
