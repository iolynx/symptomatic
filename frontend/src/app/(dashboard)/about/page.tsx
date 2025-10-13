export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">About This App</h2>
      <p>
        Symptomatic is a <strong> Healthcare Symptom Checker</strong> that uses AI to suggest possible diagnoses
        and next steps based on your input.
      </p>
      <p className="text-yellow-600 font-medium">
        ⚠️ Disclaimer: This tool is for informational and educational purposes only.
        It is not a substitute for professional medical advice, diagnosis, or treatment.
      </p>
    </div>
  );
}

