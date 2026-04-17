import CourseForm from "@/components/dashboard/courses/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl mb-2">Nouvelle formation</h1>
      <p className="text-muted mb-8">Créez votre formation en quelques clics</p>
      
      <CourseForm />
    </div>
  );
}