export type Course = {
	_id?: string;
	name: string;
	course_code: string;
	objective_question_and_answer: {
		question: string;
	};
	theory_question_and_answer: {
		number: {
			question: string;
			rubric: {
				full_mark: string;
				half_mark: string;
				no_mark: string;
			};
		};
	};
};
