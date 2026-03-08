import AssessmentPageClient from "@/components/assessment/AssessmentPageClient";

export default async function AssessmentPage({ params }) {
  const { assessmentType, applicationId } = await params;
  return (
    <AssessmentPageClient
      assessmentType={assessmentType}
      applicationId={applicationId}
    />
  );
}
