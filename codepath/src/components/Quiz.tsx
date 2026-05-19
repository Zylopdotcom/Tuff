import { useState } from 'react'

const questions = [
  {
    id: 'goal',
    text: 'What do you want to build?',
    options: [
      { value: 'web', label: 'Websites & web apps' },
      { value: 'data', label: 'Data analysis & AI' },
      { value: 'mobile', label: 'Mobile apps' },
      { value: 'games', label: 'Games' },
    ],
  },
  {
    id: 'style',
    text: 'How do you prefer to learn?',
    options: [
      { value: 'visual', label: 'Visual results fast' },
      { value: 'logic', label: 'Logic & understanding the why' },
      { value: 'practical', label: 'Practical projects' },
    ],
  },
  {
    id: 'math',
    text: "What's your math comfort level?",
    options: [
      { value: 'low', label: 'I avoid math when I can' },
      { value: 'mid', label: 'Comfortable with basics' },
      { value: 'high', label: 'I enjoy math & logic' },
    ],
  },
  {
    id: 'career',
    text: "What's your goal?",
    options: [
      { value: 'job', label: 'Get a job in tech' },
      { value: 'freelance', label: 'Freelance & side projects' },
      { value: 'hobby', label: 'Just for fun & learning' },
    ],
  },
]

type Answers = Record<string, string>

type Props = {
  onComplete: (answers: Answers) => void
}

export default function Quiz({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

  const current = questions[step]
  const selected = answers[current.id]
  const progress = ((step) / questions.length) * 100

  function handleSelect(value: string) {
    setAnswers({ ...answers, [current.id]: value })
  }

  function handleNext() {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(answers)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-1.5 bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">{current.text}</h2>

        <div className="space-y-3 mb-8">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 text-sm
                ${selected === opt.value
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full py-3 bg-green-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          {step < questions.length - 1 ? 'Next →' : 'See my result →'}
        </button>

      </div>
    </div>
  )
}