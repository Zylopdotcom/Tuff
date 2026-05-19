import { languages, recommend } from '../data/languages'

type Props = {
  answers: Record<string, string>
  onRestart: () => void
}

export default function Result({ answers, onRestart }: Props) {
  const key = recommend(answers.goal, answers.math)
  const lang = languages[key]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        <div className="mb-6">
          <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Your match
          </span>
        </div>

        <div className="mb-6">
          <div className="text-5xl mb-3">{lang.emoji}</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{lang.name}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{lang.desc}</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Your learning roadmap</h3>
          <div className="space-y-4">
            {lang.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{step.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.detail}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {step.resources.map((r) => (
                      <span key={r} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full mt-8 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          ← Start over
        </button>

      </div>
    </div>
  )
}