export type Course = {
	_id?: string;
	school_name: string;
	name: string;
	course_code: string;
	objective_question_and_answer: {
		question: string;
	};
	theory_question_and_answer: {
		number: {
			question: String;
			rubric: String;
			context: [String];
			marks: number;
		};
	};
};
