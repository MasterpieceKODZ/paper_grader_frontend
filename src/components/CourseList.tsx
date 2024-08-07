import React from "react";

interface Course {
	_id: string;
	name: string;
	course_code: string;
}

interface CourseListProps {
	courses: Course[];
	onSelectCourse: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse }) => {
	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Registered Courses</h2>
			<ul className="space-y-2">
				{courses.map((course) => (
					<li
						key={course._id}
						className="p-2 bg-white border cursor-pointer hover:bg-gray-100"
						onClick={() => onSelectCourse(course)}>
						{course.name} ({course.course_code})
					</li>
				))}
			</ul>
		</div>
	);
};

export default CourseList;
