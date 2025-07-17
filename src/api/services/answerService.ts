import { apiClient } from '../client';
import type { 
  SubmitAnswerRequest, 
  AnswerSubmissionResponse, 
  PreviousAnswerResponse,
  ApiResponse 
} from '../../types/api';

export class AnswerService {
  private baseEndpoint = '/api/csharp/answers';

  async submitAnswer(
    questionId: number, 
    answer: string | string[], 
    timeSpentSeconds: number
  ): Promise<AnswerSubmissionResponse> {
    try {
      const requestData: SubmitAnswerRequest = {
        questionId,
        answer,
        timeSpentSeconds,
      };

      const response = await apiClient.post<ApiResponse<AnswerSubmissionResponse>>(
        this.baseEndpoint,
        requestData
      );
      
      return response.data || { success: false, isCorrect: false };
    } catch (error) {
      console.error(`Failed to submit answer for question ${questionId}:`, error);
      throw error;
    }
  }

  async getLatestAnswer(questionId: number): Promise<PreviousAnswerResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<PreviousAnswerResponse>>(
        `${this.baseEndpoint}/${questionId}/latest`
      );
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch latest answer for question ${questionId}:`, error);
      throw error;
    }
  }
}

export const answerService = new AnswerService(); 