interface ResumeAnalysisDto {
  [key: string]: any;  // This allows us to dynamically handle different sections
}

interface Improvements {
  [key: string]: any; // This allows us to dynamically handle different sections
}

export interface AnalysisResult {
  resumeAnalysisDto: ResumeAnalysisDto;
  improvements: Improvements;
}