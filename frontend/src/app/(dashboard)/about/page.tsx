export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-semibold text-center">About Symptomatic</h2>

      <p>
        <strong>Symptomatic</strong> is an AI-powered <strong>Healthcare Symptom Checker</strong> that helps you
        understand your symptoms by suggesting possible conditions and next steps - all for educational purposes.
      </p>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">🩺 How It Works</h3>
        <p>
          Simply enter your symptoms, and our backend uses the <strong>Gemini Large Language Model (LLM)</strong> to
          generate a reasoned explanation of potential causes and general recommendations. The responses are stored
          securely in a local database to allow you to review your <strong>query history</strong> anytime.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">⚙️ Powered By</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Next.js</strong> & Tailwind CSS (Frontend UI)</li>
          <li><strong>shadcn/ui</strong> (Modern component library)</li>
          <li><strong>Node.js</strong> & <strong>Express</strong> (Backend API)</li>
          <li><strong>MongoDB</strong> with Mongoose (Query history storage)</li>
          <li><strong>Gemini API</strong> (AI reasoning & suggestions)</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-yellow-700">⚠️ Important Disclaimer</h3>
        <p className="text-yellow-700 font-medium">
          This application is for <strong>informational and educational purposes only</strong>.
          It does <strong>not provide medical advice</strong>, diagnosis, or treatment.
          Always consult a qualified healthcare professional regarding any medical condition.
        </p>
      </div>

      <footer className="text-center text-sm text-muted-foreground pt-6 border-t">
        Built by <span className="font-medium">Vishal R</span>.
      </footer>
    </div>
  );
}
